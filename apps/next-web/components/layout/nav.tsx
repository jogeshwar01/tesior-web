"use client";

import Image from "next/image";
import { APP_DOMAIN, cn } from "@/lib/utils";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { createContext } from "react";
import { useScroll } from "@/lib/hooks";
import { MaxWidthWrapper } from "../shared/max-width-wrapper";
import { useSignInModal } from "./sign-in-modal";
import { Session } from "next-auth";
import UserDropdown from "./user-dropdown";

export type NavTheme = "light" | "dark";

export const NavContext = createContext<{ theme: NavTheme }>({
  theme: "light",
});

export const navItems = [
  {
    name: "Create Task",
    slug: "create",
  },
  {
    name: "Payments",
    slug: "payment",
  },
  {
    name: "Wallet",
    slug: "wallet",
  },
];

export function Nav({
  theme = "light",
  session,
}: {
  theme?: NavTheme;
  session: Session | null;
}) {
  const { SignInModal, setShowSignInModal } = useSignInModal();

  const { domain = APP_DOMAIN } = useParams() as {
    domain: string;
  };
  const createHref = (href: string) =>
    domain === APP_DOMAIN ? href : `${APP_DOMAIN}${href}`;

  const scrolled = useScroll(80);
  const selectedLayout = useSelectedLayoutSegment();

  return (
    <NavContext.Provider value={{ theme }}>
      <div
        className={cn(
          `sticky inset-x-0 top-0 z-30 w-full transition-all`,
          theme === "dark" && "dark"
        )}
      >
        <div
          className={cn(
            "-z-1 absolute inset-0 border-transparent transition-all",
            {
              "border-b border-black/10 bg-white/75 backdrop-blur-lg dark:border-black/10 dark:bg-white/75":
                scrolled,
            }
          )}
        />
        <MaxWidthWrapper className="relative">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center space-x-12">
              <Link
                href="/"
                className="flex items-center font-display text-2xl"
              >
                <Image
                  src="/logo.png"
                  alt="Tesior logo"
                  width="30"
                  height="30"
                  className="mr-2 rounded-sm"
                ></Image>
                <p>Tesior</p>
              </Link>
              <NavigationMenuPrimitive.Root
                delayDuration={0}
                className="relative hidden lg:block"
              >
                <NavigationMenuPrimitive.List className="flex flex-row space-x-2 p-4">
                  {navItems.map(({ name, slug }) => (
                    <NavigationMenuPrimitive.Item key={slug} asChild>
                      <Link
                        id={`nav-${slug}`}
                        key={slug}
                        href={createHref(`/${slug}`)}
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
                    </NavigationMenuPrimitive.Item>
                  ))}
                </NavigationMenuPrimitive.List>

                <NavigationMenuPrimitive.Viewport className="data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content absolute left-0 top-full flex w-[var(--radix-navigation-menu-viewport-width)] origin-[top_center] justify-start rounded-lg border border-gray-200 bg-white shadow-lg dark:border-white/[0.15] dark:bg-black" />
              </NavigationMenuPrimitive.Root>
            </div>

            <div className="hidden lg:block">
              <SignInModal />
              <div>
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
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </NavContext.Provider>
  );
}