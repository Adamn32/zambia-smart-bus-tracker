"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : tracking_service.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Centralizes backend business logic for tracking and analytics workflows.

  This file's role in the codebase:
    - creates and serializes location updates written to the database
    - computes latest position per vehicle for read APIs
    - detects inactive vehicles using time-threshold rules
    - aggregates vehicle utilization across active routes

Notes:
  Keep pure business/domain logic here and keep route handlers thin.
----------------------------------------------------------------------------
"""

from datetime import datetime, timezone
from math import sqrt

from sqlalchemy import func

from ..models import GPSLocation, Route


def _serialize_vehicle(gps: GPSLocation) -> dict:
    return {
        "vehicle_id": gps.vehicle_id,
        "latitude": gps.latitude,
        "longitude": gps.longitude,
        "speed": gps.speed,
        "timestamp": gps.timestamp,
    }


def create_location_update(
    db,
    vehicle_id: str,
    latitude: float,
    longitude: float,
    speed: float,
    direction: str | None = None,
) -> dict:
    gps = GPSLocation(
        vehicle_id=vehicle_id,
        latitude=latitude,
        longitude=longitude,
        speed=speed,
    )

    db.add(gps)
    db.commit()
    db.refresh(gps)

    return {
        "vehicle_id": gps.vehicle_id,
        "latitude": gps.latitude,
        "longitude": gps.longitude,
        "speed": gps.speed,
        "timestamp": gps.timestamp.isoformat() if gps.timestamp else None,
        "direction": direction,
    }


def get_latest_vehicle_positions(db) -> list[dict]:
    subquery = (
        db.query(
            GPSLocation.vehicle_id,
            func.max(GPSLocation.timestamp).label("max_time"),
        )
        .group_by(GPSLocation.vehicle_id)
        .subquery()
    )

    results = (
        db.query(GPSLocation)
        .join(
            subquery,
            (GPSLocation.vehicle_id == subquery.c.vehicle_id)
            & (GPSLocation.timestamp == subquery.c.max_time),
        )
        .all()
    )

    return [_serialize_vehicle(r) for r in results]


def get_vehicle_latest_position(db, vehicle_id: str) -> dict | None:
    latest = (
        db.query(GPSLocation)
        .filter(GPSLocation.vehicle_id == vehicle_id)
        .order_by(GPSLocation.timestamp.desc())
        .first()
    )

    if latest is None:
        return None

    return _serialize_vehicle(latest)


def _to_utc(ts: datetime) -> datetime:
    if ts.tzinfo is None:
        return ts.replace(tzinfo=timezone.utc)
    return ts.astimezone(timezone.utc)


def detect_inactive_vehicles(vehicles: list[dict], threshold_seconds: int = 120) -> list[dict]:
    now = datetime.now(timezone.utc)
    inactive = []

    for vehicle in vehicles:
        timestamp = vehicle.get("timestamp")
        if not isinstance(timestamp, datetime):
            continue

        age_seconds = (now - _to_utc(timestamp)).total_seconds()
        if age_seconds > threshold_seconds:
            inactive.append(
                {
                    **vehicle,
                    "inactive_for_seconds": int(age_seconds),
                }
            )

    return inactive


def _squared_distance(a: tuple[float, float], b: tuple[float, float]) -> float:
    dx = a[0] - b[0]
    dy = a[1] - b[1]
    return dx * dx + dy * dy


def _distance_point_to_segment(
    point: tuple[float, float],
    start: tuple[float, float],
    end: tuple[float, float],
) -> float:
    abx = end[0] - start[0]
    aby = end[1] - start[1]
    ab2 = abx * abx + aby * aby

    if ab2 == 0:
        return sqrt(_squared_distance(point, start))

    apx = point[0] - start[0]
    apy = point[1] - start[1]
    t = max(0, min(1, (apx * abx + apy * aby) / ab2))

    projection = (start[0] + t * abx, start[1] + t * aby)

    return sqrt(_squared_distance(point, projection))


def _closest_route_for_vehicle(vehicle: dict, routes: list[Route], tolerance: float) -> Route | None:
    point = (vehicle["latitude"], vehicle["longitude"])

    closest_route = None
    min_distance = float("inf")

    for route in routes:
        points = route.waypoints or []
        if len(points) < 2:
            continue

        for idx in range(len(points) - 1):
            start = (points[idx][0], points[idx][1])
            end = (points[idx + 1][0], points[idx + 1][1])
            distance = _distance_point_to_segment(point, start, end)

            if distance < min_distance:
                min_distance = distance
                closest_route = route

    if min_distance < tolerance:
        return closest_route

    return None


def aggregate_route_utilization(
    db,
    vehicles: list[dict],
    tolerance: float = 0.005,
) -> dict:
    routes = db.query(Route).filter(Route.is_active.is_(True)).all()

    by_route = {
        route.route_id: {
            "route_id": route.route_id,
            "name": route.name,
            "vehicle_count": 0,
        }
        for route in routes
    }

    unassigned_count = 0

    for vehicle in vehicles:
        matched_route = _closest_route_for_vehicle(vehicle, routes, tolerance)

        if matched_route is None:
            unassigned_count += 1
            continue

        by_route[matched_route.route_id]["vehicle_count"] += 1

    return {
        "total_active_vehicles": len(vehicles),
        "unassigned": unassigned_count,
        "by_route": list(by_route.values()),
    }
