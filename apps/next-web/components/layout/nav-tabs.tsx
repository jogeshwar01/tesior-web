"use client";

import useWorkspace from "@/lib/swr/useWorkspace";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function NavTabs() {
  const pathname = usePathname();
  const { error } = useWorkspace();
  const { slug } = useParams() as { slug?: string };

  const tabs = [
    { name: "Tasks", href: `/${slug}/tasks` },
    { name: "Transfers", href: `/${slug}/transfers` },
  ];

  // don't show tabs on home/wallet/error page
  if (error || pathname === "/wallet" || pathname === "/" || pathname === "/payments") return null;

  return (
    <div className="hidden sm:flex scrollbar-hide mb-[-3px] h-12 items-center justify-start space-x-2 overflow-x-auto">
      {tabs.map(({ name, href }) => (
        <Link key={href} href={href} className="relative">
          <div className="m-1 rounded-md px-3 py-2 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
            <p className="text-sm text-gray-600 hover:text-black">{name}</p>
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
              <div className="h-0.5 bg-black" />
            </motion.div>
          )}
        </Link>
      ))}
    </div>
  );
}
