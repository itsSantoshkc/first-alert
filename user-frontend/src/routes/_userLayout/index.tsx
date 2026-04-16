import { createFileRoute } from "@tanstack/react-router";
import EmergencyAlert from "../../User/components/EmergencyAlert";
import Map from "../../components/Map";

export const Route = createFileRoute("/_userLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="absolute inset-0 z-0">
        <Map />
      </div>
      <EmergencyAlert />
    </div>
  );
}
