import type { ReactNode } from "react";

export const metadata = {
  title: "premier.gg",
  description: "VALORANT Premier match analysis — Phase 0 mock demo",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 24, lineHeight: 1.5 }}>
        {children}
      </body>
    </html>
  );
}
