import { createFileRoute } from "@tanstack/react-router";

import Homepage from "@/User/Pages/HomePage";

export const Route = createFileRoute("/_userLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Homepage />;
}
