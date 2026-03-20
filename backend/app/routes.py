"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : routes.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Implements HTTP and WebSocket endpoints for fleet tracking operations.

  This file's role in the codebase:
    - receives GPS updates from simulator or external producers
    - streams live vehicle updates over `/ws/locations`
    - delegates core tracking logic to the service layer
    - exposes read endpoints for fleet overview, per-vehicle latest state, inactivity, and route aggregation

Notes:
  Keep response shapes stable because frontend components depend on them.
----------------------------------------------------------------------------
"""

from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from .auth import require_api_token, require_ws_token
from .database import SessionLocal
from .schemas import (
    InactiveVehicle,
    LocationUpdate,
    LocationUpdateResponse,
    RouteAggregationResponse,
    VehicleLocation,
)
from .services import tracking_service

router = APIRouter()


class ConnectionManager:

    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        disconnected = []

        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)

        for connection in disconnected:
            self.disconnect(connection)


manager = ConnectionManager()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.websocket("/ws/locations")
async def vehicle_updates_socket(websocket: WebSocket):

    try:
        require_ws_token(websocket.query_params.get("token"))
    except HTTPException:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket)

    try:
        # Keep the socket alive while client remains connected.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


@router.post("/location/update", response_model=LocationUpdateResponse)
async def update_location(
    data: LocationUpdate,
    db: Session = Depends(get_db),
    _token: str = Depends(require_api_token),
):

    vehicle_payload = tracking_service.create_location_update(
        db,
        vehicle_id=data.vehicle_id,
        latitude=data.lat,
        longitude=data.lon,
        speed=data.speed,
    )

    await manager.broadcast(
        {
            "type": "vehicle_update",
            "vehicle": vehicle_payload,
        }
    )

    return {"status": "ok"}


@router.get("/vehicles", response_model=list[VehicleLocation])
def vehicles(
    db: Session = Depends(get_db),
    _token: str = Depends(require_api_token),
):
    return tracking_service.get_latest_vehicle_positions(db)


@router.get("/vehicles/{vehicle_id}/latest", response_model=VehicleLocation)
def vehicle_latest(
    vehicle_id: str,
    db: Session = Depends(get_db),
    _token: str = Depends(require_api_token),
):
    vehicle = tracking_service.get_vehicle_latest_position(db, vehicle_id)

    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return vehicle


@router.get("/vehicles/live", response_model=list[VehicleLocation])
def vehicles_live(
    db: Session = Depends(get_db),
    _token: str = Depends(require_api_token),
):
    # Backward-compatible alias.
    return tracking_service.get_latest_vehicle_positions(db)


@router.get("/vehicles/inactive", response_model=list[InactiveVehicle])
def vehicles_inactive(
    threshold_seconds: int = Query(default=120, ge=1),
    db: Session = Depends(get_db),
    _token: str = Depends(require_api_token),
):
    vehicles_data = tracking_service.get_latest_vehicle_positions(db)
    return tracking_service.detect_inactive_vehicles(vehicles_data, threshold_seconds)


@router.get("/vehicles/route-aggregation", response_model=RouteAggregationResponse)
def route_aggregation(
    tolerance: float = Query(default=0.005, gt=0),
    db: Session = Depends(get_db),
    _token: str = Depends(require_api_token),
):
    vehicles_data = tracking_service.get_latest_vehicle_positions(db)
    return tracking_service.aggregate_route_utilization(db, vehicles_data, tolerance)
