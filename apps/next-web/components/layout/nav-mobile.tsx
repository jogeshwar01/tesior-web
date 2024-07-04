"use client";

import { cn } from "@/lib/utils";
import { APP_DOMAIN } from "@/lib/utils/constants";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import UserDropdown from "./user-dropdown";
import { useSelectedLayoutSegment } from 'next/navigation'

type NavTheme = "light" | "dark";

const navItems = [
  {
    name: "Tasks",
    slug: "tasks",
  },
  {
    name: "Payments",
    slug: "payments",
  },
  {
    name: "Transfers",
    slug: "transfers",
  },
  {
    name: "Wallet",
    slug: "wallet",
  },
];

export function NavMobile({
  theme = "light",
  session,
}: {
  theme?: NavTheme;
  session: Session | null;
}) {
  const { domain = APP_DOMAIN } = useParams() as { domain: string };
  const [open, setOpen] = useState(false);
  const selectedLayout = useSelectedLayoutSegment();

  const createHref = (href: string) =>
    domain === APP_DOMAIN ? href : `${APP_DOMAIN}${href}`;

  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <div className={cn(theme === "dark" && "dark", "sm:hidden")}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-3 top-3 z-40 rounded-full p-2 transition-colors duration-200 hover:bg-gray-200 focus:outline-none active:bg-gray-300 dark:hover:bg-white/20 dark:active:bg-white/30 lg:hidden",
          open && "hover:bg-gray-100 active:bg-gray-200"
        )}
      >
        {open ? (
          <X className="h-5 w-5 text-gray-600 dark:text-black/70" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600 dark:text-black/70" />
        )}
      </button>
      <nav
        className={cn(
          "fixed inset-0 z-20 hidden w-full bg-white px-5 py-16 dark:bg-white dark:text-white/70 sm:hidden",
          open && "block"
        )}
      >
        <ul className="grid divide-y divide-gray-200 dark:divide-black/[0.15]">
          {navItems.map(({ name, slug }) => (
            <li key={slug} className="py-3 text-gray-500">
              <Link
                href={createHref(`/${slug}`)}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black dark:text-black/50 dark:hover:text-black",
                  {
                    "text-black dark:text-black":
                      selectedLayout === slug,
                  }
                )}
              >
                {name}
              </Link>
            </li>
          ))}

          <div>
            <li className="px-3 py-2">
              {session ? (
                <UserDropdown session={session} />
              ) : (
                <Link
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  href={`${APP_DOMAIN}/login`}
                >
                  Sign In
                </Link>
              )}
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
}
