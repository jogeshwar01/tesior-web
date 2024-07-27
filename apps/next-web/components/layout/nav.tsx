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
import { useScroll } from "@/lib/hooks";

export function Nav({ session }: { session: Session | null }) {
  const selectedLayout = useSelectedLayoutSegment();
  const scrolled = useScroll(80);

  return (
    <MaxWidthWrapper>
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className={cn(
              "hidden transition-all sm:block font-medium text-white",
              scrolled && "translate-y-[3.3rem]"
            )}
          >
            Tesior
          </Link>
          <Divider className="hidden h-8 w-8 text-accent-3 sm:ml-3 sm:block" />
          <WorkspaceSwitcher />
        </div>
        <div className="flex items-center space-x-6">
          <Link
            href="/payments"
            className={cn(
              "font-medium hidden text-sm text-accent-6 transition-colors hover:text-custom-white-200 sm:block",
              {
                "text-custom-white-200": selectedLayout === "payments",
              }
            )}
          >
            Payments
          </Link>
          <Link
            href="/wallet"
            className={cn(
              "font-medium hidden text-sm text-accent-6 transition-colors hover:text-custom-white-200 sm:block",
              {
                "text-custom-white-200": selectedLayout === "wallet",
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
                  className="font-medium text rounded-full border border-white bg-white p-1 px-4 text-sm text-black transition-all hover:bg-black hover:text-white"
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
  );
}
