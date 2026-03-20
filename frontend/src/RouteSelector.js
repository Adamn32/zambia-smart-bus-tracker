/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : RouteSelector.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description : Route filter control for selecting visible transit lines.
----------------------------------------------------------------------------
*/

function RouteSelector({ routes, selected, onChange }) {

    return (

        <div className="route-selector">

            <label>Route Filter</label>

            <select
                value={selected}
                onChange={(e) => onChange(e.target.value)}
            >

                <option value="ALL">All Routes</option>

                {routes.map(r => (
                    <option key={r.id} value={r.id}>
                        {r.name}
                    </option>
                ))}

            </select>

        </div>

    )
}

export default RouteSelector