"use client";

import { useAddEditTaskModal } from "@/components/modals/add-edit-task-modal";
import { useAddWorkspaceModal } from "@/components/modals/add-workspace-modal";
import { Dispatch, ReactNode, SetStateAction, createContext } from "react";

export const ModalContext = createContext<{
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
  setShowAddEditTaskModal: Dispatch<SetStateAction<boolean>>; // this is for add-edit-task-modal
}>({
  setShowAddWorkspaceModal: () => {},
  setShowAddEditTaskModal: () => {},
});

export default function ModalProvider({ children }: { children: ReactNode }) {
  const { AddWorkspaceModal, setShowAddWorkspaceModal } =
    useAddWorkspaceModal();

  const { setShowAddEditTaskModal, AddEditTaskModal } = useAddEditTaskModal();

  return (
    <ModalContext.Provider
      value={{
        setShowAddWorkspaceModal,
        setShowAddEditTaskModal,
      }}
    >
      <AddWorkspaceModal />
      <AddEditTaskModal />
      {children}
    </ModalContext.Provider>
  );
}
