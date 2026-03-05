from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from .database import SessionLocal
from .models import GPSLocation, Route

router = APIRouter()

class LocationUpdate(BaseModel):
    vehicle_id: str
    lat: float
    lon: float
    speed: float

class LocationResponse(BaseModel):
    id: int
    vehicle_id: str
    latitude: float
    longitude: float
    speed: float
    timestamp: str

    class Config:
        from_attributes = True

class RouteCreate(BaseModel):
    route_id: str
    name: str
    color: str
    waypoints: List[List[float]]

class RouteResponse(BaseModel):
    id: int
    route_id: str
    name: str
    color: str
    waypoints: List[List[float]]
    is_active: bool

    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/location/update")
def update_location(data: LocationUpdate, db: Session = Depends(get_db)):
    try:
        gps = GPSLocation(
            vehicle_id=data.vehicle_id,
            latitude=data.lat,
            longitude=data.lon,
            speed=data.speed
        )

        db.add(gps)
        db.commit()
        db.refresh(gps)

        return {"status": "ok", "id": gps.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vehicles/live", response_model=list[LocationResponse])
def vehicles(db: Session = Depends(get_db)):
    try:
        results = db.query(GPSLocation).order_by(GPSLocation.timestamp.desc()).limit(50).all()
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/routes", response_model=RouteResponse)
def create_route(route_data: RouteCreate, db: Session = Depends(get_db)):
    try:
        # Check if route already exists
        existing = db.query(Route).filter(Route.route_id == route_data.route_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Route already exists")

        route = Route(
            route_id=route_data.route_id,
            name=route_data.name,
            color=route_data.color,
            waypoints=route_data.waypoints,
            is_active=True
        )

        db.add(route)
        db.commit()
        db.refresh(route)

        return route
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/routes", response_model=list[RouteResponse])
def get_routes(db: Session = Depends(get_db)):
    try:
        routes = db.query(Route).filter(Route.is_active == True).all()
        return routes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/routes/{route_id}", response_model=RouteResponse)
def get_route(route_id: str, db: Session = Depends(get_db)):
    try:
        route = db.query(Route).filter(Route.route_id == route_id).first()
        if not route:
            raise HTTPException(status_code=404, detail="Route not found")
        return route
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/routes/{route_id}", response_model=RouteResponse)
def update_route(route_id: str, route_data: RouteCreate, db: Session = Depends(get_db)):
    try:
        route = db.query(Route).filter(Route.route_id == route_id).first()
        if not route:
            raise HTTPException(status_code=404, detail="Route not found")

        route.name = route_data.name
        route.color = route_data.color
        route.waypoints = route_data.waypoints

        db.commit()
        db.refresh(route)

        return route
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/routes/{route_id}")
def delete_route(route_id: str, db: Session = Depends(get_db)):
    try:
        route = db.query(Route).filter(Route.route_id == route_id).first()
        if not route:
            raise HTTPException(status_code=404, detail="Route not found")

        route.is_active = False
        db.commit()

        return {"status": "ok", "message": "Route deactivated"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
