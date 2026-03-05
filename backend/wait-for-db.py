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
