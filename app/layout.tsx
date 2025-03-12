// app/layout.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Toaster } from "@/components/ui/toaster";
import CulqiScript from "@/components/CulqiScript";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import LoadingAnimation from "@/components/LoadingAnimation";
import Script from "next/script";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

export const metadata: Metadata = {
  title: "TopSeven Tienda Online",
  description: "Plataforma de venta de gafas de sol de alta calidad.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Metatags adicionales si se requieren */}
      </head>
      <body className={`${jost.variable} antialiased`}>
        {/* Google Analytics script using next/script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9G4V0FEFXE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9G4V0FEFXE');
          `}
        </Script>
        
        <ThemeWrapper>
          {/* Suspense sigue envolviendo el contenido en caso de componentes con Suspense */}
          <Suspense fallback={<LoadingAnimation />}>
            <PageTransitionWrapper>{children}</PageTransitionWrapper>
          </Suspense>
          <Toaster />
          <CulqiScript />
        </ThemeWrapper>
      </body>
    </html>
  );
}