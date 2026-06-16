import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const defaultCenter = [40.7128, -74.006];

function LocationMap({ locations, center = defaultCenter }) {
    return (
        <MapContainer center={center} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location) => (
                <Marker key={location.id} position={[location.lat, location.lng]}>
                    <Popup>
                        <strong>{location.name}</strong> <br />
                        {location.description} <br />
                        <em>Type: {location.type}</em>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default LocationMap;