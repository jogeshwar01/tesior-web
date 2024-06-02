import React, { useState } from "react";
import { Edit3 } from "lucide-react";
import { TaskInput, TaskStatus } from "@/lib/types";
import { ThreeDots, Delete } from "../shared/icons";
import { Popover } from "@/components/shared";

import { FolderInput } from "lucide-react";

// Props for TaskCard component
interface TaskCardProps {
  task: TaskInput;
  handleStatus: (taskId: string, status: string) => void;
  handlePayout: (taskId: string, amount: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  handleStatus,
  handlePayout,
}) => {
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <li
      className={`
         "border-gray-50 relative rounded-lg border-2 bg-white p-3 pr-1 shadow transition-all hover:shadow-md sm:p-4`}
    >
      <div className="relative flex items-center justify-between">
        <div className="relative flex shrink space-x-10 items-center">
          <div>{task.title}</div>
          <div>{task.proof}</div>
          <div>{task.amount}</div>
          <div>{task.status}</div>
          {/* 
            Here, we're manually setting ml-* values because if we do space-x-* in the parent div, 
            it messes up the tooltip positioning.
          */}
          <div className="ml-2 sm:ml-4">
            <div className="flex max-w-fit items-center space-x-1">
              <a
                href={task.proof}
                target="_blank"
                rel="noopener noreferrer"
                className="xs:block hidden max-w-[140px] truncate text-sm font-medium text-gray-700 underline-offset-2 hover:underline sm:max-w-[300px] md:max-w-[360px] xl:max-w-[420px]"
              >
                {task.proof}
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Popover
            content={
              <div className="w-full sm:w-48">
                <div className="border-t border-gray-200" />
                <div className="grid gap-px p-2">
                  {task.status === TaskStatus.Pending ? (
                    <div>
                      <button
                        onClick={() => {
                          setOpenPopover(false);
                          handleStatus(task.id, "Approved");
                        }}
                        className="h-9 px-2 font-medium"
                      >
                        <FolderInput className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setOpenPopover(false);
                          handleStatus(task.id, "Rejected");
                        }}
                        className="h-9 px-2 font-medium"
                      >
                        <Delete className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setOpenPopover(false);
                        handlePayout(task.id, task.amount);
                      }}
                      className="h-9 px-2 font-medium"
                    >
                      <FolderInput className="h-4 w-4" />
                      Pay
                    </button>
                  )}
                </div>
              </div>
            }
            align="end"
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          >
            <button
              type="button"
              onClick={() => {
                setOpenPopover(!openPopover);
              }}
              className="rounded-md px-1 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
            >
              <span className="sr-only">More options</span>
              <ThreeDots className="h-5 w-5 text-gray-500" />
            </button>
          </Popover>
        </div>
      </div>
    </li>
  );
};
