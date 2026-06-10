import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RedirectIfAuthed } from "@rocksa/auth";

export const Route = createFileRoute("/auth")({
  component: () => (
    <RedirectIfAuthed>
      <Outlet />
    </RedirectIfAuthed>
  ),
});
