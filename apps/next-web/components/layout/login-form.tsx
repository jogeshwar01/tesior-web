"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { LoadingDots, Github } from "@/components/shared/icons";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [signInClicked, setSignInClicked] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");

  return (
    <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
        <a href="https://github.com/jogeshwar01/tesior-web">
          <Image
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 rounded-full"
            width={20}
            height={20}
          />
        </a>
        <h3 className="font-display text-2xl font-bold">Sign in to Tesior</h3>
        <p className="text-sm text-gray-500">
          Get your bounties for contributing to open source projects.
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
        <button
          disabled={signInClicked}
          className={`${
            signInClicked
              ? "cursor-not-allowed border-gray-200 bg-gray-100"
              : "border border-gray-200 bg-white text-black hover:bg-gray-50"
          } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
          onClick={() => {
            setSignInClicked(true);
            // The callbackUrl specifies to which URL the user will be redirected after signing in.
            // Defaults to the page URL the sign-in is initiated from.
            signIn("github", {
              ...(next && next.length > 0 ? { callbackUrl: next } : {}),
            });
          }}
        >
          {signInClicked ? (
            <LoadingDots color="#808080" />
          ) : (
            <>
              <Github className="h-5 w-5" />
              <p>Sign in with Github</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
