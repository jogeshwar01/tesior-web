import "@/app/globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import Providers from "@/app/providers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100 -z-10" />
      <Suspense fallback="...">
        <Navbar />
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center pb-16">
        {children}
      </main>
      <Footer />
    </Providers>
  );
}
