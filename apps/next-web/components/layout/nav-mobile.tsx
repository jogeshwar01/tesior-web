"use client";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import UserDropdown from "./user-dropdown";
import { useSelectedLayoutSegment } from "next/navigation";
import useWorkspace from "@/lib/swr/useWorkspace";

export function NavMobile({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);
  const selectedLayout = useSelectedLayoutSegment();

  const { error } = useWorkspace();
  const pathname = usePathname();
  const { slug } = useParams() as { slug?: string };

  let navItems = [
    { name: "Tasks", href: `/${slug}/tasks` },
    { name: "Transfers", href: `/${slug}/transfers` },
    { name: "Settings", href: `/${slug}/settings` },
    { name: "Payments", href: `/payments` },
    { name: "Wallet", href: "/wallet" },
  ];

  if (
    error ||
    pathname === "/wallet" ||
    pathname === "/" ||
    pathname === "/payments"
  ) {
    // don't show tabs on home/wallet/error page
    navItems = [
      {
        name: "Wallet",
        href: "/wallet",
      },
      {
        name: "Payments",
        href: "/payments",
      },
    ];
  }

  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <div className={"sm:hidden"}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-3 top-3 z-40 rounded-full p-2 transition-colors duration-200 hover:bg-accent-4 focus:outline-none active:bg-accent-6 lg:hidden",
          open && "hover:bg-accent-4 active:bg-accent-6"
        )}
      >
        {open ? (
          <X className="h-5 w-5 text-accent-3" />
        ) : (
          <Menu className="h-5 w-5 text-accent-3" />
        )}
      </button>
      <nav
        className={cn(
          "fixed inset-0 z-20 hidden w-full bg-custom-black-100 px-5 py-16 sm:hidden",
          open && "block"
        )}
      >
        <ul className="grid divide-y divide-accent-3">
          <a
            href="https://github.com/jogeshwar01/tesior-web/blob/main/DOCS.md"
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-3 py-2 text-sm font-medium text-accent-6 transition-colors ease-out hover:text-white"
          >
            Docs
          </a>
          {session && (
            <>
              {navItems.map(({ name, href }) => (
                <li key={href} className="py-3">
                  <Link
                    href={`/${href}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium text-accent-6 transition-colors ease-out hover:text-white",
                      {
                        "text-white": selectedLayout === href,
                      }
                    )}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </>
          )}

          <div>
            <li className="px-1 py-4">
              {session ? (
                <UserDropdown session={session} />
              ) : (
                <Link
                  className="font-medium text rounded-full border border-white bg-white p-1 px-4 text-sm text-black transition-all hover:bg-black hover:text-white"
                  href="/login"
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
