"use client";

import "./globals.css";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black overflow-x-hidden">
        <SmoothCursor />
        {children}
      </body>
    </html>
  );
}
