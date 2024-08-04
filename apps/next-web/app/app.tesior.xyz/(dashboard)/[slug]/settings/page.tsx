"use client";

import useWorkspace from "@/lib/swr/useWorkspace";

export default function WorkspaceSettingsClient() {
  const { id, name, slug, isOwner, repoUrl } = useWorkspace();

  return (
    <div className="rounded-lg border border-accent-3 ">
      <div className="flex flex-col space-y-3 p-10 pb-0">
        <h2 className="text-xl font-medium">General</h2>
        <p className="text-sm text-gray-500">
          View and edit your workspace settings.
        </p>
      </div>
      <div className="flex items-center justify-between p-10 pt-5 md:w-[60vw]">
        <div className="flex flex-col space-y-1">
          <p className="text-sm">Workspace</p>
          <p className="text-md">
            Name: <span className="font-medium">{name}</span>
          </p>
          <p className="text-sm text-gray-500">
            Slug: <span className="font-medium">{slug}</span>
          </p>
          <p className="text-sm text-gray-500">
            Repository:{" "}
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent-6"
            >
              {repoUrl}
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Workspace ID: <span className="font-medium">{id}</span>
          </p>
          <p className="text-sm text-gray-500">
            Role:{" "}
            <span className="font-medium">{isOwner ? "Owner" : "Member"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
