import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace/__layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/workspace/__layout"!</div>;
}
