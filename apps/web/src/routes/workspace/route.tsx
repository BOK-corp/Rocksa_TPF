import {
  Outlet,
  createFileRoute,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { RequireAuth } from "@rocksa/auth";
import { WorkspaceLayout } from "../../components/WorkspaceLayout.tsx";

export const Route = createFileRoute("/workspace")({
  beforeLoad: ({ context }) => {
    const { auth } = context;
    if (auth.status === "anon") throw redirect({ to: "/auth/login" });
    if (
      auth.status === "authed" &&
      auth.profile &&
      !["curator", "admin"].includes(auth.profile.role)
    ) {
      throw redirect({ to: "/" });
    }
  },
  component: WorkspaceRoot,
});

function WorkspaceRoot() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isWelcome = pathname === "/workspace" || pathname === "/workspace/";

  return (
    <RequireAuth roles={["curator", "admin"]}>
      {isWelcome ? (
        <Outlet />
      ) : (
        <WorkspaceLayout>
          <Outlet />
        </WorkspaceLayout>
      )}
    </RequireAuth>
  );
}
