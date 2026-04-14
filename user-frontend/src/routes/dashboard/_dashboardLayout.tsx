import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/_dashboardLayout")({
  component: () => (
    <div style={{ display: "flex" }}>
      <aside>Sidebar</aside>
      <main>
        <Outlet />
      </main>
    </div>
  ),
});
