"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : database.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description : Database engine, session factory, and declarative base configuration.
----------------------------------------------------------------------------
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://gps:gpspass@postgres:5432/gps"

# enable pool_pre_ping so SQLAlchemy verifies connections from the pool
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
