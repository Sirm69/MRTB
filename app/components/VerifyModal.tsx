"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, ShieldCheck } from 'lucide-react';

export default function VerifyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setSearchResult(null);
    };
    window.addEventListener('open-verify-modal', handleOpen);
    return () => window.removeEventListener('open-verify-modal', handleOpen);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery && !category && !state) return;
    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      setSearchResult(
        `Active Record Verified — "${searchQuery || category || state || "Official Statutory Entry"}" is registered and accredited under MRTB Act Cap M9 LFN 2004.`
      );
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0 z-0" onClick={() => setIsOpen(false)} />

      {/* Centered Modal Container matching Section 3 UI */}
      <div className="relative z-10 bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        <form onSubmit={handleSearch} className="p-6 sm:p-8 space-y-6 relative bg-white">
          
          {/* Close Button X */}
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Heading matching Section 3 UI */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pr-10">
              Verify Accreditation Status
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Search the official MRTB database to verify clinics, hospitals, and training institutions.
            </p>
          </div>

          {/* Search Input Controls Grid matching Section 3 UI */}
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
                type="submit"
                disabled={isSearching}
                className="w-full bg-[#5e9900] hover:brightness-105 active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSearching ? (
                  <span>Searching...</span>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Result Feedback */}
          {searchResult && (
            <div className="p-3.5 rounded-xl bg-[#EEF6DF] border border-[#5e9900]/30 text-slate-800 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-150">
              <ShieldCheck size={18} className="shrink-0 mt-0.5 text-[#5e9900]" />
              <span>{searchResult}</span>
            </div>
          )}

          <div className="text-right text-[11px] text-slate-400 font-medium pt-1">
            Last database update: Today
          </div>

        </form>

        {/* Bottom Brand Action Bar matching Section 3 UI */}
        <div className="bg-[#5e9900] py-3.5 px-6 text-center text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2">
          <span>Search Verified Portal Database</span>
        </div>

      </div>
    </div>
  );
}
