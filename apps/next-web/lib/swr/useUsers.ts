import { WorkspaceUserProps } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import useWorkspace from "./useWorkspace";

export default function useUsers({ invites }: { invites?: boolean } = {}) {
  const { id } = useWorkspace();

  const { data: users, error } = useSWR<WorkspaceUserProps[]>(
    id && `/api/workspaces/${id}/users`,
    fetcher
  );

  return {
    users,
    loading: !error && !users,
  };
}
