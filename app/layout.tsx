import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sweet — Digital Gifts",
  description: "Create and share digital gift boxes of sweets, flowers & love",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
