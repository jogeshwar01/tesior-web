import { WorkspaceProps } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

export default function useWorkspaces() {
  const { data: workspaces, error } = useSWR<WorkspaceProps[]>(
    "/api/workspaces",
    fetcher,
    {
      dedupingInterval: 30000,
    }
  );

  return {
    workspaces,
    error,
    loading: !workspaces && !error,
  };
}
