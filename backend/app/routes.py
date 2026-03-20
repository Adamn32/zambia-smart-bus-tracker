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
    - exposes read endpoints for live vehicles, inactivity, and route aggregation

Notes:
  Keep response shapes stable because frontend components depend on them.
----------------------------------------------------------------------------
"""

from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from .database import SessionLocal
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

    await manager.connect(websocket)

    try:
        # Keep the socket alive while client remains connected.
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)


@router.post("/location/update")
async def update_location(data: dict, db: Session = Depends(get_db)):

    vehicle_payload = tracking_service.create_location_update(db, data)

    await manager.broadcast({
        "type": "vehicle_update",
        "vehicle": vehicle_payload,
    })

    return {"status": "ok"}


@router.get("/vehicles/live")
def vehicles_live(db: Session = Depends(get_db)):
    return tracking_service.get_latest_vehicle_positions(db)


@router.get("/vehicles/inactive")
def vehicles_inactive(
    threshold_seconds: int = Query(default=120, ge=1),
    db: Session = Depends(get_db),
):
    vehicles = tracking_service.get_latest_vehicle_positions(db)
    return tracking_service.detect_inactive_vehicles(vehicles, threshold_seconds)


@router.get("/vehicles/route-aggregation")
def route_aggregation(
    tolerance: float = Query(default=0.005, gt=0),
    db: Session = Depends(get_db),
):
    vehicles = tracking_service.get_latest_vehicle_positions(db)
    return tracking_service.aggregate_route_utilization(db, vehicles, tolerance)
