import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { jwtDecode } from "jwt-decode";

type JwtPayload = { role?: string };

export const Route = createFileRoute("/_respondentLayout")({
  component: RouteComponent,
  beforeLoad: () => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw redirect({ to: "/auth/login" });

    let decoded: JwtPayload;
    try {
      decoded = jwtDecode<JwtPayload>(token);
    } catch {
      throw redirect({ to: "/auth/login" });
    }

    const role = decoded?.role?.toLowerCase();
    if (!role || !["firefighter", "police", "medic"].includes(role)) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="relative h-screen w-full font-sans overflow-hidden bg-[#FDF8EF] text-[#1a1a1a]">
      <Outlet />
    </div>
  );
}
