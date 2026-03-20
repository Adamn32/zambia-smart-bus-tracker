/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : VehiclePanel.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description : Panel listing live vehicles and their route assignments.
----------------------------------------------------------------------------
*/

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