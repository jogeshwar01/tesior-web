"use client";

import useWorkspace from "@/lib/swr/useWorkspace";
import LayoutLoader from "@/components/layout/layout-loader";
import WorkspaceNotFound from "@/components/workspaces/workspace-not-found";
import { ReactNode } from "react";

export default function WorkspaceAuth({ children }: { children: ReactNode }) {
  const { loading, error } = useWorkspace();

  if (loading) {
    return <LayoutLoader />;
  }

  if (error && (error.status === 404 || error.status === 500)) {
    return <WorkspaceNotFound />;
  }

  return children;
}
