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