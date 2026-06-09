import { Outlet, createFileRoute } from "@tanstack/react-router";
import { WorkspaceLayout } from "../../components/WorkspaceLayout.tsx";

export const Route = createFileRoute("/workspace/__layout")({
  component: WorkspaceShell,
});

function WorkspaceShell() {
  return (
    <WorkspaceLayout>
      <Outlet />
    </WorkspaceLayout>
  );
}
