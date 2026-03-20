"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : main.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Creates and configures the FastAPI application instance.

  This file's role in the codebase:
    - sets middleware and CORS policy for client access
    - validates database readiness on startup before serving
    - initializes tables and mounts router endpoints

Notes:
  Startup retry behavior here protects service boot in containerized runs.
----------------------------------------------------------------------------
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
from sqlalchemy import text
from .database import engine
from .models import Base
from .routes import router

app = FastAPI(title="Zambia Smart Bus Tracker")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Wait for the database to become available before creating tables
    retries = 12
    delay = 2
    for attempt in range(retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            break
        except Exception:
            if attempt == retries - 1:
                raise
            time.sleep(delay)

    Base.metadata.create_all(bind=engine)


app.include_router(router)
