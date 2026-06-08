import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata = {
  title: "premier.gg — VALORANT Premier match review",
  description: "Review your VALORANT Premier matches: your team, your opponents, your positions. Mock demo — not endorsed by Riot Games.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen bg-bg text-fg font-sans antialiased">{children}</body>
    </html>
  );
}
