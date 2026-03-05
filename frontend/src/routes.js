const LUSAKA_ROUTES = [

    {
        id: "1",
        name: "CBD → Kabulonga",
        color: "#FF5733",
        waypoints: [
            [-15.4167, 28.2833],
            [-15.4100, 28.3000],
            [-15.3950, 28.3150],
            [-15.3800, 28.3300]
        ]
    },

    {
        id: "2",
        name: "CBD → Bauleni",
        color: "#33FF57",
        waypoints: [
            [-15.4167, 28.2833],
            [-15.4300, 28.2600],
            [-15.4500, 28.2400],
            [-15.4700, 28.2300]
        ]
    },

    {
        id: "3",
        name: "CBD → Kamwala",
        color: "#3357FF",
        waypoints: [
            [-15.4167, 28.2833],
            [-15.4000, 28.2500],
            [-15.3800, 28.2300],
            [-15.3600, 28.2200]
        ]
    }

]

export default LUSAKA_ROUTES


export function findClosestRoute(vehicleLocation) {

    if (!vehicleLocation) return null

    let closestRoute = null
    let minDistance = Infinity

    LUSAKA_ROUTES.forEach(route => {

        route.waypoints.forEach(point => {

            const dLat = Math.abs(point[0] - vehicleLocation[0])
            const dLon = Math.abs(point[1] - vehicleLocation[1])

            const distance = Math.sqrt(dLat * dLat + dLon * dLon)

            if (distance < minDistance) {
                minDistance = distance
                closestRoute = route
            }

        })

    })

    return minDistance < 0.05 ? closestRoute : null

}