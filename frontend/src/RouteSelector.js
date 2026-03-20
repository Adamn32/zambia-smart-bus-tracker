/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : RouteSelector.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Renders the route filter control used by map views.

  This file's role in the codebase:
    - exposes route selection UI for narrowing active display
    - sends selected value changes back to parent state
    - supports focused monitoring of specific corridors

Notes:
  Keep this component controlled through props for predictable filtering.
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