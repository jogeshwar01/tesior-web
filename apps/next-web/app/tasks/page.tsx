"use client";

import React from "react";
import { useAddEditTaskModal } from "@/components/modals";
import useTasks from "@/lib/swr/useTasks";
import { TaskCard } from "@/components/task/TaskCard"

export default function CreateTaskPage() {
  const { setShowModal, AddEditTaskModal } = useAddEditTaskModal();
  const { tasks, error, loading } = useTasks();
  
  const handleEdit = () => {
    console.log("Editing");
  };

  const handleApprove = (taskId: string) => {
    console.log("Approving", taskId);
  };

  const handleReject = (taskId: string) => {
    console.log("Rejecting", taskId);
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
                onEdit={handleEdit}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
