import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Electrolize,
  Playfair,
  Courier_Prime,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Roboto,
} from "next/font/google";
import "./globals.css";
import { AppProviders } from "./context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const electrolize = Electrolize({
  variable: "--font-electrolize",
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const playfair = Playfair({
  variable: "--font-playfair",
  weight: "400",
  style: "normal",
  display: "swap",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: "normal",
});

export const metadata: Metadata = {
  title: "Business Simulation Platform",
  description:
    "Experience real-world business scenarios in a risk-free environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#121d3a]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${electrolize.variable} ${playfair.variable} ${courierPrime.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable} ${roboto.variable} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
