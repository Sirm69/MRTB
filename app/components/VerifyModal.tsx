"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, ShieldCheck, Loader2, AlertCircle, Building2 } from 'lucide-react';
import InstitutionProfileCard, { InstitutionProfile } from './InstitutionProfileCard';

export default function VerifyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<InstitutionProfile[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleOpen = (e: Event) => {
      setIsOpen(true);
      setErrorMsg('');
      
      // Check if custom event passed initial search params
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.query) setSearchQuery(customEvent.detail.query);
        if (customEvent.detail.category) setCategory(customEvent.detail.category);
        if (customEvent.detail.state) setState(customEvent.detail.state);
        // Trigger automatic search if params passed
        fetchPublicVerification(
          customEvent.detail.query || '',
          customEvent.detail.category || '',
          customEvent.detail.state || ''
        );
      }
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

  const fetchPublicVerification = async (q: string, cat: string, st: string) => {
    setIsSearching(true);
    setErrorMsg('');
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (q) params.append('query', q.trim());
      if (cat) params.append('category', cat.trim());
      if (st) params.append('state', st.trim());

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
        setResults(data.results || []);
      } else {
        setErrorMsg('Failed to query public registry. Please try again.');
        setResults([]);
      }
    } catch (err) {
      console.error("Public verification search error:", err);
      setErrorMsg('Network error connecting to verification database.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPublicVerification(searchQuery, category, state);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0 z-0" onClick={() => setIsOpen(false)} />

      {/* Centered Modal Container */}
      <div className="relative z-10 bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header with Search Form */}
        <form onSubmit={handleSearch} className="p-6 sm:p-7 space-y-5 relative bg-white border-b border-slate-100 shrink-0">
          
          {/* Close Button X */}
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Heading */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pr-10">
              Verify Accreditation Status
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Search the official MRTB statutory registry to verify health facilities and academic training institutions.
            </p>
          </div>

          {/* Search Input Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Institution / Accreditation No. Input */}
            <div className="md:col-span-5 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Institution Name or Accreditation No." 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5e9900] focus:bg-white focus:ring-2 focus:ring-[#EEF6DF] transition-all"
              />
            </div>

            {/* All Categories Dropdown */}
            <div className="md:col-span-3">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#5e9900] focus:bg-white focus:ring-2 focus:ring-[#EEF6DF] transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="physiotherapy">Physiotherapy</option>
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
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#5e9900] focus:bg-white focus:ring-2 focus:ring-[#EEF6DF] transition-all cursor-pointer"
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
                className="w-full bg-[#5e9900] hover:bg-[#4a7c0b] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isSearching ? (
                  <><Loader2 size={14} className="animate-spin" /> Searching...</>
                ) : (
                  <><Search size={14} /> Search</>
                )}
              </button>
            </div>

          </div>

        </form>

        {/* Scrollable Results Area */}
        <div className="p-6 overflow-y-auto space-y-4 bg-slate-50/50 flex-1">
          
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
              <Loader2 size={32} className="animate-spin text-[#5e9900]" />
              <p className="text-xs font-medium">Querying statutory accreditation database...</p>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isSearching && hasSearched && results.length === 0 && !errorMsg && (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-2 max-w-md mx-auto">
              <Building2 size={36} className="text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-800">No Matching Institutions Found</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We could not find any active accreditation records matching your search query. Please verify the name or search by State / Category.
              </p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-medium">Found {results.length} official institution record{results.length > 1 ? 's' : ''}:</span>
                <span className="text-[11px] text-[#066936] font-semibold bg-[#EEF6DF] px-2.5 py-0.5 rounded-full">
                  Statutory Register Active
                </span>
              </div>

              {results.map((inst, index) => (
                <InstitutionProfileCard key={inst.id || index} institution={inst} />
              ))}
            </div>
          )}

          {!isSearching && !hasSearched && (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <ShieldCheck size={32} className="text-slate-300 mx-auto" />
              <p className="text-xs font-medium text-slate-500">
                Enter an institution name, accreditation number, or filter by category and state above to verify records.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100/80 border-t border-slate-200/80 py-3 px-6 text-center text-slate-500 text-[11px] font-medium flex items-center justify-between shrink-0">
          <span>Medical Rehabilitation Therapists Board of Nigeria</span>
          <span>MRTB Act Cap M9 LFN 2004</span>
        </div>

      </div>
    </div>
  );
}
