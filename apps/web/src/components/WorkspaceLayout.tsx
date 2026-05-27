import type { ReactNode } from "react";
import { TopNav } from "./TopNav.tsx";
import { WorkspaceSidebar } from "./CategorySidebar.tsx";

export const WorkspaceLayout = ({ children }: { children: ReactNode }) => (
  <div>
    <TopNav />
    <div className="flex min-h-[calc(100vh-4rem)]">
      <WorkspaceSidebar />
      <main className="flex-1">{children}</main>
    </div>
  </div>
);
