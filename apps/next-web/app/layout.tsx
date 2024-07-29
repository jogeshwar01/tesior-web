import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/new-york/tooltip";

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
        <TooltipProvider>
          <Toaster closeButton className="pointer-events-auto" />
          {children}
          <VercelAnalytics />
          <SpeedInsights />
        </TooltipProvider>
      </body>
    </html>
  );
}
