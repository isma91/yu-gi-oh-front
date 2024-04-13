import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

type LeafletPropsType = {
    lattitude?: number;
    longitude?: number;
    radius?: number;
    popupText?: string | null;
};

export default function Leaflet(props: LeafletPropsType) {
    //Eiffel Tower by default
    let lattitude = 48.85825806070258;
    let longitude = 2.294487802648355;
    let radius: null | number = null;
    if (props.lattitude !== undefined) {
        lattitude = props.lattitude;
    }
    if (props.longitude !== undefined) {
        longitude = props.longitude;
    }
    if (props.radius !== undefined) {
        radius = props.radius;
    }
    let popupText = `Lattitude: ${lattitude}, longitude: ${longitude}`;
    if (props.popupText !== undefined && props.popupText !== null) {
        popupText = props.popupText;
    }
    const position: [number, number] = [lattitude, longitude];

    return (
        <MapContainer style={{ width: "100%", height: "60vh" }} center={position} zoom={12} scrollWheelZoom={true} tap={false}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
                position={position}
                icon={new Icon({ iconUrl: "/static/images/loading.png", iconSize: [40, 40], iconAnchor: [20, 41], popupAnchor: [0, -32] })}
            >
                <Popup>{popupText}</Popup>
            </Marker>
            {radius !== null ? <Circle center={position} radius={radius * 1000} /> : null}
        </MapContainer>
    );
}
