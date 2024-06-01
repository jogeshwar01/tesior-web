"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Modal } from "@/components/shared";
import { toast } from "sonner";
import { CreateTaskInput } from "@/lib/types";
import { mutate } from "swr";

interface AddEditTaskModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  initialData?: CreateTaskInput;
}

export function AddEditTaskModal({
  showModal,
  setShowModal,
  initialData,
}: AddEditTaskModalProps) {
  const [data, setData] = useState<CreateTaskInput>({
    title: initialData?.title || "",
    contact: initialData?.contact || "",
    proof: initialData?.proof || "",
    amount: initialData?.amount || 0,
  });

  const [saving, setSaving] = useState(false);

  const saveTask = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await response.json();
      setShowModal(false);
      toast.success("Task successfully created!");

      mutate("/api/user/task");

    } catch (error) {
      console.error("Failed to create task", error);
      toast.error("Failed to create task!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveTask();
        }}
      >
        <div>
          <label htmlFor="title">Add/Edit Task</label>
          <input
            type="text"
            id="title"
            value={data?.title || ""}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="contact">Contact</label>
          <input
            type="text"
            id="contact"
            required
            value={data?.contact}
            onChange={(e) => setData({ ...data, contact: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="proof">Proof</label>
          <input
            type="text"
            id="proof"
            required
            value={data?.proof}
            onChange={(e) => setData({ ...data, proof: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            required
            value={data?.amount || 0}
            onChange={(e) =>
              setData({ ...data, amount: Number(e.target.value) })
            }
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Task"}
        </button>
      </form>
    </Modal>
  );
}

export function useAddEditTaskModal() {
  const [showModal, setShowModal] = useState(false);

  const AddEditTaskModalCallback = useCallback(
    () => (
      <AddEditTaskModal showModal={showModal} setShowModal={setShowModal} />
    ),
    [showModal, setShowModal]
  );

  return useMemo(
    () => ({
      setShowModal,
      AddEditTaskModal: AddEditTaskModalCallback,
    }),
    [setShowModal, AddEditTaskModalCallback]
  );
}
