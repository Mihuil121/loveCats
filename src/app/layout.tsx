import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import icon from './2938229.png'

const geistSans:NextFontWithVariable = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono:NextFontWithVariable = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Кошачий пинтерест",
  description: "сайт с кошками)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href={icon.src} type="image/x-icon"/>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
