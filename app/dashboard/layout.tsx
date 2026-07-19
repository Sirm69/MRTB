"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import NextTopLoader from 'nextjs-toploader';
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ClipboardList, 
  CreditCard, 
  CalendarDays, 
  FolderHeart, 
  MessageSquare, 
  UserCog, 
  LogOut 
} from "lucide-react";

// Create Mobile Menu Context
const MobileMenuContext = createContext({
  setIsMobileMenuOpen: (val: boolean) => {},
});

export const useMobileMenu = () => useContext(MobileMenuContext);

// Create User Context
interface UserContextType {
  userData: any;
  isLoadingProfile: boolean;
  refreshProfile: () => Promise<void>;
  paidRegistration: boolean;
  paidLogistics: boolean;
  setPaidRegistration: (val: boolean) => void;
  setPaidLogistics: (val: boolean) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Profile data & payment states
  const [userData, setUserData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [paidRegistration, setPaidRegistration] = useState(false);
  const [paidLogistics, setPaidLogistics] = useState(false);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const profileData = data.data || data;
        setUserData(profileData); 
        
        if (profileData.paid_registration) setPaidRegistration(true);
        if (profileData.paid_logistics) setPaidLogistics(true);
      } else {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        router.push('/auth/login');
      }
    } catch (error) {
      console.error("Failed to fetch profile in layout context:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    router.push('/auth/login');
  };

  const menuItems = [
    { label: "Overview", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "My Application", href: "/dashboard/application", icon: <ClipboardList size={20} /> },
    { label: "Payments & Fees", href: "/dashboard/payments", icon: <CreditCard size={20} /> },
    { label: "Inspection Schedule", href: "/dashboard/schedule", icon: <CalendarDays size={20} /> },
    { label: "Documents & Certificates", href: "/dashboard/documents", icon: <FolderHeart size={20} /> },
    { label: "Support Messages", href: "/dashboard/messages", icon: <MessageSquare size={20} /> },
    { label: "Profile Settings", href: "/dashboard/profile", icon: <UserCog size={20} /> },
  ];

  const SidebarItem = ({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) => {
    const isActive = pathname === href;
    
    return (
      <Link
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-4 w-full transition-all duration-300 rounded-lg ${
          isExpanded || isMobileMenuOpen ? "px-4 py-3" : "justify-center p-2"
        } ${
          isActive
            ? "bg-white/20 text-white font-semibold shadow-sm"
            : "text-white/60 hover:text-white hover:bg-white/10"
        }`}
      >
        <div className="shrink-0">{icon}</div>
        {(isExpanded || isMobileMenuOpen) && (
          <span className="text-sm font-medium whitespace-nowrap overflow-hidden animate-in fade-in duration-500">
            {label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        isLoadingProfile,
        refreshProfile: fetchUserProfile,
        paidRegistration,
        paidLogistics,
        setPaidRegistration,
        setPaidLogistics,
      }}
    >
      <MobileMenuContext.Provider value={{ setIsMobileMenuOpen }}>
        {/* NextTopLoader handles route transitions smoothly */}
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
            className={`absolute md:relative inset-y-0 left-0 transform transition-all duration-300 ease-in-out bg-[#5D9C0E] h-full flex flex-col justify-between py-6 z-50 shrink-0 shadow-xl md:shadow-none ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 ${
              isExpanded || isMobileMenuOpen ? "w-64 items-start" : "w-20 items-center"
            }`}
          >
            <div className="flex flex-col items-center w-full gap-8 overflow-y-auto no-scrollbar">
              {/* Menu toggle button */}
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

              {/* Sidebar Menu Items */}
              <div className="w-full flex flex-col gap-2.5 px-2">
                {menuItems.map((item, index) => (
                  <SidebarItem key={index} label={item.label} href={item.href} icon={item.icon} />
                ))}
              </div>
            </div>

            {/* Logout button at the bottom */}
            <div className={`w-full px-2 mt-auto pt-4 flex ${isExpanded || isMobileMenuOpen ? "justify-start" : "justify-center"}`}>
              <button 
                onClick={handleLogout}
                className={`bg-[#4d820c] hover:bg-[#3f6b09] transition rounded-lg text-white/95 shadow-sm flex items-center gap-4 ${
                  isExpanded || isMobileMenuOpen ? "px-4 py-3 w-full" : "p-3"
                }`}
                title="Log Out"
              >
                <LogOut size={20} />
                {(isExpanded || isMobileMenuOpen) && <span className="text-sm font-semibold">Log Out</span>}
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 h-full overflow-y-auto px-4 sm:px-8 md:px-10 lg:px-12 pt-6 md:pt-8 pb-10 flex flex-col w-full">
            <div className="w-full flex flex-col gap-6">
              {isLoadingProfile ? (
                <div className="flex h-[80vh] items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
                </div>
              ) : (
                children
              )}
            </div>
          </main>
        </div>
      </MobileMenuContext.Provider>
    </UserContext.Provider>
  );
}