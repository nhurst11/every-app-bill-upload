import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import AuthSessionProvider from "@/components/session-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "NJ Bill Analyzer — Commercial Energy Bill Upload",
  description:
    "Upload and analyze your New Jersey commercial energy bills. Track spending, monitor kWh usage, and find savings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
