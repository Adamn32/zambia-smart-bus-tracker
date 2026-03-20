"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : simulator.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description : GPS simulator that posts mock vehicle positions to backend endpoints.
----------------------------------------------------------------------------
"""

import requests
import time
import random

API = "http://api:8000/location/update"

# Lusaka bus routes (same coordinates used by frontend)
ROUTES = {
    "LUS-MB-101": [
        [-15.4167, 28.2833],
        [-15.4100, 28.3000],
        [-15.3950, 28.3150],
        [-15.3800, 28.3300],
    ],
    "LUS-MB-102": [
        [-15.4167, 28.2833],
        [-15.4300, 28.2600],
        [-15.4500, 28.2400],
        [-15.4700, 28.2300],
    ],
    "LUS-MB-103": [
        [-15.4167, 28.2833],
        [-15.4000, 28.2500],
        [-15.3800, 28.2300],
        [-15.3600, 28.2200],
    ],
}

vehicle_positions = {v: 0 for v in ROUTES}

while True:

    for vehicle, route in ROUTES.items():

        index = vehicle_positions[vehicle]

        lat, lon = route[index]

        payload = {
            "vehicle_id": vehicle,
            "lat": lat,
            "lon": lon,
            "speed": random.randint(30, 60),
        }

        try:
            requests.post(API, json=payload, timeout=3)
        except Exception as e:
            print("API error:", e)

        vehicle_positions[vehicle] = (index + 1) % len(route)

    time.sleep(5)