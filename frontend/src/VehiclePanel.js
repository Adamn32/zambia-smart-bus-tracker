function VehiclePanel({ vehicles }) {

    return (

        <div className="vehicle-panel">

            <h3>Fleet Vehicles</h3>

            {vehicles.length === 0 && <p>No active vehicles</p>}

            {vehicles.map(v => (

                <div key={v.vehicle_id} className="vehicle-row">

                    <strong>{v.vehicle_id}</strong>

                    <div>Speed: {v.speed} km/h</div>

                    <div>
                        {v.latitude.toFixed(4)},
                        {v.longitude.toFixed(4)}
                    </div>

                </div>

            ))}

        </div>

    )
}

export default VehiclePanel