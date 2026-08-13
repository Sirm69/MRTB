"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  MessageCircle
} from 'lucide-react';

const Footer = () => {
  const router = useRouter();

  // Brand Color Palette
  const accentYellow = "#d8f22f";
  const deeperGreen = "#5e9900";
  const overColor = "#1b1e15";

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Accreditation', href: '/#verify-accreditation' },
    { name: 'Registration', href: '/auth/login' },
  ];

  const SocialIcons = [
    {
      name: 'X',
      href: '#',
      path: <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    },
    {
      name: 'Instagram',
      href: '#',
      path: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></g>
    },
    {
      name: 'Facebook',
      href: '#',
      path: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    },
    {
      name: 'WhatsApp',
      href: '#',
      icon: <MessageCircle size={18} strokeWidth={1.5} />
    }
  ];

  return (
    <footer style={{ backgroundColor: deeperGreen }} className="text-white pt-12 md:pt-16 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pb-10 md:pb-14">

        {/* TOP SECTION - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">

          {/* COLUMN 1: BRANDING */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="bg-white p-2 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden shadow-xl transition-transform group-hover:scale-105 shrink-0">
                <Image
                  src="/logo.png"
                  alt="MRTB Logo"
                  width={54}
                  height={54}
                  className="object-contain"
                  style={{ height: 'auto' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl sm:text-2xl leading-none tracking-tight">
                  MRTB Nigeria
                </span>
                <span className="text-[10px] text-white/80 uppercase tracking-[0.2em] font-medium mt-1.5">
                  Medical Rehabilitation Board
                </span>
              </div>
            </Link>
            <p className="text-xs text-white/70 max-w-lg leading-relaxed">
              Federal Statutory Regulatory Agency under the Federal Ministry of Health & Social Welfare, regulating training and practice across medical rehabilitation professions.
            </p>
          </div>

          {/* COLUMN 2: QUICK LINKS (Single Column Vertical List) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-3">
            <h4 className="text-[#d8f22f] font-bold text-lg sm:text-xl tracking-tight">
              Quick Links
            </h4>
            <ul className="space-y-2 max-w-xs">
              {quickLinks.map((link) => (
                <li key={link.name} className="border-b border-white/10 pb-1.5">
                  <Link 
                    href={link.href} 
                    onClick={(e) => {
                      if (link.href.includes('verify') || link.href.includes('accreditation')) {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('open-verify-modal'));
                      }
                    }}
                    className="text-sm font-semibold text-white/90 hover:text-[#d8f22f] transition-all flex items-center gap-2 group"
                  >
                    <span className="text-[#d8f22f] text-xs font-black">▶</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ backgroundColor: overColor }} className="py-4 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">

          <p className="text-[11px] uppercase tracking-widest font-medium text-white/40">
            &copy; {new Date().getFullYear()} MRTB Nigeria. All Rights Reserved.
          </p>

          {/* SOCIAL MEDIA LINKS */}
          <div className="flex gap-8 items-center justify-center">
            {SocialIcons.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-white/40 hover:text-[#8dc63f] transition-all hover:scale-110"
                aria-label={social.name}
              >
                {social.icon ? (
                  social.icon
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    {social.path}
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;