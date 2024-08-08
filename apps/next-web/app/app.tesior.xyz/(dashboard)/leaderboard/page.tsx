"use client";

import { columns } from "@/components/table/leaderboard/columns";
import { DataTable } from "@/components/table/leaderboard/data-table";
import z from "zod";
import useLeaderboard from "@/lib/swr/useLeaderboard";
import { LoadingSpinner } from "@/components/custom/loading";
import { Leaderboard } from "@/lib/types";

export default function LeaderboardPage() {
  const { leaderboard: data, error, loading } = useLeaderboard();

  if (error) return <div>Failed to load leaderboard</div>;
  if (loading) return <LoadingSpinner />;

  const leaderboard = z.array(Leaderboard).parse(data);

  return (
    <div className="hidden h-full w-[75%] flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard!</h2>
          <p className="text-muted-foreground">
            Here are the top contributors in your projects!
          </p>
        </div>
      </div>
      <DataTable data={leaderboard} columns={columns} />
    </div>
  );
}
