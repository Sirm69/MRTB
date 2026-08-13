"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Eye, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  Landmark
} from 'lucide-react';
import Footer from '@/app/components/Footer';

export default function MandatePage() {
  const deeperGreen = "#5D9C0E";

  const fadeInUp = {
    initial: { opacity: 0, y: 28, scale: 0.985 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-40px" },
    transition: { 
      duration: 0.75, 
      ease: [0.16, 1, 0.3, 1]
    }
  } as const;

  const regulatedProfessions = [
    "Physiotherapy",
    "Occupational Therapy",
    "Speech Therapy",
    "Clinical Audiology",
    "Osteopathic Medicine",
    "Chiropractic Medicine",
    "Prosthetics & Orthotics"
  ];

  const missionPillars = [
    {
      title: "Quackery Control & Eradication",
      desc: "Aggressive enforcement of ethical practice, elimination of unlicensed practitioners, and protection of public safety across all health settings."
    },
    {
      title: "Continuing Professional Development (CPD)",
      desc: "Organization and mandatory accreditation of standard CPD educational programs to maintain modern clinical competencies."
    },
    {
      title: "Public Awareness & Decentralization",
      desc: "Decentralization and nationwide dissemination of information to registrants, professionals, and the general public to foster transparency."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      
      {/* 1. HERO HEADER SECTION */}
      <section className="relative bg-[#0e2102] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e2102] via-[#163302] to-[#0e2102] opacity-90" />
        
        {/* Abstract Glow Accents */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#5e9900]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#d8f22f]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1240px] mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#5e9900]/30 border border-[#5e9900]/50 text-[#d8f22f] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={14} className="shrink-0" />
            <span className="hidden sm:inline">Statutory Regulatory Charter (Decree 38 of 1988 / Acts M9 LFN 2004)</span>
            <span className="sm:hidden">Decree 38 of 1988 (M9 LFN 2004)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Official Board Mandate
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Welcome Address, Statutory Scope, Vision, and Mission of the Medical Rehabilitation Therapists (Registration) Board of Nigeria.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 md:space-y-16">

        {/* SECTION 2: WELCOME ADDRESS & STATUTORY CHARTER */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
              <Landmark size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome Address & Board Charter
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Medical Rehabilitation Therapists (Registration) Board of Nigeria</p>
            </div>
          </div>

          <div className="prose max-w-none text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed space-y-4">
            <p className="text-slate-800 font-medium leading-relaxed">
              On behalf of the <strong className="text-slate-900">Medical Rehabilitation Therapists (Registration) Board of Nigeria (MRTB)</strong>, I sincerely welcome all and sundry to the Board’s official website. MRTB was established by <strong className="text-slate-900">Decree 38 of 1988/Acts M9 LFN 2004</strong> for the regulation and control of the under listed professions in the Health Sector in Nigeria:
            </p>

            {/* List of Regulated Professions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-6">
              {regulatedProfessions.map((prof, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 hover:bg-[#EEF6DF]/40 transition-colors">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5D9C0E] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{prof}</span>
                </div>
              ))}
            </div>

            <p>
              With this arrangement the MRTB can be seen as a heterogeneous regulatory agency saddled with the statutory responsibilities of regulating the training and practice of the above named professions in the Health Sector in Nigeria.
            </p>

            <p className="p-4 bg-[#EEF6DF]/50 border-l-4 border-[#066936] rounded-r-xl text-slate-800 font-medium">
              All Medical Rehabilitation Professionals in Nigeria and Diaspora in need of any information including registration and licence renewal under the Board may now log in accordingly.
            </p>
          </div>
        </motion.section>

        {/* SECTION 3: VISION & MISSION CARDS */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* VISION CARD */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEF6DF] text-[#066936] rounded-full text-xs font-bold uppercase tracking-wider">
                <Eye size={14} />
                <span>Our Vision</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vision Statement</h3>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-semibold italic border-l-4 border-[#5D9C0E] pl-4 py-1">
                "To build an apex regulatory Agency where equity, Justice and fair play constitute the watch words."
              </p>
            </div>
            <div className="pt-4 text-xs text-slate-400 font-medium">
              Core Governance Principle • MRTB Nigeria
            </div>
          </div>

          {/* MISSION CARD */}
          <div className="bg-[#0e2102] text-white rounded-2xl p-6 sm:p-8 border border-[#5e9900]/30 shadow-md hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5e9900]/30 text-[#d8f22f] rounded-full text-xs font-bold uppercase tracking-wider border border-[#5e9900]/50">
                <Target size={14} />
                <span>Our Mission</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Mission Statement</h3>
              <p className="text-slate-200 text-sm leading-relaxed font-medium">
                Utilizing all available resources required to build a vibrant Board through:
              </p>
              
              <div className="space-y-3 pt-2">
                {missionPillars.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <CheckCircle2 size={16} className="text-[#d8f22f] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 text-xs text-[#d8f22f]/80 font-medium">
              Operational Roadmap • Strategic Action
            </div>
          </div>
        </motion.section>

        {/* SECTION 4: CALL TO ACTION */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center space-y-6"
        >
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              For Further Enquiries & Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Browse this website or contact us. Thank you for visiting.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link 
              href="/auth/register" 
              style={{ backgroundColor: deeperGreen }}
              className="inline-flex items-center gap-2 text-white font-bold text-xs py-3 px-6 rounded-full shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Portal Login & Registration</span>
              <ArrowRight size={14} />
            </Link>

            <Link 
              href="/about" 
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold text-xs py-3 px-6 rounded-full shadow-sm transition-all cursor-pointer"
            >
              <span>About MRTB History</span>
            </Link>
          </div>
          
          <p className="text-xs text-slate-400 font-medium pt-2">
            Thank you for visiting the official MRTB Nigeria Portal.
          </p>
        </motion.section>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
