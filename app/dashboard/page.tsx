"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, X, Loader2, LogOut } from 'lucide-react';
import ActivitiesBox from "../components/ActivitiesBox";
import { useMobileMenu } from "./layout";

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

// 1. We move the main dashboard logic into this internal component
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for UI
  const [showAlert, setShowAlert] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isAcceptingVisit, setIsAcceptingVisit] = useState(false);

  // States for user data and authentication
  const [userData, setUserData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // MOCK PAYMENT STATES
  const [paidRegistration, setPaidRegistration] = useState(false);
  const [paidLogistics, setPaidLogistics] = useState(false);
  const [paymentModalType, setPaymentModalType] = useState<"registration" | "logistics" | null>(null);

  // ==========================================
  // INDEPENDENT STATUS & PHASE LOGIC
  // ==========================================
  const rawStatus = userData?.status || searchParams.get("status");
  
  // Phase 1: Pre-Assessment
  const isApproved = rawStatus === "approved";
  const isRejected = rawStatus === "rejected"; 
  const isUnderReview = rawStatus === "under_review" || rawStatus === "recommended_accept" || rawStatus === "recommended_reject";

  // Phase 2: Assessment
  const assessmentStatus = userData?.assessment_status;
  const isAssessmentSubmitted = assessmentStatus !== null && assessmentStatus !== undefined;
  const isAssessmentApproved = assessmentStatus === "approved";
  const isAssessmentRejected = assessmentStatus === "rejected"; 
  
  // Phase 3: Visitation (THE FIX: Force these to be false unless fully approved!)
  const isVisitationAccepted = (userData?.visitation_accepted || false) && isAssessmentApproved;
  const isRescheduled = (userData?.is_rescheduled || false) && isAssessmentApproved;

  // Financial Data
  const registrationCost = userData?.cost_estimate || 0;
  const logisticsCost = userData?.logistics_fee || 0;
  const totalCost = registrationCost + logisticsCost;
  const visitDate = userData?.visit_date || "";

  // The application moves to the next phase when BOTH payments are completed
  const isFullyPaid = paidRegistration && paidLogistics;

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const profileData = data.data || data;
          setUserData(profileData); 
          
          if (profileData.paid_registration) setPaidRegistration(true);
          if (profileData.paid_logistics) setPaidLogistics(true);
        } else {
          localStorage.removeItem('accessToken');
          sessionStorage.removeItem('accessToken');
          router.push('/auth/login');
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    router.push('/auth/login');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => window.location.reload(), 500);
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

  const confirmMockPayment = async () => {
    if (!paymentModalType) return;
    setIsProcessingPayment(true);

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/payment/mock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ payment_type: paymentModalType })
      });

      if (response.ok) {
        if (paymentModalType === "registration") setPaidRegistration(true);
        if (paymentModalType === "logistics") setPaidLogistics(true);
      } else {
        alert("Payment simulation failed.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Network error processing payment.");
    } finally {
      setIsProcessingPayment(false);
      setPaymentModalType(null);
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
        setUserData({ ...userData, visitation_accepted: true, is_rescheduled: false });
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

  let displayActivities = [...(userData?.activities || [])];
  
  if (isFullyPaid) {
    const paymentIdx = displayActivities.findIndex(a => a.action === "Payment");
    if (paymentIdx !== -1) {
      displayActivities[paymentIdx] = { ...displayActivities[paymentIdx], status: "Successful", date: new Date().toLocaleDateString() };
    }
  }

  if (isAssessmentSubmitted) {
    displayActivities.push({
      id: 999, 
      action: "Assessment Form Submitted",
      category: userData?.category || "-",
      date: new Date().toLocaleDateString(), 
      status: assessmentStatus === "approved" ? "Approved" : assessmentStatus === "rejected" ? "Rejected" : "Under Review"
    });
  }

  if (isVisitationAccepted) {
    const acceptIdx = displayActivities.findIndex(a => a.action === "Accept Visitation");
    if (acceptIdx !== -1) {
      displayActivities[acceptIdx] = { ...displayActivities[acceptIdx], status: "Successful", date: new Date().toLocaleDateString() };
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
      </div>
    );
  }

  // ==========================================
  // DYNAMIC FORM URL CALCULATIONS (For Native Links)
  // ==========================================
  const isAcademic = 
    userData?.field?.toLowerCase() === "academics" || 
    userData?.category?.toLowerCase().includes("academic");

  const categorySlug = isAcademic ? "academic" : "clinical";
  const professionSlug = getProfessionSlug(userData?.profession);

  const preAssessmentUrl = isAcademic ? "/forms/preassessment/academic" : "/forms/preassessment/clinical";
  const assessmentUrl = `/forms/assessment/${professionSlug}/${categorySlug}`;

  // UPDATED ALERT MESSAGES (Handles Rejections)
  let alertMessage = "Please kindly complete the Pre-assessment form";
  if (isRescheduled && !isVisitationAccepted) alertMessage = "🚨 Your visitation date has been rescheduled! Please review and accept the new date.";
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
            <svg className={`transition-transform duration-500 ${isRefreshing ? "animate-spin" : ""}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
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
          
          {/* DYNAMIC TOP BUTTON / PILL */}
          {isVisitationAccepted ? (
            <div className="w-full bg-[#E8F5E9] text-[#5D9C0E] border border-[#5D9C0E] px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
              <CheckCircle2 size={16} /> Visitation Confirmed
            </div>
          ) : isAssessmentApproved ? (
            <div className="w-full bg-[#E8F5E9] text-[#5D9C0E] border border-[#5D9C0E] px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
              <CheckCircle2 size={16} /> Assessment Approved
            </div>
          ) : isAssessmentRejected ? (
            <div className="w-full bg-red-50 text-red-600 border border-red-200 px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
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
            <div className="w-full bg-red-50 text-red-600 border border-red-200 px-5 py-3 md:py-2.5 rounded-full text-[13px] font-bold shadow-sm flex justify-center items-center gap-2 whitespace-nowrap">
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

      {/* ON-LOAD POPUP ALERT */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white px-6 py-6 rounded-2xl shadow-2xl flex flex-col items-center text-center w-full max-w-[380px] animate-in fade-in zoom-in-95 duration-300">
            {(isApproved || isAssessmentApproved || isVisitationAccepted) && !isAssessmentSubmitted && !isRejected && <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-3"><CheckCircle2 size={24} className="text-[#5D9C0E]" /></div>}
            {isAssessmentSubmitted && !isAssessmentApproved && !isAssessmentRejected && <div className="w-12 h-12 bg-[#F4F9F2] rounded-full flex items-center justify-center mb-3"><CheckCircle2 size={24} className="text-[#5D9C0E]" /></div>}
            {(isRejected || isAssessmentRejected) && <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3"><X size={24} className="text-red-500" /></div>}
            
            <p className="text-gray-800 font-medium text-[14px] md:text-[15px] leading-tight mb-4">{alertMessage}</p>
            <button onClick={() => setShowAlert(false)} className="w-full bg-[#5D9C0E] hover:bg-[#528a0c] text-white font-bold transition-colors py-2.5 rounded-full text-[13px] shadow-sm">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* MOCK PAYMENT CONFIRMATION MODAL */}
      {paymentModalType && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Payment</h3>
            <p className="text-sm text-gray-500 mb-6">
              You are about to simulate the Remita payment for your <strong>{paymentModalType === 'registration' ? 'Registration' : 'Logistics'} Fee</strong>.
            </p>
            <div className="flex gap-3">
              <button disabled={isProcessingPayment} onClick={() => setPaymentModalType(null)} className="flex-1 py-2.5 rounded-full border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
              <button disabled={isProcessingPayment} onClick={confirmMockPayment} className="flex-1 py-2.5 rounded-full bg-[#5D9C0E] text-white font-bold text-sm hover:bg-[#4a7c0b] transition-colors shadow-md disabled:opacity-50">
                {isProcessingPayment ? "Processing..." : "Confirm Paid"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP PROGRESS BAR SECTION */}
      {isApproved && isFullyPaid && !isAssessmentSubmitted && (
        <div className="bg-white rounded-[24px] p-6 mb-6 shadow-sm border border-gray-100 flex flex-col w-full lg:w-max min-w-[320px]">
          <div className="flex w-full bg-gray-100 h-2.5 rounded-full mb-5 overflow-hidden">
             <div className="bg-[#65A30D] w-1/5 h-full"></div>
          </div>
          <h3 className="text-[22px] font-bold text-gray-800 mb-1 tracking-tight">5 sections left</h3>
          <p className="text-sm text-gray-400 font-medium">Fill in your details to complete your accreditation</p>
        </div>
      )}

      {/* COMPLETED/REJECTED PROGRESS BAR SECTION */}
      {isAssessmentSubmitted && !isAssessmentRejected && (
        <div className="bg-[#FAFCF8] rounded-[24px] p-6 mb-6 shadow-sm border border-[#5D9C0E]/30 flex flex-col w-full lg:w-max min-w-[320px]">
          <div className="flex w-full bg-gray-100 h-2.5 rounded-full mb-5 overflow-hidden relative">
             <div className="bg-[#5D9C0E] w-full h-full"></div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[22px] font-bold text-[#5D9C0E] tracking-tight">5 of 5 Completed</h3>
            <CheckCircle2 size={20} className="text-[#5D9C0E]" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            {isVisitationAccepted
              ? "All phases complete. Kindly prepare for your scheduled inspection."
              : isAssessmentApproved 
              ? "Your assessment has been approved! Kindly prepare for your scheduled inspection."
              : "Your assessment is currently being reviewed by the administration."}
          </p>
        </div>
      )}

      {isAssessmentRejected && (
        <div className="bg-[#FFF5F5] rounded-[24px] p-6 mb-6 shadow-sm border border-red-200 flex flex-col w-full lg:w-max min-w-[320px]">
          <div className="flex w-full bg-red-100 h-2.5 rounded-full mb-5 overflow-hidden relative">
             <div className="bg-red-500 w-full h-full"></div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[22px] font-bold text-red-600 tracking-tight">Assessment Rejected</h3>
            <X size={20} className="text-red-600" />
          </div>
          <p className="text-sm text-red-500 font-medium">
            Your assessment was rejected. Please appeal to resubmit your details.
          </p>
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
            {isVisitationAccepted ? (
               <button className="border border-gray-400 text-gray-500 bg-white px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max cursor-default transition-colors">
                 Visitation in view
               </button>
            ) : isAssessmentApproved ? (
               <button className="border-2 border-[#5D9C0E] bg-[#FAFCF8] text-[#5D9C0E] px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max cursor-default flex items-center justify-center gap-2">
                 Assessment Approved <CheckCircle2 size={14} />
               </button>
            ) : isAssessmentRejected ? (
               <Link href={assessmentUrl} className="border-2 border-red-500 bg-red-50 text-red-600 px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max shadow-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
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
              <Link href={preAssessmentUrl} className="border-2 border-red-500 bg-red-50 text-red-600 px-6 py-2.5 rounded-full text-xs font-bold w-full sm:w-max shadow-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
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
          <div className={`rounded-[24px] p-6 flex flex-col justify-center flex-1 shadow-sm border ${isApproved ? 'bg-white border-gray-100' : 'bg-white border-gray-100'}`}>
            <h3 className={`${isApproved ? 'text-gray-400' : 'text-gray-500'} font-semibold text-[15px] mb-1`}>
              {isApproved ? 'Estimated Cost' : 'Estimated Cost'}
            </h3>
            
            <p className={`${isFullyPaid ? 'text-[#DFEAD9]' : 'text-[#DFEAD9]'} text-[38px] md:text-[42px] font-black leading-none mb-4`}>
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
                    <button onClick={() => setPaymentModalType('registration')} className="bg-[#5D9C0E] hover:bg-[#528a0c] text-white px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm transition-colors">Pay Now</button>
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
                    <button onClick={() => setPaymentModalType('logistics')} className="bg-[#5D9C0E] hover:bg-[#528a0c] text-white px-4 py-1.5 rounded-full text-[11px] font-bold shadow-sm transition-colors">Pay Now</button>
                  )}
                </div>
              </div>
            ) : isApproved && isFullyPaid ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-[#5D9C0E] mb-3">
                  <span className="text-lg font-medium">Paid</span> <CheckCircle2 size={18} strokeWidth={2.5} />
                </div>
                <p className="text-gray-800 text-[13px] font-medium">
                  {isAssessmentApproved
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full pb-3 mt-4">
        <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-800 text-[15px]">Reports</h4>
          <p className="text-[12px] text-gray-400">No reports yet.</p>
          <button className="border border-gray-200 text-gray-300 px-6 py-2 rounded-full text-[11px] font-semibold cursor-not-allowed">Download Report</button>
        </div>
        <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-gray-800 text-[15px]">Certificates</h4>
          <p className="text-[12px] text-gray-400">No certificates yet.</p>
          <button className="border border-gray-200 text-gray-300 px-6 py-2 rounded-full text-[11px] font-semibold cursor-not-allowed">Download Certificate</button>
        </div>
        
        {isVisitationAccepted ? (
          <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center shadow-sm border border-[#5D9C0E]/30 sm:col-span-2 md:col-span-1">
            <h4 className="font-bold text-[#2C3E20] text-[16px] mb-2">Scheduled Visit Date</h4>
            <p className="text-[13px] text-[#2C3E20] font-medium">
              {formatVisitDate(visitDate)}
            </p>
          </div>
        ) : isAssessmentApproved ? (
          <div className="bg-white rounded-[24px] py-6 px-6 flex flex-col items-center justify-center shadow-sm border border-gray-100 sm:col-span-2 md:col-span-1">
            <h4 className="font-bold text-[#2C3E20] text-[16px] mb-2">Scheduled Visit Date</h4>
            <p className="text-[13px] text-[#2C3E20] font-medium mb-4">
              {formatVisitDate(visitDate)}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => alert("Appeal functionality coming soon!")}
                disabled={isAcceptingVisit}
                className="border border-[#F05252] text-[#F05252] px-8 py-2 rounded-full text-[13px] font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Appeal
              </button>
              <button 
                onClick={handleAcceptVisitation}
                disabled={isAcceptingVisit}
                className="bg-[#5D9C0E] text-white px-8 py-2 rounded-full text-[13px] font-bold hover:bg-[#4a7c0b] transition-colors disabled:opacity-50 flex justify-center items-center"
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
    </>
  );
}

// 2. Wrap the component in Suspense for Next.js SSR build requirement!
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