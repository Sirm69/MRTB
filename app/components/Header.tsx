"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-md flex flex-col justify-center shadow-md border-b border-slate-200 z-[100]">
      
      {/* Decorative Background swooshes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 h-full">
        <div className="absolute -top-[300px] -right-[100px] w-[1200px] h-[800px] rounded-[100%] border-[6px] border-[#eaf2df] opacity-70" />
        <div className="absolute -top-[500px] right-[200px] w-[1000px] h-[900px] rounded-[100%] border-[5px] border-[#f0f5e8] opacity-50" />
        <div className="absolute top-[20px] -right-[200px] w-[600px] h-[800px] rounded-[100%] border-[8px] border-[#eaf2df] opacity-70" />
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 relative z-10 flex justify-between items-center h-20 md:h-24">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center shrink-0">
          <Image 
            src="/logo.png" 
            alt="MRTB Logo" 
            width={52} 
            height={52} 
            className="object-contain" 
            style={{ height: 'auto' }} 
            priority
          />
        </Link>

        {/* NAVIGATION & ACTION BUTTON */}
        <div className="flex items-center gap-4 md:gap-12">
          
          <nav className="hidden md:block">
            <ul className="flex items-center gap-10 text-[16px] text-gray-800 font-medium">
              <li>
                <Link href="/about" className="hover:text-[#71b600] transition-colors">About</Link>
              </li>
              <li>
                <Link href="/accreditation" className="hover:text-[#71b600] transition-colors">Accreditation</Link>
              </li>
              <li>
                <Link href="/license-renewal" className="hover:text-[#71b600] transition-colors">License Renewal</Link>
              </li>
            </ul>
          </nav>

          {/* LOGIN BUTTON WITH DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setIsLoginOpen(!isLoginOpen)}
              onBlur={() => setTimeout(() => setIsLoginOpen(false), 200)}
              className="flex items-center bg-[#152405] hover:bg-black transition-colors rounded-full overflow-hidden text-white h-[40px] md:h-[42px]"
            >
              <span className="px-4 md:px-5 text-[14px] md:text-[15px] font-medium tracking-wide">
                Login
              </span>
              <div className="h-[20px] w-[1px] bg-white/20"></div>
              <span className="px-2 md:px-3 flex items-center justify-center text-[#8dc63f]">
                <ChevronDown size={18} strokeWidth={3} className={`transition-transform duration-300 ${isLoginOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>

            {/* LOGIN DROPDOWN MENU */}
            <div className={`absolute right-0 top-full mt-3 w-48 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden transition-all duration-200 origin-top-right ${isLoginOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              <div className="flex flex-col py-1">
                <Link href="/auth/login" className="px-5 py-3 text-sm text-gray-700 font-medium hover:bg-slate-50 hover:text-[#71b600] transition-colors border-l-2 border-transparent hover:border-[#71b600]">
                  Entity
                </Link>
                <div className="h-[1px] w-full bg-slate-50"></div>
                <Link href="/admin/login" className="px-5 py-3 text-sm text-gray-700 font-medium hover:bg-slate-50 hover:text-[#71b600] transition-colors border-l-2 border-transparent hover:border-[#71b600]">
                  Admin
                </Link>
                <div className="h-[1px] w-full bg-slate-50"></div>
                {/* Updated the href right here 👇 */}
                <Link href="/admin/login" className="px-5 py-3 text-sm text-gray-700 font-medium hover:bg-slate-50 hover:text-[#71b600] transition-colors border-l-2 border-transparent hover:border-[#71b600]">
                  Field Team
                </Link>
              </div>
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden flex items-center justify-center p-2 text-gray-800 hover:text-[#71b600] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={26} strokeWidth={2.5} /> : <Menu size={26} strokeWidth={2.5} />}
          </button>
          
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg transition-all duration-300 ease-in-out z-[110] origin-top ${isMobileMenuOpen ? 'opacity-100 max-h-[300px] visible' : 'opacity-0 max-h-0 invisible'}`}>
        <nav className="flex flex-col px-6 py-4 space-y-4">
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-[16px] text-gray-800 font-medium hover:text-[#71b600] transition-colors py-2 border-b border-slate-50">
            About
          </Link>
          <Link href="/accreditation" onClick={() => setIsMobileMenuOpen(false)} className="text-[16px] text-gray-800 font-medium hover:text-[#71b600] transition-colors py-2 border-b border-slate-50">
            Accreditation
          </Link>
          <Link href="/license-renewal" onClick={() => setIsMobileMenuOpen(false)} className="text-[16px] text-gray-800 font-medium hover:text-[#71b600] transition-colors py-2">
            License Renewal
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;