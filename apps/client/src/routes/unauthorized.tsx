import { createFileRoute } from "@tanstack/react-router";
import { VscError } from "react-icons/vsc";

export const Route = createFileRoute("/unauthorized")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
    <VscError style={{height:250, width:250}}></VscError>
      <h1>
        You are not authorized to view this page.
      </h1>
      <p>
      Please log in to continue.</p>
    </div>
  );
}
