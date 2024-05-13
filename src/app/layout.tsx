import Navbar from "@/components/server/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { EdgeStoreProvider } from "@/lib/edgeStore";

const montserrat = Montserrat({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Homework",
  description: "Manage student assignments with homework app.",
  themeColor: "#007991",
};
import NextTopLoader from "nextjs-toploader";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <meta
        name="google-site-verification"
        content="bRqRTz-O0zDpWLJIvjjckmVbgxMItCfiJNUICNe-GT0"
      />

      <body className={montserrat.className}>
        <NextTopLoader color="#007991" showSpinner={false}/>
        <Navbar />
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
      </body>
    </html>
  );
}
