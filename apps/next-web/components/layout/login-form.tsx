"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { LoadingDots, Github } from "@/components/shared/icons";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [signInClicked, setSignInClicked] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams?.get("next");

  return (
    <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-md md:border md:border-accent-3">
      <div className="flex flex-col items-center justify-center space-y-3 border-accent-3 bg-custom-black-100 px-4 pt-8 text-center md:px-16">
        <h3 className="font-display text-2xl font-bold text-custom-white-100">
          Sign in to Tesior
        </h3>
        <p className="text-sm text-custom-white-50 w-[80%]">
          Manage open source bounties and get paid for your contributions.
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-custom-black-100 px-4 py-8 md:px-16">
        <button
          disabled={signInClicked}
          className={`${
            signInClicked
              ? "cursor-not-allowed border-accent-3 bg-custom-black-100"
              : "border border-accent-3 bg-custom-black-100 text-black hover:bg-black"
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
              <Github className="h-5 w-5 text-custom-white-100" />
              <p className="text-custom-white-100">Sign in with Github</p>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
