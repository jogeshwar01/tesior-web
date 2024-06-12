"use client";

import { columns } from "@/components/table/task/columns";
import { DataTable } from "@/components/table/task/data-table";
import useTasks from "@/lib/swr/useTasks";
import z from "zod";
import { Task } from "@/lib/types";

export default function TaskPage() {
  const { tasks: data, error, loading } = useTasks();

  if (error) return <div>Failed to load tasks</div>;
  if (loading) return <div>Loading...</div>;

  const tasks = z.array(Task).parse(data);

  return (
    <div className="hidden h-full w-[70%] flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your contributions.
          </p>
        </div>
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
}
