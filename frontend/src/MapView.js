import { MapContainer, TileLayer } from "react-leaflet"
import { useEffect, useState } from "react"
import axios from "axios"
import RouteDisplay from "./RouteDisplay"
import VehicleMarker from "./VehicleMarker"
import "./MapView.css"

function MapView() {

    const [vehicles, setVehicles] = useState([])

    const API = "http://localhost:8000"

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await axios.get(`${API}/vehicles/live`)
                setVehicles(res.data)
            } catch (err) {
                console.error("Vehicle fetch error:", err)
            }
        }

        fetchData()

        const interval = setInterval(fetchData, 5000)

        return () => clearInterval(interval)

    }, [])

    return (
        <div className="mapview-container">

            <MapContainer
                center={[-15.4167, 28.2833]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />

                <RouteDisplay />

                {vehicles.map((v) => (
                    <VehicleMarker
                        key={v.id || v.vehicle_id}
                        vehicle={v}
                    />
                ))}

            </MapContainer>

            <div className="mapview-legend">

                <strong>🚌 Active Vehicles: {vehicles.length}</strong>

                <hr />

                <p>Colored dashed lines = Bus routes</p>
                <p>● = Bus stops</p>

            </div>

        </div>
    )

}

export default MapView