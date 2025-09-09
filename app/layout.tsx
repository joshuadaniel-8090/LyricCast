import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"; // 👈 import toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LyricCast",
  description: "Professional presentation software for worship services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster /> {/* 👈 mount toaster once here */}
      </body>
    </html>
  );
}
