import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "./AuthProvider.tsx";

interface Props {
  redirectTo?: string;
  children: ReactNode;
}

export const RedirectIfAuthed = ({
  redirectTo = "/workspace/overview",
  children,
}: Props) => {
  const { status } = useAuth();
  if (status === "loading") return null;
  if (status === "authed") return <Navigate to={redirectTo} />;
  return <>{children}</>;
};
