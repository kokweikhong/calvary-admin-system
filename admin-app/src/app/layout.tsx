import SidebarLayout from "@/components/SidebarLayout";
import { QueryProvider } from "@/context/QueryContext";
import { inter } from "@/lib/fonts";
import { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Admin Dashboard | Calvary Carpentry",
  description: "Admin Dashboard for Calvary Carpentry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" className={`h-full bg-white ${inter.variable}`}>
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
          <link rel="manifest" href="/favicons/site.webmanifest" />
        </Head>
        <AuthProvider>
          <QueryProvider>
            <body className="h-full font-inter">
              <SidebarLayout>{children}</SidebarLayout>
            </body>
          </QueryProvider>
        </AuthProvider>
      </html>
    </>
  );
}
