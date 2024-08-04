import { fetcher } from "@/lib/utils";
import useSWRImmutable from "swr/immutable";
import { UserProps } from "@/lib/types";

export default function useUser() {
  const { data, isLoading } = useSWRImmutable<UserProps>("/api/user", fetcher);

  return {
    user: data,
    loading: isLoading,
  };
}
