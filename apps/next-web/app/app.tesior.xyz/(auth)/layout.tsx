import { ReactNode } from "react";
import Providers from "@/app/providers";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="fixed h-screen w-full bg-custom-black-200 -z-10" />
      <main className="flex min-h-screen w-full flex-col items-center justify-center">
        {children}
      </main>
    </Providers>
  );
}
