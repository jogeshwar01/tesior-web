"use client";

import { columns } from "@/components/table/task/columns";
import { DataTable } from "@/components/table/task/data-table";
import useTasks from "@/lib/swr/useTasks";
import z from "zod";
import { Task } from "@/lib/types";
import { Button } from "@/components/ui/new-york/button";
import { useContext } from "react";
import { ModalContext } from "@/components/modals/provider";
import useWorkspace from "@/lib/swr/useWorkspace";
import { LoadingSpinner } from "@/components/custom/loading";

export default function TaskPage() {
  const workspace = useWorkspace();
  const { tasks: data, error, loading } = useTasks(workspace.id || "");
  const { setShowAddEditTaskModal } = useContext(ModalContext);

  if (error) return <div>Failed to load tasks</div>;
  if (loading) return <LoadingSpinner />;

  const tasks = z.array(Task).parse(data);

  return (
    <div className="hidden h-full w-[75%] flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of contributions.
          </p>
        </div>
        {workspace.isOwner && (
          <div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAddEditTaskModal(true)}
              className="hover:bg-black"
            >
              Add Task
            </Button>
          </div>
        )}
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
}
