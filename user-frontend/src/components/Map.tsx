import {
  forwardRef,
  useEffect,
  useMemo,
  useImperativeHandle,
  useRef,
} from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

import RoutingMachine from "@/utilities/RoutingMachine";

type Props = {
  position: [number, number];
  setPosition: (coords: [number, number]) => void;
  respondendPosition?: [number, number] | null;
};

export type MapRef = {
  latestPosition: [number, number] | null;
};

const DEFAULT_ICON = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DEFAULT_ICON;

const MapRecenter = ({ position }: { position: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, map.getZoom(), { duration: 1 });
  }, [map, position]);

  return null;
};

const Map = forwardRef<MapRef, Props>(
  ({ position, setPosition, respondendPosition }, ref) => {
    const latestPositionRef = useRef<[number, number] | null>(position);

    useImperativeHandle(ref, () => ({
      latestPosition: latestPositionRef.current,
    }));

    const icons = useMemo(() => {
      return {
        FireFighter: L.icon({
          iconUrl: "/fire-truck.svg",
          iconSize: [35, 35],
          iconAnchor: [17, 35],
        }),
        Police: L.icon({
          iconUrl: "/police.svg",
          iconSize: [35, 35],
          iconAnchor: [17, 35],
        }),
        Medic: L.icon({
          iconUrl: "/ambulance.svg",
          iconSize: [35, 35],
          iconAnchor: [17, 35],
        }),
      } satisfies Record<"Police" | "Medic" | "FireFighter", L.Icon>;
    }, []);

    useEffect(() => {
      if (!("geolocation" in navigator)) return;

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords: [number, number] = [
            pos.coords.latitude,
            pos.coords.longitude,
          ];
          latestPositionRef.current = coords;
          setPosition(coords);
        },
        (err) => {
          console.warn("Location access denied or unavailable.", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        },
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
      <MapContainer
        center={position}
        zoom={14}
        zoomControl={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter position={position} />

        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <p className="font-bold">Current Location</p>
              <p className="text-xs text-gray-500">Device Location</p>
            </div>
          </Popup>
        </Marker>

        {respondendPosition && (
          <RoutingMachine start={position} end={respondendPosition} />
        )}
      </MapContainer>
    );
  },
);

export default Map;
