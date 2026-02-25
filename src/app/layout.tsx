import "./globals.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCachedSiteContent } from "@/lib/siteContent";
import BottomLinks from "@/components/BottomLinks";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: "Dr. Nilam Panchal | Academic Portfolio",
    template: "%s | Dr. Nilam Panchal",
  },
  description:
    "Official academic portfolio of Prof. (Dr.) Nilam Panchal featuring publications, teaching, achievements, lectures, and professional updates.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getCachedSiteContent();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased flex flex-col">
        <Header displayName={content.sidebarName} />
        <main className="pt-20 flex-1">{children}</main>
        <BottomLinks />
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
