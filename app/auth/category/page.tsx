"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import AlertModal from '../../components/AlertModal';

export default function CategoryPage() {
  const brandGreen = "#066936"; 

  const [logoError, setLogoError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState<{ isOpen: boolean; message: string; type?: 'success' | 'error' | 'warning' }>({ isOpen: false, message: "" });

  // --- Profession State ---
  const [professionOpen, setProfessionOpen] = useState(false);
  const [profession, setProfession] = useState("");
  const professionsList = [
    "Physiotherapy",
    "Speech Therapy",
    "Audiology",
    "Occupational Therapy",
    "Prosthetics and Orthotics"
  ];

  // --- Category State ---
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = [
    "Government - Academics",
    "Private - Academics",
    "Government - Clinicals",
    "Private - Clinicals"
  ];

  // --- Subcategory State ---
  const [tierOpen, setTierOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("");

  // Dynamic cascading logic exactly like the banner
  const getSubcategories = () => {
    if (!selectedCategory) return [];
    
    if (selectedCategory.includes('Academics')) {
      return [
        "Diploma - Resource Verification",
        "Diploma - Accreditation",
        "Bachelor - Resource Verification",
        "Bachelor - Accreditation",
        "Doctor - Resource Verification",
        "Doctor - Accreditation"
      ];
    }

    if (selectedCategory.includes('Clinicals')) {
      if (selectedCategory.includes('Private')) {
        return [
          "Safe Practice - Hospital",
          "Safe Practice - Private Clinic",
          "Internship - Hospital",
          "Internship - Private Clinic"
        ];
      }
      return [
        "Safe Practice - Hospital",
        "Safe Practice - Clinic",
        "Internship - Hospital",
        "Internship - Clinic"
      ];
    }
    
    return [];
  };

  const currentSubcategories = getSubcategories();

  // Reset the subcategory if the parent category changes
  useEffect(() => {
    setSelectedTier("");
  }, [selectedCategory]);

  // Dropdown toggle helpers (ensures only one is open at a time)
  const toggleProfession = () => {
    if (loading) return;
    setProfessionOpen(!professionOpen);
    setCategoryOpen(false);
    setTierOpen(false);
  };

  const toggleCategory = () => {
    if (loading) return;
    setCategoryOpen(!categoryOpen);
    setProfessionOpen(false);
    setTierOpen(false);
  };

  const toggleTier = () => {
    if (loading) return;
    setTierOpen(!tierOpen);
    setCategoryOpen(false);
    setProfessionOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || !selectedTier || !profession) {
      setCustomAlert({ isOpen: true, message: "Please fill in all fields.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const existingDataStr = localStorage.getItem('pendingRegistration');
      if (!existingDataStr) {
        setCustomAlert({ isOpen: true, message: "Registration data missing. Please go back to the first step.", type: "error" });
        setLoading(false);
        return;
      }

      // Securely parsing local storage to prevent crash from data poisoning
      const existingData = JSON.parse(existingDataStr);

      // Splitting UI strings into clean parameters for the backend update
      const [sector, field] = selectedCategory.split(' - ');
      const [program, endpoint] = selectedTier.split(' - ');

      const finalPayload = {
        ...existingData,
        profession: profession,
        // Sending the parsed data for the updated backend structure
        sector: sector?.toLowerCase(),       
        field: field?.toLowerCase(),         
        program: program?.toLowerCase(),     
        endpoint: endpoint?.toLowerCase(),
        // Preserving the old payload keys in case the backend needs a transition period
        category: selectedCategory,
        sub_category: selectedTier 
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(finalPayload)
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('userEmailForOTP', finalPayload.email);
        localStorage.removeItem('pendingRegistration');
        setIsSubmitted(true);
      } else {
        setCustomAlert({ isOpen: true, message: `Registration failed: ${result.message || "Please check your information."}`, type: "error" });
      }
    } catch (error) {
      console.error("Network Error:", error);
      setCustomAlert({ isOpen: true, message: "Could not connect to the server. Please check your network connection and try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Restored the lemon/green focus border
  const fieldBase = "w-[82%] max-w-[340px] bg-white border border-gray-300 rounded-lg py-1.5 px-4 text-sm text-slate-700 outline-none focus:border-[#71b600] transition-all flex items-center justify-between cursor-pointer";

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-800">
      
      {/* 1. HEADER */}
      <header className="relative z-30 flex items-center justify-center py-4 px-6 bg-white shadow-md">
        <Link href="/auth/register" className="absolute left-6 md:left-12 p-2 hover:bg-slate-50 rounded-full">
          <ArrowLeft size={18} className="text-slate-900" />
        </Link>
        <div className="w-10 h-10 relative">
          {!logoError ? (
            <img src="/logo.png" alt="Logo" className="object-contain w-full h-full" onError={() => setLogoError(true)} />
          ) : (
            <div className="w-full h-full rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-center p-1" style={{ borderColor: brandGreen, color: brandGreen }}>LOGO</div>
          )}
        </div>
      </header>

      {/* 2. MAIN SECTION */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-10 px-6 relative overflow-hidden bg-[#FCFDFF]">
        
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
          <img src="/logo.png" alt="Watermark" className="w-[80%] max-w-xl object-contain" />
        </div>

        <h1 className="text-lg font-normal text-slate-900 mb-6 relative z-10 tracking-tight">Select Your Category</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-[580px] space-y-3 relative z-10 flex flex-col items-center">
      
          {/* PROFESSION CARD - Restored #96C93D background & slate-900 labels */}
          <div className="w-full bg-[#96C93D] rounded-2xl py-4 px-6 flex flex-col items-center justify-center shadow-sm relative">
            <div className="w-[82%] max-w-[340px] text-left">
              <label className="text-[11px] font-bold text-slate-900 block leading-tight">Profession</label>
            </div>
            <div className="mt-1 w-full flex justify-center">
               <div 
                onClick={toggleProfession}
                className={`${fieldBase} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={profession ? "text-slate-800" : "text-slate-400"}>
                  {profession || "Select Profession"}
                </span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${professionOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {professionOpen && (
              <div className="absolute top-[90%] z-40 w-[82%] max-w-[340px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {professionsList.map((item) => (
                  <div 
                    key={item}
                    onClick={() => {setProfession(item); setProfessionOpen(false);}}
                    className="px-4 py-2.5 text-sm text-slate-700 hover:bg-[#96C93D]/10 hover:text-[#066936] cursor-pointer border-b border-gray-50 last:border-none"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CATEGORY CARD */}
          <div className="w-full bg-[#96C93D] rounded-2xl py-4 px-6 flex flex-col items-center justify-center shadow-sm relative">
            <div className="w-[82%] max-w-[340px] text-left">
              <label className="text-[11px] font-bold text-slate-900 block leading-tight">Category</label>
            </div>
            <div className="mt-1 w-full flex justify-center">
              <div 
                onClick={toggleCategory}
                className={`${fieldBase} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={selectedCategory ? "text-slate-800" : "text-slate-400"}>
                  {selectedCategory || "Select Category"}
                </span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {categoryOpen && (
              <div className="absolute top-[90%] z-40 w-[82%] max-w-[340px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {categories.map((item) => (
                  <div 
                    key={item}
                    onClick={() => {setSelectedCategory(item); setCategoryOpen(false);}}
                    className="px-4 py-2.5 text-sm text-slate-700 hover:bg-[#96C93D]/10 hover:text-[#066936] cursor-pointer border-b border-gray-50 last:border-none"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBCATEGORY CARD */}
          <div className="w-full bg-[#96C93D] rounded-2xl py-4 px-6 flex flex-col items-center justify-center shadow-sm relative">
            <div className="w-[82%] max-w-[340px] text-left">
              <label className="text-[11px] font-bold text-slate-900 block leading-tight">Subcategory</label>
            </div>
            <div className="mt-1 w-full flex justify-center">
              <div 
                onClick={toggleTier}
                className={`${fieldBase} ${!selectedCategory || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={selectedTier ? "text-slate-800" : "text-slate-400"}>
                  {selectedTier || (selectedCategory ? "Select Subcategory" : "Select a Category first")}
                </span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${tierOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {tierOpen && selectedCategory && (
              <div className="absolute top-[90%] z-40 w-[82%] max-w-[340px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {currentSubcategories.map((item) => (
                  <div 
                    key={item}
                    onClick={() => {setSelectedTier(item); setTierOpen(false);}}
                    className="px-4 py-2.5 text-sm text-slate-700 hover:bg-[#96C93D]/10 hover:text-[#066936] cursor-pointer border-b border-gray-50 last:border-none"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Restored the #71b600 button colors */}
          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#71b600] hover:bg-[#629d00] text-white font-black text-[11px] uppercase tracking-widest py-3 px-24 rounded-full shadow-md active:scale-95 transition-all flex items-center justify-center min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  SUBMITTING...
                </>
              ) : "SUBMIT"}
            </button>
          </div>
        </form>

        {/* 3. SUCCESS ALERT MODAL */}
        {isSubmitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[1px] animate-in fade-in duration-200 px-6">
            <div className="bg-white w-full max-w-[280px] p-6 rounded-xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
              <div className="mb-3">
                <div className="bg-[#4CAF50] p-1.5 rounded-lg">
                   <CheckCircle2 size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-[#4CAF50] text-[13px] font-medium mb-8 text-center">
                  Account created successfully
              </h2>
              <Link 
                href="/auth/otp" 
                className="w-full py-2 px-4 border border-slate-300 rounded-full text-center font-bold text-black text-[11px] hover:bg-slate-50 transition-colors"
               >
                Continue to Verification
              </Link>
            </div>
          </div>
        )}
      </main>

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