"use client";

import React from "react";
import { toast } from "sonner";
import { useAddEditTaskModal } from "@/components/modals";
import useTasks from "@/lib/swr/useTasks";
import { TaskCard } from "@/components/task/TaskCard";
import { mutate } from "swr";

export default function CreateTaskPage() {
  const { setShowModal, AddEditTaskModal } = useAddEditTaskModal();
  const { tasks, error, loading } = useTasks();

  const handleStatus = async (taskId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/task/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.approval) {
        mutate("/api/user/task");
        toast.success("Task status updated successfully!");
      } else {
        toast.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Failed to update task status");
    }
  };

  const handlePayout = async (taskId: string, amount: number) => {
    console.log("Payout task", taskId, "with amount", amount);
  };

  if (error) return <div>Failed to load tasks</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <button onClick={() => setShowModal(true)}>Create/Edit Task</button>
      <AddEditTaskModal />

      <div className="col-span-full lg:col-span-8">
        <ul className="grid min-h-[66.5vh] grid-cols-16 gap-3 p-4">
          {tasks &&
            tasks.length > 0 &&
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                handleStatus={handleStatus}
                handlePayout={handlePayout}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
