/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : routes.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Stores route definitions and helper utilities for route matching.

  This file's role in the codebase:
    - defines canonical route names, colors, and coordinates
    - provides helper logic like closest-route detection
    - is reused by map rendering and vehicle/statistics components

Notes:
  Update route metadata here first when adding new transit lines.
----------------------------------------------------------------------------
*/

const LUSAKA_ROUTES = [

    {
        id: "1",
        name: "Kulima Tower -> Kabulonga",
        color: "#FF5733",
        waypoints: [
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
            [-15.418260, 28.342979]
        ]
    },

    {
        id: "2",
        name: "Kulima Tower -> Bauleni",
        color: "#33FF57",
        waypoints: [
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
            [-15.447367, 28.379089]
        ]
    },

    {
        id: "3",
        name: "Kulima Tower -> Kamwala South",
        color: "#3357FF",
        waypoints: [
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
            [-15.448675, 28.296703]
        ]
    }

]

export default LUSAKA_ROUTES

function squaredDistance(a, b) {
    const dx = a[0] - b[0]
    const dy = a[1] - b[1]
    return dx * dx + dy * dy
}

function distancePointToSegment(p, a, b) {
    const abx = b[0] - a[0]
    const aby = b[1] - a[1]
    const ab2 = abx * abx + aby * aby

    if (ab2 === 0) {
        return Math.sqrt(squaredDistance(p, a))
    }

    const apx = p[0] - a[0]
    const apy = p[1] - a[1]
    const t = Math.max(0, Math.min(1, (apx * abx + apy * aby) / ab2))

    const projection = [
        a[0] + t * abx,
        a[1] + t * aby
    ]

    return Math.sqrt(squaredDistance(p, projection))
}

export function findClosestRoute(vehicleLocation) {

    if (!vehicleLocation) return null

    let closestRoute = null
    let minDistance = Infinity

    LUSAKA_ROUTES.forEach(route => {
        const points = route.waypoints

        if (!points || points.length === 0) {
            return
        }

        if (points.length === 1) {
            const pointDistance = Math.sqrt(squaredDistance(vehicleLocation, points[0]))
            if (pointDistance < minDistance) {
                minDistance = pointDistance
                closestRoute = route
            }
            return
        }

        for (let i = 0; i < points.length - 1; i += 1) {
            const segmentDistance = distancePointToSegment(vehicleLocation, points[i], points[i + 1])

            if (segmentDistance < minDistance) {
                minDistance = segmentDistance
                closestRoute = route
            }
        }
    })

    // ~550m tolerance in Lusaka latitude band.
    return minDistance < 0.005 ? closestRoute : null

}
