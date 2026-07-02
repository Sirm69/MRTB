"use client";

import React, { useState, createContext, useContext } from "react";
import NextTopLoader from 'nextjs-toploader'; // <-- Imported the loader!

// Create a context so the Page can control the Sidebar in the Layout
const MobileMenuContext = createContext({
  setIsMobileMenuOpen: (val: boolean) => {},
});

export const useMobileMenu = () => useContext(MobileMenuContext);

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const SidebarItem = ({ icon, label, active = false }: SidebarItemProps) => (
    <button
      className={`flex items-center gap-4 w-full transition-all duration-300 rounded-lg ${
        isExpanded || isMobileMenuOpen ? "px-4 py-3" : "justify-center p-2"
      } ${
        active
          ? "bg-white/20 text-white"
          : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
    >
      <div className="shrink-0">{icon}</div>
      {(isExpanded || isMobileMenuOpen) && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden animate-in fade-in duration-500">
          {label}
        </span>
      )}
    </button>
  );

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
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`absolute md:relative inset-y-0 left-0 transform transition-all duration-300 ease-in-out bg-[#5D9C0E] h-full flex flex-col justify-between py-8 z-50 shrink-0 shadow-xl md:shadow-none ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 ${
            isExpanded || isMobileMenuOpen ? "w-64 items-start" : "w-20 items-center"
          }`}
        >
          <div className="flex flex-col items-center w-full gap-10">
            <button
              className={`text-white/80 hover:text-white transition flex items-center h-10 ${
                isExpanded || isMobileMenuOpen ? "px-6 w-full justify-start" : "justify-center"
              }`}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                } else {
                  setIsExpanded(!isExpanded);
                }
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              {(isExpanded || isMobileMenuOpen) && (
                <span className="ml-4 font-bold tracking-tight">MENU</span>
              )}
            </button>

            <div className="w-full flex flex-col gap-4 px-2">
              <SidebarItem active label="Dashboard" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" ry="1"></rect><rect x="14" y="3" width="7" height="7" rx="1" ry="1"></rect><rect x="14" y="14" width="7" height="7" rx="1" ry="1"></rect><rect x="3" y="14" width="7" height="7" rx="1" ry="1"></rect></svg>} />
              <SidebarItem label="Applications" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M9 14h6" /><path d="M9 10h6" /></svg>} />
              <SidebarItem label="Schedule" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} />
              <SidebarItem label="Analytics" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="8" y1="17" x2="8" y2="12" /><line x1="12" y1="17" x2="12" y2="8" /><line x1="16" y1="17" x2="16" y2="14" /></svg>} />
              <div className={`border-t border-white/20 my-2 mx-auto ${isExpanded || isMobileMenuOpen ? "w-full" : "w-10"}`}></div>
              <SidebarItem label="Profile Settings" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><circle cx="19" cy="11" r="2" /><path d="M19 8v1" /><path d="M19 13v1" /><path d="M21.6 9.5l-.87.5" /><path d="M17.27 12l-.87.5" /><path d="M21.6 12.5l-.87-.5" /><path d="M17.27 10l-.87-.5" /></svg>} />
            </div>
          </div>

          <div className={`w-full px-2 flex ${isExpanded || isMobileMenuOpen ? "justify-start" : "justify-center"}`}>
            <button className={`bg-[#7AB32E] hover:bg-[#6e9e2a] transition rounded-full text-white/90 shadow-sm flex items-center gap-4 ${isExpanded || isMobileMenuOpen ? "px-6 py-3 w-full" : "p-3"}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <circle cx="8" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="16" cy="12" r="1" fill="currentColor" />
              </svg>
              {(isExpanded || isMobileMenuOpen) && <span className="text-sm font-semibold">Messages</span>}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 h-full overflow-y-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-6 md:pt-8 pb-10 flex flex-col w-full">
          <div className="w-full flex flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </MobileMenuContext.Provider>
  );
}