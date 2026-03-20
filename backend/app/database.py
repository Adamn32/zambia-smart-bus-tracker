"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : database.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Configures SQLAlchemy engine, sessions, and base metadata.

  This file's role in the codebase:
    - creates the PostgreSQL connection engine with health checks
    - exposes SessionLocal for request-scoped DB usage
    - exports declarative Base shared by ORM models

Notes:
  Connection URL and pooling behavior here affect all backend DB access.
----------------------------------------------------------------------------
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://gps:gpspass@postgres:5432/gps"

# enable pool_pre_ping so SQLAlchemy verifies connections from the pool
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
