"use client"

import { Github, Twitter } from "@/components/shared/icons";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function WorkspaceHome() {
  const { slug } = useParams() as { slug?: string };

  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <h2
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          Get started by creating tasks
        </h2>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <Link
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-lg text-gray-600 shadow-md transition-colors hover:border-gray-800"
            href={`${slug}/tasks`}
          >
            <p>
              Let's Begin
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
