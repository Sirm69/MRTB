"use client";

import React, { useState, createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ClipboardList, Settings, Navigation } from "lucide-react";
import NextTopLoader from 'nextjs-toploader';

// Create a context so the Page can control the Sidebar in the Layout
const MobileMenuContext = createContext({
  setIsMobileMenuOpen: (val: boolean) => {},
});

export const useMobileMenu = () => useContext(MobileMenuContext);

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export default function FieldTeamLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const SidebarItem = ({ icon, label, path }: SidebarItemProps) => {
    const active = pathname === path;
    return (
      <button
        onClick={() => {
          router.push(path);
          setIsMobileMenuOpen(false);
        }}
        className={`flex items-center w-full transition-all duration-300 rounded-xl ${
          isExpanded || isMobileMenuOpen ? "px-4 py-3.5 gap-4" : "justify-center p-3.5 gap-0"
        } ${
          active
            ? "bg-white/20 text-white shadow-sm"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        <div className="shrink-0">{icon}</div>
        {(isExpanded || isMobileMenuOpen) && (
          <span className="text-[15px] font-normal whitespace-nowrap overflow-hidden tracking-wide animate-in fade-in duration-300">
            {label}
          </span>
        )}
      </button>
    );
  };

  return (
    <MobileMenuContext.Provider value={{ setIsMobileMenuOpen }}>
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

      <div
        className="flex h-screen w-full overflow-hidden text-gray-800 bg-[#f1f4ee] relative"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* MOBILE OVERLAY */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`absolute md:relative inset-y-0 left-0 transform transition-all duration-300 ease-in-out bg-[#5D9C0E] h-full flex flex-col py-8 z-50 shrink-0 shadow-2xl md:shadow-none ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 ${
            isExpanded || isMobileMenuOpen ? "w-[260px]" : "w-[88px]"
          }`}
        >
          <div className="flex flex-col w-full px-4 gap-8">
            
            {/* Header (Hamburger + MENU) */}
            <button
              className={`text-white hover:opacity-80 transition-opacity flex items-center h-10 ${
                isExpanded || isMobileMenuOpen ? "px-2 w-full justify-start gap-4" : "justify-center w-full"
              }`}
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileMenuOpen(!isMobileMenuOpen);
                else setIsExpanded(!isExpanded);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              {(isExpanded || isMobileMenuOpen) && (
                <span className="font-normal text-[17px] tracking-wide uppercase">MENU</span>
              )}
            </button>

            {/* Nav Items for Field Team */}
            <div className="w-full flex flex-col gap-2">
              <SidebarItem label="Dashboard" path="/field-team/dashboard" icon={<LayoutDashboard size={22} />} />
              
              {/* Added a dedicated Inspections tab for future expansion */}
              <SidebarItem label="My Inspections" path="/field-team/inspections" icon={<ClipboardList size={22} />} />
              
              <div className={`border-t border-white/20 my-4 mx-auto transition-all duration-300 ${isExpanded || isMobileMenuOpen ? "w-full" : "w-10"}`}></div>
              
              <SidebarItem label="Profile Settings" path="/field-team/settings" icon={<Settings size={22} />} />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 pb-10 flex flex-col w-full min-w-0">
          
          {/* Top Mobile Bar */}
          <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm">
             <span className="font-semibold text-[#5D9C0E] flex items-center gap-2">
                <Navigation size={18} /> Field Operations
             </span>
             <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
             </button>
          </div>

          <div className="w-full flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </MobileMenuContext.Provider>
  );
}