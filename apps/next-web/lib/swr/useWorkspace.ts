import { WorkspaceProps } from "@/lib/types";
import { fetcher } from "@/lib/utils";
import { useParams, useSearchParams } from "next/navigation";
import useSWR from "swr";

export default function useWorkspace() {
  let { slug } = useParams() as { slug: string | null };
  const searchParams = useSearchParams();
  if (!slug) {
    slug = searchParams.get("slug");
  }

  const {
    data: workspace,
    error,
    mutate,
  } = useSWR<WorkspaceProps>(slug && `/api/workspaces/${slug}`, fetcher, {
    dedupingInterval: 30000,
  });

  return {
    ...workspace,
    isOwner: workspace?.users && workspace?.users[0]?.role === "owner",
    error,
    mutate,
    loading: slug && !workspace && !error ? true : false,
  };
}
