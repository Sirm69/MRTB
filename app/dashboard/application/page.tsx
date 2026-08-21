"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Clock, 
  Lock, 
  FileText, 
  FileCheck2, 
  CalendarCheck 
} from "lucide-react";
import { useUser } from "../layout";

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

function ApplicationContent() {
  const router = useRouter();
  const { userData, paidRegistration, paidLogistics } = useUser();

  // Status variables
  const rawStatus = userData?.status;
  const isApproved = rawStatus === "approved";
  const isRejected = rawStatus === "rejected"; 
  const isUnderReview = rawStatus === "under_review" || rawStatus === "recommended_accept" || rawStatus === "recommended_reject";

  const assessmentStatus = userData?.assessment_status;
  const isAssessmentSubmitted = assessmentStatus !== null && assessmentStatus !== undefined;
  
  const hasFinalizedReport = userData?.has_finalized_report === true;
  const isAccredited = hasFinalizedReport && assessmentStatus === "approved";
  const isAccreditationRejected = hasFinalizedReport && assessmentStatus === "rejected";

  const isAssessmentApproved = assessmentStatus === "approved" && !hasFinalizedReport;
  const isAssessmentRejected = assessmentStatus === "rejected" && !hasFinalizedReport; 
  
  const isAccreditationGoingOn = (assessmentStatus === "inspected" || assessmentStatus === "finalized" || hasFinalizedReport) && !isAccredited && !isAccreditationRejected;
  const isVisitationAccepted = (((userData?.visitation_accepted || false) && isAssessmentApproved) || isAccreditationGoingOn) && !isAccredited && !isAccreditationRejected;

  const isFullyPaid = paidRegistration && paidLogistics;

  // Slugs & links
  const isAcademic = 
    userData?.field?.toLowerCase() === "academics" || 
    userData?.category?.toLowerCase().includes("academic");

  const categorySlug = isAcademic ? "academic" : "clinical";
  const professionSlug = getProfessionSlug(userData?.profession);

  const preAssessmentUrl = isAcademic ? "/forms/preassessment/academic" : "/forms/preassessment/clinical";
  const assessmentUrl = `/forms/assessment/${professionSlug}/${categorySlug}`;

  // Pre-assessment form status
  const preAssessmentDone = !!(userData?.cost_estimate || rawStatus !== "pending");

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">My Application</h1>
        <p className="text-xs text-gray-400 font-normal mt-0.5">Track and complete your pre-assessment and assessment forms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        
        {/* Forms Management Section */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Pre-Assessment Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex gap-3.5">
                <div className="bg-[#EEF6DF] text-[#066936] p-2.5 rounded-xl shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 leading-tight">1. Pre-Assessment Form</h3>
                  <p className="text-xs text-gray-500 font-normal mt-1 max-w-md leading-relaxed">
                    Collects facility details, discipline, and categorization to calculate statutory inspection fees.
                  </p>
                </div>
              </div>
              <div>
                {preAssessmentDone ? (
                  <span className="text-[#066936] text-[11px] font-medium flex items-center gap-1 bg-[#EEF6DF] px-3 py-0.5 rounded-full">
                    <CheckCircle2 size={12} className="text-[#5D9C0E]" /> Completed
                  </span>
                ) : (
                  <span className="text-amber-700 text-[11px] font-medium flex items-center gap-1 bg-amber-50 px-3 py-0.5 rounded-full">
                    <Clock size={12} className="text-amber-500" /> Not Started
                  </span>
                )}
              </div>
            </div>

            {preAssessmentDone ? (
              <div className="bg-[#FAFCF8] rounded-xl p-4 text-xs text-gray-700 space-y-2 mb-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="font-medium text-gray-400 block text-[10px]">Profession</span>
                    <span className="font-semibold text-gray-800 text-xs">{userData?.profession || "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400 block text-[10px]">Field</span>
                    <span className="font-semibold text-gray-800 capitalize text-xs">{userData?.field || "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400 block text-[10px]">Category</span>
                    <span className="font-semibold text-gray-800 text-xs">{userData?.category || "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400 block text-[10px]">Tier / Specialty</span>
                    <span className="font-semibold text-gray-800 text-xs">{userData?.sub_category || "-"}</span>
                  </div>
                </div>
                {isUnderReview && (
                  <p className="text-[#066936] font-normal pt-1 text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#5D9C0E] rounded-full inline-block animate-pulse"></span> Form submitted successfully. Review in progress.
                  </p>
                )}
                {isRejected && (
                  <div className="pt-2">
                    <p className="text-red-500 font-normal text-[11px] mb-2">
                      Your pre-assessment request was rejected. Please appeal to update information.
                    </p>
                    <Link href={preAssessmentUrl} className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-1.5 rounded-xl text-xs font-medium w-fit flex items-center justify-center gap-1.5">
                      Appeal & Modify Pre-assessment
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-2 flex justify-end">
                <Link href={preAssessmentUrl} className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5">
                  Start Form <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>

          {/* Detailed Assessment Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 ${isFullyPaid ? "bg-[#EEF6DF] text-[#066936]" : "bg-gray-100 text-gray-400"}`}>
                  <FileCheck2 size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-semibold leading-tight ${isFullyPaid ? "text-gray-900" : "text-gray-400"}`}>2. Complete Assessment Form</h3>
                  <p className="text-xs text-gray-400 font-normal mt-1 max-w-md leading-relaxed">
                    Provide precise details on clinical space layout, professional staff roster, equipment inventory, and compliance credentials.
                  </p>
                </div>
              </div>
              <div>
                {!isApproved ? (
                  <span className="text-gray-400 text-[11px] font-normal flex items-center gap-1 bg-gray-50 px-3 py-0.5 rounded-full"><Lock size={11}/> Locked</span>
                ) : !isFullyPaid ? (
                  <span className="text-amber-700 text-[11px] font-medium flex items-center gap-1 bg-amber-50 px-3 py-0.5 rounded-full"><Lock size={11}/> Awaiting Payment</span>
                ) : isAccredited ? (
                  <span className="text-[#066936] text-[11px] font-medium flex items-center gap-1 bg-emerald-50 px-3 py-0.5 rounded-full"><CheckCircle2 size={11}/> Approved</span>
                ) : isAssessmentApproved ? (
                  <span className="text-[#066936] text-[11px] font-medium flex items-center gap-1 bg-[#EEF6DF] px-3 py-0.5 rounded-full"><CheckCircle2 size={11}/> Approved</span>
                ) : isAssessmentRejected ? (
                  <span className="text-red-600 text-[11px] font-medium flex items-center gap-1 bg-red-50 px-3 py-0.5 rounded-full"><X size={11}/> Rejected</span>
                ) : isAssessmentSubmitted ? (
                  <span className="text-blue-600 text-[11px] font-medium flex items-center gap-1 bg-blue-50 px-3 py-0.5 rounded-full"><Clock size={11}/> Under Review</span>
                ) : (
                  <span className="text-[#066936] text-[11px] font-medium flex items-center gap-1 bg-emerald-50 px-3 py-0.5 rounded-full"><ArrowRight size={11}/> Ready to Fill</span>
                )}
              </div>
            </div>

            {/* Assessment UI rendering based on status */}
            {!isApproved ? (
              <p className="text-xs text-gray-400 font-normal italic">
                Unlock this stage by completing the Pre-Assessment Form and receiving administrator approval.
              </p>
            ) : !isFullyPaid ? (
              <div className="bg-amber-50/60 rounded-xl p-4 text-xs text-gray-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <p className="text-amber-800 font-normal">
                  Pre-assessment approved. Please complete your registration & logistics payments to unlock this form.
                </p>
                <Link href="/dashboard/payments" className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-1.5 rounded-xl whitespace-nowrap text-center transition-colors">
                  Go to Payments
                </Link>
              </div>
            ) : isAssessmentSubmitted && !isAssessmentRejected ? (
              <div className="bg-[#FAFCF8] rounded-xl p-4 text-xs text-gray-700">
                <p className="text-[#066936] font-medium flex items-center gap-1.5 mb-1">
                  <CheckCircle2 size={14} className="text-[#5D9C0E]" /> Form Submitted Successfully
                </p>
                <p className="text-gray-500 font-normal leading-relaxed">
                  Your facility assets and credentials list is being reviewed. You will be notified once scheduled for physical visitation.
                </p>
              </div>
            ) : isAssessmentRejected ? (
              <div className="bg-red-50/50 rounded-xl p-4 text-xs text-gray-700">
                <p className="text-red-600 font-medium flex items-center gap-1.5 mb-1.5">
                  <X size={14} /> Assessment Denied / Feedback Received
                </p>
                <p className="text-red-500/80 mb-3 font-normal leading-relaxed">
                  Please review observations and resubmit with updated details.
                </p>
                <Link href={assessmentUrl} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-medium w-fit flex items-center gap-1.5 transition-colors">
                  Appeal & Modify Assessment <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="mt-2 flex justify-end">
                <Link href={assessmentUrl} className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-5 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5">
                  Complete Assessment Form <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Panel */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <CalendarCheck size={16} className="text-[#5D9C0E]" /> Application Timeline
          </h3>

          <div className="relative border-l border-gray-100 pl-5 space-y-5 text-xs">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[27px] top-0 bg-[#5D9C0E] text-white rounded-full p-1 border-2 border-white flex items-center justify-center">
                <CheckCircle2 size={11} />
              </span>
              <h4 className="font-medium text-gray-800">Account Registered</h4>
              <p className="text-gray-400 font-normal text-[10.5px]">Initial profile created</p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className={`absolute -left-[27px] top-0 rounded-full p-1 border-2 border-white flex items-center justify-center ${preAssessmentDone ? "bg-[#5D9C0E] text-white" : "bg-gray-100 text-gray-400"}`}>
                {preAssessmentDone ? <CheckCircle2 size={11} /> : <span className="w-2.5 h-2.5"></span>}
              </span>
              <h4 className={`font-medium ${preAssessmentDone ? "text-gray-800" : "text-gray-400"}`}>Pre-Assessment Submitted</h4>
              <p className="text-gray-400 font-normal text-[10.5px]">Discipline and classification</p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className={`absolute -left-[27px] top-0 rounded-full p-1 border-2 border-white flex items-center justify-center ${isFullyPaid ? "bg-[#5D9C0E] text-white" : "bg-gray-100 text-gray-400"}`}>
                {isFullyPaid ? <CheckCircle2 size={11} /> : <span className="w-2.5 h-2.5"></span>}
              </span>
              <h4 className={`font-medium ${isFullyPaid ? "text-gray-800" : "text-gray-400"}`}>Fees Paid</h4>
              <p className="text-gray-400 font-normal text-[10.5px]">Registration & Logistics</p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <span className={`absolute -left-[27px] top-0 rounded-full p-1 border-2 border-white flex items-center justify-center ${isAssessmentSubmitted ? "bg-[#5D9C0E] text-white" : "bg-gray-100 text-gray-400"}`}>
                {isAssessmentSubmitted ? <CheckCircle2 size={11} /> : <span className="w-2.5 h-2.5"></span>}
              </span>
              <h4 className={`font-medium ${isAssessmentSubmitted ? "text-gray-800" : "text-gray-400"}`}>Assessment Submitted</h4>
              <p className="text-gray-400 font-normal text-[10.5px]">Equipment, staff & space checklist</p>
            </div>

            {/* Step 5 */}
            <div className="relative">
              <span className={`absolute -left-[27px] top-0 rounded-full p-1 border-2 border-white flex items-center justify-center ${isVisitationAccepted ? "bg-[#5D9C0E] text-white" : "bg-gray-100 text-gray-400"}`}>
                {isVisitationAccepted ? <CheckCircle2 size={11} /> : <span className="w-2.5 h-2.5"></span>}
              </span>
              <h4 className={`font-medium ${isVisitationAccepted ? "text-gray-800" : "text-gray-400"}`}>Visitation Confirmed</h4>
              <p className="text-gray-400 font-normal text-[10.5px]">Scheduled inspection</p>
            </div>

            {/* Step 6 */}
            <div className="relative">
              <span className={`absolute -left-[27px] top-0 rounded-full p-1 border-2 border-white flex items-center justify-center ${isAccredited ? "bg-[#5D9C0E] text-white" : isAccreditationRejected ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                {isAccredited ? <CheckCircle2 size={11} /> : isAccreditationRejected ? <X size={11} /> : <span className="w-2.5 h-2.5"></span>}
              </span>
              <h4 className={`font-medium ${isAccredited || isAccreditationRejected ? "text-gray-800" : "text-gray-400"}`}>MRTB Decision</h4>
              <p className="text-gray-400 font-normal text-[10.5px]">Accreditation decision finalized</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ApplicationPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <ApplicationContent />
    </Suspense>
  );
}
