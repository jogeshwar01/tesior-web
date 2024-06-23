import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { TaskInput } from "../types";
import { APP_DOMAIN } from "../utils/constants";

export default function useTasks() {
  const { data: tasks, error } = useSWR<TaskInput[]>(`${APP_DOMAIN}/api/user/task`, fetcher);

  return {
    tasks: tasks,
    loading: !tasks && !error,
    error,
  };
}
