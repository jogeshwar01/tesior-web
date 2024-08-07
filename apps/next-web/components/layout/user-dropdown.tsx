"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Popover } from "@/components/shared";
import Image from "next/image";
import { Session } from "next-auth";

export default function UserDropdown({ session }: { session: Session }) {
  const { email, image } = session?.user || {};
  const [openPopover, setOpenPopover] = useState(false);

  if (!email) return null;

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-custom-black-100 p-2 sm:w-56 border-accent-3">
            <div className="p-2 border-b border-accent-3">
              {session?.user?.name && (
                <p className="truncate text-sm font-medium text-custom-white-100">
                  {session?.user?.name}
                </p>
              )}
              <p className="truncate text-sm text-accent-6">
                {session?.user?.email}
              </p>
            </div>
            <button
              className="relative flex w-full items-center justify-start text-accent-6 hover:text-custom-white-200 space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm ">Logout</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-accent-3 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          <Image
            alt={email}
            src={image || `https://avatars.dicebear.com/api/micah/${email}.svg`}
            width={40}
            height={40}
          />
        </button>
      </Popover>
    </div>
  );
}
