import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "../../User/Pages/ProfilePage";

export const Route = createFileRoute("/_userLayout/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProfilePage />;
}
