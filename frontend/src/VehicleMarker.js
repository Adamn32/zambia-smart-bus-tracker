/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : VehicleMarker.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Renders each vehicle marker with popup metadata on the map.

  This file's role in the codebase:
    - converts vehicle records into Leaflet marker instances
    - attaches popups with speed, status, and route details
    - applies route inference helpers for readable marker context

Notes:
  Marker icon and popup formatting changes should stay consistent with panel data.
----------------------------------------------------------------------------
*/

import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { findClosestRoute } from "./routes";

function lightenHexColor(hexColor, factor = 0.45) {
    if (!hexColor || typeof hexColor !== "string") return "#7faedc";

    const sanitized = hexColor.replace("#", "");
    if (sanitized.length !== 6) return hexColor;

    const r = parseInt(sanitized.slice(0, 2), 16);
    const g = parseInt(sanitized.slice(2, 4), 16);
    const b = parseInt(sanitized.slice(4, 6), 16);

    const lighten = (value) => Math.round(value + (255 - value) * factor);

    const rr = lighten(r).toString(16).padStart(2, "0");
    const gg = lighten(g).toString(16).padStart(2, "0");
    const bb = lighten(b).toString(16).padStart(2, "0");

    return `#${rr}${gg}${bb}`;
}

function VehicleMarker({ vehicle }) {
    const route = vehicle.matchedRoute || findClosestRoute([vehicle.latitude, vehicle.longitude]);

    const baseColor = route ? route.color : "#3388ff";
    const isInbound = vehicle.direction === "inbound";
    const markerColor = isInbound ? lightenHexColor(baseColor, 0.45) : baseColor;

    const busIcon = L.divIcon({
        html: `
      <div style="
        background-color: ${markerColor};
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
                    <strong>Direction:</strong> {isInbound ? "Returning to Kulima Tower" : "Outbound to destination"}
                    <br />
                    {route ? (
                        <>
                            <strong>Route:</strong> {route.name}
                            <br />
                            <strong>Color:</strong>{" "}
                            <span
                                style={{
                                    color: markerColor,
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
