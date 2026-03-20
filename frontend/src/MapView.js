/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : MapView.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Implements the main real-time map screen and data orchestration layer.

  This file's role in the codebase:
    - combines WebSocket streaming with REST fallback polling
    - coordinates map layers, markers, route filters, and side panels
    - keeps fleet and statistics panels aligned in a shared left column
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

    const API = process.env.REACT_APP_API_URL || "http://localhost:8000"
    const API_TOKEN = process.env.REACT_APP_API_TOKEN || "dev-token-change-me"
    const WS_API = API.startsWith("https")
        ? API.replace("https", "wss")
        : API.replace("http", "ws")

    useEffect(() => {

        let websocket = null
        let reconnectTimer = null
        let isUnmounted = false

        const upsertVehicle = (vehicle) => {
            setVehicles((currentVehicles) => {
                const index = currentVehicles.findIndex(
                    (v) => v.vehicle_id === vehicle.vehicle_id
                )

                if (index === -1) {
                    return [...currentVehicles, vehicle]
                }

                const nextVehicles = [...currentVehicles]
                nextVehicles[index] = {
                    ...nextVehicles[index],
                    ...vehicle,
                }

                return nextVehicles
            })
        }

        const fetchVehicles = async () => {
            try {
                const res = await axios.get(`${API}/vehicles/live`, {
                    headers: {
                        Authorization: `Bearer ${API_TOKEN}`,
                    },
                })
                setVehicles(res.data)
            } catch (err) {
                console.error(err)
            }
        }

        const connectSocket = () => {
            const socketUrl = `${WS_API}/ws/locations?token=${encodeURIComponent(API_TOKEN)}`
            websocket = new WebSocket(socketUrl)

            websocket.onmessage = (event) => {
                try {
                    const payload = JSON.parse(event.data)

                    if (
                        payload &&
                        payload.type === "vehicle_update" &&
                        payload.vehicle &&
                        payload.vehicle.vehicle_id
                    ) {
                        upsertVehicle(payload.vehicle)
                    }
                } catch (error) {
                    console.error("Invalid WebSocket payload", error)
                }
            }

            websocket.onclose = () => {
                if (!isUnmounted) {
                    reconnectTimer = setTimeout(connectSocket, 3000)
                }
            }

            websocket.onerror = (error) => {
                console.error("WebSocket error", error)
            }
        }

        fetchVehicles()

        // Keep REST as fallback consistency check while streaming is primary.
        const interval = setInterval(fetchVehicles, 15000)

        connectSocket()

        return () => {
            isUnmounted = true
            clearInterval(interval)

            if (reconnectTimer) {
                clearTimeout(reconnectTimer)
            }

            if (websocket && websocket.readyState <= 1) {
                websocket.close()
            }
        }

    }, [API, API_TOKEN, WS_API])

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

            <div className="app-title">Real-Time Transit Fleet Monitoring (Simulator + API + Dashboard)</div>

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
            <div className="left-panels">
                <VehiclePanel vehicles={filteredVehicles} />

                <StatsPanel vehicles={vehiclesWithRoute} routes={LUSAKA_ROUTES} />
            </div>

        </div>
    )
}

export default MapView
