"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Check,
  Building2,
  UserCheck,
  FileText,
  RotateCw,
  ArrowRight,
  Newspaper,
  Calendar,
  ExternalLink,
  Landmark,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Award,
  Search
} from 'lucide-react';
import Hero from '@/app/components/Banner';
import Footer from '@/app/components/Footer';

export default function Home() {
  // Brand Color Palette (Mandatory)
  const deeperGreen = "#5D9C0E";
  const overColor = "#1b1e15";

  // Natural Smooth Fluid Motion Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 28, scale: 0.985 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-40px" },
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1]
    }
  } as const;

  // Guarantee page starts from the very top on fresh load / refresh
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">

      {/* HERO BANNER SECTION */}
      <Hero />



      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-14 sm:pb-20 md:pb-24 space-y-12 md:space-y-16">

        {/* SECTION 1: FACILITY ASSESSMENT */}
        <motion.section
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="bg-white rounded-2xl p-5 md:p-6 lg:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#5e9900]/30 transition-all duration-500 ease-out flex flex-col lg:flex-row items-center gap-6 lg:gap-8 overflow-hidden"
        >
          {/* Image Container with Integrated Government Seal Tag */}
          <div className="w-full lg:w-1/2 relative overflow-hidden rounded-xl">
            <div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative aspect-[4/3] sm:aspect-[16/10]">
              <img
                src="/facility-assessment.png"
                alt="Facility Assessment & Quality Accreditation"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/bb1.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

              {/* Integrated Official Verification Seal Badge */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-slate-900/45 backdrop-blur-md rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-white/20 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#5e9900]/30 text-[#d8f22f] border border-[#5e9900]/50 flex items-center justify-center shrink-0">
                    <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight">MRTB Verification Seal</h4>
                    <p className="text-[10px] sm:text-xs text-slate-200 mt-0.5">Statutory Facility Infrastructure Audit</p>
                  </div>
                </div>
                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#d8f22f] bg-[#5e9900]/40 border border-[#5e9900]/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md shrink-0">
                  Official Standard
                </span>
              </div>
            </div>
          </div>

          {/* Text Content with Compact Spacing */}
          <div className="w-full lg:w-1/2 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EEF6DF] text-[#066936] text-[11px] font-semibold tracking-wide">
              <Building2 size={12} />
              <span>Facility Regulation & Accreditation</span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              Facility Assessment & Quality Accreditation
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Your clinical environment matters as much as practitioner expertise. The Board evaluates health facilities nationwide to confirm they meet required operational, equipment, safety, and hygiene standards.
            </p>

            {/* Clean Compact Feature List */}
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  Infrastructure, clinical tools and essential equipment readiness audits
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  Safety and sanitation standards compliance for patient protection
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  Issuance of statutory accreditation certificates for operating centers
                </span>
              </div>
            </div>

            <div className="pt-1.5">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-guideline-modal'))}
                style={{ backgroundColor: deeperGreen }}
                className="inline-flex items-center gap-2 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm hover:brightness-105 transition-all cursor-pointer"
              >
                <span>Accreditation Guidelines</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </motion.section>


        {/* SECTION 2: STAFF VERIFICATION */}
        <motion.section
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="bg-white rounded-2xl p-5 md:p-6 lg:p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#5e9900]/30 transition-all duration-500 ease-out flex flex-col lg:flex-row-reverse items-center gap-6 lg:gap-8 overflow-hidden"
        >
          {/* Image Container with Integrated Verification Tag */}
          <div className="w-full lg:w-1/2 relative overflow-hidden rounded-xl">
            <div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative aspect-[4/3] sm:aspect-[16/10]">
              <img
                src="/bb2-opt.webp"
                alt="Staff Verification"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/bb2.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

              {/* Integrated Practitioner Credential Badge */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-slate-900/45 backdrop-blur-md rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-white/20 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#5e9900]/30 text-[#d8f22f] border border-[#5e9900]/50 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight">Licensed Practitioner Registry</h4>
                    <p className="text-[10px] sm:text-xs text-slate-200 mt-0.5">Qualifications & Credentials Verification</p>
                  </div>
                </div>
                <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#d8f22f] bg-[#5e9900]/40 border border-[#5e9900]/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md shrink-0">
                  Validated
                </span>
              </div>
            </div>
          </div>

          {/* Text Content with Compact Spacing */}
          <div className="w-full lg:w-1/2 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#EEF6DF] text-[#066936] text-[11px] font-semibold tracking-wide">
              <UserCheck size={12} />
              <span>Practitioner Regulation & Licensing</span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              Professional Staff Review & Certification
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Ensure your team meets the highest standards of professional competence. MRTB conducts thorough reviews of medical rehabilitation personnel, validating qualifications, practicing licenses, and ethical standing.
            </p>

            {/* Clean Compact Feature List */}
            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  Verification of academic degrees and professional certifications
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  Confirmation of active annual practicing license status
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4.5 h-4.5 rounded-full bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={11} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-medium text-slate-700">
                  Enforcement of ethical practice to protect patient care and trust
                </span>
              </div>
            </div>

            <div className="pt-1.5">
              <Link
                href="/mandate"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <span>Read Board Mandate</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </motion.section>
        <motion.section
          id="verify-accreditation"
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-[#5e9900]/30 transition-all duration-500 ease-out overflow-hidden"
        >
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Verify Accreditation Status
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Search the official MRTB database to verify clinics, hospitals, and training institutions.
              </p>
            </div>

            {/* Search Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Institution / Accreditation No. Input */}
              <div className="md:col-span-5 relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Institution Name or Accreditation No."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5e9900] focus:ring-2 focus:ring-[#EEF6DF] transition-all"
                />
              </div>

              {/* All Categories Dropdown */}
              <div className="md:col-span-3">
                <select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#5e9900] focus:ring-2 focus:ring-[#EEF6DF] transition-all cursor-pointer">
                  <option value="">All Categories</option>
                  <option value="physiotherapy">Physiotherapy Center</option>
                  <option value="occupational">Occupational Therapy</option>
                  <option value="speech">Speech Therapy</option>
                  <option value="prosthetics">Prosthetics & Orthotics</option>
                  <option value="chiropractic">Chiropractic & Osteopathy</option>
                </select>
              </div>

              {/* All States Dropdown */}
              <div className="md:col-span-2">
                <select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#5e9900] focus:ring-2 focus:ring-[#EEF6DF] transition-all cursor-pointer">
                  <option value="">All States</option>
                  <option value="abuja">Abuja (FCT)</option>
                  <option value="lagos">Lagos</option>
                  <option value="kano">Kano</option>
                  <option value="rivers">Rivers</option>
                  <option value="oyo">Oyo</option>
                  <option value="enugu">Enugu</option>
                  <option value="kaduna">Kaduna</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-verify-modal'))}
                  className="w-full bg-[#5e9900] hover:brightness-105 active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400 font-medium pt-1">
              Last database update: Today
            </div>
          </div>

          {/* Bottom Brand Action Bar */}
          <div
            onClick={() => window.dispatchEvent(new CustomEvent('open-verify-modal'))}
            className="bg-[#5e9900] hover:brightness-105 py-3.5 px-6 text-center text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Search Verified Portal Database</span>
          </div>
        </motion.section>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}