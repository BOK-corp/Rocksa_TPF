import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { RequireAuth } from "@rocksa/auth";

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
  component: () => (
    <RequireAuth roles={["curator", "admin"]}>
      <Outlet />
    </RequireAuth>
  ),
});
