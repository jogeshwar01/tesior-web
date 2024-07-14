"use client";

import { APP_DOMAIN } from "@/lib/utils/constants";
import Link from "next/link";
import { Suspense } from "react";
import { MaxWidthWrapper } from "../shared";
import { Session } from "next-auth";
import UserDropdown from "./user-dropdown";
import { Divider } from "@/components/shared/icons";
import WorkspaceSwitcher from "./workspace-switcher";
import NavTabs from "./nav-tabs";
import { NavMobile } from "./nav-mobile";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";

export function Nav({ session }: { session: Session | null }) {
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <div className="w-full bg-gray-50">
      <div className="sticky left-0 right-0 top-0 z-20 border-b border-gray-200 bg-white">
        <MaxWidthWrapper>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="hidden sm:block">
                Tesior
              </Link>
              <Divider className="hidden h-8 w-8 text-gray-200 sm:ml-3 sm:block" />
              <WorkspaceSwitcher />
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/payments"
                className={cn(
                  "hidden text-sm text-gray-500 transition-colors hover:text-gray-700 sm:block",
                  {
                    "text-black dark:text-black": selectedLayout === "payments",
                  }
                )}
              >
                Payments
              </Link>
              <Link
                href="/wallet"
                className={cn(
                  "hidden text-sm text-gray-500 transition-colors hover:text-gray-700 sm:block",
                  {
                    "text-black dark:text-black": selectedLayout === "wallet",
                  }
                )}
              >
                Wallet
              </Link>
              <div className="hidden sm:block">
                <div>
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
                </div>
              </div>
            </div>
          </div>
          <Suspense fallback={<div className="h-12 w-full" />}>
            <NavTabs />
            <NavMobile session={session} />
          </Suspense>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}
