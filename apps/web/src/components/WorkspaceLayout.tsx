import { useState, type ReactNode } from "react";
import { TopNav } from "./TopNav.tsx";
import { WorkspaceSidebar } from "./CategorySidebar.tsx";

export const WorkspaceLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <TopNav
        showMenuButton
        onMenuClick={() => setSidebarOpen(true)}
      />
      <div className="relative flex min-h-[calc(100vh-4rem)]">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-ink-900/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <WorkspaceSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};
