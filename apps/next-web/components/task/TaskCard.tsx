import React, { useState } from "react";
import { Edit3 } from "lucide-react";
import { TaskInput } from "@/lib/types";
import { ThreeDots, Delete } from "../shared/icons";
import { Popover } from "@/components/shared";

import { FolderInput } from "lucide-react";

// Props for TaskCard component
interface TaskCardProps {
  task: TaskInput;
  onEdit: () => void;
  onApprove: (taskId: string) => void;
  onReject: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onApprove,
  onReject,
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
          <div >{task.amount}</div>
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
                <div className="grid gap-px p-2">
                  <button
                    onClick={() => {
                      setOpenPopover(false);
                      onEdit();
                    }}
                    className="h-9 px-2 font-medium"
                  ><Edit3 className="h-4 w-4" /> Edit</button>
                </div>
                <div className="border-t border-gray-200" />
                <div className="grid gap-px p-2">
                  <button
                    onClick={() => {
                      setOpenPopover(false);
                      onApprove("Abc");
                    }}
                    className="h-9 px-2 font-medium"
                  ><FolderInput className="h-4 w-4" />Transfer
                  </button>
                  <button
                    onClick={() => {
                      setOpenPopover(false);
                      onReject("abc");
                    }}
                    className="h-9 px-2 font-medium"
                  ><Delete className="h-4 w-4" /> Delete</button>
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
