function StatsPanel({ vehicles, routes }) {

    const activeVehicles = vehicles.length

    const avgSpeed = vehicles.length
        ? Math.round(
            vehicles.reduce((a, b) => a + b.speed, 0) / vehicles.length
        )
        : 0

    const routeStats = {}

    routes.forEach(r => {
        routeStats[r.id] = vehicles.filter(v => v.route_id === r.id).length
    })

    return (

        <div className="stats-panel">

            <h3>Fleet Statistics</h3>

            <div>Active Vehicles: {activeVehicles}</div>

            <div>Average Speed: {avgSpeed} km/h</div>

            <h4>Route Utilization</h4>

            {routes.map(r => (

                <div key={r.id}>

                    <span style={{ color: r.color }}>■</span>

                    {r.name}

                    : {routeStats[r.id] || 0}

                </div>

            ))}

        </div>

    )
}

export default StatsPanel