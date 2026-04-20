import { createFileRoute } from "@tanstack/react-router";
import Homepage from "../../../Respondent/Homepage";

export const Route = createFileRoute("/_respondentLayout/respondent/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Homepage />;
}
