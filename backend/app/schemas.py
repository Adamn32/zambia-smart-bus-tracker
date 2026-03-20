"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : schemas.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Defines Pydantic request and response schemas for the public API.

  This file's role in the codebase:
    - validates incoming GPS update payloads before persistence
    - enforces consistent response shape for fleet and analytics endpoints
    - serves as the contract layer between HTTP routes and clients

Notes:
  Keep these models synchronized with route response_model declarations.
----------------------------------------------------------------------------
"""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class LocationUpdate(BaseModel):
    vehicle_id: str = Field(min_length=1)
    lat: float
    lon: float
    speed: float = Field(ge=0)
    direction: Literal["outbound", "inbound"] | None = None


class LocationUpdateResponse(BaseModel):
    status: str


class VehicleLocation(BaseModel):
    vehicle_id: str
    latitude: float
    longitude: float
    speed: float
    timestamp: datetime | None
    direction: Literal["outbound", "inbound"] | None = None


class InactiveVehicle(VehicleLocation):
    inactive_for_seconds: int


class RouteUtilizationItem(BaseModel):
    route_id: str
    name: str
    vehicle_count: int


class RouteAggregationResponse(BaseModel):
    total_active_vehicles: int
    unassigned: int
    by_route: list[RouteUtilizationItem]
