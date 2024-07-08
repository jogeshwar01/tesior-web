import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { TaskInput } from "../types";

export default function useTasks(workspaceId: string) {
  const { data: tasks, error } = useSWR<TaskInput[]>(`/api/task?workspaceId=${workspaceId}`, fetcher);

  return {
    tasks: tasks,
    loading: !tasks && !error,
    error,
  };
}
