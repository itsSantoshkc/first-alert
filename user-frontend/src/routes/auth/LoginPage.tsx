import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "../../Auth/Login/Login";

export const Route = createFileRoute("/auth/LoginPage")({
  component: LoginPage,
});
