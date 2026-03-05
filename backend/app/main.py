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
