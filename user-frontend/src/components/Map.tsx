import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import RoutingMachine from "@/utilities/RoutingMachine";

type Props = {
  position: [number, number];
  setPosition: (coords: [number, number]) => void;
  respondendPosition?: [number, number] | null;
};

const kathmanduLocations: {
  type: string;
  coordinate: [number, number];
}[] = [
  { type: "Police", coordinate: [27.7172, 85.324] }, // Kathmandu Durbar Square
  { type: "Medic", coordinate: [27.712, 85.3123] }, // Swayambhunath
  { type: "FireFighter", coordinate: [27.7215, 85.362] }, // Boudhanath
  { type: "Police", coordinate: [27.715, 85.29] }, // Kirtipur
  { type: "Medic", coordinate: [27.7426, 85.3015] }, // Balaju
  { type: "FireFighter", coordinate: [27.7066, 85.3305] }, // Thamel
  { type: "Police", coordinate: [27.6846, 85.3182] }, // Patan Durbar Square
  { type: "Medic", coordinate: [27.671, 85.4298] }, // Bhaktapur Durbar Square
  { type: "FireFighter", coordinate: [27.6939, 85.281] }, // Kalanki
  { type: "Police", coordinate: [27.7041, 85.304] }, // Teku
  { type: "Medic", coordinate: [27.734, 85.335] }, // Lazimpat
  { type: "FireFighter", coordinate: [27.7366, 85.343] }, // Maharajgunj
  { type: "Police", coordinate: [27.7285, 85.345] }, // Teaching Hospital Area
  { type: "Medic", coordinate: [27.698, 85.359] }, // Koteshwor
  { type: "FireFighter", coordinate: [27.6915, 85.342] }, // Baneshwor
  { type: "Police", coordinate: [27.7, 85.333] }, // New Baneshwor
  { type: "Medic", coordinate: [27.71, 85.348] }, // Gaushala
  { type: "FireFighter", coordinate: [27.739, 85.365] }, // Gokarna
  { type: "Police", coordinate: [27.785, 85.332] }, // Budhanilkantha
  { type: "Medic", coordinate: [27.754, 85.318] }, // Gongabu
  { type: "FireFighter", coordinate: [27.755, 85.346] }, // Tokha
  { type: "Police", coordinate: [27.665, 85.329] }, // Jawalakhel
  { type: "Medic", coordinate: [27.664, 85.318] }, // Lagankhel
  { type: "FireFighter", coordinate: [27.65, 85.307] }, // Bungamati
  { type: "Police", coordinate: [27.646, 85.322] }, // Khokana
  { type: "Medic", coordinate: [27.68, 85.395] }, // Thimi
  { type: "FireFighter", coordinate: [27.673, 85.438] }, // Suryabinayak
  { type: "Police", coordinate: [27.73, 85.38] }, // Jorpati
  { type: "Medic", coordinate: [27.705, 85.27] }, // Thankot
  { type: "FireFighter", coordinate: [27.743, 85.37] }, // Sundarijal
];

const imageObj: Record<string, L.Icon<L.IconOptions>> = {
  FireFighter: L.icon({
    iconUrl: "/fire truck.svg",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  }),
  Police: L.icon({
    iconUrl: "/public/police.svg",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  }),
  Medic: L.icon({
    iconUrl: "/public/ambulance.svg",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  }),
};

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to auto-pan the map when location changes
const MapRecenter = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
};

const Map = ({ position, setPosition, respondendPosition }: Props) => {
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn(
            "Location access denied or unavailable. Using default location.",
            err,
          );
        },
        { enableHighAccuracy: true },
      );
    }
  }, []);
  return (
    <MapContainer
      center={position}
      zoom={14}
      zoomControl={false} // Hiding default zoom to keep UI clean, optional
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapRecenter position={position} />
      {kathmanduLocations?.map((obj) => (
        <Marker position={obj.coordinate} icon={imageObj[obj.type]}>
          <Popup>
            <div className="text-center">
              <p className="font-bold">{obj.type}</p>
              <p className="text-xs text-gray-500">Device Location</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {respondendPosition && (
        <RoutingMachine start={position} end={respondendPosition} />
      )}
      <Marker position={position}>
        <Popup>
          <div className="text-center">
            <p className="font-bold">Current Location</p>
            <p className="text-xs text-gray-500">Device Location</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
