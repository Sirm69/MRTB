"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Menu, X, Landmark } from 'lucide-react';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Verify Accreditation', href: '/verify' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (href.includes('verify') || href.includes('accreditation')) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-verify-modal'));
    }
  };

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-md flex flex-col justify-center shadow-md border-b border-slate-200 z-[100]">

      {/* Top Official Federal Government Bar */}
      <div className="bg-[#0e2102] text-white text-[10px] md:text-[11px] font-medium py-1.5 px-4 md:px-6 hidden sm:flex justify-between items-center border-b border-white/10 tracking-wide">
        <div className="flex items-center gap-2">
          <Landmark size={12} className="text-[#d8f22f]" />
          <span>Medical Rehabilitation Therapists Board of Nigeria (MRTB)</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-200">
          <span>Federal Ministry of Health & Social Welfare</span>
        </div>
      </div>

      {/* Decorative Background swooshes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 h-full">
        <div className="absolute -top-[300px] -right-[100px] w-[1200px] h-[800px] rounded-[100%] border-[6px] border-[#eaf2df] opacity-70" />
        <div className="absolute -top-[500px] right-[200px] w-[1000px] h-[900px] rounded-[100%] border-[5px] border-[#f0f5e8] opacity-50" />
        <div className="absolute top-[20px] -right-[200px] w-[600px] h-[800px] rounded-[100%] border-[8px] border-[#eaf2df] opacity-70" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10 flex justify-between items-center h-20 md:h-22">

        {/* LOGO */}
        <Link href="/" className="flex items-center shrink-0 gap-3 group">
          <Image
            src="/logo.png"
            alt="MRTB Logo"
            width={52}
            height={52}
            className="object-contain transition-transform group-hover:scale-105"
            style={{ height: 'auto' }}
            priority
          />
          <div className="flex flex-col text-left hidden sm:flex">
            <span className="text-base font-extrabold text-slate-900 leading-none tracking-tight">MRTB NIGERIA</span>
            <span className="text-[10px] font-semibold text-[#066936] uppercase tracking-widest mt-1">Official Regulatory Portal</span>
          </div>
        </Link>

        {/* NAVIGATION & ACTION BUTTON */}
        <div className="flex items-center gap-4 md:gap-10">

          <nav className="hidden md:block">
            <ul className="flex items-center gap-8 text-[15px]">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`relative py-1.5 font-semibold transition-colors group flex flex-col justify-center items-center ${isActive ? 'text-[#066936]' : 'text-slate-700 hover:text-[#066936]'
                        }`}
                    >
                      <span>{item.name}</span>
                      {/* Underline indicator for hover and active */}
                      <span
                        className={`absolute bottom-0 left-0 h-[2.5px] rounded-full transition-all duration-300 ${isActive
                            ? 'w-full bg-[#066936]'
                            : 'w-0 group-hover:w-full bg-[#5D9C0E]'
                          }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* LOGIN BUTTON WITH DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              onBlur={() => setTimeout(() => setIsLoginOpen(false), 200)}
              className="bg-[#5e9900] hover:brightness-105 active:scale-[0.98] text-white font-bold text-xs sm:text-sm py-2.5 px-5 sm:px-6 rounded-full shadow-sm transition-all flex items-center gap-2 border border-[#5D9C0E] cursor-pointer"
            >
              <span>Login</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isLoginOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* LOGIN DROPDOWN MENU */}
            {isLoginOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-[110] animate-in fade-in duration-150">
                <Link 
                  href="/auth/login" 
                  className="block px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-[#EEF6DF] hover:text-[#066936] transition-colors border-l-2 border-transparent hover:border-[#5e9900]"
                >
                  Entity
                </Link>
                <div className="border-t border-slate-100 my-0.5" />
                <Link 
                  href="/admin/login" 
                  className="block px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-[#EEF6DF] hover:text-[#066936] transition-colors border-l-2 border-transparent hover:border-[#5e9900]"
                >
                  Admin
                </Link>
                <div className="border-t border-slate-100 my-0.5" />
                <Link 
                  href="/admin/login" 
                  className="block px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-[#EEF6DF] hover:text-[#066936] transition-colors border-l-2 border-transparent hover:border-[#5e9900]"
                >
                  Field Team
                </Link>
              </div>
            )}
          </div>

          {/* HAMBURGER MENU BUTTON FOR MOBILE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-700 hover:text-slate-900 focus:outline-none p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* MOBILE BACKDROP DISMISS OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-[1px] z-[105] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* CLEAN FLAT MOBILE MENU TRAY WITH FINE CURVED BOTTOM EDGE */}
      <div className={`md:hidden absolute top-full left-0 right-0 w-full bg-white border-b border-[#EEF6DF] rounded-b-2xl shadow-lg shadow-slate-900/5 transition-all duration-300 ease-in-out z-[110] overflow-hidden origin-top ${isMobileMenuOpen ? 'opacity-100 max-h-[300px] visible py-4 px-6' : 'opacity-0 max-h-0 invisible py-0 px-6'}`}>
        <nav className="flex flex-col space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-[15px] font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-between ${isActive
                    ? 'bg-[#EEF6DF] text-[#066936] border-l-4 border-[#066936]'
                    : 'text-slate-800 hover:bg-[#EEF6DF]/50 hover:text-[#066936]'
                  }`}
              >
                <span>{item.name}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-[#066936]" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;