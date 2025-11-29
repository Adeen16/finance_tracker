import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GigLens - Financial Support for Gig Workers",
  description: "Smart financial health scoring and forecasting for the gig economy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Simple check for dashboard routes to apply layout
  // In a real app, use a proper layout.tsx in (dashboard) group
  // For this prototype, we'll just check if we are not on the landing page
  // But since this is server component, we can't check pathname easily here without client component wrapper
  // So we will use a Route Group strategy instead.
  // But for now, let's just wrap everything and hide sidebar on landing page via CSS or client wrapper?
  // Better: Create a (dashboard) route group.

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
