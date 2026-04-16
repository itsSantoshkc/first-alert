import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Navbar from "../User/components/Navbar";

export const Route = createFileRoute("/_userLayout")({
  component: RouteComponent,
  beforeLoad: () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw redirect({
        to: "/auth/login",
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="relative h-screen w-full font-sans overflow-hidden bg-[#FDF8EF] text-[#1a1a1a]">
      <Navbar />
      <Outlet />
    </div>
  );
}
