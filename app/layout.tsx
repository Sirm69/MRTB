import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper"; 
import NextTopLoader from 'nextjs-toploader'; // <-- The new loader package!
// Triggering Next.js dev rebuild for CSS refresh.
import GlobalAlertProvider from "./components/GlobalAlertProvider";
import VerifyModal from "@/app/components/VerifyModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MRTB Nigeria | Medical Rehabilitation Therapists Board",
  description: "Official portal for registration and regulation of rehabilitation therapists in Nigeria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Fixed the smooth scroll warning and added hydration suppression
    <html lang="en" className="scroll-smooth" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@500;700;800;900&family=Cinzel+Decorative:wght@700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Great+Vibes&family=Italianno&family=MonteCarlo&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=UnifrakturMaguntia&display=swap" 
          rel="stylesheet" 
        />
      </head>
      {/* Added suppressHydrationWarning to body to block Chrome extension errors */}
      <body className={`${inter.className} bg-slate-50 text-slate-900`} suppressHydrationWarning>
        
        {/* The sleek, thin Top Loader in your brand green */}
        <NextTopLoader 
          color="#5D9C0E" 
          initialPosition={0.08} 
          crawlSpeed={200} 
          height={3} 
          crawl={true} 
          showSpinner={false} 
          easing="ease" 
          speed={200} 
          shadow="0 0 10px #5D9C0E,0 0 5px #5D9C0E" 
        />

        {/* Global Verification Modal Popup */}
        <VerifyModal />

        {/* This wrapper handles the "Home Page Only" logic */}
        <HeaderWrapper />
        
        <GlobalAlertProvider>
          <main>
            {children}
          </main>
        </GlobalAlertProvider>
      </body>
    </html>
  );
}