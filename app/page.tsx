"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import InstitutionProfileCard, { InstitutionProfile } from '@/app/components/InstitutionProfileCard';
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
  Search,
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';
import Hero from '@/app/components/Banner';
import Footer from '@/app/components/Footer';

export default function Home() {
  // Brand Color Palette (Mandatory)
  const deeperGreen = "#5D9C0E";
  const overColor = "#1b1e15";

  // Section 3 Search State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [state, setState] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<InstitutionProfile[]>([]);
  const [searchError, setSearchError] = React.useState('');

  const handleInlineSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setSearchError('');
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      if (category.trim()) params.append('category', category.trim());
      if (state.trim()) params.append('state', state.trim());

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/verify?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results || []);
      } else {
        setSearchError('Could not retrieve verification records. Please try again.');
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Home search error:", err);
      setSearchError('Network error connecting to verification database.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCategory('');
    setState('');
    setHasSearched(false);
    setSearchResults([]);
    setSearchError('');
  };

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
          className="bg-white rounded-2xl border border-slate-200/80 shadow-md hover:border-[#5e9900]/30 transition-all duration-500 ease-out overflow-hidden"
        >
          <form onSubmit={handleInlineSearch} className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Verify Accreditation Status
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  Search the official MRTB database to verify clinics, hospitals, and training institutions.
                </p>
              </div>

              {hasSearched && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold border border-slate-200 bg-white px-3 py-1.5 rounded-full transition-colors cursor-pointer w-fit"
                >
                  <X size={13} /> Clear Results
                </button>
              )}
            </div>

            {/* Search Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Institution / Accreditation No. Input */}
              <div className="md:col-span-5 relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Institution Name or Accreditation No."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5e9900] focus:ring-2 focus:ring-[#EEF6DF] transition-all"
                />
              </div>

              {/* All Categories Dropdown */}
              <div className="md:col-span-3">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#5e9900] focus:ring-2 focus:ring-[#EEF6DF] transition-all cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="physiotherapy">Physiotherapy Center</option>
                  <option value="occupational">Occupational Therapy</option>
                  <option value="speech">Speech Therapy</option>
                  <option value="audiology">Audiology</option>
                  <option value="prosthetics">Prosthetics & Orthotics</option>
                  <option value="chiropractic">Chiropractic & Osteopathy</option>
                </select>
              </div>

              {/* All States Dropdown */}
              <div className="md:col-span-2">
                <select 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#5e9900] focus:ring-2 focus:ring-[#EEF6DF] transition-all cursor-pointer"
                >
                  <option value="">All States</option>
                  <option value="Abuja">Abuja (FCT)</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Kano">Kano</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Enugu">Enugu</option>
                  <option value="Kaduna">Kaduna</option>
                  <option value="Edo">Edo</option>
                  <option value="Delta">Delta</option>
                  <option value="Ogun">Ogun</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-[#5e9900] hover:brightness-105 active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSearching ? (
                    <><Loader2 size={16} className="animate-spin" /> Searching...</>
                  ) : (
                    <><Search size={16} /> Search</>
                  )}
                </button>
              </div>
            </div>

            {/* In-Line Search Results Container */}
            {isSearching && (
              <div className="py-10 flex flex-col items-center justify-center space-y-2 text-slate-400">
                <Loader2 size={30} className="animate-spin text-[#5e9900]" />
                <p className="text-xs font-medium">Verifying public accreditation records...</p>
              </div>
            )}

            {searchError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {!isSearching && hasSearched && searchResults.length === 0 && !searchError && (
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center space-y-2 max-w-md mx-auto my-4">
                <Building2 size={36} className="text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No Matching Institutions Found</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We could not find any active accreditation records matching your search query. Please verify the name or search by State / Category.
                </p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                  <span className="font-semibold text-slate-700">
                    Found {searchResults.length} Verified Institution Profile{searchResults.length > 1 ? 's' : ''}:
                  </span>
                  <span className="text-[11px] text-[#066936] font-bold bg-[#EEF6DF] px-2.5 py-0.5 rounded-full border border-[#CDE1B4]">
                    Statutory Registry Verified
                  </span>
                </div>

                <div className="space-y-4">
                  {searchResults.map((inst, index) => (
                    <InstitutionProfileCard key={inst.id || index} institution={inst} />
                  ))}
                </div>
              </div>
            )}

            <div className="text-right text-[11px] text-slate-400 font-medium pt-1">
              Last database update: Today
            </div>
          </form>

          {/* Bottom Brand Action Bar */}
          <div
            onClick={() => window.dispatchEvent(new CustomEvent('open-verify-modal', {
              detail: { query: searchQuery, category, state }
            }))}
            className="bg-[#5e9900] hover:brightness-105 py-3.5 px-6 text-center text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Open Dedicated Verification Modal</span>
          </div>
        </motion.section>


      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}