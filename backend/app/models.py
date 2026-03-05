from sqlalchemy import Column,Integer,String,Float,DateTime,JSON,Boolean
from sqlalchemy.sql import func
from .database import Base

class GPSLocation(Base):
    __tablename__ = "gps_locations"

    id = Column(Integer, primary_key=True)
    vehicle_id = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    speed = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True)
    route_id = Column(String, unique=True)
    name = Column(String)
    color = Column(String)
    waypoints = Column(JSON)  # List of [latitude, longitude] pairs
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
