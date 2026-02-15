import { SessionTimeout } from "@/components/security/session-timeout";
import { Card } from "@/components/ui/card";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";
import "../globals.css";
import { Providers } from "../providers";

export const metadata = {
  title: "E-Voting System",
  description: "Secure Electronic Voting Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <div className="flex bg-linear-to-b from-indigo-50/50 to-purple-100/50 text-gray-800 items-center justify-center md:p-4">
              <Card className="w-full max-w-2xl bg-linear-to-b from-indigo-50 to-purple-100 border-none shadow-xl">
                {children}
              </Card>
            </div>
            <SessionTimeout />
          </Providers>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
