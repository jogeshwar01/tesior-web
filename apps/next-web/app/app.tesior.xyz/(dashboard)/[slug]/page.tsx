"use client";

import useWorkspace from "@/lib/swr/useWorkspace";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function WorkspaceHome() {
  const { slug } = useParams() as { slug?: string };
  const workspace = useWorkspace();

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0 mt-24">
        <h2
          className="animate-fade-up text-white text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          Welcome to <div>{workspace.name}</div>
        </h2>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <Link
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-accent-3 bg-black px-5 py-2 text-lg text-white shadow-md transition-colors hover:border-white"
            href={`${slug}/tasks`}
          >
            <p>Go to Workspace Tasks</p>
          </Link>
        </div>
      </div>
    </>
  );
}
