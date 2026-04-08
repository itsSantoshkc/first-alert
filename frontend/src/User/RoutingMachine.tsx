import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

type Props = {
  start: [number, number];
  end: [number, number];
};

export default function RoutingMachine({ start, end }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    //@ts-ignore
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: true,
      addWaypoints: false,
      draggableWaypoints: true,
      show: true,
      //@ts-ignore
      router: L.Routing?.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
}
