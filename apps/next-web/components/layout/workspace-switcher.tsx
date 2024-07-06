"use client";

import useWorkspaces from "@/lib/swr/useWorkspaces";
import { WorkspaceProps } from "@/lib/types";
import { BlurImage, Popover } from "@/components/ui";
import { Tick } from "@/components/shared/icons";
import { DICEBEAR_AVATAR_URL } from "@/lib/utils/constants";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCallback, useContext, useMemo, useState } from "react";
import { ModalContext } from "@/components/modals/provider";

export default function WorkspaceSwitcher() {
  const { workspaces } = useWorkspaces();
  const { data: session, status } = useSession();
  const { slug, key } = useParams() as {
    slug?: string;
    key?: string;
  };

  const selected = useMemo(() => {
    const selectedWorkspace = workspaces?.find(
      (workspace: any) => workspace.slug === slug
    );

    if (slug && workspaces && selectedWorkspace) {
      return {
        ...selectedWorkspace,
        image:
          selectedWorkspace.logo ||
          `${DICEBEAR_AVATAR_URL}${selectedWorkspace.name}`,
      };

      // return personal account selector if there's no workspace or error (user doesn't have access to workspace)
    } else {
      return {
        name: session?.user?.name || session?.user?.email,
        slug: "/",
        image:
          session?.user?.image ||
          `https://api.dicebear.com/7.x/micah/svg?seed=${session?.user?.email}`,
      };
    }
  }, [slug, workspaces, session]) as {
    id?: string;
    name: string;
    slug: string;
    image: string;
  };

  const [openPopover, setOpenPopover] = useState(false);

  if (!workspaces || status === "loading") {
    return <WorkspaceSwitcherPlaceholder />;
  }

  return (
    <div>
      <Popover
        content={
          <WorkspaceList
            selected={selected}
            workspaces={workspaces}
            setOpenPopover={setOpenPopover}
          />
        }
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex items-center justify-between rounded-lg bg-white p-1.5 text-left text-sm transition-all duration-75 hover:bg-gray-100 focus:outline-none active:bg-gray-200"
        >
          <div className="flex items-center space-x-3 pr-2">
            <BlurImage
              src={selected.image}
              referrerPolicy="no-referrer"
              width={20}
              height={20}
              alt={selected.id || selected.name}
              className="h-8 w-8 flex-none overflow-hidden rounded-full"
            />
            <div
              className={`${
                key ? "hidden" : "flex"
              } items-center space-x-3 sm:flex`}
            >
              <span className="inline-block max-w-[100px] truncate text-sm font-medium sm:max-w-[200px]">
                {selected.name}
              </span>
            </div>
          </div>
          <ChevronsUpDown
            className="h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </Popover>
    </div>
  );
}

function WorkspaceList({
  selected,
  workspaces,
  setOpenPopover,
}: {
  selected: {
    name: string;
    slug: string;
    image: string;
  };
  workspaces: WorkspaceProps[];
  setOpenPopover: (open: boolean) => void;
}) {
  const { setShowAddWorkspaceModal } = useContext(ModalContext);
  
  const { domain, key } = useParams() as { domain?: string; key?: string };
  const pathname = usePathname();

  const href = useCallback(
    (slug: string) => {
      if (domain || key || selected.slug === "/") {
        // if we're on a link page, navigate back to the workspace root
        return `/${slug}`;
      } else {
        // else, we keep the path but remove all query params
        return pathname?.replace(selected.slug, slug).split("?")[0] || "/";
      }
    },
    [domain, key, pathname, selected.slug]
  );

  return (
    <div className="relative mt-1 max-h-72 w-full space-y-0.5 overflow-auto rounded-md bg-white p-2 text-base sm:w-60 sm:text-sm sm:shadow-lg">
      <div className="p-2 text-xs text-gray-500">My Workspaces</div>
      {workspaces.map(({ id, name, slug, logo }) => {
        return (
          <Link
            key={slug}
            className={`relative flex w-full items-center space-x-2 rounded-md px-2 py-1.5 hover:bg-gray-100 active:bg-gray-200 ${
              selected.slug === slug ? "font-medium" : ""
            } transition-all duration-75`}
            href={href(slug)}
            shallow={false}
            onClick={() => setOpenPopover(false)}
          >
            <BlurImage
              src={logo || `${DICEBEAR_AVATAR_URL}${name}`}
              width={20}
              height={20}
              alt={id}
              className="h-7 w-7 shrink-0 overflow-hidden rounded-full"
            />
            <span
              className={`block truncate text-sm sm:max-w-[140px] ${
                selected.slug === slug ? "font-medium" : "font-normal"
              }`}
            >
              {name}
            </span>
            {selected.slug === slug ? (
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-black">
                <Tick className="h-5 w-5" aria-hidden="true" />
              </span>
            ) : null}
          </Link>
        );
      })}
      <button
        key="add"
        onClick={() => {
          setOpenPopover(false);
          setShowAddWorkspaceModal(true);
        }}
        className="flex w-full cursor-pointer items-center space-x-2 rounded-md p-2 transition-all duration-75 hover:bg-gray-100"
      >
        <PlusCircle className="h-6 w-6 text-gray-500" />
        <span className="block truncate">Add a new workspace</span>
      </button>
    </div>
  );
}

function WorkspaceSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
      <div className="hidden h-8 w-28 animate-pulse rounded-md bg-gray-200 sm:block sm:w-40" />
      <ChevronsUpDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
    </div>
  );
}
