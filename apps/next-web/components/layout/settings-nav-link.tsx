"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

export default function NavLink({
  segment,
  children,
}: {
  segment: string | null;
  children: ReactNode;
}) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const { slug } = useParams() as {
    slug?: string;
  };

  const href = `${slug ? `/${slug}` : ""}/settings${
    segment ? `/${segment}` : ""
  }`;

  const isSelected = selectedLayoutSegment === segment;

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        "flex items-center gap-2.5 whitespace-nowrap rounded-lg p-2 text-sm text-white outline-none transition-all duration-75",
        "ring-black/50 focus-visible:ring-2",
        isSelected
          ? "bg-accent-2"
          : "hover:bg-accent-2 active:bg-accent-3",
      )}
    >
      {children}
    </Link>
  );
}
