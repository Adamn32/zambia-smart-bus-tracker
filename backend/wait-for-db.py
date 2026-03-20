"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : wait-for-db.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description : Database readiness probe used before backend service startup.
----------------------------------------------------------------------------
"""

import time
import psycopg2

while True:
    try:
        conn = psycopg2.connect(
            host="postgres",
            database="gps",
            user="gps",
            password="gpspass"
        )
        conn.close()
        print("Database ready")
        break
    except psycopg2.OperationalError:
        print("Waiting for database...")
        time.sleep(3)
