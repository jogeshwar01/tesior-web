"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/new-york/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/new-york/dropdown-menu";

import { Task, TaskStatus } from "@/lib/types";
import { mutate } from "swr";
import { toast } from "sonner";
import useWorkspace from "@/lib/swr/useWorkspace";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = Task.parse(row.original);
  const workspace = useWorkspace();

  const handleStatus = async (taskId: string, status: string) => {
    try {
      const response = await fetch(`/api/task/${taskId}?workspaceId=${workspace.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.approval) {
        mutate(`/api/task?workspaceId=${workspace.id}`);
        toast.success("Task status updated successfully!");
      } else {
        toast.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Failed to update task status");
    }
  };

  const handleTransfer = async (taskId: string) => {
    try {
      const response = await fetch(`/api/transfer?workspaceId=${workspace.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      if (response.status === 200) {
        mutate(`/api/task?workspaceId=${workspace.id}`);
        mutate(`/api/balance`);
        mutate(`/api/transfer?workspaceId=${workspace.id}`);
        toast.success("Task paid successfully!");
      } else {
        toast.error("Failed to pay for task");
      }
    } catch (error) {
      console.error("Failed to pay for task", error);
      toast.error("Failed to pay for task");
    }
  };

  return (
    <>
      {workspace.isOwner && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {task.status === TaskStatus.Pending ? (
              <div>
                <DropdownMenuItem
                  onClick={() => {
                    handleStatus(task.id, "Approved");
                  }}
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleStatus(task.id, "Rejected");
                  }}
                >
                  Reject
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </div>
            ) : task.status === TaskStatus.Approved ? (
              <DropdownMenuItem
                onClick={() => {
                  handleTransfer(task.id);
                }}
              >
                Pay
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>{task.status}</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
