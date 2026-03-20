"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : models.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Declares ORM entities used by the backend persistence layer.

  This file's role in the codebase:
    - defines database table mappings for GPS/location records
    - centralizes typed columns and default timestamp behavior
    - provides schema contract for route and stats queries

Notes:
  Any schema change here should be coordinated with migration/update strategy.
----------------------------------------------------------------------------
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from .database import Base


class GPSLocation(Base):

    __tablename__ = "gps_locations"

    id = Column(Integer, primary_key=True, autoincrement=True)

    vehicle_id = Column(String, index=True)

    latitude = Column(Float)
    longitude = Column(Float)

    speed = Column(Float)

    timestamp = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True
    )


class Route(Base):

    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, autoincrement=True)

    route_id = Column(String, unique=True, index=True)

    name = Column(String)

    color = Column(String)

    waypoints = Column(JSON)

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )