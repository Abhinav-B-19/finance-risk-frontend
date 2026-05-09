import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/layout/navbar";

import Footer from "@/components/layout/footer";

import { Toaster } from "sonner";

export const metadata: Metadata =
  {
    title:
      "FinanceRisk AI",

    description:
      "AI-powered financial risk prediction platform.",
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </div>

        <Toaster
          position="top-right"
          offset="80px"
          richColors
        />
      </body>
    </html>
  );
}