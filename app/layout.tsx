"use client";

import "./globals.css";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import ChatWidget from "@/components/ui/ChatWidget";

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
        <ChatWidget />
      </body>
    </html>
  );
}
