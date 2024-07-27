"use client";

import { useScroll } from "@/lib/hooks";
import useWorkspace from "@/lib/swr/useWorkspace";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function NavTabs() {
  const pathname = usePathname();
  const { error } = useWorkspace();
  const { slug } = useParams() as { slug?: string };
  const scrolled = useScroll(80);

  const tabs = [
    { name: "Tasks", href: `/${slug}/tasks` },
    { name: "Transfers", href: `/${slug}/transfers` },
    { name: "Settings", href: `/${slug}/settings` },
  ];

  // don't show tabs on home/wallet/error page
  if (
    error ||
    pathname === "/wallet" ||
    pathname === "/" ||
    pathname === "/payments"
  )
    return null;

  return (
    <div
      className={cn(
        "scrollbar-hide relative flex gap-x-2 overflow-x-auto transition-all",
        scrolled && "sm:translate-x-16"
      )}
    >
      {tabs.map(({ name, href }) => (
        <Link key={href} href={href} className="relative">
          <div className="m-1 rounded-md px-3 py-2 transition-all duration-75 text-accent-6 hover:bg-accent-2 active:bg-accent-2 hover:text-white active:text-white">
            <p
              className={cn(
                "text-sm font-medium",
                pathname == href && "text-white"
              )}
            >
              {name}
            </p>
          </div>
          {(pathname === href ||
            (href.endsWith("/settings") && pathname?.startsWith(href))) && (
            <motion.div
              layoutId="indicator"
              transition={{
                duration: 0.25,
              }}
              className="absolute bottom-0 w-full px-1.5"
            >
              <div className="h-0.5 bg-white" />
            </motion.div>
          )}
        </Link>
      ))}
    </div>
  );
}
