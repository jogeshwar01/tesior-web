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
      <div className="min-h-screen w-full bg-custom-black-200">
        <div className="sticky -top-16 z-20 border-b border-accent-3 bg-custom-black-100">
          <Suspense fallback="...">
            <Navbar />
          </Suspense>
        </div>
        <main className="flex min-h-screen w-full flex-col items-center pb-16">
          {children}
        </main>
      </div>
      <Footer />
    </Providers>
  );
}
