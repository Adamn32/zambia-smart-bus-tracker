/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : VehiclePanel.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Displays a textual list of active vehicles and states.

  This file's role in the codebase:
    - mirrors live vehicle feed in a compact operator panel
    - surfaces route assignment, speed, and activity status
    - provides quick non-map visibility for fleet monitoring

Notes:
  Keep sorting/filter logic aligned with MapView selection behavior.
----------------------------------------------------------------------------
*/

import { findClosestRoute } from "./routes"

function VehiclePanel({ vehicles }) {

    const sortedVehicles = [...vehicles].sort((a, b) => {
        const aMatch = String(a.vehicle_id || "").match(/(\d+)$/)
        const bMatch = String(b.vehicle_id || "").match(/(\d+)$/)

        if (aMatch && bMatch) {
            return Number(aMatch[1]) - Number(bMatch[1])
        }

        return String(a.vehicle_id || "").localeCompare(String(b.vehicle_id || ""))
    })

    return (

        <div className="vehicle-panel">

            <h3>Fleet Vehicles</h3>

            {sortedVehicles.length === 0 && <p>No active vehicles</p>}

            {sortedVehicles.map(v => {
                const route = v.matchedRoute || findClosestRoute([v.latitude, v.longitude])

                return (
                    <div key={v.vehicle_id} className="vehicle-row">

                        <strong>{v.vehicle_id}</strong>

                        <div>Speed: {v.speed} km/h</div>

                        <div>
                            {v.latitude.toFixed(4)},
                            {v.longitude.toFixed(4)}
                        </div>

                        <div>
                            Route: {route ? route.name : "Unassigned"}
                        </div>

                    </div>
                )
            })}

        </div>

    )
}

export default VehiclePanel
