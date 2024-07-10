"use client";

import useUsers from "@/lib/swr/useUsers";
import useWorkspace from "@/lib/swr/useWorkspace";
import { WorkspaceUserProps } from "@/lib/types";
import { useInviteTeammateModal } from "@/components/modals/invite-teammate-modal";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
} from "@/components/ui/new-york";
import { cn, timeAgo } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";

const tabs: Array<"Members" | "Invitations"> = ["Members", "Invitations"];

export default function WorkspacePeopleClient() {
  const { setShowInviteTeammateModal, InviteTeammateModal } =
    useInviteTeammateModal();

  const [currentTab, setCurrentTab] = useState<"Members" | "Invitations">(
    "Members"
  );

  const { isOwner } = useWorkspace();

  const { users } = useUsers({ invites: currentTab === "Invitations" });

  return (
    <>
      {isOwner && <InviteTeammateModal />}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-col items-center  md:w-[60vw] justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-medium">People</h2>
            <p className="text-sm text-gray-500">
              Teammates that have access to this workspace.
            </p>
          </div>
          {isOwner && (
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowInviteTeammateModal(true)}
                className="h-9"
              >
                Invite
              </Button>
            </div>
          )}
        </div>
        <div className="flex space-x-3 border-b border-gray-200 px-3 sm:px-7">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`${
                tab === currentTab ? "border-black" : "border-transparent"
              } border-b py-1`}
            >
              <button
                onClick={() => setCurrentTab(tab)}
                className="rounded-md px-3 py-1.5 text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
              >
                {tab}
              </button>
            </div>
          ))}
        </div>
        <div className="grid divide-y divide-gray-200">
          {users ? (
            users.length > 0 ? (
              users.map((user) => (
                <UserCard key={user.id} user={user} currentTab={currentTab} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <img
                  src="/_static/illustrations/video-park.svg"
                  alt="No invitations sent"
                  width={300}
                  height={300}
                  className="pointer-events-none -my-8"
                />
                <p className="text-sm text-gray-500">No invitations sent</p>
              </div>
            )
          ) : (
            Array.from({ length: 5 }).map((_, i) => <UserPlaceholder key={i} />)
          )}
        </div>
      </div>
    </>
  );
}

const UserCard = ({
  user,
  currentTab,
}: {
  user: WorkspaceUserProps;
  currentTab: "Members" | "Invitations";
}) => {
  const { isOwner } = useWorkspace();
  const { id, name, email, createdAt, role: currentRole, isMachine } = user;
  const { data: session } = useSession();
  const [role, setRole] = useState<"owner" | "member">(currentRole);

  // invites expire after 14 days of being sent
  const expiredInvite =
    currentTab === "Invitations" &&
    createdAt &&
    Date.now() - new Date(createdAt).getTime() > 14 * 24 * 60 * 60 * 1000;

  return (
    <>
      <div
        key={id}
        className="flex items-center justify-between space-x-3 px-4 py-3 sm:pl-8"
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{name || email}</h3>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>

          {expiredInvite && <Badge variant="default">Expired</Badge>}
        </div>
        <div className="flex items-center space-x-3">
          {currentTab === "Members" ? (
            session?.user?.email === email ? (
              <p className="text-xs capitalize text-gray-500">{role}</p>
            ) : (
              !isMachine && (
                <select
                  className={cn(
                    "rounded-md border border-gray-200 text-xs text-gray-500 focus:border-gray-600 focus:ring-gray-600",
                    {
                      "cursor-not-allowed bg-gray-100": !isOwner,
                    }
                  )}
                  value={role}
                  disabled={true}
                >
                  <option value="owner">Owner</option>
                  <option value="member">Member</option>
                </select>
              )
            )
          ) : (
            <p className="text-xs text-gray-500" suppressHydrationWarning>
              Invited {timeAgo(createdAt)}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const UserPlaceholder = () => (
  <div className="flex items-center justify-between space-x-3 px-4 py-3 sm:px-8">
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-col">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
  </div>
);
