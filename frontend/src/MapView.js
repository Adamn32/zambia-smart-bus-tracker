import { MapContainer, TileLayer } from "react-leaflet"
import { useEffect, useState } from "react"
import axios from "axios"
import RouteDisplay from "./RouteDisplay"
import VehicleMarker from "./VehicleMarker"
import VehiclePanel from "./VehiclePanel"
import StatsPanel from "./StatsPanel"
import RouteSelector from "./RouteSelector"
import LUSAKA_ROUTES from "./routes"
import "./MapView.css"

function MapView() {

    const [vehicles, setVehicles] = useState([])
    const [selectedRoute, setSelectedRoute] = useState("ALL")

    const API = "http://localhost:8000"

    useEffect(() => {

        const fetchVehicles = async () => {
            try {
                const res = await axios.get(`${API}/vehicles/live`)
                setVehicles(res.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchVehicles()

        const interval = setInterval(fetchVehicles, 5000)

        return () => clearInterval(interval)

    }, [])

    const filteredVehicles = selectedRoute === "ALL"
        ? vehicles
        : vehicles.filter(v => v.route_id === selectedRoute)

    return (

        <div className="mapview-container">

            <MapContainer
                center={[-15.4167, 28.2833]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RouteDisplay />

                {filteredVehicles.map(v =>
                    <VehicleMarker
                        key={v.vehicle_id}
                        vehicle={v}
                    />
                )}

            </MapContainer>

            <RouteSelector
                routes={LUSAKA_ROUTES}
                selected={selectedRoute}
                onChange={setSelectedRoute}
            />

            <VehiclePanel vehicles={filteredVehicles} />

            <StatsPanel vehicles={vehicles} routes={LUSAKA_ROUTES} />

        </div>
    )
}

export default MapView