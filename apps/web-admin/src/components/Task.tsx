import { TaskInput, TaskStatus } from "@repo/common";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config.ts";

export const Task = ({
  setBalance,
}: {
  setBalance: Dispatch<SetStateAction<number>>;
}) => {
  const [tasks, setTasks] = useState<TaskInput[]>([]);

  async function getTasks() {
    const response = await axios.get(`${BACKEND_URL}/v1/admin/task`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return response.data.tasks;
  }

  async function handleStatus(id: string, status: TaskStatus) {
    await axios.put(
      `${BACKEND_URL}/v1/admin/task/${id}`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          status: status,
        };
      }
      return task;
    });

    setTasks(newTasks);
  }

  async function handleTransfer(taskId: string) {
    const response = await axios.post(
      `${BACKEND_URL}/v1/admin/transfer`,
      {
        taskId,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    if (response.data.admin.pending_amount) {
      setBalance(response.data.admin.pending_amount);

      const newTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: TaskStatus.Paid,
          };
        }
        return task;
      });

      setTasks(newTasks);
    }
  }

  useEffect(() => {
    getTasks().then((data) => {
      setTasks(data);
    });
  }, []);

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex m-5">
            <h1>{task.title}</h1>
            <span>{task.contact}</span>
            <a href={task.proof} style={{ color: "blue" }}>
              {task.proof}
            </a>
            <span>{task.amount}</span>
            <span>{task.user_id}</span>
            <span>{task.status}</span>

            {task.status === TaskStatus.Pending && (
              <>
                <button
                  className="bg-green-500 mx-5"
                  onClick={async () => {
                    await handleStatus(task.id, TaskStatus.Approved);
                  }}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500"
                  onClick={async () => {
                    await handleStatus(task.id, TaskStatus.Rejected);
                  }}
                >
                  Reject
                </button>
              </>
            )}

            {task.status === TaskStatus.Approved && (
              <button
                className="text-pink-500"
                onClick={async () => {
                  await handleTransfer(task.id);
                }}
              >
                Pay
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
