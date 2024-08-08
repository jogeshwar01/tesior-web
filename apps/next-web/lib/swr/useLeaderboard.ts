import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { LeaderboardInput } from "../types";

export default function useLeaderboard() {
  const { data: leaderboard, error } = useSWR<LeaderboardInput[]>(
    `/api/leaderboard`,
    fetcher
  );

  return {
    leaderboard: leaderboard,
    loading: !leaderboard && !error,
    error,
  };
}
