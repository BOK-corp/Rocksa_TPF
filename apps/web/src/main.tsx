import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth, type AuthValue } from "@rocksa/auth";
import { routeTree } from "./routeTree.gen.ts";
import "./styles.css";

const queryClient = new QueryClient();

interface RouterContext {
  queryClient: QueryClient;
  auth: AuthValue;
}

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const AppRouter = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ queryClient, auth }} />;
};

const root = document.getElementById("root");
if (!root) throw new Error("missing #root");

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);

export type { RouterContext };
