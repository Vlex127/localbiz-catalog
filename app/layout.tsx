import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalBiz Catalog — AI Storefront Maker",
  description: "Snap a photo, get a digital catalog. AI-powered storefronts for local businesses.",
  openGraph: {
    title: "LocalBiz Catalog",
    description: "Turn your products into a digital catalog in seconds.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#E85D3A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
