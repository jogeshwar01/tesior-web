"use client";

import { APP_DOMAIN, cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, type NavTheme } from "./nav";
import { useSignInModal } from "./sign-in-modal";
import { Session } from "next-auth";
import UserDropdown from "./user-dropdown";

export function NavMobile({
  theme = "light",
  session,
}: {
  theme?: NavTheme;
  session: Session | null;
}) {
  const { SignInModal, setShowSignInModal } = useSignInModal();

  const { domain = APP_DOMAIN } = useParams() as { domain: string };
  const [open, setOpen] = useState(false);

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
    <div className={cn(theme === "dark" && "dark")}>
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
          "fixed inset-0 z-20 hidden w-full bg-white px-5 py-16 dark:bg-white dark:text-white/70 lg:hidden",
          open && "block"
        )}
      >
        <ul className="grid divide-y divide-gray-200 dark:divide-black/[0.15]">
          {navItems.map(({ name, slug }) => (
            <li key={slug} className="py-3 text-gray-500">
              <Link
                href={createHref(`/${slug}`)}
                onClick={() => setOpen(false)}
                className="flex w-full font-semibold capitalize"
              >
                {name}
              </Link>
            </li>
          ))}

          <SignInModal />
          <div>
            <li className="py-3">
              {session ? (
                <UserDropdown session={session} />
              ) : (
                <button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  onClick={() => setShowSignInModal(true)}
                >
                  Sign In
                </button>
              )}
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
}
