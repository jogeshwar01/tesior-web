import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";

export const metadata = {
  title: "Tesior - Open Source Web3 Bounties",
  description:
    "Tesior is an open souce web3 bounty app that allows maintainers to reward contributors via crypto.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
        <Suspense fallback="...">
          <Navbar />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center pb-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
