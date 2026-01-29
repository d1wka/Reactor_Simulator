import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuclear Reactor Simulator — VVER-1200",
  description: "Interactive educational nuclear reactor process simulator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
