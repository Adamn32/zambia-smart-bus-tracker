# Lusaka Smart Bus Tracker - OSM Routes Integration

## Overview

The Lusaka Smart Bus Tracker has been upgraded with real OpenStreetMap (OSM) road routes. The application now displays major bus routes in Lusaka with real-time vehicle tracking on these routes.

## Features

### 🗺️ Real Lusaka Bus Routes
- **5 Major Routes**: Kabulonga, Bauleni, Kamwala, Emmasdale, and Matero
- **Color-coded visualization**: Each route has a distinctive color for easy identification
- **Route stops**: Shows waypoints/stops along each route
- **Route information**: Click on routes to see detailed information

### 🚌 Real-time Vehicle Tracking
- **Live vehicle positions**: Vehicles update every 5 seconds
- **Speed display**: Shows current speed of each vehicle
- **Route assignment**: Automatically assigns vehicles to routes based on proximity
- **Status indicator**: Visual indicators for active vehicles

### 📍 OpenStreetMap Integration
- **Accurate maps**: Uses OSM for accurate Lusaka geography
- **Responsive design**: Works on desktop and mobile devices
- **Interactive popups**: Click on vehicles and routes for details

## Routes Data

### Current Routes

| Route | Name | Color | Stops |
|-------|------|-------|-------|
| 1 | Lusaka - Kabulonga | 🔴 Red | 4 |
| 2 | Lusaka - Bauleni | 🟢 Green | 4 |
| 3 | Lusaka - Kamwala | 🔵 Blue | 4 |
| 4 | Lusaka - Emmasdale | 🟣 Magenta | 4 |
| 5 | Lusaka - Matero | 🟠 Orange | 4 |

### Adding New Routes

POST `/routes`
```json
{
  "route_id": "6",
  "name": "Lusaka - New Area",
  "color": "#FF0000",
  "waypoints": [
    [-15.4167, 28.2833],
    [-15.4200, 28.2900],
    [-15.4250, 28.2950]
  ]
}
```

## API Endpoints

### Location Endpoints

**Update vehicle location:**
```
POST /location/update
{
  "vehicle_id": "LUS-MB-101",
  "lat": -15.4167,
  "lon": 28.2833,
  "speed": 45
}
```

**Get live vehicles:**
```
GET /vehicles/live
```

### Route Endpoints

**Create a new route:**
```
POST /routes
Content-Type: application/json

{
  "route_id": "unique_id",
  "name": "Route Name",
  "color": "#HEXCOLOR",
  "waypoints": [
    [lat, lon],
    [lat, lon]
  ]
}
```

**Get all routes:**
```
GET /routes
```

**Get specific route:**
```
GET /routes/{route_id}
```

**Update a route:**
```
PUT /routes/{route_id}
```

**Delete/deactivate a route:**
```
DELETE /routes/{route_id}
```

## Database Schema

### Routes Table
```sql
CREATE TABLE routes (
    id INTEGER PRIMARY KEY,
    route_id VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    color VARCHAR NOT NULL,
    waypoints JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### GPS Locations Table
```sql
CREATE TABLE gps_locations (
    id INTEGER PRIMARY KEY,
    vehicle_id VARCHAR NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    speed FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

## Frontend Components

### MapView.js
Main component that displays the map and orchestrates all other components.

### RouteDisplay.js
Renders all bus routes with:
- Polylines for route paths
- CircleMarkers for bus stops
- Color-coded visualization

### VehicleMarker.js
Displays individual vehicles with:
- Custom bus emoji icon
- Automatic route assignment
- Detailed popup with vehicle info

### routes.js
Utility module with:
- Route definitions
- Distance calculations
- Closest route detection

## Deployment

### Docker Compose
The application uses Docker Compose for orchestration with automatic route initialization:

```bash
docker-compose up -d
```

This will:
1. Start PostgreSQL with PostGIS
2. Run database migrations
3. Start the FastAPI backend
4. Initialize Lusaka routes (automatic)
5. Start the GPS simulator
6. Launch the React dashboard

### Manual Route Initialization
If routes don't auto-initialize, run:

```bash
python backend/init_routes.py http://localhost:8000
```

## Technology Stack

### Frontend
- **React 18**: UI framework
- **Leaflet**: Interactive maps
- **react-leaflet**: React wrapper for Leaflet
- **Axios**: HTTP client
- **OpenStreetMap**: Map tiles

### Backend
- **FastAPI**: Python web framework
- **SQLAlchemy**: ORM
- **PostgreSQL + PostGIS**: Geospatial database
- **Uvicorn**: ASGI server

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Orchestration
- **curl**: Health checks

## Configuration

### Environment Variables

**Backend:**
- `DATABASE_URL`: PostgreSQL connection string

**Frontend:**
- `REACT_APP_API_URL`: API base URL

**GPS Simulator:**
- `API_URL`: API endpoint for location updates

## Performance Considerations

1. **Vehicle Updates**: Vehicles update every 5 seconds via polling
2. **Route Limit**: Dashboard shows last 50 vehicle locations
3. **Database Indexing**: Add indexes on vehicle_id and timestamp for better performance
4. **Caching**: Consider caching routes data

## Future Enhancements

- [ ] Real-time route optimization
- [ ] Passenger boarding/alighting tracking
- [ ] Route analytics and statistics
- [ ] WebSocket for real-time updates
- [ ] Mobile app
- [ ] Route planning integration
- [ ] Fare estimation
- [ ] Schedule adherence monitoring
- [ ] Traffic/congestion detection
- [ ] Multi-language support

## Troubleshooting

### Routes not displaying
1. Check API health: `curl http://localhost:8000/docs`
2. Verify routes in database: `GET /routes`
3. Check browser console for errors

### Vehicles not updating
1. Verify simulator is running: `docker logs gps-simulator`
2. Check API logs: `docker logs gps-api`
3. Ensure location data is being received: `GET /vehicles/live`

### Database connection issues
1. Verify PostgreSQL is running: `docker ps`
2. Check connection string in environment variables
3. Ensure database user and password are correct

## Contributing

To add new routes:
1. Update `frontend/src/routes.js` with route coordinates
2. Run `python backend/init_routes.py` to sync to database
3. Test routes display in map

## License

MIT License

## Support

For issues or questions, please refer to the project repository.
