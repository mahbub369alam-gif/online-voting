import { SessionTimeout } from "@/components/security/session-timeout";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";
import "../globals.css";
import { Providers } from "../providers";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "E-Voting System",
  description: "Secure Electronic Voting Platform",
  generator: "v0.app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            {children}
            <SessionTimeout />
            <Toaster />
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
