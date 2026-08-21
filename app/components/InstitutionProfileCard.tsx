"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  Copy, 
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface InstitutionProfile {
  id?: number;
  institution_name: string;
  institution_type: string;
  location: string;
  accreditation_number: string;
  accreditation_status: string;
  date_of_accreditation: string;
  accreditation_expiry_date: string;
  scope_of_accreditation: string;
  has_certificate?: boolean;
  profession?: string;
  state?: string;
}

interface InstitutionProfileCardProps {
  institution: InstitutionProfile;
}

export default function InstitutionProfileCard({ institution }: InstitutionProfileCardProps) {
  const [copied, setCopied] = useState(false);

  const isAccredited = 
    institution.has_certificate === true ||
    (institution.accreditation_status.toLowerCase().includes("accredited") && 
     !institution.accreditation_status.toLowerCase().includes("not") &&
     !institution.accreditation_status.toLowerCase().includes("pending"));

  const hasValidAccNumber = 
    institution.accreditation_number && 
    !institution.accreditation_number.toLowerCase().includes("n/a") &&
    !institution.accreditation_number.toLowerCase().includes("not");

  const handleCopyAccNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasValidAccNumber) return;
    navigator.clipboard.writeText(institution.accreditation_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white rounded-2xl border ${
      isAccredited ? "border-slate-200/90 hover:border-[#5e9900]/40" : "border-amber-200/70 hover:border-amber-300"
    } shadow-xs hover:shadow-md transition-all duration-200 p-5 sm:p-6 space-y-4 text-left`}>
      
      {/* Header with Title & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${
              isAccredited ? "bg-[#EEF6DF] text-[#066936]" : "bg-amber-100/70 text-amber-800"
            } flex items-center justify-center shrink-0`}>
              <Building2 size={15} />
            </div>
            <span className={`text-[11px] font-semibold ${
              isAccredited ? "text-[#066936]" : "text-amber-800"
            } uppercase tracking-wider`}>
              {institution.institution_type}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
            {institution.institution_name}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span>{institution.location}</span>
          </p>
        </div>

        {/* Accreditation Status Badge */}
        <div className="shrink-0 self-start">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
            isAccredited 
              ? "bg-[#EEF6DF] text-[#066936] border-[#CDE1B4]" 
              : "bg-amber-50 text-amber-900 border-amber-300/80"
          }`}>
            {isAccredited ? <CheckCircle2 size={13} /> : <AlertCircle size={13} className="text-amber-600" />}
            <span>{isAccredited ? institution.accreditation_status : "Not Accredited"}</span>
          </span>
        </div>
      </div>

      {/* Structured 8-Criteria Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        
        {/* 1. Accreditation Number */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Accreditation Number
          </span>
          <div className="flex items-center justify-between gap-1.5">
            <span className={`font-mono font-bold text-xs ${
              hasValidAccNumber ? "text-slate-800" : "text-slate-400 font-normal italic"
            }`}>
              {institution.accreditation_number}
            </span>
            {hasValidAccNumber && (
              <button
                onClick={handleCopyAccNumber}
                title="Copy Accreditation No."
                className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer"
              >
                {copied ? <Check size={13} className="text-[#5e9900]" /> : <Copy size={13} />}
              </button>
            )}
          </div>
        </div>

        {/* 2. Date of Accreditation */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Date of Accreditation
          </span>
          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
            <Calendar size={13} className={isAccredited ? "text-[#5e9900] shrink-0" : "text-slate-400 shrink-0"} />
            <span className={isAccredited ? "text-slate-800" : "text-slate-400 font-normal italic"}>
              {institution.date_of_accreditation}
            </span>
          </div>
        </div>

        {/* 3. Accreditation Expiry Date */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Accreditation Expiry Date
          </span>
          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
            <Clock size={13} className={isAccredited ? "text-[#066936] shrink-0" : "text-slate-400 shrink-0"} />
            <span className={isAccredited ? "text-slate-800" : "text-slate-400 font-normal italic"}>
              {institution.accreditation_expiry_date}
            </span>
          </div>
        </div>

      </div>

      {/* Scope / Category of Accreditation */}
      <div className={`rounded-xl p-3.5 border flex items-start gap-2.5 text-xs ${
        isAccredited 
          ? "bg-[#FAFCF8] border-[#EEF6DF]" 
          : "bg-slate-50 border-slate-100"
      }`}>
        <Tag size={15} className={isAccredited ? "text-[#5e9900] shrink-0 mt-0.5" : "text-slate-400 shrink-0 mt-0.5"} />
        <div>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
            Scope / Category of Registration
          </span>
          <p className="text-slate-800 font-medium mt-0.5 leading-relaxed">
            {institution.scope_of_accreditation}
          </p>
        </div>
      </div>

    </div>
  );
}
