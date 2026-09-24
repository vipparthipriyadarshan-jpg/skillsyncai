import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Skill Sync AI",
    default: "Skill Sync AI — Bridging Industry Demand and Workforce Skills",
  },
  description:
    "An evidence-based platform converting labor-market signals into actionable curriculum, trainer, and training capacity decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-sky-100 selection:text-sky-900">
        {children}
      </body>
    </html>
  );
}
