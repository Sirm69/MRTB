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
  Building2,
  RefreshCw,
  Clock,
  Receipt,
  Check,
  Sparkles,
  Menu,
  ShieldCheck
} from 'lucide-react';
import ActivitiesBox from "../components/ActivitiesBox";
import { useMobileMenu, useUser } from "./layout";
import CertificateModal from "../components/CertificateModal";
import { CertificateData } from "../components/CertificateView";

// Helper function to map database profession names to our URL folder names
const getProfessionSlug = (profession?: string) => {
  if (!profession) return "physiotherapy";
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
  const [isAcceptingVisit, setIsAcceptingVisit] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Status & Phase logic
  const rawStatus = userData?.status || searchParams.get("status");
  const isApproved = rawStatus === "approved";
  const isRejected = rawStatus === "rejected"; 
  const isUnderReview = rawStatus === "under_review" || rawStatus === "recommended_accept" || rawStatus === "recommended_reject";

  const assessmentStatus = userData?.assessment_status;
  const isAssessmentSubmitted = assessmentStatus !== null && assessmentStatus !== undefined;
  
  const hasFinalizedReport = userData?.has_finalized_report === true;

  // Final Accreditation States
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
    setIsRefreshing(true);
    await refreshProfile();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formatVisitDate = (dateString: string) => {
    if (!dateString) return "Date pending";
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-GB', options);
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

  // Build display activities array
  const displayActivities: any[] = [];

  displayActivities.push({
    id: 1,
    action: "Account Creation",
    category: userData?.profession || "Facility Profile",
    date: "August 1, 2025",
    status: "Successful"
  });

  const isPreassessmentSubmitted = !!(userData?.cost_estimate || rawStatus !== "pending");
  
  // Progress calculations
  let progressPercentage = 15;
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
    date: isPreassessmentSubmitted ? (userData?.visit_date ? new Date(userData.visit_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })) : "-",
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
    date: hasAnyPayment ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "-",
    status: isFullyPaid ? "Successful" : hasAnyPayment ? "Partially Paid" : "-"
  });

  displayActivities.push({
    id: 4,
    action: "Assessment form Submitted",
    category: isAssessmentSubmitted ? userData?.category : "-",
    date: isAssessmentSubmitted ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "-",
    status: isAssessmentSubmitted 
      ? (assessmentStatus === "approved" ? "Approved" : assessmentStatus === "rejected" ? "Rejected" : "Under Review") 
      : "-"
  });

  const hasAcceptedVisitDate = userData?.visitation_accepted || isAccreditationGoingOn || isAccredited || isAccreditationRejected;
  displayActivities.push({
    id: 5,
    action: "Visitation Date Accepted",
    category: hasAcceptedVisitDate ? (userData?.visit_date ? new Date(userData.visit_date).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "Scheduled") : "-",
    date: hasAcceptedVisitDate ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "-",
    status: hasAcceptedVisitDate ? "Successful" : (isRescheduled ? "Rescheduled" : "-")
  });

  const isVisitationCompleted = hasFinalizedReport || isAccredited || isAccreditationRejected;
  displayActivities.push({
    id: 6,
    action: "Visitation Exercise",
    category: isVisitationCompleted ? "Completed" : "-",
    date: isVisitationCompleted ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "-",
    status: isVisitationCompleted ? "Successful" : "-"
  });

  const hasDecision = isAccredited || isAccreditationRejected;
  displayActivities.push({
    id: 7,
    action: "Accreditation Decision",
    category: hasDecision ? (isAccredited ? "Accredited" : "Rejected") : "-",
    date: hasDecision ? new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "-",
    status: isAccredited ? "Granted" : isAccreditationRejected ? "Rejected" : "-"
  });

  const isAcademic = 
    userData?.field?.toLowerCase() === "academics" || 
    userData?.category?.toLowerCase().includes("academic");

  const categorySlug = isAcademic ? "academic" : "clinical";
  const professionSlug = getProfessionSlug(userData?.profession);

  const preAssessmentUrl = isAcademic ? "/forms/preassessment/academic" : "/forms/preassessment/clinical";
  const assessmentUrl = `/forms/assessment/${professionSlug}/${categorySlug}`;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto w-full pb-10">
      
      {/* TOP HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl md:rounded-3xl p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden bg-[#5D9C0E] text-white p-2 rounded-xl hover:bg-[#528a0c] transition shrink-0" 
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                Facility Dashboard
              </h1>
              <button 
                onClick={handleRefresh} 
                className={`p-1.5 rounded-lg text-gray-400 hover:text-[#5D9C0E] hover:bg-[#F8FCF5] transition-all ${isRefreshing ? 'animate-spin text-[#5D9C0E]' : ''}`}
                title="Refresh Profile"
              >
                <RefreshCw size={14} />
              </button>
            </div>
            <p className="text-xs text-gray-400 font-normal mt-0.5">
              MRTB Accreditation Management Portal
            </p>
          </div>
        </div>

        {/* User Card & Actions */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-xl max-w-[220px]">
            <div className="w-8 h-8 rounded-lg bg-[#5D9C0E] text-white flex items-center justify-center text-xs shrink-0">
              <Building2 size={15} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-800 text-xs truncate leading-tight">
                {userData?.name || "Organization"}
              </p>
              <p className="text-[10px] text-gray-400 truncate leading-tight font-normal">
                {userData?.profession || "Health Facility"}
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-xl transition-all shrink-0"
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* ACCREDITATION PROGRESS BAR CARD */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 border border-gray-100 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#5D9C0E]/70" />
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 tracking-tight">
              Accreditation Progress
            </h3>
          </div>
          <span className={`text-[11px] font-normal px-2.5 py-0.5 rounded-full w-fit ${
            isAccreditationRejected || isAssessmentRejected 
              ? 'bg-red-50 text-red-500' 
              : isAccredited 
              ? 'bg-[#EEF6DF]/70 text-[#066936]' 
              : 'bg-[#F8FCF5] text-[#5D9C0E]/80'
          }`}>
            {progressText} • {progressPercentage}%
          </span>
        </div>

        <div className="w-full bg-gray-100/80 h-1.5 rounded-full overflow-hidden flex">
          <div 
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isAccreditationRejected || isAssessmentRejected 
                ? 'bg-red-400/70' 
                : 'bg-gradient-to-r from-[#5D9C0E]/40 to-[#5D9C0E]/60'
            }`} 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="text-[11px] sm:text-xs text-gray-400 font-normal mt-2.5 leading-relaxed">
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
            ? "Payment verified. Please proceed to complete your facility self-assessment form."
            : isApproved
            ? "Your pre-assessment has been approved. Please complete the registration and logistics payments below."
            : "Complete and submit your pre-assessment form to start the accreditation process."}
        </p>
      </div>

      {/* HERO SECTION: CLINIC DETAILS & COST ESTIMATION (SEPARATE CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
        
        {/* Clinic Summary Card */}
        <div className={`${isApproved ? 'lg:col-span-4' : 'lg:col-span-5'} bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 border border-gray-100 flex flex-col justify-between`}>
          <div>
            {/* Clean borderless image */}
            <div className="w-full h-36 sm:h-38 rounded-xl sm:rounded-2xl overflow-hidden mb-3.5 relative bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Facility" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-normal text-gray-700 shadow-none border border-gray-100/60">
                {userData?.profession || "Facility"}
              </div>
            </div>

            <h2 className="font-medium text-base text-gray-900 leading-snug mb-1">
              {userData?.name || "Your Organization"}
            </h2>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className="px-2.5 py-0.5 bg-gray-50 text-gray-500 rounded-full text-[10.5px] font-normal border border-gray-100">
                {userData?.category || "Category"}
              </span>
              <span className="px-2.5 py-0.5 bg-gray-50 text-gray-500 rounded-full text-[10.5px] font-normal border border-gray-100">
                {userData?.sub_category || "Tier"}
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-3 border-t border-gray-100 mt-2">
            {isAccredited ? (
              <button 
                onClick={() => setShowDetailsModal(true)} 
                className="w-full bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-2 px-3 rounded-xl text-xs font-normal transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={14} /> Accreditation Granted
              </button>
            ) : isAccreditationRejected ? (
              <button 
                onClick={() => setShowDetailsModal(true)} 
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-2 px-3 rounded-xl text-xs font-normal transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <X size={14} /> Accreditation Rejected
              </button>
            ) : isAccreditationGoingOn ? (
              <div className="w-full bg-[#EEF6DF] text-[#066936] py-2 px-3 rounded-xl text-xs font-normal text-center flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5D9C0E] animate-pulse"></span> Accreditation In Progress
              </div>
            ) : isVisitationAccepted ? (
              <div className="w-full bg-slate-50 text-slate-700 py-2 px-3 rounded-xl text-xs font-normal text-center flex items-center justify-center gap-2">
                <Calendar size={13} className="text-[#5D9C0E]" /> Visitation Confirmed
              </div>
            ) : isAssessmentApproved ? (
              <div className="w-full bg-[#EEF6DF] text-[#066936] py-2 px-3 rounded-xl text-xs font-normal text-center flex items-center justify-center gap-2">
                <CheckCircle2 size={13} className="text-[#5D9C0E]" /> Assessment Approved
              </div>
            ) : isAssessmentRejected ? (
              <Link 
                href={assessmentUrl} 
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-2 px-3 rounded-xl text-xs font-normal transition-colors text-center flex items-center justify-center gap-2"
              >
                Appeal Assessment <ArrowRight size={13} />
              </Link>
            ) : isAssessmentSubmitted ? (
              <div className="w-full bg-[#FEA924] text-white py-2 px-3 rounded-xl text-xs font-normal text-center flex items-center justify-center gap-2">
                <Clock size={13} className="text-white" /> Assessment Under Review
              </div>
            ) : isApproved && isFullyPaid ? (
              <Link 
                href={assessmentUrl} 
                className="w-full bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-2 px-3 rounded-xl text-xs font-normal transition-colors text-center flex items-center justify-center gap-2"
              >
                Proceed to Assessment Form <ArrowRight size={13} />
              </Link>
            ) : isApproved ? (
              <div className="w-full bg-[#EEF6DF] text-[#066936] py-2 px-3 rounded-xl text-xs font-normal text-center flex items-center justify-center gap-2">
                <CheckCircle2 size={13} className="text-[#5D9C0E]" /> Application Approved
              </div>
            ) : isRejected ? (
              <Link 
                href={preAssessmentUrl} 
                className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-2 px-3 rounded-xl text-xs font-normal transition-colors text-center flex items-center justify-center gap-2"
              >
                Appeal Application <ArrowRight size={13} />
              </Link>
            ) : isUnderReview ? (
              <div className="w-full bg-[#FEA924] text-white py-2 px-3 rounded-xl text-xs font-normal text-center flex items-center justify-center gap-2">
                <Clock size={13} className="text-white" /> Application Under Review
              </div>
            ) : (
              <Link 
                href={preAssessmentUrl} 
                className="w-full bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-2 px-3 rounded-xl text-xs font-normal transition-colors text-center flex items-center justify-center gap-2"
              >
                Complete Pre-assessment <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>

        {isApproved ? (
          <div className="lg:col-span-8 flex flex-col justify-between gap-4">
            {/* COMMON HEADER: TOTAL AMOUNT */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-gray-400 font-normal block mb-0.5">
                  Total Estimated Cost
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-medium text-gray-800 tracking-tight">
                    ₦{totalCost.toLocaleString()}
                  </span>
                  {isFullyPaid && (
                    <span className="text-xs font-normal text-[#066936] flex items-center gap-1">
                      <Check size={13} className="text-[#5D9C0E]" /> Settled
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-normal px-3 py-1 rounded-full ${
                  isFullyPaid 
                    ? 'bg-[#EEF6DF] text-[#066936]' 
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {isFullyPaid ? "All Paid ✓" : "Payment Due"}
                </span>
              </div>
            </div>

            {/* SEPARATE INDIVIDUAL FEE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {/* REGISTRATION FEE CARD */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">
                        Registration Fee
                      </h3>
                      <p className="text-[11px] text-gray-400 font-normal">Statutory board registration</p>
                    </div>
                    <span className={`text-[10px] font-normal px-2.5 py-0.5 rounded-full ${
                      paidRegistration 
                        ? 'bg-[#EEF6DF] text-[#066936]' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {paidRegistration ? "Paid ✓" : "Pending"}
                    </span>
                  </div>

                  <div className="my-2">
                    <span className="text-[10.5px] text-gray-400 font-normal block mb-0.5">
                      Amount
                    </span>
                    <span className="text-base sm:text-lg font-medium text-gray-800 tracking-tight block">
                      ₦{registrationCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-2">
                  {paidRegistration ? (
                    <div className="w-full py-2 bg-[#EEF6DF] text-[#066936] rounded-xl text-xs font-normal flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={13} className="text-[#5D9C0E]" /> Settled
                    </div>
                  ) : (
                    <button 
                      onClick={() => router.push(`/payment/remita?type=registration&amount=${registrationCost}`)} 
                      className="w-full bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-2 px-3 rounded-xl text-xs font-normal transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Pay Registration
                    </button>
                  )}
                </div>
              </div>

              {/* LOGISTICS FEE CARD */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">
                        Logistics Fee
                      </h3>
                      <p className="text-[11px] text-gray-400 font-normal">Panel verification & inspection</p>
                    </div>
                    <span className={`text-[10px] font-normal px-2.5 py-0.5 rounded-full ${
                      paidLogistics 
                        ? 'bg-[#EEF6DF] text-[#066936]' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {paidLogistics ? "Paid ✓" : "Pending"}
                    </span>
                  </div>

                  <div className="my-2">
                    <span className="text-[10.5px] text-gray-400 font-normal block mb-0.5">
                      Amount
                    </span>
                    <span className="text-base sm:text-lg font-medium text-gray-800 tracking-tight block">
                      ₦{logisticsCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 mt-2">
                  {paidLogistics ? (
                    <div className="w-full py-2 bg-[#EEF6DF] text-[#066936] rounded-xl text-xs font-normal flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={13} className="text-[#5D9C0E]" /> Settled
                    </div>
                  ) : (
                    <button 
                      onClick={() => router.push(`/payment/remita?type=logistics&amount=${logisticsCost}`)} 
                      className="w-full bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-2 px-3 rounded-xl text-xs font-normal transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Pay Logistics
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ACCREDITATION STATUTORY NOTICE (WHEN NOT APPROVED YET) */
          <div className="lg:col-span-7 bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="pb-3.5 mb-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm md:text-[15px] leading-tight">
                  Accreditation Fees
                </h3>
                <p className="text-[11px] text-gray-400 font-normal">Official statutory charges</p>
              </div>

              <div className="bg-gray-50/70 border border-gray-100 p-5 rounded-2xl mb-3 text-center">
                <p className="text-xs text-gray-500 font-normal leading-relaxed">
                  Statutory registration and logistics costs will appear here as separate payable invoices once your pre-assessment application is reviewed and approved.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-normal pt-3 border-t border-gray-100">
              <ShieldCheck size={13} className="text-[#5D9C0E] shrink-0" />
              <span>Secure payments processed through the Federal Government Remita gateway.</span>
            </div>
          </div>
        )}

      </div>

      {/* ACTIVITIES BOX */}
      <ActivitiesBox activities={displayActivities} />

      {/* BOTTOM CARDS ROW (REPORTS, CERTIFICATES, SCHEDULE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
        
        {/* Reports Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#F8FCF5] flex items-center justify-center text-[#5D9C0E]">
              <FileText size={14} />
            </div>
            <h4 className="font-medium text-gray-900 text-sm leading-tight">Evaluation Report</h4>
          </div>

          <div className="my-2">
            {hasFinalizedReport ? (
              <div className="bg-[#F8FCF5] p-3 rounded-xl text-center">
                <span className="text-xs font-medium text-[#066936] block mb-1">
                  Report Available
                </span>
                <p className="text-[10.5px] text-gray-500 font-normal">
                  Official evaluation signed by panel inspectors.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50/70 p-3 rounded-xl text-center">
                <span className="text-xs font-normal text-gray-400 block mb-1">
                  No Report Yet
                </span>
                <p className="text-[10.5px] text-gray-400 font-normal">
                  Available after field team conducts inspection.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100">
            {hasFinalizedReport ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowDetailsModal(true)} 
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-center"
                >
                  View Details
                </button>
                <button 
                  onClick={handleDownloadReport} 
                  className="flex-1 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-center"
                >
                  Download PDF
                </button>
              </div>
            ) : (
              <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-xl text-xs font-normal cursor-not-allowed">
                Report Unavailable
              </button>
            )}
          </div>
        </div>

        {/* Certificates Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#F8FCF5] flex items-center justify-center text-[#5D9C0E]">
              <Award size={14} />
            </div>
            <h4 className="font-medium text-gray-900 text-sm leading-tight">Accreditation Certificate</h4>
          </div>

          <div className="my-2">
            {isAccredited ? (
              <div className="bg-[#F8FCF5] p-3 rounded-xl text-center">
                <span className="text-xs font-medium text-[#066936] block mb-1">
                  Certificate Issued ✓
                </span>
                <p className="text-[10.5px] text-gray-500 font-normal">
                  Accreditation valid for recognized operational cycle.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50/70 p-3 rounded-xl text-center">
                <span className="text-xs font-normal text-gray-400 block mb-1">
                  Certificate Locked
                </span>
                <p className="text-[10.5px] text-gray-400 font-normal">
                  Granted after positive board decision.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100">
            {isAccredited ? (
              <button 
                onClick={() => setShowCertModal(true)} 
                className="w-full bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-2 rounded-xl text-xs font-medium transition-all cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-1.5"
              >
                <Award size={14} />
                Download Certificate
              </button>
            ) : (
              <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-xl text-xs font-normal cursor-not-allowed">
                Certificate Locked
              </button>
            )}
          </div>
        </div>
        
        {/* Inspection Schedule Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 border border-gray-100 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#F8FCF5] flex items-center justify-center text-[#5D9C0E]">
              <Calendar size={14} />
            </div>
            <h4 className="font-medium text-gray-900 text-sm leading-tight">Inspection Date</h4>
          </div>

          <div className="my-2 text-center">
            {isAccredited || isAccreditationRejected ? (
              <div className="bg-[#F8FCF5] p-3 rounded-xl">
                <span className="text-xs font-medium text-[#066936] block">Inspection Concluded</span>
                {visitDate && <p className="text-[10.5px] text-gray-500 font-normal mt-0.5">{formatVisitDate(visitDate)}</p>}
              </div>
            ) : isVisitationAccepted ? (
              <div className="bg-[#F8FCF5] p-3 rounded-xl">
                <span className="text-[10.5px] text-gray-400 font-medium block">Scheduled Date</span>
                <span className="text-xs font-semibold text-[#066936] block mt-0.5">{formatVisitDate(visitDate)}</span>
              </div>
            ) : isAssessmentApproved ? (
              <div className="bg-amber-50/70 p-3 rounded-xl">
                <span className="text-[10.5px] text-amber-700 font-medium block">Proposed Date</span>
                <span className="text-xs font-semibold text-gray-900 block mt-0.5">{formatVisitDate(visitDate)}</span>
              </div>
            ) : (
              <div className="bg-gray-50/70 p-3 rounded-xl">
                <span className="text-xs font-normal text-gray-400 block mb-1">Date Pending</span>
                <p className="text-[10.5px] text-gray-400 font-normal">Unlocked after assessment review.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100">
            {isAssessmentApproved && !isVisitationAccepted ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => alert("Appeal functionality coming soon!")}
                  disabled={isAcceptingVisit}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
                >
                  Appeal
                </button>
                <button 
                  onClick={handleAcceptVisitation}
                  disabled={isAcceptingVisit}
                  className="flex-1 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50 flex justify-center items-center cursor-pointer"
                >
                  {isAcceptingVisit ? <Loader2 size={13} className="animate-spin" /> : "Accept Date"}
                </button>
              </div>
            ) : isVisitationAccepted ? (
              <div className="w-full bg-[#EEF6DF] text-[#066936] py-2 rounded-xl text-xs font-medium text-center">
                Confirmed ✓
              </div>
            ) : (
              <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-xl text-xs font-normal cursor-not-allowed">
                Schedule Locked
              </button>
            )}
          </div>
        </div>

      </div>

      {/* DETAILED ACCREDITATION SUMMARY OVERLAY MODAL */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100">
            {/* Modal Header */}
            <div className={`p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center ${isAccredited ? 'bg-[#FAFCF8]' : 'bg-red-50/40'}`}>
              <div>
                <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                  {isAccredited ? 'Accreditation Award Details' : 'Accreditation Evaluation & Findings'}
                </h3>
                <p className="text-xs text-gray-500 font-normal mt-0.5">{userData?.name || "Facility Profile"}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
              {/* General Decision Card */}
              <div className={`p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isAccredited ? 'bg-[#FAFCF8]' : 'bg-red-50/40'}`}>
                <div className="space-y-1">
                  <span className="text-[10.5px] font-medium text-gray-400 block">Decision Awarded</span>
                  <span className={`text-base font-semibold tracking-wide ${isAccredited ? 'text-[#066936]' : 'text-red-600'}`}>
                    {userData?.inspection_report?.step3?.decision || (isAccredited ? 'Full Accreditation' : 'Denial (No Accreditation)')}
                  </span>
                </div>
                
                {isAccredited && userData?.inspection_report?.step3?.duration && (
                  <div className="space-y-1 sm:text-right border-t sm:border-t-0 sm:border-l border-gray-200/50 pt-2 sm:pt-0 sm:pl-6">
                    <span className="text-[10.5px] font-medium text-gray-400 block">Duration Granted</span>
                    <span className="text-base font-semibold text-gray-900">
                      {userData.inspection_report.step3.duration} Years
                    </span>
                  </div>
                )}

                {userData?.inspection_report?.step3?.reportDate && (
                  <div className="space-y-1 sm:text-right border-t sm:border-t-0 sm:border-l border-gray-200/50 pt-2 sm:pt-0 sm:pl-6">
                    <span className="text-[10.5px] font-medium text-gray-400 block">Date of Evaluation</span>
                    <span className="text-xs font-medium text-gray-700">
                      {formatVisitDate(userData.inspection_report.step3.reportDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Complete Report Download CTA */}
              <div className="bg-[#FAFCF8] p-5 sm:p-6 rounded-2xl flex flex-col items-center text-center space-y-3">
                <div className="w-10 h-10 bg-[#EEF6DF] rounded-xl flex items-center justify-center text-[#066936]">
                  <FileText size={18} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 text-sm">Download Full Evaluation Report</h4>
                  <p className="text-gray-500 text-[11px] font-normal max-w-md leading-relaxed">
                    Access the complete accreditation report with field observations and checklist scores in PDF format.
                  </p>
                </div>
                <button
                  onClick={handleDownloadReport}
                  className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-medium text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  Download Report (PDF)
                </button>
              </div>

              {/* Panel Members */}
              {userData?.inspection_report?.step3?.panelMembers && userData.inspection_report.step3.panelMembers.filter((m: string) => m.trim() !== "").length > 0 && (
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <span className="text-[10.5px] font-medium text-gray-400 block">Accreditation Inspection Panel</span>
                  <div className="flex flex-wrap gap-1.5">
                    {userData.inspection_report.step3.panelMembers.filter((m: string) => m.trim() !== "").map((member: string, idx: number) => (
                      <span key={idx} className="bg-[#EEF6DF] text-[#066936] font-normal px-3 py-1 rounded-lg text-[10.5px]">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="bg-white hover:bg-gray-100 text-gray-700 font-medium px-5 py-2 rounded-xl border border-gray-200 text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official MRTB Accreditation Certificate Modal */}
      {userData && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          certificateData={{
            id: userData.id,
            organizationName: userData.institution_name || userData.facility_name || userData.name || "ACCREDITED FACILITY",
            location: [userData.lga || userData.city, userData.state].filter(Boolean).join(", ") || userData.address || "NIGERIA",
            discipline: userData.discipline || userData.profession || "Physiotherapy",
            programmeName: userData.programme_name || (userData.discipline ? `Bachelor of ${userData.discipline} Training Programme` : undefined),
            duration: userData.inspection_report?.step3?.duration || "Five (5) Years",
            decisionType: userData.inspection_report?.step3?.decision || "Full Accreditation",
            registrationNumber: userData.registration_number || userData.accreditation_number || userData.user_code || `MRTB/${isAcademic ? "ACB" : "SPP"}/${(userData.discipline || userData.profession || "PT").slice(0,2).toUpperCase()}/${String(userData.id || 1).padStart(4, "0")}`,
            accreditationDate: userData.visit_date 
              ? new Date(userData.visit_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) 
              : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
            issueMonthYear: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          }}
        />
      )}

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}