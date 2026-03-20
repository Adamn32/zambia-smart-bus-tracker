/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : MapView.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Implements the main map screen and data orchestration layer.

  This file's role in the codebase:
    - fetches and refreshes vehicles, routes, and summary data
    - coordinates map layers, markers, filters, and side panels
    - acts as the operational dashboard container for dispatch view

Notes:
  State changes here directly affect map rendering and panel updates.
----------------------------------------------------------------------------
*/

import { MapContainer, TileLayer } from "react-leaflet"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import RouteDisplay from "./RouteDisplay"
import VehicleMarker from "./VehicleMarker"
import VehiclePanel from "./VehiclePanel"
import StatsPanel from "./StatsPanel"
import RouteSelector from "./RouteSelector"
import LUSAKA_ROUTES, { findClosestRoute } from "./routes"
import "./MapView.css"

function MapView() {

    const [vehicles, setVehicles] = useState([])
    const [selectedRoute, setSelectedRoute] = useState("ALL")

    const API = "http://localhost:8000"

    useEffect(() => {

        const fetchVehicles = async () => {
            try {
                const res = await axios.get(`${API}/vehicles/live`)
                setVehicles(res.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchVehicles()

        const interval = setInterval(fetchVehicles, 5000)

        return () => clearInterval(interval)

    }, [])

    const vehiclesWithRoute = useMemo(() => {
        return vehicles.map((v) => {
            const matchedRoute = findClosestRoute([v.latitude, v.longitude])
            return {
                ...v,
                matchedRoute,
                matchedRouteId: matchedRoute ? matchedRoute.id : null
            }
        })
    }, [vehicles])

    const filteredVehicles = selectedRoute === "ALL"
        ? vehiclesWithRoute
        : vehiclesWithRoute.filter((v) => v.matchedRouteId === selectedRoute)

    return (

        <div className="mapview-container">

            <MapContainer
                center={[-15.4167, 28.2833]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RouteDisplay />

                {filteredVehicles.map(v =>
                    <VehicleMarker
                        key={v.vehicle_id}
                        vehicle={v}
                    />
                )}

            </MapContainer>

            <RouteSelector
                routes={LUSAKA_ROUTES}
                selected={selectedRoute}
                onChange={setSelectedRoute}
            />

            <VehiclePanel vehicles={filteredVehicles} />

            <StatsPanel vehicles={vehiclesWithRoute} routes={LUSAKA_ROUTES} />

        </div>
    )
}

export default MapView
