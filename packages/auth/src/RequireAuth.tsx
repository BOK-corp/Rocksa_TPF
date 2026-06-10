import type { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "./AuthProvider.tsx";

interface Props {
  roles?: string[];
  fallbackTo?: string;
  children: ReactNode;
}

export const RequireAuth = ({
  roles,
  fallbackTo = "/auth/login",
  children,
}: Props) => {
  const { status, profile } = useAuth();

  if (status === "loading") return null;
  if (status === "anon") return <Navigate to={fallbackTo} />;
  if (roles && profile && !roles.includes(profile.role)) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
