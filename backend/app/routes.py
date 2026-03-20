"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : routes.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description : API endpoints for vehicle locations, routes, and fleet statistics.
----------------------------------------------------------------------------
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .database import SessionLocal
from .models import GPSLocation

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/location/update")
def update_location(data: dict, db: Session = Depends(get_db)):

    gps = GPSLocation(
        vehicle_id=data["vehicle_id"],
        latitude=data["lat"],
        longitude=data["lon"],
        speed=data["speed"]
    )

    db.add(gps)
    db.commit()

    return {"status": "ok"}


@router.get("/vehicles/live")
def vehicles_live(db: Session = Depends(get_db)):

    # Get latest location per vehicle
    subquery = (
        db.query(
            GPSLocation.vehicle_id,
            func.max(GPSLocation.timestamp).label("max_time")
        )
        .group_by(GPSLocation.vehicle_id)
        .subquery()
    )

    results = (
        db.query(GPSLocation)
        .join(
            subquery,
            (GPSLocation.vehicle_id == subquery.c.vehicle_id)
            & (GPSLocation.timestamp == subquery.c.max_time)
        )
        .all()
    )

    vehicles = []

    for r in results:
        vehicles.append({
            "vehicle_id": r.vehicle_id,
            "latitude": r.latitude,
            "longitude": r.longitude,
            "speed": r.speed,
            "timestamp": r.timestamp
        })

    return vehicles