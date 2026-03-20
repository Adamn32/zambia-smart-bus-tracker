"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : simulator.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Generates and sends mock GPS telemetry for simulated buses.

  This file's role in the codebase:
    - iterates route coordinates to emulate moving vehicles
    - posts periodic location/speed/status updates to backend API
    - provides realistic data feed for local testing and demos

Notes:
  API endpoint and timing values control simulation realism and load.
----------------------------------------------------------------------------
"""

import random
import time

import requests

API = "http://api:8000/location/update"

# Aligned with frontend route waypoints in frontend/src/routes.js
ROUTES = {
    "LUS-MB-101": [
        [-15.423221, 28.280470],
        [-15.424765, 28.283285],
        [-15.423277, 28.291198],
        [-15.421944, 28.295721],
        [-15.419735, 28.302915],
        [-15.418658, 28.309829],
        [-15.417209, 28.314422],
        [-15.420675, 28.319321],
        [-15.423666, 28.331021],
        [-15.422620, 28.334651],
        [-15.421401, 28.341949],
        [-15.418260, 28.342979],
    ],
    "LUS-MB-102": [
        [-15.423221, 28.280470],
        [-15.424765, 28.283285],
        [-15.421944, 28.295721],
        [-15.419735, 28.302915],
        [-15.422642, 28.309323],
        [-15.427834, 28.319262],
        [-15.432819, 28.331458],
        [-15.435935, 28.339145],
        [-15.441064, 28.343472],
        [-15.440862, 28.350076],
        [-15.438351, 28.358734],
        [-15.443563, 28.368300],
        [-15.447927, 28.373142],
        [-15.447367, 28.379089],
    ],
    "LUS-MB-103": [
        [-15.423221, 28.280470],
        [-15.425542, 28.279027],
        [-15.428470, 28.280902],
        [-15.429623, 28.282723],
        [-15.431595, 28.285265],
        [-15.435325, 28.285808],
        [-15.437565, 28.287650],
        [-15.439468, 28.291771],
        [-15.441375, 28.295916],
        [-15.443234, 28.299942],
        [-15.445906, 28.297901],
        [-15.447815, 28.297531],
        [-15.448675, 28.296703],
    ],
}

vehicle_positions = {vehicle_id: 0 for vehicle_id in ROUTES}

while True:

    for vehicle_id, route_points in ROUTES.items():

        index = vehicle_positions[vehicle_id]
        lat, lon = route_points[index]

        payload = {
            "vehicle_id": vehicle_id,
            "lat": lat,
            "lon": lon,
            "speed": random.randint(30, 60),
        }

        try:
            requests.post(API, json=payload, timeout=3)
        except Exception as error:
            print("API error:", error)

        vehicle_positions[vehicle_id] = (index + 1) % len(route_points)

    time.sleep(5)
