import type { Metadata } from "next";
import SweetsBuilder from "@/components/sweets/SweetsBuilder";

export const metadata: Metadata = {
  title: "SweetBox — Build a Digital Gift Box",
  description: "Build a digital gift box of sweets, flowers & love. Pick your favorites, add a note, and share with someone special.",
  openGraph: {
    title: "SweetBox — Build a Digital Gift Box",
    description: "Build a digital gift box of sweets, flowers & love",
    type: "website",
  },
};

export default function SweetsPage() {
  return <SweetsBuilder />;
}
