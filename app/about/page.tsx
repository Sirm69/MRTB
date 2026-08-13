"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Landmark, 
  History, 
  Users, 
  Award, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  HeartPulse,
  Brain,
  Volume2,
  Stethoscope,
  Building2,
  FileText
} from 'lucide-react';
import Footer from '@/app/components/Footer';

export default function AboutPage() {
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

  const pioneerBoardMembers = [
    { name: "Professor G. I. Odia", role: "Chairman" },
    { name: "Dr. Isaac O. Owoeye", role: "Acting Registrar" },
    { name: "Mr. B. A. Williams", role: "Board Member" },
    { name: "Dr. C. C. Unogwu", role: "Board Member" },
    { name: "Mr. A. O. Ukaegbu", role: "Board Member" },
    { name: "Dr. K. Sodeke", role: "Board Member" },
    { name: "Dr. (Mrs.) A. O. Sanya", role: "Board Member" },
    { name: "Dr. O. Owolawi", role: "Board Member" },
    { name: "Mr. M. O. B. Olaogun", role: "Board Member" },
    { name: "Dr. I. A. Falope", role: "Board Member" },
    { name: "Mr. G. Etikeretse", role: "Board Member" },
    { name: "Dr. M. Dawodu", role: "Board Member" },
    { name: "Mr. C. B. Dan-Jumbo", role: "Board Member" },
    { name: "Chief J. A. Dagbue", role: "Board Member" },
    { name: "Mrs. O. O. Coker", role: "Board Member" },
    { name: "Miss S. A. Adeniji-Adele", role: "Board Member" }
  ];

  const historicalMilestones = [
    {
      year: "1945",
      title: "Introduction of Physical Therapy",
      description: "Physical Therapy was initiated by expatriate Physiotherapists at the National Orthopaedic Hospital, Igbobi, Lagos, later expanding to centres in Ibadan, Kano, and Enugu."
    },
    {
      year: "1950s",
      title: "Emergence of Occupational Therapy",
      description: "Occupational therapy began practice in psychiatric hospitals in Lagos and Abeokuta, and at UCH Ibadan. Nigerian practitioners commenced formal training abroad in Britain."
    },
    {
      year: "1959",
      title: "Establishment of NSP",
      description: "The Nigeria Society of Physiotherapy (NSP) was established, marking the beginning of a 33-year struggle for a legal regulating board in Nigeria."
    },
    {
      year: "1988",
      title: "Enactment of Decree 38 of 1988",
      description: "The Medical Rehabilitation Therapists (Registration) Board of Nigeria was constituted by Nigerian Law (Decree 38 of 1988 / M9 LFN 2004)."
    },
    {
      year: "1992",
      title: "Official Board Inauguration",
      description: "On Tuesday, December 29, 1992, the Honourable Minister of Health, Late Prof. Olikoye Ransome-Kuti, formally inaugurated the MRTB at Federal Ministry of Health, Ikoyi, Lagos."
    },
    {
      year: "2000",
      title: "Regulatory Restructuring",
      description: "Chiropractic and Osteopathic Medicine transitioned to dedicated council oversight, defining MRTB's core mandate across Physiotherapy, Occupational Therapy, Speech Therapy, Audiology, and Prosthetics/Orthotics."
    }
  ];

  const regulatedProfessions = [
    {
      icon: Activity,
      title: "Physiotherapy",
      description: "Dynamic and autonomous medical profession using diagnostic, therapeutic, and rehabilitative techniques to restore neuro-musculoskeletal, cardiovascular, and respiratory physical functions. Accounts for over 90% of Board registrants across hospitals, sports, industries, and rehabilitation centers."
    },
    {
      icon: Brain,
      title: "Occupational Therapy",
      description: "Utilizes constructive and manipulative activities as media for therapy, bridging the gap between disability and ability. Empowers individuals with functional self-reliance to reintegrate into community and vocational life."
    },
    {
      icon: Volume2,
      title: "Speech Therapy & Audiology",
      description: "Maximizes essential speech and language communication skills for individuals with cognitive or physical handicaps. Audiology encompasses hearing assessment, impairment detection, and fitting of hearing aids."
    },
    {
      icon: Stethoscope,
      title: "Prosthetics & Orthotics",
      description: "Evaluation, design, custom fabrication, and fitting of artificial limbs and orthopedic braces. Prevents and corrects physical impairments and functional disabilities."
    },
    {
      icon: HeartPulse,
      title: "Chiropractic & Osteopathic Medicine",
      description: "Historically regulated under MRTB's foundational charter, focusing on spinal column adjustment and musculoskeletal system alignment to maintain structural equilibrium."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-[#0e2102] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e2102] via-[#163302] to-[#0e2102] opacity-90" />
        
        {/* Abstract Background Accents */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#5e9900]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#d8f22f]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1240px] mx-auto text-center space-y-4">

          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 rounded-full bg-[#5e9900]/30 border border-[#5e9900]/50 text-[#d8f22f] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            <History size={13} className="shrink-0" />
            <span className="hidden sm:inline">Established by Decree 38 of 1988 (M9 LFN 2004)</span>
            <span className="sm:hidden">Decree 38 of 1988 (M9 LFN 2004)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            History & Mandate of MRTB Nigeria
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            The statutory parastatal of the Federal Ministry of Health regulating, licensing, and standardizing medical rehabilitation therapy professions across the Federal Republic of Nigeria.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">

        {/* SECTION 2: FOUNDATIONAL HISTORY & INAUGURATION */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
              <Landmark size={22} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                The Origin of MRTB Nigeria
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Official History & Legal Charter</p>
            </div>
          </div>

          <div className="prose max-w-none text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed space-y-4">
            <p>
              A unique milestone in the history of Medical Rehabilitation on the continent of Africa was made on <strong className="text-slate-900">Tuesday, December 29, 1992</strong>, when the then Honourable Minister of Health, <strong className="text-slate-900">Late Professor Olikoye Ransome-Kuti</strong>, officially inaugurated the Medical Rehabilitation Therapists (Registration) Board of Nigeria.
            </p>
            <p>
              The struggle for a legal regulating Board of control for the various medical disciplines in Medical Rehabilitation Therapy in Nigeria was a long and dedicated journey, dating back to 1959 when the Nigeria Society of Physiotherapy (NSP) was established. The Board was constituted under Nigerian Law via <strong className="text-slate-900">Decree 38 of 1988 / M9 LFN 2004</strong>.
            </p>
            <p>
              On that historic morning of December 29, 1992, at 10:00 AM, newly appointed members from across the nation gathered at the Conference Hall of the Federal Ministry of Health in Ikoyi, Lagos, where the Minister performed the inauguration with nationwide media coverage. This landmark event established a statutory body second to none on the African continent.
            </p>
          </div>
        </motion.section>

        {/* SECTION 3: HISTORICAL TIMELINE */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Historical Milestones
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Key moments shaping the evolution of rehabilitation therapy regulation in Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historicalMilestones.map((m, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#5e9900]/40 transition-all space-y-3"
              >
                <span className="inline-block px-3 py-1 bg-[#EEF6DF] text-[#066936] font-bold text-xs rounded-full">
                  {m.year}
                </span>
                <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 4: PIONEER BOARD MEMBERS */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pioneer Board Members (Inaugurated 1992)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">The Inaugural Governing Council of MRTB Nigeria</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {pioneerBoardMembers.map((member, i) => (
              <div 
                key={i} 
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-[#EEF6DF]/30 hover:border-[#5e9900]/30 transition-all flex flex-col justify-between"
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900">{member.name}</div>
                <div className="text-[11px] font-semibold text-[#066936] mt-1 uppercase tracking-wider">{member.role}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 5: REGULATED PROFESSIONS */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Regulated Medical Rehabilitation Professions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              MRTB is unique in its heterogeneous nature, governing the training standards, clinical accreditation, and ethical practice of major rehabilitation disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regulatedProfessions.map((p, idx) => {
              const IconComponent = p.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0 mt-1">
                    <IconComponent size={20} />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* SECTION 6: STATUTORY MANDATE & LEGAL COMPLIANCE */}
        <motion.section 
          initial={fadeInUp.initial}
          whileInView={fadeInUp.whileInView}
          viewport={fadeInUp.viewport}
          transition={fadeInUp.transition}
          className="bg-[#0e2102] text-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-[#5e9900]/30 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5e9900]/30 text-[#d8f22f] flex items-center justify-center shrink-0">
              <Scale size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Statutory Compliance & Legal Provisions
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">Section 15 (1 & 2) of Decree 38 of 1988 / M9 LFN 2004</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <p>
              In accordance with <strong className="text-white">Section 15, 1 & 2 of the Enabling Law (Decree 38 of 1988 / M9 LFN 2004)</strong>, it is illegal for any Medical Rehabilitation Therapist to practice or be engaged in any form of public or private health work for gain without holding a current annual Practicing License issued by the Board.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-xl border border-white/10">
                <CheckCircle2 size={18} className="text-[#d8f22f] shrink-0 mt-0.5" />
                <span>Practitioners must renew professional licenses annually at the start of each year.</span>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white/5 rounded-xl border border-white/10">
                <CheckCircle2 size={18} className="text-[#d8f22f] shrink-0 mt-0.5" />
                <span>Teaching and clinical supervision are restricted exclusively to Board-accredited institutions.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link 
              href="/auth/register" 
              style={{ backgroundColor: deeperGreen }}
              className="inline-flex items-center gap-2 text-white font-bold text-xs py-3 px-6 rounded-full shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Begin Practitioner / Facility Registration</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.section>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
