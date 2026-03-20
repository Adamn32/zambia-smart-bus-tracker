/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : VehicleMarker.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description : Map marker component showing live vehicle positions and details.
----------------------------------------------------------------------------
*/

import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { findClosestRoute } from "./routes";

function VehicleMarker({ vehicle }) {
    const route = findClosestRoute([vehicle.latitude, vehicle.longitude]);

    const busIcon = L.divIcon({
        html: `
      <div style="
        background-color: ${route ? route.color : '#3388ff'};
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        🚌
      </div>
    `,
        iconSize: [30, 30],
        className: "bus-icon",
    });

    return (
        <Marker
            position={[vehicle.latitude, vehicle.longitude]}
            icon={busIcon}
            key={vehicle.id}
        >
            <Popup>
                <div style={{ minWidth: "200px" }}>
                    <strong>Vehicle: {vehicle.vehicle_id}</strong>
                    <br />
                    <strong>Speed:</strong> {vehicle.speed} km/h
                    <br />
                    <strong>Location:</strong> {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                    <br />
                    {route ? (
                        <>
                            <strong>Route:</strong> {route.name}
                            <br />
                            <strong>Color:</strong>{" "}
                            <span
                                style={{
                                    color: route.color,
                                    fontWeight: "bold",
                                }}
                            >
                                ●
                            </span>
                        </>
                    ) : (
                        <strong style={{ color: "#999" }}>Not on a tracked route</strong>
                    )}
                    <br />
                    <small style={{ color: "#666" }}>
                        Updated: {new Date(vehicle.timestamp).toLocaleTimeString()}
                    </small>
                </div>
            </Popup>
        </Marker>
    );
}

export default VehicleMarker;
