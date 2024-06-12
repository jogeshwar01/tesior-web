"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { APP_DOMAIN } from "@/lib/utils/constants";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegment,
} from "next/navigation";
import { createContext } from "react";
import { useScroll } from "@/lib/hooks";
import { MaxWidthWrapper } from "../shared";
import { Session } from "next-auth";
import UserDropdown from "./user-dropdown";
import { motion } from "framer-motion";
import useBalance from "@/lib/swr/useBalance";
import { usePublicKey } from "@/lib/hooks/use-public-key";

export type NavTheme = "light" | "dark";

export const NavContext = createContext<{ theme: NavTheme }>({
  theme: "light",
});

export const navItems = [
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

export function Nav({
  theme = "light",
  session,
}: {
  theme?: NavTheme;
  session: Session | null;
}) {
  const pathname = usePathname();
  const { balance } = useBalance();

  const { domain = APP_DOMAIN } = useParams() as {
    domain: string;
  };
  const createHref = (href: string) =>
    domain === APP_DOMAIN ? href : `${APP_DOMAIN}${href}`;

  const scrolled = useScroll(80);
  const selectedLayout = useSelectedLayoutSegment();

  const { WalletMultiButtonDynamic } = usePublicKey();

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
                  {navItems.map(({ name, slug }) => {
                    const href = createHref(`/${slug}`);

                    return (
                      <NavigationMenuPrimitive.Item key={slug} asChild>
                        <Link
                          id={`nav-${slug}`}
                          key={slug}
                          href={href}
                          className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black dark:text-black/50 dark:hover:text-black",
                            {
                              "text-black dark:text-black":
                                selectedLayout === slug,
                            }
                          )}
                        >
                          <div className="m-1 rounded-md px-3 py-3 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200">
                            <p className="text-sm font-normal text-gray-700 hover:text-black">
                              {name}
                            </p>
                          </div>
                          {(pathname === href ||
                            (href.endsWith("/settings") &&
                              pathname?.startsWith(href))) && (
                            <motion.div
                              layoutId="indicator"
                              transition={{
                                duration: 0.25,
                              }}
                              className="bottom-0 w-full pl-2 pr-1"
                            >
                              <div className="h-0.5 bg-black" />
                            </motion.div>
                          )}
                        </Link>
                      </NavigationMenuPrimitive.Item>
                    );
                  })}
                </NavigationMenuPrimitive.List>

                <NavigationMenuPrimitive.Viewport className="data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content absolute left-0 top-full flex w-[var(--radix-navigation-menu-viewport-width)] origin-[top_center] justify-start rounded-lg border border-gray-200 bg-white shadow-lg dark:border-white/[0.15] dark:bg-black" />
              </NavigationMenuPrimitive.Root>
              <Link className="flex flex-row z-10" href={`/wallet`}>
                <Image src={"/solana.png"} alt={""} width={25} height={20} />
                <div className="ml-2">{balance?.pending_amount}</div>
              </Link>
            </div>

            {session && (
              <div className="absolute right-16 lg:block lg:right-40">
                <WalletMultiButtonDynamic />
              </div>
            )}

            <div className="hidden lg:block">
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
        </MaxWidthWrapper>
      </div>
    </NavContext.Provider>
  );
}
