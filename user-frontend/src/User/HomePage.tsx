import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in react-leaflet not showing up correctly with Webpack/Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import RoutingMachine from "./RoutingMachine";
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
    iconUrl: "../../public/fire truck.svg",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  }),
  Police: L.icon({
    iconUrl: "../../public/police.svg",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  }),
  Medic: L.icon({
    iconUrl: "../../public/ambulance.svg",
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

const Homepage: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Defaulting to Chapagaun, Bagmati Province, Nepal
  const [position, setPosition] = useState<[number, number]>([
    27.5878, 85.3213,
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock User Data
  const user = {
    firstName: "John",
    lastName: "Doe",
  };
  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  // Fetch actual device location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn(
            "Location access denied or unavailable. Using default location.",
            err,
          );
        },
      );
    }

    // Click outside to close dropdown handler
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative h-screen w-full font-sans overflow-hidden bg-[#FDF8EF] text-[#1a1a1a]">
      {/* --- FULL SCREEN MAP LAYER --- */}
      <div className="absolute inset-0 z-0">
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
          <RoutingMachine
            start={kathmanduLocations[0].coordinate}
            end={kathmanduLocations[10].coordinate}
          />

          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <p className="font-bold">Current Location</p>
                <p className="text-xs text-gray-500">Device Location</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* --- FLOATING NAVBAR LAYER --- */}
      {/* pointer-events-none on the wrapper so we can still click/drag the map behind it */}
      <div className="absolute top-6 left-0 right-0 z-10 px-6 flex justify-between items-start pointer-events-none">
        {/* Left Side: Pills */}
        <div className="flex gap-3 pointer-events-auto">
          <button className="bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 rounded-full px-5 py-3 font-bold text-sm hover:bg-white transition">
            Dashboard
          </button>

          <button className="bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 rounded-full px-5 py-3 font-bold text-sm hover:bg-white transition flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            Alerts
          </button>
        </div>

        {/* Right Side: User Avatar & Dropdown */}
        <div className="relative pointer-events-auto" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#FBCF9E] text-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-sm hover:bg-[#f2b978] transition"
          >
            {initials}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 py-2 overflow-hidden transform origin-top-right transition-all">
              <div className="px-4 py-3 border-b border-gray-100 mb-1">
                <p className="text-sm font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">Agent Account</p>
              </div>

              <button className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition">
                Alert History
              </button>

              <div className="h-px w-full bg-gray-100 my-1"></div>

              <button
                onClick={() => console.log("Logging out...")}
                className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
