"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, ChevronDown, X, Search, Loader2 } from 'lucide-react';
// @ts-expect-error - naija-state-local-government does not have built-in TypeScript types
import NaijaStates from 'naija-state-local-government';
import AlertModal from '../../components/AlertModal';

export default function RegisterPage() {
  const router = useRouter();
  const brandGreen = "#066936";
  const [logoError, setLogoError] = useState(false);

  // Form states
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecking, setIsChecking] = useState(false); // NEW: Loading state for API call

  // Location states
  const [states, setStates] = useState<string[]>([]);
  const [lgas, setLgas] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");

  // Modal states
  const [activeModal, setActiveModal] = useState<'state' | 'lga' | null>(null);
  
  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState<{ isOpen: boolean; message: string; type?: 'success' | 'error' | 'warning' }>({ isOpen: false, message: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setStates(NaijaStates.states());
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setPhone(numericValue);
    }
  };

  const handleSelectState = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedLGA("");
    const stateData = NaijaStates.lgas(stateName);
    setLgas(stateData?.lgas || stateData || []);
    setActiveModal(null);
    setSearchQuery("");
  };

  const handleSelectLGA = (lgaName: string) => {
    setSelectedLGA(lgaName);
    setActiveModal(null);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setCustomAlert({ isOpen: true, message: "Passwords do not match!", type: "error" });
      return;
    }

    if (!selectedState || !selectedLGA) {
      setCustomAlert({ isOpen: true, message: "Please select both a State and an LGA.", type: "error" });
      return;
    }

    const fullPhoneNumber = `+234${phone}`;
    setIsChecking(true);

    try {
      // 1. Check if user exists in the database
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/check-exists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ email: email, phone: fullPhoneNumber })
      });

      const result = await response.json();

      // If backend throws a 400, the email/phone exists
      if (!response.ok) {
        setCustomAlert({ isOpen: true, message: result.detail || "Account already exists.", type: "error" });
        setIsChecking(false);
        return;
      }

      // 2. If clear, compile data and save to localStorage
      const registrationData = { 
        name: orgName,          
        email: email, 
        phone: fullPhoneNumber, 
        state: selectedState, 
        lga: selectedLGA, 
        password: password 
      };

      localStorage.setItem('pendingRegistration', JSON.stringify(registrationData));
      
      // 3. Redirect to the Category page
      router.push('/auth/category'); 

    } catch (error) {
      console.error("API Error:", error);
      setCustomAlert({ isOpen: true, message: "Could not connect to the server to verify your details.", type: "error" });
    } finally {
      setIsChecking(false);
    }
  };

  const modalItems = useMemo(() => {
    const list = activeModal === 'state' ? states : lgas;
    if (!searchQuery) return list;
    return list.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeModal, states, lgas, searchQuery]);

  const inputClass = "w-full bg-transparent border border-gray-400 rounded-lg py-2 px-3 text-sm text-slate-800 placeholder:text-gray-400 outline-none focus:border-[#71b600] transition-colors";
  const triggerClass = `${inputClass} flex items-center justify-between cursor-pointer bg-white`;

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-800">
      <header className="relative z-30 flex items-center justify-center py-4 px-6 bg-white shadow-md">
        <Link href="/" className="absolute left-6 md:left-12 p-2 hover:bg-slate-50 rounded-full transition-colors">
          <ArrowLeft size={18} className="text-slate-700" />
        </Link>
        <div className="w-10 h-10 relative flex items-center justify-center">
          {!logoError ? (
            <img src="/logo.png" alt="Logo" className="object-contain w-full h-full" onError={() => setLogoError(true)} />
          ) : (
            <div className="w-full h-full rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-center p-1" style={{ borderColor: brandGreen, color: brandGreen }}>LOGO</div>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center pt-8 pb-16 px-6 relative overflow-hidden bg-[#FCFDFF]">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
          <img src="/logo.png" alt="Background Watermark" className="w-[85%] max-w-2xl h-auto object-contain" />
        </div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <Lock size={18} className="mb-2 text-black fill-black" />
          <h1 className="text-xl font-normal text-black tracking-tight">Create Account</h1>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col items-center w-full max-w-2xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full">
            
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-bold text-black ml-1">Name of the organization <span className="text-red-500">*</span></label>
              <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Hisgrace" className={inputClass} autoComplete="off" required disabled={isChecking} />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-bold text-black ml-1">Email <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className={inputClass} autoComplete="off" required disabled={isChecking} />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-bold text-black ml-1">Phone Number <span className="text-red-500">*</span></label>
              <div className={`flex w-full border border-gray-400 rounded-lg overflow-hidden focus-within:border-[#71b600] transition-colors bg-transparent ${isChecking ? 'opacity-60' : ''}`}>
                <div className="bg-gray-100 border-r border-gray-400 px-3 py-2 flex items-center justify-center text-sm text-slate-700 font-semibold select-none">+234</div>
                <input type="tel" value={phone} onChange={handlePhoneChange} placeholder="803 000 0000" className="w-full bg-transparent py-2 px-3 text-sm text-slate-800 placeholder:text-gray-400 outline-none" autoComplete="off" required disabled={isChecking} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-bold text-black ml-1">State <span className="text-red-500">*</span></label>
                <div onClick={() => !isChecking && setActiveModal('state')} className={`${triggerClass} ${isChecking ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  <span className={`truncate ${!selectedState && 'text-gray-400'}`}>{selectedState || "Select State"}</span>
                  <ChevronDown size={14} className="text-gray-500 shrink-0 ml-1" />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-bold text-black ml-1">LGA <span className="text-red-500">*</span></label>
                <div onClick={() => !isChecking && selectedState && setActiveModal('lga')} className={`${triggerClass} ${(!selectedState || isChecking) ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}>
                  <span className={`truncate ${!selectedLGA && 'text-gray-400'}`}>{selectedLGA || "Select LGA"}</span>
                  <ChevronDown size={14} className="text-gray-500 shrink-0 ml-1" />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-bold text-black ml-1">Password <span className="text-red-500">*</span></label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="****************" className={inputClass} autoComplete="new-password" required disabled={isChecking} />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-bold text-black ml-1">Confirm Password <span className="text-red-500">*</span></label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="****************" className={inputClass} autoComplete="new-password" required disabled={isChecking} />
            </div>

          </div>

          <div className="mt-10 w-full flex justify-center">
            <button 
              type="submit" 
              disabled={isChecking}
              className="bg-[#5e9900] hover:bg-[#4d7e00] disabled:bg-[#92b55b] disabled:cursor-not-allowed text-white font-black text-[11px] uppercase tracking-widest py-3 px-20 rounded-full transition-all active:scale-95 shadow-md flex items-center justify-center min-w-[220px]"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  VERIFYING...
                </>
              ) : (
                "CONTINUE"
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-slate-500 text-sm relative z-10">
          Already have an account? <Link href="/auth/login" className="text-[#5e9900] font-bold hover:underline">Login</Link>
        </p>
      </main>

      {/* SELECTION MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl flex flex-col max-h-[75vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-bold text-slate-800">Select {activeModal === 'state' ? 'State' : 'Local Government'}</h3>
              <button onClick={() => { setActiveModal(null); setSearchQuery(""); }} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><X size={18} /></button>
            </div>
            <div className="p-3 border-b border-gray-100 bg-gray-50/50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#5e9900] transition-colors" />
              </div>
            </div>
            <div className="overflow-y-auto p-2 flex-grow">
              {modalItems.length > 0 ? (
                <div className="space-y-1">
                  {modalItems.map((item, index) => {
                    const isSelected = activeModal === 'state' ? selectedState === item : selectedLGA === item;
                    return (
                      <button key={index} onClick={() => activeModal === 'state' ? handleSelectState(item) : handleSelectLGA(item)} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${isSelected ? 'bg-[#71b600]/10 text-[#609a00] font-bold' : 'text-slate-700 hover:bg-gray-100'}`}>
                        {item}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-400 text-sm">No results found.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ALERT MODAL */}
      <AlertModal 
        isOpen={customAlert.isOpen} 
        message={customAlert.message} 
        type={customAlert.type} 
        onClose={() => setCustomAlert(prev => ({ ...prev, isOpen: false }))} 
      />
    </div>
  );
}