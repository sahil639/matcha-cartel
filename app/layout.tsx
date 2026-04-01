import type { Metadata } from "next";
import "./globals.css";
import LockScreen from "@/components/LockScreen";
import GlobalNavDots from "@/components/GlobalNavDots";

export const metadata: Metadata = {
  title: "Matcha Cartel",
  description: "The world's most desired green powder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <LockScreen />
        <GlobalNavDots />
        {children}
      </body>
    </html>
  );
}
