import { createFileRoute } from "@tanstack/react-router";
import Homepage from "../../../Respondent/Homepage";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_respondentLayout/respondent/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Toaster />
      <Homepage />
    </>
  );
}
