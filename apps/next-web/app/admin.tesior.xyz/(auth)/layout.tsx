import { ReactNode } from "react";
import Providers from "@/app/providers";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 -z-10" />
      <main className="flex min-h-screen w-full flex-col items-center justify-center pb-16">
        {children}
      </main>
    </Providers>
  );
}
