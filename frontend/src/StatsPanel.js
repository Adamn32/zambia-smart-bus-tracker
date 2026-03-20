/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : StatsPanel.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Computes and displays aggregate fleet performance indicators.

  This file's role in the codebase:
    - derives totals and averages from live vehicle feed
    - summarizes route and activity insights for quick scanning
    - complements map visuals with numerical operational context

Notes:
  Guard calculations for empty datasets to avoid NaN outputs.
----------------------------------------------------------------------------
*/

import { findClosestRoute } from "./routes"

function StatsPanel({ vehicles, routes }) {

  const activeVehicles = vehicles.length

  const avgSpeed =
    vehicles.length > 0
      ? Math.round(
          vehicles.reduce((sum, v) => sum + v.speed, 0) / vehicles.length
        )
      : 0

  const routeStats = {}

  routes.forEach(r => {
    routeStats[r.id] = 0
  })

  vehicles.forEach(v => {

    const route = findClosestRoute([v.latitude, v.longitude])

    if (route) {
      routeStats[route.id] += 1
    }

  })

  return (

    <div className="stats-panel">

      <h3>Fleet Statistics</h3>

      <div>Active Vehicles: {activeVehicles}</div>

      <div>Average Speed: {avgSpeed} km/h</div>

      <h4>Route Utilization</h4>

      {routes.map(r => (

        <div key={r.id}>

          <span style={{ color: r.color }}>■</span>{" "}
          {r.name}: {routeStats[r.id]}

        </div>

      ))}

    </div>
  )
}

export default StatsPanel