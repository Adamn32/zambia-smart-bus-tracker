# ----------------------------------------------------------------------------
# Project     : Zambia Smart Bus Tracker
# Module      : Dockerfile
# Author      : Adam ChapChap Ng'uni
# Date        : 2026-03-20
# Time        : 10:54:11 CAT
# Description : Container build instructions for the backend API service.
# ----------------------------------------------------------------------------

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app app
COPY wait-for-db.py .
COPY init_routes.py .

CMD python wait-for-db.py && uvicorn app.main:app --host 0.0.0.0 --port 8000
