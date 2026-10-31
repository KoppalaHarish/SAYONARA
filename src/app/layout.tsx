import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAYONARA | CSE Farewell Fest 2026 (Batch 2021-2027)",
  description:
    "The official CSE department farewell fest platform celebrating the 2021-2027 graduating batch (6-Year Integrated: 2 Years PUC + 4 Years B.Tech). Built by CSE, for CSE.",
  keywords: [
    "SAYONARA",
    "CSE Farewell Fest",
    "Batch 2021-2027",
    "6 Year Integrated BTech",
    "PUC and BTech",
    "Computer Science and Engineering",
    "College Fest",
    "Farewell 2026",
    "CSE",
  ],
  authors: [{ name: "CSE Tech Team" }],
  openGraph: {
    title: "SAYONARA | CSE Farewell Fest 2026 (Batch 2021-2027)",
    description: "A farewell experience built by CSE, for CSE. Exclusively for 3rd and 4th year B.Tech CSE students (6-Year Integrated PUC + B.Tech).",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#05070f] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
