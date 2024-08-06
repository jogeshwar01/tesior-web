import { fetcher } from "@/lib/utils";
import useSwr from "swr";
import { UserProps } from "@/lib/types";

export default function useUser() {
  const { data, isLoading } = useSwr<UserProps>("/api/user", fetcher);

  return {
    user: data,
    loading: isLoading,
  };
}
