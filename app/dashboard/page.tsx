"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  X, 
  LogOut, 
  Loader2, 
  FileText, 
  Award,
  ArrowRight,
  CreditCard,
  Calendar,
  FolderHeart
} from 'lucide-react';
import ActivitiesBox from "../components/ActivitiesBox";
import { useMobileMenu, useUser } from "./layout";

// Helper function to map database profession names to our URL folder names
const getProfessionSlug = (profession?: string) => {
  if (!profession) return "physiotherapy"; // Default fallback
  const lowerProf = profession.toLowerCase();
  
  if (lowerProf.includes("speech")) return "speech-therapy";
  if (lowerProf.includes("audiology")) return "audiology";
  if (lowerProf.includes("occupational")) return "occupational-therapy";
  if (lowerProf.includes("prosthetics") || lowerProf.includes("orthotics")) return "prosthetics-orthotics";
  
  return "physiotherapy";
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsMobileMenuOpen } = useMobileMenu();
  const { userData, refreshProfile, paidRegistration, paidLogistics } = useUser();

  // Dialog & scheduling states
  const [showAlert, setShowAlert] = useState(true);
  const [isAcceptingVisit, setIsAcceptingVisit] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Status & Phase logic
  const rawStatus = userData?.status || searchParams.get("status");
  const isApproved = rawStatus === "approved";
  const isRejected = rawStatus === "rejected"; 
  const isUnderReview = rawStatus === "under_review" || rawStatus === "recommended_accept" || rawStatus === "recommended_reject";

  const assessmentStatus = userData?.assessment_status;
  const isAssessmentSubmitted = assessmentStatus !== null && assessmentStatus !== undefined;
  
  const hasFinalizedReport = userData?.has_finalized_report === true;

  // New Final Accreditation States
  const isAccredited = hasFinalizedReport && assessmentStatus === "approved";
  const isAccreditationRejected = hasFinalizedReport && assessmentStatus === "rejected";

  const isAssessmentApproved = assessmentStatus === "approved" && !hasFinalizedReport;
  const isAssessmentRejected = assessmentStatus === "rejected" && !hasFinalizedReport; 
  
  const isAccreditationGoingOn = (assessmentStatus === "inspected" || assessmentStatus === "finalized" || hasFinalizedReport) && !isAccredited && !isAccreditationRejected;
  const isVisitationAccepted = (((userData?.visitation_accepted || false) && isAssessmentApproved) || isAccreditationGoingOn) && !isAccredited && !isAccreditationRejected;
  const isRescheduled = (userData?.is_rescheduled || false) && isAssessmentApproved && !isAccreditationGoingOn && !isAccredited && !isAccreditationRejected;

  const registrationCost = userData?.cost_estimate || 0;
  const logisticsCost = userData?.logistics_fee || 0;
  const totalCost = registrationCost + logisticsCost;
  const visitDate = userData?.visit_date || "";
  const isFullyPaid = paidRegistration && paidLogistics;

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    router.push('/auth/login');
  };

  const handleRefresh = async () => {
    await refreshProfile();
  };

  const formatVisitDate = (dateString: string) => {
    if (!dateString) return "Date pending...";
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-GB', options) + ".";
    } catch (error) {
      return dateString;
    }
  };

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

  const handleDownloadReport = () => {
    if (!userData) return;
    window.open(`/report/print?id=${userData.id}`, '_blank');
  };

  // Build the display activities array dynamically based on live states
  const displayActivities: any[] = [];

  displayActivities.push({
    id: 1,
    action: "Account Creation",
    category: userData?.profession || "Facility Profile",
    date: "August 1, 2025",
    status: "Successful"
  });

  const isPreassessmentSubmitted = !!(userData?.cost_estimate || rawStatus !== "pending");
  
  // Calculate progress percentage and text
  let progressPercentage = 15; // Step 1: Account Created
  let progressText = "Account Created";
  
  if (isPreassessmentSubmitted) {
    progressPercentage = 30;
    progressText = "Pre-assessment Submitted";
  }
  if (isFullyPaid) {
    progressPercentage = 45;
    progressText = "Fees Paid";
  }
  if (isAssessmentSubmitted) {
    progressPercentage = 60;
    progressText = "Assessment Submitted";
  }
  if (isVisitationAccepted) {
    progressPercentage = 75;
    progressText = "Visitation Confirmed";
  }
  if (isAccreditationGoingOn) {
    progressPercentage = 90;
    progressText = "Inspection Conducted";
  }
  if (isAccredited || isAccreditationRejected) {
    progressPercentage = 100;
    progressText = isAccredited ? "Accreditation Granted" : "Accreditation Rejected";
  }
  displayActivities.push({
    id: 2,
    action: "Pre-assessment form Submitted",
    category: userData?.category || "-",
    date: isPreassessmentSubmitted ? (userData?.visit_date ? new Date(userData.visit_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })) : "-",
    status: isPreassessmentSubmitted ? "Successful" : "-"
  });

  let amountPaidVal = 0;
  if (paidRegistration) amountPaidVal += registrationCost;
  if (paidLogistics) amountPaidVal += logisticsCost;
  const hasAnyPayment = paidRegistration || paidLogistics;
  displayActivities.push({
    id: 3,
    action: "Payment",
    category: hasAnyPayment ? `₦${amountPaidVal.toLocaleString()}` : "₦0",
    date: hasAnyPayment ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "-",
    status: isFullyPaid ? "Successful" : hasAnyPayment ? "Partially Paid" : "-"
  });

  displayActivities.push({
    id: 4,
    action: "Assessment form Submitted",
    category: isAssessmentSubmitted ? userData?.category : "-",
    date: isAssessmentSubmitted ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "-",
    status: isAssessmentSubmitted 
      ? (assessmentStatus === "approved" ? "Approved" : assessmentStatus === "rejected" ? "Rejected" : "Under Review") 
      : "-"
  });

  const hasAcceptedVisitDate = userData?.visitation_accepted || isAccreditationGoingOn || isAccredited || isAccreditationRejected;
  displayActivities.push({
    id: 5,
    action: "Visitation Date Accepted",
    category: hasAcceptedVisitDate ? (userData?.visit_date ? new Date(userData.visit_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "Scheduled") : "-",
    date: hasAcceptedVisitDate ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "-",
    status: hasAcceptedVisitDate ? "Successful" : (isRescheduled ? "Rescheduled" : "-")
  });

  const isVisitationCompleted = hasFinalizedReport || isAccredited || isAccreditationRejected;
  displayActivities.push({
    id: 6,
    action: "Visitation Exercise",
    category: isVisitationCompleted ? "Completed" : "-",
    date: isVisitationCompleted ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "-",
    status: isVisitationCompleted ? "Successful" : "-"
  });

  const hasDecision = isAccredited || isAccreditationRejected;
  displayActivities.push({
    id: 7,
    action: "Accreditation Decision",
    category: hasDecision ? (isAccredited ? "Accredited" : "Rejected") : "-",
    date: hasDecision ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' }) : "-",
    status: isAccredited ? "Granted" : isAccreditationRejected ? "Rejected" : "-"
  });

  const isAcademic = 
    userData?.field?.toLowerCase() === "academics" || 
    userData?.category?.toLowerCase().includes("academic");

  const categorySlug = isAcademic ? "academic" : "clinical";
  const professionSlug = getProfessionSlug(userData?.profession);

  const preAssessmentUrl = isAcademic ? "/forms/preassessment/academic" : "/forms/preassessment/clinical";
  const assessmentUrl = `/forms/assessment/${professionSlug}/${categorySlug}`;

  let alertMessage = "Please kindly complete the Pre-assessment form";
  if (isAccredited) alertMessage = "🎉 Congratulations! Your facility has been successfully accredited by the Medical Rehabilitation Therapists Board of Nigeria (MRTB).";
  else if (isAccreditationRejected) alertMessage = "❌ We regret to inform you that your accreditation application has been evaluated and rejected by the Board. Please review the findings.";
  else if (isAccreditationGoingOn) alertMessage = "Accreditation in progress! Your visitation summary report has been submitted and is under evaluation.";
  else if (isRescheduled && !isVisitationAccepted) alertMessage = "🚨 Your visitation date has been rescheduled! Please review and accept the new date.";
  else if (isVisitationAccepted) alertMessage = "Visitation accepted! Please ensure all preparations are in place for the inspection.";
  else if (isAssessmentApproved) alertMessage = "Your Assessment form has been approved! Please review and accept your scheduled inspection date.";
  else if (isAssessmentRejected) alertMessage = "Your Assessment form was rejected. Please review any feedback and click 'Appeal Assessment' to resubmit.";
  else if (isAssessmentSubmitted) alertMessage = "Your Assessment form has been submitted successfully and is currently under review.";
  else if (isApproved && !isFullyPaid) alertMessage = "Your application is Approved! Please proceed to complete your payments.";
  else if (isApproved && isFullyPaid) alertMessage = "Payments successful! You may now proceed to the Assessment Form.";
  else if (isRejected) alertMessage = "Your Pre-assessment application was rejected. Please click 'Appeal Application' to update and resubmit your details.";
  else if (isUnderReview) alertMessage = "Your pre-assessment form is under review, come back later.";

  return (
    <>
      {/* TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start w-full gap-6 md:gap-0 relative mb-6 md:mb-2">
        <div className="flex items-center gap-4 mt-1 w-full md:w-auto">
          <button className="md:hidden bg-[#5D9C0E] text-white p-2 rounded-md hover:bg-[#528a0c] transition shrink-0" onClick={() => setIsMobileMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
          </button>
          <h1 className="text-[24px] sm:text-[26px] font-bold text-gray-800 tracking-wide">Your Dashboard</h1>
          <button onClick={handleRefresh} className="ml-auto md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-0 bg-[#e4f0d8] text-[#5D9C0E] p-2.5 rounded-full hover:bg-[#d6e8c6] transition shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          </button>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-[260px]">
          {/* USER PILL & LOGOUT BUTTON ROW */}
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 bg-white rounded-full py-1.5 pl-2 pr-4 flex items-center justify-between shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-[#5D9C0E] p-2 rounded-full text-white shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-gray-800 text-xs truncate max-w-[100px]">{userData?.name || "Loading..."}</p>
                  <p className="text-[10px] text-gray-400 truncate max-w-[100px]">{userData?.category || "Category"}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="bg-red-50 text-red-500 p-2.5 rounded-full hover:bg-red-500 hover:text-white border border-red-100 transition-colors shadow-sm shrink-0"
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
          
          {/* DYNAMIC TOP STATUS PILL */}
          {isAccredited ? (
            <div className="w-full bg-[#E8F5E9] text-[#066936] border border-[#CDE1B4] px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
              <CheckCircle2 size={16} /> Accredited
            </div>
          ) : isAccreditationRejected ? (
            <div className="w-full bg-red-50 text-red-650 border border-red-200 px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
              <X size={16} /> Accreditation Rejected
            </div>
          ) : isAccreditationGoingOn ? (
            <div className="w-full bg-[#E8F5E9] text-[#5D9C0E] border border-[#5D9C0E] px-5 py-3 md:py-2.5 rounded-full text-[12px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 bg-[#5D9C0E] rounded-full inline-block animate-pulse"></span> Accreditation Going On
            </div>
          ) : isVisitationAccepted ? (
            <div className="w-full bg-[#E8F5E9] text-[#5D9C0E] border border-[#5D9C0E] px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
              <CheckCircle2 size={16} /> Visitation Confirmed
            </div>
          ) : isAssessmentApproved ? (
            <div className="w-full bg-[#E8F5E9] text-[#5D9C0E] border border-[#5D9C0E] px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
              <CheckCircle2 size={16} /> Assessment Approved
            </div>
          ) : isAssessmentRejected ? (
            <div className="w-full bg-red-50 text-red-650 border border-red-200 px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
              <X size={16} /> Assessment Rejected
            </div>
          ) : isAssessmentSubmitted ? (
            <div className="w-full bg-[#8C988B] text-white px-5 py-3 md:py-2.5 rounded-full text-[12px] font-semibold shadow-md flex justify-center items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 bg-white rounded-full inline-block animate-pulse"></span> Assessment Under Review
            </div>
          ) : isApproved && isFullyPaid ? (
            <Link href={assessmentUrl} className="w-full bg-[#5D9C0E] hover:bg-[#528a0c] transition text-white px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-md flex items-center justify-center whitespace-nowrap">
              Assessment form
            </Link>
          ) : isApproved ? (
            <div className="w-full bg-[#E8F5E9] text-[#5D9C0E] border border-[#5D9C0E] px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2">
              <CheckCircle2 size={16} /> Approved
            </div>
          ) : isRejected ? (
            <div className="w-full bg-red-50 text-red-650 border border-red-200 px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
              <X size={16} /> Application Rejected
            </div>
          ) : isUnderReview ? (
            <div className="w-full bg-[#8C988B] text-white px-5 py-3 md:py-2.5 rounded-full text-[13px] font-semibold shadow-md flex justify-center items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full inline-block animate-pulse"></span> Under Review
            </div>
          ) : (
            <Link href={preAssessmentUrl} className="w-full bg-[#5D9C0E] hover:bg-[#528a0c] transition text-white px-5 py-3 md:py-2.5 rounded-full text-[13px] font-semibold shadow-md flex items-center justify-center whitespace-nowrap">
              Pre-assessment form
            </Link>
          )}
        </div>
      </div>

      {/* POPUP ALERT */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white px-6 py-6 rounded-2xl shadow-2xl flex flex-col items-center text-center w-full max-w-[380px] animate-in fade-in zoom-in-95 duration-300">
            {isAccredited && (
              <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 size={24} className="text-[#066936]" />
              </div>
            )}
            {isAccreditationRejected && (
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                <X size={24} className="text-red-500" />
              </div>
            )}
            {!isAccredited && !isAccreditationRejected && (
              <>
                {(isApproved || isAssessmentApproved || isVisitationAccepted) && !isAssessmentSubmitted && !isRejected && (
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} className="text-[#5D9C0E]" />
                  </div>
                )}
                {isAssessmentSubmitted && !isAssessmentApproved && !isAssessmentRejected && (
                  <div className="w-12 h-12 bg-[#F4F9F2] rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} className="text-[#5D9C0E]" />
                  </div>
                )}
                {(isRejected || isAssessmentRejected) && (
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                    <X size={24} className="text-red-500" />
                  </div>
                )}
              </>
            )}
            
            <p className="text-gray-800 font-medium text-[14px] md:text-[15px] leading-tight mb-4">{alertMessage}</p>
            <button onClick={() => setShowAlert(false)} className="w-full bg-[#5D9C0E] hover:bg-[#528a0c] text-white font-bold transition-colors py-2.5 rounded-full text-[13px] shadow-sm">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* TOP PROGRESS BAR SECTION - SLICK & UNIFIED DYNAMIC PROCESS */}
      <div className="bg-white rounded-[24px] p-5 mb-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[14px] font-bold text-gray-800 tracking-tight font-black uppercase">Accreditation Process</h3>
          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
            isAccreditationRejected || isAssessmentRejected 
              ? 'bg-red-50 text-red-600' 
              : isAccredited 
              ? 'bg-[#EEF6DF] text-[#066936]' 
              : 'bg-slate-50 text-gray-700'
          }`}>
            {progressText} ({progressPercentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-105 h-2.5 rounded-full overflow-hidden flex">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isAccreditationRejected || isAssessmentRejected ? 'bg-red-500' : 'bg-[#65A30D]'
            }`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-[11.5px] text-gray-400 font-medium mt-2.5 leading-relaxed">
          {isAccredited
            ? "Congratulations! Your facility has met all standards and is officially Accredited."
            : isAccreditationRejected
            ? "Your application has been evaluated and rejected by the board."
            : isAccreditationGoingOn
            ? "Your visitation has been concluded. The board is currently evaluating the final reports."
            : isVisitationAccepted
            ? "Visitation scheduled! Please prepare your facility for the upcoming physical inspection on the accepted date."
            : isAssessmentApproved
            ? "Your assessment has been approved. Please review and accept your scheduled visitation date."
            : isAssessmentSubmitted
            ? "Your assessment form has been submitted and is currently under review by the administration."
            : isFullyPaid
            ? "Payment verified. Please select the 'Start Assessment' button below to complete your resource self-assessment."
            : isApproved
            ? "Your pre-assessment has been approved. Please complete the registration and logistics payment."
            : "Complete the pre-assessment form to initiate the accreditation process."}
        </p>
      </div>

      {isAssessmentRejected && !isAccreditationRejected && (
        <div className="bg-[#FFF5F5] rounded-[24px] p-4.5 mb-5 shadow-sm border border-red-200 flex flex-col w-full">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-bold text-red-600 tracking-tight">Assessment Rejected</h3>
            <X size={16} className="text-red-650" />
          </div>
          <p className="text-xs text-red-500 font-medium">
            Your assessment was rejected. Please appeal to resubmit your details.
          </p>
        </div>
      )}

      {isAccredited && (
        <div className="bg-[#FAFCF8] rounded-[24px] p-4.5 mb-5 shadow-sm border border-[#5D9C0E]/30 flex flex-col w-full">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-bold text-[#066936] tracking-tight">Accreditation Granted</h3>
            <CheckCircle2 size={16} className="text-[#066936]" />
          </div>
          <p className="text-xs text-gray-500 font-medium mb-3">
            We are pleased to inform you that your organization has met all standard requirements set by the MRTB and has been granted official accreditation.
          </p>
          {userData?.inspection_report?.step3 && (
            <div className="bg-white p-4 rounded-2xl border border-gray-100 text-xs text-gray-700 space-y-2 mb-4 w-full">
              <div><span className="font-bold text-gray-400">Decision:</span> <span className="font-bold text-[#066936]">{userData.inspection_report.step3.decision}</span></div>
              {userData.inspection_report.step3.duration && (
                <div><span className="font-bold text-gray-400">Duration:</span> <span className="font-bold text-gray-900">{userData.inspection_report.step3.duration} Years</span></div>
              )}
              {userData.inspection_report.step3.reportDate && (
                <div><span className="font-bold text-gray-400">Date of Award:</span> <span className="font-bold text-gray-900">{formatVisitDate(userData.inspection_report.step3.reportDate)}</span></div>
              )}
            </div>
          )}
          <button 
            onClick={() => setShowDetailsModal(true)}
            className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold text-xs py-2 px-5 rounded-full w-fit shadow-sm transition-colors cursor-pointer"
          >
            View Accreditation Details
          </button>
        </div>
      )}

      {isAccreditationRejected && (
        <div className="bg-[#FFF5F5] rounded-[24px] p-4.5 mb-5 shadow-sm border border-red-200 flex flex-col w-full">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-bold text-red-600 tracking-tight">Accreditation Rejected</h3>
            <X size={16} className="text-red-650" />
          </div>
          <p className="text-xs text-red-500 font-medium mb-3">
            We regret to inform you that after inspection and evaluation, your facility was not granted accreditation at this time due to not meeting MRTB standards.
          </p>
          <button 
            onClick={() => setShowDetailsModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-5 rounded-full w-fit shadow-sm transition-colors cursor-pointer"
          >
            View Deficiency Details
          </button>
        </div>
      )}

      {/* Main Page Content */}
      <div className="flex flex-col lg:flex-row gap-6 w-full mb-6">
        
        {/* Clinic Card */}
        <div className={`bg-white rounded-[24px] p-4 md:p-5 flex flex-col sm:flex-row gap-5 w-full lg:w-max shadow-sm border ${isApproved || isAssessmentSubmitted ? 'border-[#5D9C0E]/30' : 'border-gray-100'}`}>
          <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Clinic Room" className="w-full sm:w-[140px] h-[160px] sm:h-[140px] md:h-full object-cover rounded-[16px]" />
          <div className="flex flex-col justify-center py-1 md:pr-6">
            <h2 className="font-bold text-lg text-gray-800 leading-tight">{userData?.name || "Your Organization"}</h2>
            <p className="text-gray-400 text-xs mb-3">{userData?.profession || "Profession"}</p>
            <p className="text-[11px] font-bold text-gray-800 mb-1">Categories:</p>
            <ul className="text-[11px] text-gray-500 mb-5 pl-4 list-disc marker:text-[#5D9C0E]">
              <li className="pl-1">{userData?.category || "Category"}</li>
              <li className="pl-1">{userData?.sub_category || "Tier"}</li>
            </ul>
            
            {/* DYNAMIC CARD BUTTON */}
            {isAccredited ? (
               <button onClick={() => setShowDetailsModal(true)} className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white border-2 border-[#5D9C0E] px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max transition-colors flex items-center justify-center gap-2 cursor-pointer">
                 Accreditation Granted <CheckCircle2 size={14} />
               </button>
            ) : isAccreditationRejected ? (
               <button onClick={() => setShowDetailsModal(true)} className="border-2 border-red-500 bg-red-50 text-red-650 px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max shadow-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                 Accreditation Rejected <X size={14} />
               </button>
            ) : isAccreditationGoingOn ? (
               <button className="border border-[#5D9C0E] text-[#5D9C0E] bg-[#EEF6DF] px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max cursor-default flex items-center justify-center gap-2">
                 Accreditation Going On <CheckCircle2 size={14} />
               </button>
            ) : isVisitationAccepted ? (
               <button className="border border-gray-400 text-gray-500 bg-white px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max cursor-default transition-colors">
                 Visitation in view
               </button>
            ) : isAssessmentApproved ? (
               <button className="border-2 border-[#5D9C0E] bg-[#FAFCF8] text-[#5D9C0E] px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max cursor-default flex items-center justify-center gap-2">
                 Assessment Approved <CheckCircle2 size={14} />
               </button>
            ) : isAssessmentRejected ? (
               <Link href={assessmentUrl} className="border-2 border-red-500 bg-red-50 text-red-650 px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max shadow-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                 Appeal Assessment <X size={14} />
               </Link>
            ) : isAssessmentSubmitted ? (
               <button className="border border-[#5D9C0E] text-[#5D9C0E] bg-[#EEF6DF] px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max cursor-default flex items-center justify-center gap-2">
                 Assessment Submitted <CheckCircle2 size={14} />
               </button>
            ) : isApproved && isFullyPaid ? (
              <Link href={assessmentUrl} className="bg-[#5D9C0E] text-white px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max shadow-md transition-colors hover:bg-[#528a0c] flex items-center justify-center">
                Proceed to assessment form
              </Link>
            ) : isApproved ? (
              <button className="border-2 border-[#5D9C0E] bg-[#FAFCF8] text-[#5D9C0E] px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max cursor-default flex items-center justify-center gap-2">
                Application Approved <CheckCircle2 size={14} />
              </button>
            ) : isRejected ? (
              <Link href={preAssessmentUrl} className="border-2 border-red-500 bg-red-50 text-red-650 px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max shadow-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                Appeal Application <X size={14} />
              </Link>
            ) : isUnderReview ? (
              <button className="border border-gray-400 text-gray-500 px-6 py-2.5 rounded-full text-xs font-semibold w-full sm:w-max cursor-not-allowed flex items-center justify-center">
                Application Under Review
              </button>
            ) : (
              <Link href={preAssessmentUrl} className="border border-[#5D9C0E] text-[#5D9C0E] px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#f8fcf5] transition w-full sm:w-max flex items-center justify-center">
                Complete Application
              </Link>
            )}
          </div>
        </div>

        {/* ESTIMATED COST CARD */}
        {(isUnderReview || isApproved || isRejected) && (
          <div className={`rounded-[24px] p-6 flex flex-col justify-center flex-1 shadow-sm border border-gray-100 bg-white`}>
            <h3 className={`${isApproved ? 'text-gray-400' : 'text-gray-505'} font-semibold text-[15px] mb-1`}>
              {isApproved ? 'Estimated Cost' : 'Estimated Cost'}
            </h3>
            
            <p className={`${isFullyPaid ? 'text-gray-800' : 'text-gray-800'} text-[38px] md:text-[42px] font-black leading-none mb-4`}>
              ₦{isApproved ? totalCost.toLocaleString() : '0.00'}
            </p>
            
            {isApproved && !isFullyPaid ? (
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-[550px]">
                <div className="flex-1 flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 font-bold text-[10px] block uppercase tracking-wider mb-0.5">Registration</span>
                    <span className="text-gray-800 font-bold text-[14px]">₦{registrationCost.toLocaleString()}</span>
                  </div>
                  {paidRegistration ? (
                    <span className="text-[#5D9C0E] text-[11px] font-bold flex items-center gap-1 bg-[#EEF6DF] px-3 py-1.5 rounded-full"><CheckCircle2 size={14}/> Paid</span>
                  ) : (
                    <button onClick={() => router.push(`/payment/remita?type=registration&amount=${registrationCost}`)} className="bg-[#5D9C0E] hover:bg-[#528a0c] text-white px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm transition-colors">Pay Now</button>
                  )}
                </div>

                <div className="flex-1 flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 font-bold text-[10px] block uppercase tracking-wider mb-0.5">Logistics</span>
                    <span className="text-gray-800 font-bold text-[14px]">₦{logisticsCost.toLocaleString()}</span>
                  </div>
                  {paidLogistics ? (
                    <span className="text-[#5D9C0E] text-[11px] font-bold flex items-center gap-1 bg-[#EEF6DF] px-3 py-1.5 rounded-full"><CheckCircle2 size={14}/> Paid</span>
                  ) : (
                    <button onClick={() => router.push(`/payment/remita?type=logistics&amount=${logisticsCost}`)} className="bg-[#5D9C0E] hover:bg-[#528a0c] text-white px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm transition-colors">Pay Now</button>
                  )}
                </div>
              </div>
            ) : isApproved && isFullyPaid ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[#5D9C0E] mb-3">
                  <span className="text-lg font-medium">Paid</span> <CheckCircle2 size={18} strokeWidth={2.5} />
                </div>
                <p className="text-gray-800 text-[13px] font-medium">
                  {isAccredited
                    ? "Your accreditation has been successfully granted. No pending payments."
                    : isAccreditationRejected
                    ? "Accreditation cycle completed."
                    : isAccreditationGoingOn
                    ? "Payments confirmed. Your accreditation process is in progress."
                    : isAssessmentApproved
                    ? "Payments confirmed. Check your scheduled inspection date below."
                    : isAssessmentSubmitted 
                    ? "Payments confirmed. Your assessment is under review." 
                    : "Kindly proceed to fill out your assessment form."}
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-400 text-[12px] mb-6">Your cost would be displayed here if your accreditation is accepted.</p>
                <button disabled className="bg-[#BCC6B9] text-white px-6 py-3 rounded-full text-sm font-semibold cursor-not-allowed w-full md:w-max">
                  Make Payment through Remita
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <ActivitiesBox activities={displayActivities} />

      {/* RESTORED BOTTOM CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full pb-3 mt-4">
        
        {/* Reports Card */}
        <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-800 text-[15px] flex items-center gap-1.5"><FileText size={16} className="text-[#5D9C0E]" /> Reports</h4>
          {hasFinalizedReport ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-[12px] text-gray-500 font-medium text-center">Evaluation Report Available</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowDetailsModal(true)} 
                  className="border border-[#5D9C0E] text-[#5D9C0E] bg-white hover:bg-[#5D9C0E]/5 px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button 
                  onClick={handleDownloadReport} 
                  className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Download Report
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[12px] text-gray-400">No reports yet.</p>
              <button className="border border-gray-200 text-gray-300 px-6 py-2 rounded-full text-[11px] font-semibold cursor-not-allowed">Download Report</button>
            </>
          )}
        </div>

        {/* Certificates Card */}
        <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-800 text-[15px] flex items-center gap-1.5"><Award size={16} className="text-[#5D9C0E]" /> Certificates</h4>
          {isAccredited ? (
            <>
              <p className="text-[12px] text-emerald-600 font-bold text-center">MRTB Certificate Unlocked</p>
              <button 
                onClick={() => alert("Downloading your official MRTB Accreditation Certificate...")} 
                className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-6 py-2 rounded-full text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
              >
                Download Certificate
              </button>
            </>
          ) : (
            <>
              <p className="text-[12px] text-gray-400">No certificates yet.</p>
              <button className="border border-gray-200 text-gray-300 px-6 py-2 rounded-full text-[11px] font-semibold cursor-not-allowed">Download Certificate</button>
            </>
          )}
        </div>
        
        {/* Inspection Status Card */}
        {isAccredited || isAccreditationRejected ? (
          <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 sm:col-span-2 md:col-span-1">
            <h4 className="font-bold text-gray-800 text-[15px] mb-2">Inspection Status</h4>
            <p className="text-[11px] font-bold text-[#066936] bg-[#EEF6DF] px-3 py-1 rounded-md text-center max-w-[200px] mb-1">
              Inspection Concluded
            </p>
            {visitDate && (
              <p className="text-[10px] text-gray-400 font-medium">
                Conducted on: {formatVisitDate(visitDate)}
              </p>
            )}
          </div>
        ) : isVisitationAccepted ? (
          <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center shadow-sm border border-[#5D9C0E]/30 sm:col-span-2 md:col-span-1">
            <h4 className="font-bold text-[#2C3E20] text-[15px] mb-2">Scheduled Visit Date</h4>
            <p className="text-[13px] text-[#2C3E20] font-medium">
              {formatVisitDate(visitDate)}
            </p>
          </div>
        ) : isAssessmentApproved ? (
          <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 sm:col-span-2 md:col-span-1">
            <h4 className="font-bold text-[#2C3E20] text-[15px] mb-2">Scheduled Visit Date</h4>
            <p className="text-[13px] text-[#2C3E20] font-medium mb-4">
              {formatVisitDate(visitDate)}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => alert("Appeal functionality coming soon!")}
                disabled={isAcceptingVisit}
                className="border border-[#F05252] text-[#F05252] px-8 py-2 rounded-full text-[13px] font-bold hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer animate-in fade-in"
              >
                Appeal
              </button>
              <button 
                onClick={handleAcceptVisitation}
                disabled={isAcceptingVisit}
                className="bg-[#5D9C0E] text-white px-8 py-2 rounded-full text-[13px] font-bold hover:bg-[#4a7c0b] transition-colors disabled:opacity-50 flex justify-center items-center cursor-pointer animate-in fade-in"
              >
                {isAcceptingVisit ? <Loader2 size={16} className="animate-spin" /> : "Accept"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 sm:col-span-2 md:col-span-1">
            <h4 className="font-semibold text-gray-800 text-[15px]">Scheduled Visit Date</h4>
            <p className="text-[11px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-md text-center max-w-[200px]">
              Unlocked after Assessment Approval
            </p>
            <button disabled className="bg-[#C1C9C1] mt-1 text-white px-8 py-2 rounded-full text-[11px] font-semibold cursor-not-allowed">Accept</button>
          </div>
        )}
      </div>

      {/* DETAILED ACCREDITATION SUMMARY OVERLAY MODAL */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300">
            {/* Modal Header */}
            <div className={`p-6 border-b border-gray-100 flex justify-between items-center ${isAccredited ? 'bg-gradient-to-r from-[#EEF6DF] to-white' : 'bg-gradient-to-r from-red-50 to-white'}`}>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                  {isAccredited ? 'Accreditation Award Details' : 'Accreditation Evaluation & Findings'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{userData?.name || "Facility Profile"}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">
              {/* General Decision Card */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isAccredited ? 'bg-[#FAFCF8] border-[#5D9C0E]/20' : 'bg-red-55/30 border-red-200/50'}`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Decision Awarded</span>
                  <span className={`text-base font-extrabold tracking-wide ${isAccredited ? 'text-[#066936]' : 'text-red-650'}`}>
                    {userData?.inspection_report?.step3?.decision || (isAccredited ? 'Full Accreditation' : 'Denial (No Accreditation)')}
                  </span>
                </div>
                
                {isAccredited && userData?.inspection_report?.step3?.duration && (
                  <div className="space-y-1 sm:text-right border-t sm:border-t-0 sm:border-l border-gray-150 pt-2 sm:pt-0 sm:pl-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Duration Granted</span>
                    <span className="text-base font-extrabold text-gray-900">
                      {userData.inspection_report.step3.duration} Years
                    </span>
                  </div>
                )}

                {userData?.inspection_report?.step3?.reportDate && (
                  <div className="space-y-1 sm:text-right border-t sm:border-t-0 sm:border-l border-gray-150 pt-2 sm:pt-0 sm:pl-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Date of Evaluation</span>
                    <span className="text-xs font-bold text-gray-700">
                      {formatVisitDate(userData.inspection_report.step3.reportDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Complete Report Download Call-to-Action */}
              <div className="bg-[#FAFCF8] p-6 rounded-2xl border border-[#5D9C0E]/20 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-[#EEF6DF] rounded-full flex items-center justify-center text-[#066936]">
                  <FileText size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-[14px]">Download Complete Evaluation Report</h4>
                  <p className="text-gray-500 text-[11px] max-w-md leading-relaxed">
                    To view the full details of your evaluation including the resource assessment checklist and the final panel findings and observations, please download the report in PDF format.
                  </p>
                </div>
                <button
                  onClick={handleDownloadReport}
                  className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold text-[12px] py-2.5 px-6 rounded-full transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  Download Report (PDF)
                </button>
              </div>

              {/* Panel Members */}
              {userData?.inspection_report?.step3?.panelMembers && userData.inspection_report.step3.panelMembers.filter((m: string) => m.trim() !== "").length > 0 && (
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Accreditation Evaluation Panel</span>
                  <div className="flex flex-wrap gap-2">
                    {userData.inspection_report.step3.panelMembers.filter((m: string) => m.trim() !== "").map((member: string, idx: number) => (
                      <span key={idx} className="bg-[#EEF6DF] text-[#066936] font-bold px-3 py-1.5 rounded-full text-[10px] border border-[#CDE1B4]/40">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 py-2 rounded-full transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}