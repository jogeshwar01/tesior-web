import useWorkspace from "@/lib/swr/useWorkspace";
import { useMediaQuery } from "@/lib/hooks";
import { Modal } from "@/components/shared";
import { Button } from "@/components/ui/new-york";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Input } from "../ui/new-york/input";

function InviteTeammateModal({
  showInviteTeammateModal,
  setShowInviteTeammateModal,
}: {
  showInviteTeammateModal: boolean;
  setShowInviteTeammateModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [inviting, setInviting] = useState(false);
  const [username, setUsername] = useState("");
  const { id, slug, logo } = useWorkspace();
  const { isMobile } = useMediaQuery();

  return (
    <Modal
      showModal={showInviteTeammateModal}
      setShowModal={setShowInviteTeammateModal}
      className="bg-custom-black-100 border-accent-3"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-accent-3 px-4 py-4 pt-8 sm:px-16">
        <h2 className="text-2xl font-bold">Tesior</h2>
        <h3 className="text-lg font-medium">Add Teammate</h3>
        <p className="text-center text-sm text-gray-500">
          Add a teammate to join your workspace.
        </p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setInviting(true);
          fetch(`/api/workspaces/${id}/invites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }).then(async (res) => {
            if (res.status === 200) {
              await mutate(`/api/workspaces/${id}/invites`);
              await mutate(`/api/workspaces/${id}/users`);
              await mutate(`/api/workspaces`);
              toast.success("User Added!");
              slug && setShowInviteTeammateModal(false);
            } else {
              const { error } = await res.json();
              toast.error(error?.message ?? error);
            }
            setShowInviteTeammateModal(false);
            setInviting(false);
          });
        }}
        className="flex flex-col space-y-4 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="username" className="block text-sm">
            Github Username
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <Input
              type="username"
              name="username"
              id="username"
              placeholder="Enter Username"
              autoFocus={!isMobile}
              autoComplete="off"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md border-white text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>
        <Button disabled={inviting}>{inviting ? "Adding" : "Add"}</Button>
      </form>
    </Modal>
  );
}

export function useInviteTeammateModal() {
  const [showInviteTeammateModal, setShowInviteTeammateModal] = useState(false);

  const InviteTeammateModalCallback = useCallback(() => {
    return (
      <InviteTeammateModal
        showInviteTeammateModal={showInviteTeammateModal}
        setShowInviteTeammateModal={setShowInviteTeammateModal}
      />
    );
  }, [showInviteTeammateModal, setShowInviteTeammateModal]);

  return useMemo(
    () => ({
      setShowInviteTeammateModal,
      InviteTeammateModal: InviteTeammateModalCallback,
    }),
    [setShowInviteTeammateModal, InviteTeammateModalCallback]
  );
}
