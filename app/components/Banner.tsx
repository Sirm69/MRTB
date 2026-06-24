"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, ChevronDown, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Interfaces for TypeScript ---
interface DropdownOption {
  main: string;
  sub: string;
}

interface CustomDropdownProps {
  label: string;
  options: DropdownOption[];
  placeholder: string;
  value?: string | null;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for Dropdowns
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  
  // State for Backend Submission
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Brand Color Palette
  const deeperGreen = "#5e9900";
  const accentYellow = "#d8f22f";

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setSelectedSubcategory(null); 
  };

  const getSubcategories = (): DropdownOption[] => {
    if (!selectedCategory) return [];

    if (selectedCategory.includes('Academics')) {
      return [
        { main: "Diploma", sub: "Resource Verification" },
        { main: "Diploma", sub: "Accreditation" },
        { main: "Bachelor", sub: "Resource Verification" },
        { main: "Bachelor", sub: "Accreditation" },
        { main: "Doctor", sub: "Resource Verification" },
        { main: "Doctor", sub: "Accreditation" }
      ];
    }

    if (selectedCategory.includes('Clinicals')) {
      if (selectedCategory.includes('Private')) {
        return [
          { main: "Safe Practice", sub: "Hospital" },
          { main: "Safe Practice", sub: "Private Clinic" },
          { main: "Internship", sub: "Hospital" },
          { main: "Internship", sub: "Private Clinic" }
        ];
      }
      return [
        { main: "Safe Practice", sub: "Hospital" },
        { main: "Safe Practice", sub: "Clinic" },
        { main: "Internship", sub: "Hospital" },
        { main: "Internship", sub: "Clinic" }
      ];
    }
    
    return [];
  };

  // --- BACKEND SUBMISSION LOGIC ---
  const handleDownload = async () => {
    if (!selectedCategory || !selectedSubcategory) return;
    
    setIsDownloading(true);

    // Split the UI strings into discrete backend parameters
    const [sector, field] = selectedCategory.split(' - ');
    const [program, endpoint] = selectedSubcategory.split(' - ');

    // The clean payload your backend will receive
    const payload = {
      sector: sector.toLowerCase(),       
      field: field.toLowerCase(),         
      program: program.toLowerCase(),     
      endpoint: endpoint.toLowerCase()    
    };

    console.log("Payload sending to backend:", payload);

    try {
      const response = await fetch('/api/v1/guidelines/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the PDF');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `guideline-${payload.sector}-${payload.program}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setIsModalOpen(false);
      setSelectedCategory(null);
      setSelectedSubcategory(null);

    } catch (error) {
      console.error("Error downloading guideline:", error);
      alert("There was an error downloading your guideline. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <section className="relative w-full h-[75vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] flex flex-col justify-center items-center overflow-hidden font-sans">
        <div 
          className="absolute inset-0 bg-cover bg-[20%_center] md:bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url('/hero-rehab.jpg')` }}
        />
        <div className="absolute inset-0 bg-[#163302]/85"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-[1000px] mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-[1.3] mb-6 tracking-tight uppercase">
            ADVANCING THE FUTURE OF <br className="hidden md:block" />
            MEDICAL REHABILITATION IN NIGERIA
          </h1>
          <p className="text-[11px] md:text-[14px] font-medium text-white/80 leading-relaxed max-w-[700px] mb-10 tracking-widest uppercase">
            WE ACCREDIT AND REGULATE INSTITUTIONS OFFERING MEDICA REHABILITATION SERVICES<br className="hidden md:block" />
            TO ENSURE THEY MEET THE HIGHEST GLOBAL STANDARDS OF PATIENT<br className="hidden md:block" />
            SAFETY AND QUALITY CARE.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <Link 
              href="/auth/register" 
              style={{ backgroundColor: deeperGreen }}
              className="text-white font-bold text-[11px] md:text-[14px] py-3.5 md:py-4 px-6 md:px-20 rounded-full transition-all shadow-lg hover:shadow-xl hover:brightness-110 hover:scale-[1.02] active:scale-95 w-[70%] max-w-[280px] md:w-auto md:min-w-[320px] tracking-widest uppercase flex items-center justify-center whitespace-nowrap"
            >
              CREATE ACCOUNT
            </Link>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/10 text-white/80 py-3.5 px-6 md:py-2.5 md:px-10 rounded-full text-[11px] md:text-[12px] transition-all font-medium hover:scale-[1.02] hover:brightness-110 active:scale-95 w-[70%] max-w-[280px] md:w-auto md:min-w-[320px] whitespace-nowrap"
            >
              DOWNLOAD GUIDELINE <Download size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* MOBILE BANNER - Fixed the /admin/login paths right here 👇 */}
      <div style={{ backgroundColor: accentYellow }} className="block md:hidden py-3 px-4 shadow-inner relative z-20">
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-[#1b1e15]">
          <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-widest">Entity</Link>
          <span className="text-[#1b1e15]/30 font-light text-sm">|</span>
          <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-widest">Admin</Link>
          <span className="text-[#1b1e15]/30 font-light text-sm">|</span>
          <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-widest">Field Team</Link>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isDownloading && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-white w-full max-w-lg rounded-[24px] p-5 md:p-7 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                disabled={isDownloading}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </button>

              <h2 className="text-sm md:text-base font-bold text-slate-700 text-center mb-5 px-2 leading-snug">
                To download your guideline, kindly choose the right category.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-3 mb-6">
                <CustomDropdown 
                  label="Profession Category" 
                  placeholder="Choose category..."
                  options={[
                    { main: "Government", sub: "Academics" },
                    { main: "Private", sub: "Academics" },
                    { main: "Government", sub: "Clinicals" },
                    { main: "Private", sub: "Clinicals" },
                  ]}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  disabled={isDownloading}
                />
                <CustomDropdown 
                  label="Subcategory" 
                  placeholder={selectedCategory ? "Choose subcategory..." : "Select category first..."}
                  options={getSubcategories()}
                  value={selectedSubcategory}
                  onChange={setSelectedSubcategory}
                  disabled={!selectedCategory || isDownloading}
                />
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={handleDownload}
                  disabled={!selectedCategory || !selectedSubcategory || isDownloading}
                  style={{ backgroundColor: deeperGreen }}
                  className="hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[12px] py-2.5 px-6 rounded-full flex items-center gap-2 transition-all shadow-md active:scale-95 uppercase tracking-wide min-w-[200px] justify-center"
                >
                  {isDownloading ? (
                    <>Processing <Loader2 size={13} className="animate-spin" strokeWidth={2.5} /></>
                  ) : (
                    <>Download Guideline <Download size={13} strokeWidth={2.5} /></>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const CustomDropdown = ({ label, options, placeholder, value, onChange, disabled }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const displayValue = value || null;

  return (
    <div className={`flex flex-col gap-1 relative w-full ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-wider">{label}</label>
      <button 
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg border transition-all text-left ${
          isOpen ? 'border-[#5e9900] bg-[#f9fdf4]' : 'border-slate-100 bg-[#f9fdf4]/40'
        }`}
      >
        <span className={`text-[12px] truncate ${displayValue ? 'text-slate-700 font-semibold' : 'text-slate-300'}`}>
          {displayValue || placeholder}
        </span>
        <ChevronDown size={12} className={`text-[#5e9900] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="absolute top-[100%] left-0 w-full mt-1 bg-white border border-slate-100 shadow-xl rounded-lg z-[160] overflow-hidden max-h-60 overflow-y-auto"
          >
            {options.map((opt: DropdownOption, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (onChange) onChange(`${opt.main} - ${opt.sub}`);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-[#f9fdf4] transition-colors border-b border-slate-50 last:border-none"
              >
                <span className="text-[11px] text-slate-700 font-bold">{opt.main}</span>
                <span className="text-[11px] text-slate-400 font-light ml-1.5">— {opt.sub}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Banner;