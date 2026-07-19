"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, FileText, CheckCircle2, X, CalendarDays, MessageSquare, CheckCircle, AlertTriangle, Users, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PreAssessmentView from './PreAssessmentView';
import FullAssessmentView from './AssessmentView';

interface OrganizationDrawerProps {
  userId: number | null;
  adminRole: string;
  onClose: () => void;
  onRefreshTable: () => void;
}

export default function OrganizationDrawer({ userId, adminRole, onClose, onRefreshTable }: OrganizationDrawerProps) {
  const router = useRouter();
  const [drawerData, setDrawerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [activeDocument, setActiveDocument] = useState<'pre_assessment' | 'assessment' | null>(null);

  // Form Inputs
  const [costInput, setCostInput] = useState({ estimate: "", logistics: "" });
  const [visitDate, setVisitDate] = useState("");
  const [adminComment, setAdminComment] = useState("");

  // Interactive Calendar State
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    payload: any;
    successMessage: string;
  } | null>(null);

  const isFieldTeam = adminRole === 'admin_field' || adminRole === 'Field Team';
  const isDocumentOpen = activeDocument !== null;

  const fetchUserDetails = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${userId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) {
        const data = await response.json();
        setDrawerData(data);
        if (data.pre_assessment) {
          setCostInput({
            estimate: data.pre_assessment.cost_estimate?.toString() || "",
            logistics: data.pre_assessment.logistics_fee?.toString() || ""
          });
          setVisitDate(data.pre_assessment.visit_date || "");
          setAdminComment(data.pre_assessment.admin_comment || "");
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetLeader = async (leaderId: number) => {
    setIsUpdatingStatus(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${userId}/set-leader`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ leader_id: leaderId })
      });
      if (response.ok) {
        await fetchUserDetails();
      } else {
        alert("Failed to assign leader.");
      }
    } catch (error) {
      console.error("Error setting leader:", error);
      alert("Network error.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setActiveDocument(null);
      setCostInput({ estimate: "", logistics: "" });
      setVisitDate("");
      setAdminComment("");
      setConfirmModal(null);
      return;
    }
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    if (visitDate) {
      const parts = visitDate.split('-');
      if (parts.length === 3) {
        setCalendarYear(parseInt(parts[0], 10));
        setCalendarMonth(parseInt(parts[1], 10) - 1);
      }
    }
  }, [visitDate]);

  const handleSaveData = async (payloadOverride: any, successMessage: string, shouldCloseDrawer = false) => {
    setIsUpdatingStatus(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    
    const payload = { new_status: currentStatus, ...payloadOverride };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${userId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        onRefreshTable();
        if (shouldCloseDrawer) onClose();
        else await fetchUserDetails();
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReconsiderDecision = async () => {
    setIsUpdatingStatus(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${userId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ new_status: 'forwarded' })
      });
      if (response.ok) {
        onRefreshTable();
        onClose();
        router.push(`/field-team/examine?id=${userId}`);
      } else {
        alert("Failed to reconsider decision.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const preAssessmentStatus = drawerData?.profile?.status;
  const assessmentStatus = drawerData?.profile?.assessment_status;
  const activePhase = (preAssessmentStatus === 'approved' && assessmentStatus) ? 2 : 1;
  const currentStatus = activePhase === 2 ? assessmentStatus : preAssessmentStatus;

  const isPaid = drawerData?.pre_assessment?.paid_registration && drawerData?.pre_assessment?.paid_logistics;
  const currentEst = parseFloat(costInput.estimate) || 0;
  const currentLog = parseFloat(costInput.logistics) || 0;
  const currentComment = adminComment.trim();

  const hasFinalizedReport = drawerData?.inspection_report !== null && drawerData?.inspection_report !== undefined;
  let isLockedForReviewer = false;
  let isLockedForRegistrar = false;

  if (activePhase === 2) {
    if (hasFinalizedReport) {
      // Post-visitation flow (reviewing the Field Team's submitted report)
      if (assessmentStatus === 'finalized') {
        isLockedForReviewer = false;
        isLockedForRegistrar = true;
      } else if (assessmentStatus === 'forwarded') {
        isLockedForReviewer = true;
        isLockedForRegistrar = false;
      } else if (assessmentStatus === 'approved' || assessmentStatus === 'rejected') {
        isLockedForReviewer = true;
        isLockedForRegistrar = true;
      } else {
        isLockedForReviewer = true;
        isLockedForRegistrar = true;
      }
    } else {
      // Pre-visitation flow (reviewing the Form C assessment before scheduling visitation)
      if (assessmentStatus === 'submitted' || assessmentStatus === 'under_review') {
        isLockedForReviewer = false;
        isLockedForRegistrar = true;
      } else if (assessmentStatus === 'recommended_accept' || assessmentStatus === 'recommended_reject') {
        isLockedForReviewer = true;
        isLockedForRegistrar = false;
      } else if (assessmentStatus === 'approved') {
        isLockedForReviewer = true;
        isLockedForRegistrar = true;
      } else {
        isLockedForReviewer = true;
        isLockedForRegistrar = true;
      }
    }
  } else {
    // Phase 1 pre-assessment locking
    isLockedForReviewer = adminRole === 'admin_reviewer' && 
      (preAssessmentStatus === 'recommended_accept' || preAssessmentStatus === 'recommended_reject' || preAssessmentStatus === 'approved' || preAssessmentStatus === 'rejected');
    isLockedForRegistrar = adminRole === 'admin_registrar' && 
      (preAssessmentStatus === 'approved' || preAssessmentStatus === 'rejected');
  }
  
  const hasVisitDate = visitDate !== "" && visitDate !== null;
  const disableAcceptance = isUpdatingStatus || 
    (activePhase === 1 && (currentEst <= 0 || currentLog <= 0)) || 
    (activePhase === 2 && !hasVisitDate);

  const currentDate = visitDate || "";
  const dbDate = drawerData?.pre_assessment?.visit_date || "";
  const canEditDate = (adminRole === 'admin_registrar' || (adminRole === 'admin_reviewer' && !isLockedForReviewer)) && !hasFinalizedReport;

  const submitDateAction = async () => {
    await handleSaveData({ visit_date: currentDate }, "Visitation schedule saved!", false);
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const days = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
    for (let i = 1; i <= daysInMonth; i++) {
      const d = String(i).padStart(2, '0');
      const m = String(calendarMonth + 1).padStart(2, '0');
      const dateStr = `${calendarYear}-${m}-${d}`;
      const isSelected = visitDate === dateStr;
      
      const cellDate = new Date(calendarYear, calendarMonth, i);
      const isPast = cellDate < today;

      days.push(
        <button
          key={dateStr}
          onClick={() => setVisitDate(dateStr)}
          disabled={!canEditDate || activePhase === 1 || isPast}
          className={`h-6 w-full rounded flex items-center justify-center transition-all text-[10px] ${isSelected ? 'bg-[#5D9C0E] text-white shadow-sm' : isPast ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent'}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <button onClick={handlePrevMonth} disabled={!canEditDate || activePhase === 1} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <span className="text-[11px] text-gray-800 font-medium">{monthNames[calendarMonth]} {calendarYear}</span>
          <button onClick={handleNextMonth} disabled={!canEditDate || activePhase === 1} className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center mb-1.5">
          {dayNames.map(day => <div key={day} className="text-[8px] text-gray-400 uppercase">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-0.5 gap-x-0.5">{days}</div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <label className="text-[9px] text-gray-500 mb-1 block uppercase font-medium">Or enter date manually</label>
          <input 
            type="date" 
            value={visitDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              const selectedStr = e.target.value;
              if (selectedStr) {
                const selectedDate = new Date(selectedStr);
                selectedDate.setHours(0, 0, 0, 0);
                const currentToday = new Date();
                currentToday.setHours(0, 0, 0, 0);
                if (selectedDate < currentToday) {
                  alert("You cannot select a date in the past.");
                  return;
                }
              }
              setVisitDate(selectedStr);
            }}
            disabled={!canEditDate || activePhase === 1}
            className="w-full px-2 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-700 outline-none focus:border-[#5D9C0E] disabled:bg-gray-50 transition-colors"
          />
        </div>
      </div>
    );
  };

  if (!userId) return null;

  // SMART WIDTH CALCULATION: Expands smoothly if a document is opened!
  const drawerMaxWidth = isDocumentOpen ? 'max-w-[850px]' : (isFieldTeam ? 'max-w-[500px]' : 'max-w-[850px]');
  const flexLayout = (isFieldTeam && !isDocumentOpen) ? 'flex-col' : 'flex-col md:flex-row';

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-[2px] transition-opacity">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className={`relative w-full ${drawerMaxWidth} bg-white h-full shadow-2xl flex ${flexLayout} animate-in slide-in-from-right duration-300 overflow-hidden rounded-l-3xl transition-all`}>
        
        <button onClick={onClose} className="absolute top-3 right-3 md:right-4 z-50 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors">
          <X size={16} />
        </button>

        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#5D9C0E] mb-3" />
            <p className="text-sm text-gray-500 font-medium">Loading profile data...</p>
          </div>
        ) : drawerData && (
          <>
            {activeDocument === 'pre_assessment' && <PreAssessmentView drawerData={drawerData} onBack={() => setActiveDocument(null)} />}
            {activeDocument === 'assessment' && <FullAssessmentView drawerData={drawerData} onBack={() => setActiveDocument(null)} />}

            {activeDocument === null && (
              <>
                {/* LEFT PANEL */}
                <div className={`w-full ${isFieldTeam ? '' : 'md:w-1/2'} bg-slate-50 h-full overflow-y-auto px-3 py-4 md:p-6 flex flex-col ${isFieldTeam ? '' : 'border-r border-[#CDE1B4]/50'}`}>
                  <div>
                    <div className="w-full h-[150px] rounded-xl overflow-hidden mb-4 shadow-sm border border-black/5 bg-white shrink-0">
                      <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Clinic" className="w-full h-full object-cover" />
                    </div>
                    <div className="mb-4 flex-1">
                      <h2 className="text-xl text-gray-900 leading-tight pr-2 mb-0.5 font-medium">{drawerData.profile.name}</h2>
                      <p className="text-[#5D9C0E] text-xs mb-4 font-medium">{drawerData.profile.profession} Organization</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-white border border-[#CDE1B4]/50 rounded-md text-[10px] text-gray-700 font-medium">{drawerData.profile.category}</span>
                        <span className="px-2.5 py-1 bg-white border border-[#CDE1B4]/50 rounded-md text-[10px] text-gray-700 font-medium">{drawerData.profile.sub_category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[20px]"></div>

                  <div className="my-auto py-4">
                    <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm mb-3 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#F8FCF5] rounded-lg text-[#5D9C0E]"><FileText size={16} /></div>
                        <div>
                          <span className="text-xs text-gray-800 flex items-center gap-1 font-medium">
                            Phase 1: Pre-assessment
                            {preAssessmentStatus === 'approved' && <CheckCircle2 size={12} className="text-[#5D9C0E]" />}
                          </span>
                          <span className="text-[9px] text-gray-400 uppercase font-medium">View Document</span>
                        </div>
                      </div>
                      <button onClick={() => setActiveDocument('pre_assessment')} disabled={!drawerData.pre_assessment} className="px-4 py-2 border border-gray-200 rounded-lg text-[10px] text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm transition-colors font-medium">
                        Access
                      </button>
                    </div>

                    {drawerData.full_assessment && (
                      <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm mb-5 border border-[#5D9C0E]/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#5D9C0E]"></div>
                        <div className="flex items-center gap-3 pl-1">
                          <div className="p-2 bg-[#F8FCF5] rounded-lg text-[#5D9C0E]"><FileText size={16} /></div>
                          <div>
                            <span className="text-xs text-gray-800 flex items-center gap-1 font-medium">
                              Phase 2: Assessment
                              {assessmentStatus === 'approved' && <CheckCircle2 size={12} className="text-[#5D9C0E]" />}
                            </span>
                            <span className="text-[9px] text-[#5D9C0E] uppercase font-medium">View Document</span>
                          </div>
                        </div>
                        <button onClick={() => setActiveDocument('assessment')} className="px-4 py-2 bg-[#F8FCF5] text-[#5D9C0E] rounded-lg text-[10px] hover:bg-[#EEF6DF] shadow-sm transition-colors font-medium">
                          Access
                        </button>
                      </div>
                    )}

                    {/* ONLY SHOW DECISION BUTTONS IF NOT FIELD TEAM */}
                    {!isFieldTeam && (
                      <div className="flex flex-col gap-2 mt-5">
                        
                         {/* VIEW FIELD REPORT BUTTONS FOR EACH OFFICER */}
                         {activePhase === 2 && drawerData?.all_inspection_reports && drawerData.all_inspection_reports.length > 0 && assessmentStatus && assessmentStatus !== 'submitted' && assessmentStatus !== 'inspected' && (
                            <Link
                              href={`/field-team/examine?id=${userId}`}
                              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-md mb-4 transition-all"
                            >
                              <ClipboardCheck size={16} className="text-[#65A30D]" /> Access the Report
                            </Link>
                         )}
                        
                        {activePhase === 1 && (currentEst <= 0 || currentLog <= 0) && !isLockedForReviewer && !isLockedForRegistrar && adminRole !== 'admin_accreditation' && (
                          <div className="mb-2 text-center animate-in fade-in">
                            <span className="text-[10px] text-red-600 font-medium bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100 flex items-center justify-center gap-1.5 w-max mx-auto shadow-sm">
                              <AlertTriangle size={12} className="text-red-500" /> Please set cost estimates before accepting.
                            </span>
                          </div>
                        )}

                        {activePhase === 2 && !hasVisitDate && !isLockedForReviewer && !isLockedForRegistrar && adminRole !== 'admin_accreditation' && (
                          <div className="mb-2 text-center animate-in fade-in">
                            <span className="text-[10px] text-red-600 font-medium bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100 flex items-center justify-center gap-1.5 w-max mx-auto shadow-sm">
                              <AlertTriangle size={12} className="text-red-500" /> Please schedule a visitation date to recommend acceptance.
                            </span>
                          </div>
                        )}

                        {adminRole === 'admin_accreditation' ? (
                          <button className="w-full py-2.5 bg-[#5D9C0E] text-white rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#4a7c0b] transition-all font-medium">
                            Start assessment
                          </button>
                        ) 
                        : adminRole === 'admin_reviewer' ? (
                          activePhase === 2 && drawerData?.inspection_report ? (
                            <div className="bg-[#f8fcf5] border border-[#CDE1B4]/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                              <CheckCircle2 size={24} className="text-[#5D9C0E] mb-1" />
                              <span className="text-[12px] font-medium text-[#066936]">Report Evaluation In Progress</span>
                              <span className="text-[10px] text-gray-500 font-medium">Please review, edit, and forward the report via the "View Field Report" button above.</span>
                            </div>
                          ) : isLockedForReviewer ? (
                            <div className="bg-[#f8fcf5] border border-[#CDE1B4]/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                              <CheckCircle2 size={24} className="text-[#5D9C0E] mb-1" />
                              <span className="text-[12px] font-medium text-[#066936]">Decision Submitted to Registrar</span>
                              <span className="text-[10px] text-gray-500 font-medium">You can no longer edit this record.</span>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setConfirmModal({
                                  isOpen: true,
                                  title: "Confirm Recommendation",
                                  message: "Are you sure you want to recommend rejection? Changes cannot be made after submitting to the registrar.",
                                  payload: { new_status: 'recommended_reject', admin_comment: currentComment },
                                  successMessage: "Rejection Recommended!"
                                })} 
                                disabled={isUpdatingStatus} 
                                className="flex-1 py-2.5 border border-red-500 text-red-500 bg-white rounded-xl text-[11px] hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 font-medium"
                              >
                                Recommend Reject
                              </button>
                              <button 
                                onClick={() => setConfirmModal({
                                  isOpen: true,
                                  title: "Confirm Recommendation",
                                  message: "Are you sure you want to recommend approval? Changes cannot be made after submitting to the registrar.",
                                  payload: { new_status: 'recommended_accept', cost_estimate: currentEst, logistics_fee: currentLog, admin_comment: currentComment, visit_date: visitDate },
                                  successMessage: "Acceptance Recommended!"
                                })} 
                                disabled={disableAcceptance} 
                                className="flex-1 py-2.5 text-white bg-[#5D9C0E] rounded-xl text-[11px] shadow-md hover:bg-[#4a7c0b] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 font-medium"
                              >
                                Recommend Accept
                              </button>
                            </div>
                          )
                        ) 
                        : (
                          isLockedForRegistrar ? (
                            activePhase === 2 && (assessmentStatus === 'approved' || assessmentStatus === 'rejected') ? (
                              <div className="bg-[#f8fcf5] border border-[#CDE1B4]/50 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3 w-full">
                                {assessmentStatus === 'approved' ? (
                                  <div className="flex flex-col items-center">
                                    <CheckCircle2 size={24} className="text-[#066936] mb-1" />
                                    <span className="text-[12px] font-extrabold text-[#066936]">Accreditation Granted</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center">
                                    <X size={24} className="text-red-500 mb-1" />
                                    <span className="text-[12px] font-extrabold text-red-600">Accreditation Rejected</span>
                                  </div>
                                )}
                                <span className="text-[10px] text-gray-400 font-medium leading-normal">This application cycle is closed.</span>
                                {adminRole === 'admin_registrar' && (
                                  <button
                                    onClick={handleReconsiderDecision}
                                    disabled={isUpdatingStatus}
                                    className="w-full mt-2 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-750 font-bold border border-yellow-300 rounded-xl text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                                  >
                                    Reconsider Decision
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="bg-[#f8fcf5] border border-[#CDE1B4]/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                <CheckCircle2 size={24} className="text-[#5D9C0E] mb-1" />
                                <span className="text-[12px] font-medium text-[#066936]">Final Decision Made</span>
                                <span className="text-[10px] text-gray-500 font-medium">This application cycle is closed.</span>
                              </div>
                            )
                          ) : (
                            <div className="flex gap-2">
                              {activePhase === 2 && drawerData?.inspection_report ? (
                                <>
                                  <button 
                                    onClick={() => setConfirmModal({
                                      isOpen: true,
                                      title: "Confirm Rejection",
                                      message: "Are you sure you want to reject accreditation for this facility? This will be shown on the user's dashboard.",
                                      payload: { new_status: 'rejected', admin_comment: currentComment },
                                      successMessage: "Accreditation Rejected."
                                    })} 
                                    disabled={isUpdatingStatus} 
                                    className="flex-1 py-2.5 border border-red-500 text-red-500 bg-white rounded-xl text-[11px] hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 font-medium"
                                  >
                                    Reject Accreditation
                                  </button>
                                  <button 
                                    onClick={() => setConfirmModal({
                                      isOpen: true,
                                      title: "Confirm Accreditation",
                                      message: "Are you sure you want to grant accreditation to this facility? This will be shown on the user's dashboard.",
                                      payload: { new_status: 'approved', cost_estimate: currentEst, logistics_fee: currentLog, admin_comment: currentComment, visit_date: visitDate },
                                      successMessage: "Accreditation Granted Successfully!"
                                    })} 
                                    disabled={disableAcceptance} 
                                    className="flex-1 py-2.5 text-white bg-[#066936] rounded-xl text-[11px] shadow-md hover:bg-[#044c27] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 font-medium"
                                  >
                                    Grant Accreditation
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => setConfirmModal({
                                      isOpen: true,
                                      title: "Confirm Final Decision",
                                      message: "Are you sure you want to finalize this rejection? This will be shown on the user's dashboard.",
                                      payload: { new_status: 'rejected', admin_comment: currentComment },
                                      successMessage: "Application Rejected."
                                    })} 
                                    disabled={isUpdatingStatus} 
                                    className="flex-1 py-2.5 border border-red-500 text-red-500 bg-white rounded-xl text-[11px] hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 font-medium"
                                  >
                                    Final Reject
                                  </button>
                                  <button 
                                    onClick={() => setConfirmModal({
                                      isOpen: true,
                                      title: "Confirm Final Decision",
                                      message: "Are you sure you want to finalize approval? This will be shown on the user's dashboard.",
                                      payload: { new_status: 'approved', cost_estimate: currentEst, logistics_fee: currentLog, admin_comment: currentComment, visit_date: visitDate },
                                      successMessage: "Application Fully Approved!"
                                    })} 
                                    disabled={disableAcceptance} 
                                    className="flex-1 py-2.5 text-white bg-[#066936] rounded-xl text-[11px] shadow-md hover:bg-[#044c27] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 font-medium"
                                  >
                                    Finalize Approve
                                  </button>
                                </>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-h-[20px]"></div>

                   {/* INSPECTION PANEL MEMBERS & LEADER SELECTION */}
                   {activePhase === 2 && (
                     <div className="mb-4 pt-4 border-t border-[#CDE1B4]/50 animate-in fade-in">
                       <p className="text-[#5D9C0E] text-[10px] mb-2 uppercase tracking-wider font-medium flex items-center gap-1">
                         <Users size={12} /> Inspection Panel
                       </p>
                       <div className="bg-[#FAFCF8] border border-[#CDE1B4]/30 rounded-xl p-3 space-y-2">
                         {drawerData?.panel_members_details && drawerData.panel_members_details.length > 0 ? (
                           drawerData.panel_members_details.map((member: any) => (
                             <div key={member.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-gray-150">
                               <div className="flex flex-col pr-2 truncate">
                                 <span className="text-[12px] font-bold text-gray-800 truncate">{member.name}</span>
                                 <span className="text-[9.5px] text-gray-400">ID: {member.staffId}</span>
                               </div>
                               {member.is_leader ? (
                                 <span className="text-[9px] font-bold text-[#066936] bg-[#EEF6DF] px-2 py-0.5 rounded border border-[#CDE1B4]/40 uppercase tracking-wider shrink-0">
                                   Leader
                                 </span>
                               ) : (
                                 (adminRole === 'admin_reviewer' || adminRole === 'admin_registrar') && (
                                   <button
                                     type="button"
                                     onClick={() => handleSetLeader(member.id)}
                                     disabled={isUpdatingStatus}
                                     className="text-[9.5px] font-bold text-[#5D9C0E] hover:text-[#4a7c0b] px-2 py-0.5 border border-[#5D9C0E]/30 rounded hover:bg-[#FAFCF8] transition-colors shrink-0 disabled:opacity-50"
                                   >
                                     Make Leader
                                   </button>
                                 )
                               )}
                             </div>
                           ))
                         ) : (
                           <p className="text-[11px] text-gray-400 italic text-center">No field inspectors assigned yet.</p>
                         )}
                       </div>
                     </div>
                   )}

                   <div className="flex-1 min-h-[20px]"></div>

                  <div className="mt-auto bg-white/50 p-4 rounded-xl border border-[#CDE1B4]/50">
                    <p className="text-[#5D9C0E] text-[10px] mb-2 uppercase tracking-wider font-medium">Facility Contacts</p>
                    <p className="text-gray-700 text-xs mb-0.5 font-medium">{drawerData.profile.phone}</p>
                    <p className="text-gray-500 text-xs break-all font-medium">{drawerData.profile.email}</p>
                  </div>
                </div>

                {/* ONLY SHOW RIGHT PANEL IF NOT FIELD TEAM */}
                {!isFieldTeam && (
                  <div className="w-full md:w-1/2 h-full overflow-y-auto bg-white px-3 py-4 md:p-6 flex flex-col">
                    
                    <div className="mb-6">
                      <h3 className="text-[11px] font-medium text-[#066936] mb-3 uppercase tracking-wider flex items-center gap-1.5">Cost & Remarks</h3>
                      {isPaid ? (
                        <div className="flex flex-col p-4 bg-[#F8FCF5] border border-[#5D9C0E]/30 rounded-xl mb-4 text-center items-center justify-center">
                          <CheckCircle size={28} className="text-[#5D9C0E] mb-2" />
                          <h4 className="text-[#5D9C0E] text-[14px] font-medium">Payments Confirmed</h4>
                          <p className="text-[11px] text-gray-500 mt-1 font-medium">Registration & Logistics paid by user.</p>
                        </div>
                      ) : (
                        <div className={`p-4 rounded-xl border transition-colors ${!isLockedForReviewer && activePhase === 1 ? 'border-[#5D9C0E]/50 bg-white shadow-sm' : 'border-gray-200 bg-slate-50'}`}>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="text-[9px] text-gray-500 mb-1 block uppercase font-medium">Registration</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">₦</span>
                                <input type="number" value={costInput.estimate} onChange={(e) => setCostInput({...costInput, estimate: e.target.value})} disabled={isLockedForReviewer || activePhase === 2} className="w-full pl-7 pr-2 py-1.5 rounded-md border border-gray-200 outline-none text-gray-800 text-[13px] focus:border-[#5D9C0E] disabled:bg-gray-100 disabled:text-gray-400 transition-all font-medium" />
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 mb-1 block uppercase font-medium">Logistics</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">₦</span>
                                <input type="number" value={costInput.logistics} onChange={(e) => setCostInput({...costInput, logistics: e.target.value})} disabled={isLockedForReviewer || activePhase === 2} className="w-full pl-7 pr-2 py-1.5 rounded-md border border-gray-200 outline-none text-gray-800 text-[13px] focus:border-[#5D9C0E] disabled:bg-gray-100 disabled:text-gray-400 transition-all font-medium" />
                              </div>
                            </div>
                          </div>

                          <div>
                             <label className="text-[9px] text-gray-500 mb-1 block uppercase font-medium">Internal Remarks</label>
                             <div className="relative">
                                <MessageSquare size={12} className="absolute left-2.5 top-2.5 text-gray-300" />
                                <textarea value={adminComment} onChange={(e) => setAdminComment(e.target.value)} disabled={isLockedForReviewer} placeholder="Add internal notes..." className="w-full pl-7 pr-2 py-2 rounded-md border border-gray-200 outline-none text-gray-700 text-[12px] focus:border-[#5D9C0E] disabled:bg-gray-100 disabled:text-gray-400 resize-none h-14 transition-all font-medium" />
                             </div>
                          </div>

                          {!isLockedForReviewer && activePhase === 1 && !isLockedForRegistrar && (
                            <div className="mt-3 text-[9px] text-gray-400 italic text-center font-medium">
                              Note: Fees and remarks will be saved when you click Accept or Reject.
                            </div>
                          )}

                          {adminRole === 'admin_registrar' && isLockedForRegistrar && (
                            <button 
                                onClick={() => handleSaveData({ cost_estimate: currentEst, logistics_fee: currentLog, admin_comment: currentComment }, "Updates saved successfully!", false)}
                                disabled={isUpdatingStatus}
                                className="w-full mt-4 py-2 bg-[#EEF6DF] text-[#066936] font-medium text-[10px] rounded-lg border border-[#5D9C0E]/30 hover:bg-[#dcedc1] transition-colors flex justify-center items-center uppercase tracking-wider"
                            >
                                {isUpdatingStatus ? <Loader2 size={12} className="animate-spin" /> : "Save Updates to Cost & Remarks"}
                            </button>
                          )}
                        </div>
                       )}
                    </div>

                    <div className="flex-1 flex flex-col pb-2 relative">
                      <h3 className="text-[11px] text-[#066936] font-medium mb-3 uppercase tracking-wider flex items-center gap-1.5">
                          <CalendarDays size={13} className={activePhase === 2 ? "text-[#5D9C0E]" : "text-gray-400"} /> Schedule Inspection
                      </h3>
                      
                      {activePhase === 1 ? (
                        <div className="opacity-40 pointer-events-none select-none flex-1 flex flex-col grayscale-[20%]">
                          <div className="mb-3">{renderCalendar()}</div>
                          <div className="mt-auto">
                            <button disabled={true} className="w-full py-2 rounded-md text-[10px] uppercase tracking-wider transition-all shadow-sm bg-gray-200 text-gray-400 font-medium">
                              Submit Schedule
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col">
                          {!canEditDate && adminRole === 'admin_reviewer' && (assessmentStatus === 'submitted' || assessmentStatus === 'under_review') && (
                            <div className="bg-[#f8fcf5] text-[#066936] p-2.5 rounded-lg text-[10px] mb-3 flex items-start gap-2 shadow-sm border border-[#CDE1B4]/50">
                              <span className="flex items-center justify-center min-w-[14px] w-3.5 h-3.5 bg-[#EEF6DF] rounded-full mt-0.5 font-medium">i</span>
                              <span className="font-medium">Recommend acceptance on the left to unlock scheduling.</span>
                            </div>
                          )}

                          <div className="mb-3">{renderCalendar()}</div>
                          
                          <div className="mt-auto">
                            <div className="flex items-center justify-between mb-2.5 bg-slate-50 p-2.5 rounded-lg border border-gray-100">
                               <span className="text-[11px] text-gray-600 font-medium">Selected:</span>
                               <span className="text-[13px] text-gray-500 font-medium">{visitDate || "None"}</span>
                            </div>

                            <button 
                              onClick={submitDateAction}
                              disabled={!canEditDate || !visitDate || isUpdatingStatus || (currentDate === dbDate && dbDate !== "")}
                              className={`w-full py-2 rounded-md text-[10px] uppercase tracking-wider transition-all shadow-sm font-medium ${(!canEditDate || !visitDate || (currentDate === dbDate && dbDate !== "")) ? 'bg-gray-100 text-gray-500 border border-gray-200' : 'bg-[#066936] text-white hover:bg-[#044c27]'} disabled:opacity-50`}
                            >
                              {adminRole === 'admin_accreditation' ? 'Locked (Admin Only)' : ((currentDate === dbDate && dbDate !== "") ? 'Schedule Saved ✓' : 'Save Schedule')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {confirmModal && confirmModal.isOpen && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 rounded-l-3xl transition-opacity">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 border border-gray-100">
              <div className="flex items-center gap-3 mb-3 text-[#066936]">
                <AlertTriangle size={24} className="text-[#5D9C0E]" />
                <h3 className="text-lg font-medium">{confirmModal.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed font-medium">
                {confirmModal.message}
              </p>
              <div className="flex gap-3">
                <button 
                  disabled={isUpdatingStatus}
                  onClick={() => setConfirmModal(null)} 
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-xs hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  No, Cancel
                </button>
                <button 
                  disabled={isUpdatingStatus}
                  onClick={async () => {
                    await handleSaveData(confirmModal.payload, confirmModal.successMessage, false);
                    setConfirmModal(null);
                  }} 
                  className="flex-1 py-2.5 rounded-xl bg-[#5D9C0E] text-white font-medium text-xs shadow-md hover:bg-[#4a7c0b] transition-all disabled:opacity-50 flex justify-center items-center"
                >
                  {isUpdatingStatus ? <Loader2 size={14} className="animate-spin" /> : "Yes, I'm sure"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}