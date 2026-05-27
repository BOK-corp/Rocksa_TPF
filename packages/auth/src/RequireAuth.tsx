import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider.tsx";

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}

export const RequireAuth = ({ fallback, children }: Props) => {
  const { status } = useAuth();
  if (status === "loading") return null;
  if (status === "anon") return <>{fallback ?? null}</>;
  return <>{children}</>;
};
