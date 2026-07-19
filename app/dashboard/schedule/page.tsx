"use client";

import React, { useState, useEffect, Suspense } from "react";
import { 
  CalendarDays, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Loader2,
  ListTodo
} from "lucide-react";
import { useUser } from "../layout";

function ScheduleContent() {
  const { userData, refreshProfile } = useUser();
  const [isAcceptingVisit, setIsAcceptingVisit] = useState(false);
  
  // Interactive checklist state (saved in localStorage for persistence)
  const [checklist, setChecklist] = useState({
    licenses: false,
    equipment: false,
    space: false,
    records: false,
    safety: false
  });

  useEffect(() => {
    const saved = localStorage.getItem(`checklist_${userData?.id}`);
    if (saved) {
      try { setChecklist(JSON.parse(saved)); } catch (e) {}
    }
  }, [userData]);

  const toggleCheck = (key: keyof typeof checklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    localStorage.setItem(`checklist_${userData?.id}`, JSON.stringify(updated));
  };

  const visitDate = userData?.visit_date || "";
  const assessmentStatus = userData?.assessment_status;
  const isAssessmentApproved = assessmentStatus === "approved";
  const hasFinalizedReport = userData?.has_finalized_report === true;
  const isAccredited = hasFinalizedReport && assessmentStatus === "approved";
  const isAccreditationRejected = hasFinalizedReport && assessmentStatus === "rejected";

  const isAccreditationGoingOn = (assessmentStatus === "inspected" || assessmentStatus === "finalized" || hasFinalizedReport) && !isAccredited && !isAccreditationRejected;
  const isVisitationAccepted = (((userData?.visitation_accepted || false) && isAssessmentApproved) || isAccreditationGoingOn) && !isAccredited && !isAccreditationRejected;

  const handleAcceptVisitation = async () => {
    setIsAcceptingVisit(true);
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/visitation/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (response.ok) {
        alert("Visitation date accepted successfully!");
        await refreshProfile();
      } else {
        alert("Failed to accept visitation date.");
      }
    } catch (error) {
      console.error("Error accepting visit:", error);
      alert("Network error.");
    } finally {
      setIsAcceptingVisit(false);
    }
  };

  const handleAppealVisitation = () => {
    alert("Appeal request submitted. Our admin team will contact you shortly to reschedule.");
  };

  const formatVisitDate = (dateString: string) => {
    if (!dateString) return "Date pending...";
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-GB', options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      {/* Title Header */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Inspection Schedule</h1>
        <p className="text-sm text-gray-500">Manage inspection visit dates and check preparation guidelines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        
        {/* Scheduling Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarDays size={18} className="text-[#5D9C0E]" /> Inspection Date
            </h3>

            {isAccredited || isAccreditationRejected ? (
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-150 text-center">
                <CheckCircle size={32} className="text-[#5D9C0E] mx-auto mb-2" />
                <h4 className="font-bold text-gray-800">Inspection Concluded</h4>
                <p className="text-xs text-gray-400 mt-1">
                  The physical inspection visit has been carried out on {formatVisitDate(visitDate)}.
                </p>
              </div>
            ) : isVisitationAccepted ? (
              <div className="bg-[#FAFCF8] p-6 rounded-2xl border border-[#5D9C0E]/20 text-center">
                <div className="w-12 h-12 bg-[#EEF6DF] text-[#5D9C0E] rounded-full flex items-center justify-center mx-auto mb-3">
                  <CalendarDays size={24} />
                </div>
                <h4 className="font-bold text-gray-800 text-[15px]">Visitation Confirmed</h4>
                <p className="text-lg font-black text-[#5D9C0E] mt-2 mb-1">{formatVisitDate(visitDate)}</p>
                <p className="text-xs text-gray-400">
                  Please ensure your facility is fully prepared by reviewing the checklist.
                </p>
              </div>
            ) : isAssessmentApproved && visitDate ? (
              <div className="bg-white p-6 rounded-2xl border border-[#5D9C0E]/30 text-center">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle size={24} />
                </div>
                <h4 className="font-bold text-gray-800">Proposed Inspection Date</h4>
                <p className="text-lg font-black text-gray-800 mt-2 mb-4">{formatVisitDate(visitDate)}</p>
                
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={handleAppealVisitation}
                    disabled={isAcceptingVisit}
                    className="border border-[#F05252] text-[#F05252] hover:bg-red-50 font-bold px-6 py-2 rounded-full text-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Appeal Date
                  </button>
                  <button 
                    onClick={handleAcceptVisitation}
                    disabled={isAcceptingVisit}
                    className="bg-[#5D9C0E] text-white hover:bg-[#4a7c0b] font-bold px-8 py-2 rounded-full text-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isAcceptingVisit ? <Loader2 size={14} className="animate-spin" /> : "Accept Date"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-150 text-center text-xs text-gray-400">
                <CalendarDays size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="font-medium">No inspection scheduled yet</p>
                <p className="mt-1 leading-relaxed">
                  Your inspection visit date will be unlocked and proposed here once your detailed Assessment Form is approved by administrators.
                </p>
              </div>
            )}
          </div>

          {/* Interactive Preparation Checklist */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ListTodo size={18} className="text-[#5D9C0E]" /> Pre-Inspection Preparation
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer select-none border border-gray-50">
                <input 
                  type="checkbox" 
                  checked={checklist.licenses} 
                  onChange={() => toggleCheck("licenses")}
                  className="w-4 h-4 rounded text-[#5D9C0E] focus:ring-[#5D9C0E] border-gray-300 mt-0.5 accent-[#5D9C0E]" 
                />
                <div>
                  <p className="text-xs font-bold text-gray-800">Compile Professional Roster Licenses</p>
                  <p className="text-[10px] text-gray-400">Gather active MRTB practitioner licenses for all key clinical staff.</p>
                </div>
              </label>

              <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer select-none border border-gray-50">
                <input 
                  type="checkbox" 
                  checked={checklist.equipment} 
                  onChange={() => toggleCheck("equipment")}
                  className="w-4 h-4 rounded text-[#5D9C0E] focus:ring-[#5D9C0E] border-gray-300 mt-0.5 accent-[#5D9C0E]" 
                />
                <div>
                  <p className="text-xs font-bold text-gray-800">Calibrate & Clean Clinical Equipment</p>
                  <p className="text-[10px] text-gray-400">Ensure all major therapy equipment listed on your assessment form is operational.</p>
                </div>
              </label>

              <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer select-none border border-gray-50">
                <input 
                  type="checkbox" 
                  checked={checklist.space} 
                  onChange={() => toggleCheck("space")}
                  className="w-4 h-4 rounded text-[#5D9C0E] focus:ring-[#5D9C0E] border-gray-300 mt-0.5 accent-[#5D9C0E]" 
                />
                <div>
                  <p className="text-xs font-bold text-gray-800">Organize Consultation Rooms & Layout</p>
                  <p className="text-[10px] text-gray-400">Verify waiting area spacing, treatment cubicles, and privacy screens meet minimum dimensions.</p>
                </div>
              </label>

              <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer select-none border border-gray-50">
                <input 
                  type="checkbox" 
                  checked={checklist.records} 
                  onChange={() => toggleCheck("records")}
                  className="w-4 h-4 rounded text-[#5D9C0E] focus:ring-[#5D9C0E] border-gray-300 mt-0.5 accent-[#5D9C0E]" 
                />
                <div>
                  <p className="text-xs font-bold text-gray-800">Review Patient Logging Protocols</p>
                  <p className="text-[10px] text-gray-400">Have empty/redacted patient record card samples ready to demonstrate logging workflows.</p>
                </div>
              </label>

              <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer select-none border border-gray-50">
                <input 
                  type="checkbox" 
                  checked={checklist.safety} 
                  onChange={() => toggleCheck("safety")}
                  className="w-4 h-4 rounded text-[#5D9C0E] focus:ring-[#5D9C0E] border-gray-300 mt-0.5 accent-[#5D9C0E]" 
                />
                <div>
                  <p className="text-xs font-bold text-gray-800">Ensure Safety Protocols are Visual</p>
                  <p className="text-[10px] text-gray-400">Check that fire extinguishers are unexpired, first aid is stocked, and hazard signs are visible.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Contact/Info Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-xs">
          <div className="bg-[#EEF6DF] text-[#5D9C0E] p-2.5 rounded-2xl w-fit mb-4">
            <HelpCircle size={20} />
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Visitation Guidelines</h3>
          <ul className="space-y-3 text-gray-500 leading-relaxed list-disc pl-4 marker:text-[#5D9C0E]">
            <li>An MRTB-designated inspection panel consisting of board officers and senior regional practitioners will conduct the audit.</li>
            <li>The exercise usually lasts 1 to 2 hours per clinical discipline.</li>
            <li>Incomplete checklists or absent key clinicians during the visit may affect the final accreditation report score.</li>
          </ul>
        </div>

      </div>
    </>
  );
}

export default function SchedulePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
