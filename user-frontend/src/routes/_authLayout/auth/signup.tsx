import { createFileRoute } from "@tanstack/react-router";
import SignUpPage from "../../../Auth/Register/Signup";

export const Route = createFileRoute("/_authLayout/auth/signup")({
  component: SignUpPage,
});
