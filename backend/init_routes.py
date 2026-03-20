"""
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : init_routes.py
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Seeds baseline transit routes into the backend service.

  This file's role in the codebase:
    - sends predefined route payloads to API endpoints
    - prepares route catalog needed for UI overlays and matching
    - supports first-time environment bootstrap workflows

Notes:
  Execute after API startup so route creation requests can succeed.
----------------------------------------------------------------------------
"""

import requests
import sys

API = sys.argv[1]

routes = [
    {"name": "Town → Matero"},
    {"name": "Town → Chelstone"},
    {"name": "Town → Chilenje"},
    {"name": "Town → Kanyama"}
]

for route in routes:
    try:
        r = requests.post(f"{API}/routes", json=route)
        print("Added route:", route["name"], r.status_code)
    except Exception as e:
        print("Error:", e)
