import { useMediaQuery } from "@/lib/hooks";
import { Modal } from "@/components/shared";
import { Button } from "@/components/ui/new-york/button";
import { InfoTooltip } from "@/components/ui/new-york/tooltip";
import slugify from "@sindresorhus/slugify";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { useDebounce } from "use-debounce";
import { AlertCircleFill } from "@/components/shared/icons";
import { Input } from "@/components/ui/new-york/input";

function AddWorkspaceModalHelper({
  showAddWorkspaceModal,
  setShowAddWorkspaceModal,
}: {
  showAddWorkspaceModal: boolean;
  setShowAddWorkspaceModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const [data, setData] = useState<{
    name: string;
    slug: string;
    repoUrl: string;
  }>({
    name: "",
    slug: "",
    repoUrl: "",
  });
  const { name, slug, repoUrl } = data;

  const [slugError, setSlugError] = useState<string | null>(null);
  const [repoUrlError, setRepoUrlError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [debouncedSlug] = useDebounce(slug, 500);
  const [debouncedRepoUrl] = useDebounce(repoUrl, 500);
  useEffect(() => {
    if (debouncedSlug.length > 0 && !slugError) {
      fetch(`/api/workspaces/${slug}/exists`).then(async (res) => {
        if (res.status === 200) {
          const exists = await res.json();
          setSlugError(exists === 1 ? "Slug is already in use." : null);
        }
      });
    }

    if (debouncedRepoUrl.length > 0 && !repoUrlError) {
      fetch(`/api/workspaces/repo/exists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl: debouncedRepoUrl,
        }),
      }).then(async (res) => {
        if (res.status === 200) {
          const exists = await res.json();
          setRepoUrlError(exists === 1 ? "Repo URL is already in use." : null);
        }
      });
    }
  }, [debouncedSlug, slugError, debouncedRepoUrl, repoUrlError]);

  useEffect(() => {
    setSlugError(null);
    setRepoUrlError(null);
    setData((prev) => ({
      ...prev,
      slug: slugify(name),
    }));
  }, [name]);

  const { isMobile } = useMediaQuery();

  return (
    <Modal
      showModal={showAddWorkspaceModal}
      setShowModal={setShowAddWorkspaceModal}
      className="bg-custom-black-100 border-accent-3"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-accent-3 px-4 py-4 pt-8 sm:px-16">
        <h2 className="text-2xl font-bold">Tesior</h2>
        <h3 className="text-lg font-medium">Create a new workspace</h3>
      </div>

      <form
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setSaving(true);
          fetch("/api/workspaces", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
            }),
          }).then(async (res) => {
            if (res.status === 200) {
              // can track workspace creation event here
              await mutate("/api/workspaces");
              await mutate(`/api/workspaces/${slug}`);
              router.push(`/${slug}`);
              toast.success("Successfully created workspace!");
              setShowAddWorkspaceModal(false);
            } else {
              const { error } = await res.json();
              const message = error?.message ?? error;

              if (message && message.toLowerCase().includes("slug")) {
                setSlugError(message);
              }

              toast.error(error?.message ?? error);
            }
            setSaving(false);
          });
        }}
        className="flex flex-col space-y-6 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="name" className="flex items-center space-x-2">
            <p className="block text-sm font-medium">Workspace Name</p>
            <InfoTooltip
              content={`This is the name of your workspace on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
            />
          </label>
          <div className="mt-2 flex rounded-md shadow-sm">
            <Input
              name="name"
              id="name"
              type="text"
              required
              autoFocus={!isMobile}
              autoComplete="off"
              className="block p-3 w-full rounded-md border-gray-300 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              placeholder="Acme, Inc."
              value={name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              aria-invalid="true"
            />
          </div>
        </div>

        <div>
          <label htmlFor="slug" className="flex items-center space-x-2">
            <p className="block text-sm font-medium">Workspace Slug</p>
            <InfoTooltip
              content={`This is your workspace's unique slug on ${process.env.NEXT_PUBLIC_APP_NAME}.`}
            />
          </label>
          <div className="relative mt-2 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-5 sm:text-sm">
              tesior
            </span>
            <Input
              name="slug"
              id="slug"
              type="text"
              required
              autoComplete="off"
              pattern="[a-zA-Z0-9\-]+"
              className={`${
                slugError
                  ? "border-red-300 p-3 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 p-3 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500"
              } block w-full rounded-r-md focus:outline-none sm:text-sm rounded-l-none`}
              placeholder="acme"
              value={slug}
              minLength={3}
              maxLength={48}
              onChange={(e) => {
                setSlugError(null);
                setData({ ...data, slug: e.target.value });
              }}
              aria-invalid="true"
            />
            {slugError && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircleFill
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          {slugError && (
            <p className="mt-2 text-sm text-red-600" id="slug-error">
              {slugError}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="repoUrl" className="flex items-center space-x-2">
            <p className="block text-sm font-medium">Github Repository</p>
            <InfoTooltip
              content={`This is the github repo you want to link to the workspace.`}
            />
          </label>
          <div className="mt-2 flex rounded-md shadow-sm">
            <Input
              name="repoUrl"
              id="repoUrl"
              type="text"
              autoFocus={!isMobile}
              autoComplete="off"
              className={`${
                repoUrlError
                  ? "border-red-300 p-3 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 p-3 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500"
              } block w-full rounded-r-md focus:outline-none sm:text-sm`}
              placeholder="https://github.com/username/repo.git"
              value={repoUrl}
              onChange={(e) => {
                setRepoUrlError(null);
                setData({ ...data, repoUrl: e.target.value });
              }}
              aria-invalid="true"
            />
          </div>
          {repoUrlError && (
            <p className="mt-2 text-sm text-red-600" id="repoUrl-error">
              {repoUrlError}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={saving || (slugError || repoUrlError ? true : false)}
        >
          {saving ? "Creating..." : "Create Workspace"}
        </Button>
      </form>
    </Modal>
  );
}

export function useAddWorkspaceModal() {
  const [showAddWorkspaceModal, setShowAddWorkspaceModal] = useState(false);

  const AddWorkspaceModal = useCallback(() => {
    return (
      <AddWorkspaceModalHelper
        showAddWorkspaceModal={showAddWorkspaceModal}
        setShowAddWorkspaceModal={setShowAddWorkspaceModal}
      />
    );
  }, [showAddWorkspaceModal, setShowAddWorkspaceModal]);

  return useMemo(
    () => ({ setShowAddWorkspaceModal, AddWorkspaceModal }),
    [setShowAddWorkspaceModal, AddWorkspaceModal]
  );
}
