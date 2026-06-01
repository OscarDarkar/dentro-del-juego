import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dentro del Juego | Liga Misionera del Sur",
  description:
    "Tabla de posiciones, resultados y fixture de la Liga Misionera del Sur. Serie A, Serie B y Serie C.",
  keywords: [
    "liga misionera del sur",
    "fútbol misiones",
    "tabla de posiciones",
    "resultados fútbol paraguay",
  ],
  openGraph: {
    title: "Dentro del Juego | Liga Misionera del Sur",
    description:
      "Tabla de posiciones, resultados y fixture de la Liga Misionera del Sur.",
    url: "https://dentro-del-juego-one.vercel.app",
    siteName: "Dentro del Juego",
    locale: "es_PY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-600 text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
