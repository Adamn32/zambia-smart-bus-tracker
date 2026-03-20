/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : RouteDisplay.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description : Renders Lusaka route lines and related map markers.
----------------------------------------------------------------------------
*/

import React from "react";
import { Polyline, CircleMarker, Popup } from "react-leaflet";
import LUSAKA_ROUTES from "./routes";

function RouteDisplay() {
    return (
        <>
            {LUSAKA_ROUTES.map((route) => (
                <div key={route.id}>
                    {/* Route line */}
                    <Polyline
                        positions={route.waypoints.map((wp) => [wp[0], wp[1]])}
                        color={route.color}
                        weight={3}
                        opacity={0.7}
                        dashArray="5, 10"
                    >
                        <Popup>{route.name}</Popup>
                    </Polyline>

                    {/* Waypoint markers */}
                    {route.waypoints.map((waypoint, idx) => (
                        <CircleMarker
                            key={`${route.id}-${idx}`}
                            center={[waypoint[0], waypoint[1]]}
                            radius={4}
                            color={route.color}
                            fill={true}
                            fillColor={route.color}
                            fillOpacity={0.8}
                            weight={2}
                        >
                            <Popup>
                                <strong>{route.name}</strong>
                                <br />
                                Stop {idx + 1}
                            </Popup>
                        </CircleMarker>
                    ))}
                </div>
            ))}
        </>
    );
}

export default RouteDisplay;
