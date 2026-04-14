import { createFileRoute, Outlet } from "@tanstack/react-router";
import Map from "../components/Map";
import EmergencyAlert from "../User/components/EmergencyAlert";
import Navbar from "../User/components/Navbar";

export const Route = createFileRoute("/_userLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative h-screen w-full font-sans overflow-hidden bg-[#FDF8EF] text-[#1a1a1a]">
      <Navbar />
      <Outlet />
      <div className="absolute inset-0 z-0">
        <Map />
      </div>
      <EmergencyAlert />
    </div>
  );
}
