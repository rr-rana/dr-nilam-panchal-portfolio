import "./globals.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCachedSiteContent } from "@/lib/siteContent";
import BottomLinks from "@/components/BottomLinks";

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
      </body>
    </html>
  );
}
