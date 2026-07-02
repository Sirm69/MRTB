import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper"; 
import NextTopLoader from 'nextjs-toploader'; // <-- The new loader package!

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

        {/* This wrapper handles the "Home Page Only" logic */}
        <HeaderWrapper />
        
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}