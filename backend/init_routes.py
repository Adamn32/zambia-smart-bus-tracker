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
