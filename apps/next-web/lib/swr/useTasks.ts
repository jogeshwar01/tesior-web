import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { TaskInput } from "../types";

export default function useTasks() {
  const { data: tasks, error } = useSWR<TaskInput[]>(`/api/user/task`, fetcher);

  return {
    tasks: tasks,
    loading: !tasks && !error,
    error,
  };
}
