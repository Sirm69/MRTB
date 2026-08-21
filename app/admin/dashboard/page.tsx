"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { Calendar, Bell, Download, Building2, CalendarDays, Loader2, Filter, AlertCircle, CheckCircle2, Users, LogOut, XCircle, ClipboardCheck, FileText, AlertTriangle } from 'lucide-react';
import OrganizationDrawer from '../components/OrganizationDrawer';
import { generateAccreditationReportPDF } from '../../components/pdfGenerator';

interface ApplicationData {
  id: number;
  name: string;
  profession: string;
  email: string;
  category: string;
  status: string;
  assessment_status: string | null;
  is_appeal?: boolean;
  is_paid?: boolean; 
  has_finalized_report?: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminRole, setAdminRole] = useState<string>(''); 
  const [adminEmail, setAdminEmail] = useState<string>(''); 
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [checkedOrgId, setCheckedOrgId] = useState<number | null>(null);
  
  const [activeTab, setActiveTab] = useState<"action_required" | "awaiting_registrar" | "all" | "rejected" | "field_reports" | "scheduled">("action_required");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all");
  
  // Custom states for admin pending approvals
  const [pendingAdminsCount, setPendingAdminsCount] = useState<number>(0);
  
  // Custom Confirmation state
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const fetchApplications = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    const role = localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole') || localStorage.getItem('role') || '';
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/applications`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data.data || []);
      } else {
        if (response.status === 401 || response.status === 403) router.push('/admin/login');
      }

      // Fetch pending admins list to display notifications on dashboard
      if (role === 'admin_registrar') {
        const adminsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/list`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
        });
        if (adminsRes.ok) {
          const adminsData = await adminsRes.json();
          const pendingAdmins = (adminsData.data || []).filter((a: any) => a.status === 'pending_approval');
          setPendingAdminsCount(pendingAdmins.length);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const role = localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole') || localStorage.getItem('role') || '';
    setAdminRole(role);
    const email = localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail') || '';
    setAdminEmail(email);

    // --- THE SMART BOUNCER ---
    // Instantly redirect Field Team members to their own dedicated application folder
    if (role === 'admin_field' || role === 'Field Team') {
      router.push('/field-team/dashboard');
      return;
    }

    fetchApplications(true);
  }, [router, fetchApplications]);

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  const confirmLogoutAction = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminRole');
    sessionStorage.removeItem('adminAccessToken');
    sessionStorage.removeItem('adminRefreshToken');
    sessionStorage.removeItem('adminRole');
    router.push('/admin/login');
  };

  const handleDownloadCheckedReport = async () => {
    if (!checkedOrgId) {
      alert("Please select a facility checkbox to download their evaluation report.");
      return;
    }

    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    if (!token) {
      alert("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${checkedOrgId}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'ngrok-skip-browser-warning': 'true' 
        }
      });

      if (response.ok) {
        const resData = await response.json();
        const profile = resData.profile;
        const report = resData.inspection_report;
        const fullAssessment = resData.full_assessment;

        // Check if final decision has been made
        const isFinalDecisionMade = profile?.status === "approved" || profile?.status === "rejected" || profile?.assessment_status === "approved" || profile?.assessment_status === "rejected";

        if (!isFinalDecisionMade) {
          alert("Evaluation Report is not yet available because the final accreditation decision has not been made by the Registrar.");
          return;
        }

        // Open print view in new tab
        window.open(`/report/print?id=${checkedOrgId}`, '_blank');
      } else {
        alert("Failed to retrieve organization details.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred while fetching report details.");
    }
  };

  const isActionRequired = (app: ApplicationData) => {
    const activeStatus = app.status === 'approved' && app.assessment_status ? app.assessment_status : app.status;
    if (adminRole === 'admin_reviewer') return activeStatus === 'under_review' || activeStatus === 'submitted' || activeStatus === 'finalized';
    if (adminRole === 'admin_registrar') return activeStatus === 'recommended_accept' || activeStatus === 'recommended_reject' || activeStatus === 'forwarded';
    return false;
  };

  const actionRequiredCount = applications.filter(isActionRequired).length + (adminRole === 'admin_registrar' ? pendingAdminsCount : 0);
  
  const awaitingRegistrarCount = applications.filter(app => {
    const activeStatus = app.status === 'approved' && app.assessment_status ? app.assessment_status : app.status;
    return activeStatus === 'recommended_accept' || activeStatus === 'recommended_reject' || activeStatus === 'forwarded';
  }).length;

  const rejectedCount = applications.filter(app => {
    const activeStatus = app.status === 'approved' && app.assessment_status ? app.assessment_status : app.status;
    return activeStatus === 'rejected';
  }).length;

  const fieldReportsCount = applications.filter(app => {
    return app.status === 'approved' && app.has_finalized_report === true;
  }).length;

  const scheduledCount = applications.filter(app => {
    return app.status === 'approved' && app.has_finalized_report !== true && (app.assessment_status === 'approved' || app.assessment_status === 'inspected');
  }).length;

  const tabFilteredApps = applications.filter(app => {
    const activeStatus = app.status === 'approved' && app.assessment_status ? app.assessment_status : app.status;
    if (activeTab === 'all') return true;
    if (activeTab === 'action_required') return isActionRequired(app);
    if (activeTab === 'awaiting_registrar') {
      return activeStatus === 'recommended_accept' || activeStatus === 'recommended_reject' || activeStatus === 'forwarded';
    }
    if (activeTab === 'rejected') return activeStatus === 'rejected';
    if (activeTab === 'field_reports') {
      return app.status === 'approved' && app.has_finalized_report === true;
    }
    if (activeTab === 'scheduled') {
      return app.status === 'approved' && app.has_finalized_report !== true && (app.assessment_status === 'approved' || app.assessment_status === 'inspected');
    }
    return false;
  });

  const finalFilteredApplications = tabFilteredApps.filter(app => {
    const activeStatus = app.status === 'approved' && app.assessment_status ? app.assessment_status : app.status;
    if (currentFilter === "all") return true;
    if (currentFilter === "needs_review") return activeStatus === "under_review" || activeStatus === "submitted";
    if (currentFilter === "with_registrar") return activeStatus === "recommended_accept" || activeStatus === "recommended_reject";
    if (currentFilter === "scheduled") return activeStatus === "approved";
    if (currentFilter === "rejected") return activeStatus === "rejected";
    return true;
  });

  const formatStatus = (status: string, assessmentStatus: string | null, isPaid: boolean = false, hasFinalizedReport: boolean = false) => {
    if (assessmentStatus) {
      if (hasFinalizedReport) {
        switch(assessmentStatus) {
          case 'approved':
            return <span className="text-[#066936] bg-[#E8F5E9] border border-[#CDE1B4] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Accredited</span>;
          case 'rejected':
            return <span className="text-red-650 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Accreditation Rejected</span>;
          case 'forwarded':
            return <span className="text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Await Decision</span>;
          case 'finalized':
            return <span className="text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Report Finalized</span>;
          default:
            return <span className="text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{assessmentStatus.replace('_', ' ')}</span>;
        }
      }

      switch(assessmentStatus) {
        case 'submitted': 
        case 'under_review':
          return <span className="text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Assessment: Needs Review</span>;
        case 'recommended_accept': 
          return <span className="text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Assessment: Await Registrar</span>;
        case 'approved': 
          return <span className="text-[#65A30D] bg-[#F4F9F2] border border-[#65A30D]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Inspection Scheduled</span>;
        default: 
          return <span className="text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{assessmentStatus}</span>;
      }
    }

    switch(status) {
      case 'under_review': 
        return <span className="text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Needs Review</span>;
      case 'recommended_accept': 
        return <span className="text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Awaiting Registrar (Accept)</span>;
      case 'recommended_reject': 
        return <span className="text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Awaiting Registrar (Reject)</span>;
      case 'approved': 
        return isPaid 
          ? <span className="text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Paid - Await Assessment</span>
          : <span className="text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Pending Payment</span>;
      case 'rejected': 
        return <span className="text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Final Rejected</span>;
      default: 
        return <span className="text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{status.replace('_', ' ')}</span>;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={48} className="animate-spin text-[#65A30D]" /></div>;
  }

  return (
    <div className="pb-12 relative w-full">
      
      {/* TOP NAVIGATION */}
      <div className="flex justify-end items-center mb-6 gap-2 sm:gap-3 w-full">
        {(adminRole === 'admin_reviewer' || adminRole === 'admin_registrar') && (
          <Link 
            href="/admin/manage-admins"
            className="hidden sm:flex items-center gap-2 bg-white px-3.5 h-9 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200/80 font-medium text-xs text-gray-700"
          >
            <Users size={14} className="text-[#066936]" /> 
            <span>{adminRole === 'admin_registrar' ? 'Approve Admins' : 'Manage Admins'}</span>
          </Link>
        )}

        <button className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-gray-200/80 hover:bg-gray-50 text-gray-600 transition-colors shrink-0 cursor-pointer">
          <Calendar size={15} className="text-[#066936]" />
        </button>
        <button className="relative w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-gray-200/80 hover:bg-gray-50 text-gray-600 transition-colors shrink-0 cursor-pointer">
          <Bell size={15} className="text-[#066936]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="bg-white rounded-xl h-9 px-2.5 flex items-center gap-2 border border-gray-200/80 shrink-0">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 ${adminRole === 'admin_registrar' ? 'bg-[#0f172a]' : 'bg-[#066936]'}`}>
            <Building2 size={12} />
          </div>
          <div className="flex flex-col pr-1 hidden sm:flex">
            <span className="text-[11.5px] font-medium text-gray-800 leading-tight">
              {adminRole === 'admin_registrar' ? 'Registrar' : (adminRole === 'admin_reviewer' && adminEmail === 'admin@mrtb.gov.ng') ? 'Super Admin' : adminRole === 'admin_reviewer' ? 'Reviewer' : 'Super Admin'}
            </span>
            <span className="text-[9.5px] text-gray-400 font-normal">Portal Access</span>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-1.5 bg-red-50/70 hover:bg-red-100 text-red-600 px-3 h-9 rounded-xl transition-colors border border-red-100 font-medium text-xs shrink-0 cursor-pointer">
          <LogOut size={13} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl md:rounded-3xl mb-6 p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-100 w-full">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-xs text-gray-400 font-normal mt-0.5">
            {adminRole === 'admin_registrar' ? 'Finalize and approve scheduled visitations.' : 'Review new applications and prepare cost estimates.'}
          </p>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-2.5">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border border-gray-200/80 bg-gray-50/50 text-gray-600 px-3.5 h-9 rounded-xl hover:bg-gray-100/60 font-normal text-xs transition-colors whitespace-nowrap cursor-pointer">
             <CalendarDays size={13} className="text-gray-400" /> 
             <span className="hidden sm:inline">Jan 15 - Till date</span>
             <span className="sm:hidden">Jan 15 - Today</span>
          </button>
          <button 
            onClick={handleDownloadCheckedReport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-4 h-9 rounded-xl font-medium text-xs transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            <Download size={13} /> Download report
          </button>
        </div>
      </div>

      {/* SMART TABS */}
      <div className="mb-5 md:mb-6 flex flex-wrap gap-2 md:gap-3 w-full justify-center">
        <button onClick={() => {setActiveTab('action_required'); setCurrentFilter('all');}} className={`relative px-4 py-2 rounded-full font-medium text-xs flex items-center gap-1.5 transition-all ${activeTab === 'action_required' ? 'bg-[#5D9C0E] text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}>
          <AlertCircle size={13} /> Action Required
          {actionRequiredCount > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === 'action_required' ? 'bg-white text-[#5D9C0E]' : 'bg-red-100 text-red-650'}`}>{actionRequiredCount}</span>
          )}
        </button>

        {adminRole === 'admin_reviewer' && (
          <button onClick={() => {setActiveTab('awaiting_registrar'); setCurrentFilter('all');}} className={`relative px-4 py-2 rounded-full font-medium text-xs flex items-center gap-1.5 transition-all ${activeTab === 'awaiting_registrar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}>
            <AlertCircle size={13} /> Awaiting Registrar
            {awaitingRegistrarCount > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === 'awaiting_registrar' ? 'bg-white text-blue-600' : 'bg-blue-50 text-blue-600'}`}>{awaitingRegistrarCount}</span>
            )}
          </button>
        )}
        
        <button onClick={() => {setActiveTab('rejected'); setCurrentFilter('all');}} className={`relative px-4 py-2 rounded-full font-medium text-xs flex items-center gap-1.5 transition-all ${activeTab === 'rejected' ? 'bg-red-50 text-red-600 border border-red-250' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}>
          <XCircle size={13} /> Rejected
          {rejectedCount > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-gray-100 text-gray-600'}`}>{rejectedCount}</span>
          )}
        </button>

        <button onClick={() => {setActiveTab('field_reports'); setCurrentFilter('all');}} className={`relative px-4 py-2 rounded-full font-medium text-xs flex items-center gap-1.5 transition-all ${activeTab === 'field_reports' ? 'bg-[#5D9C0E] text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}>
          <ClipboardCheck size={13} /> Reports
          {fieldReportsCount > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === 'field_reports' ? 'bg-white text-[#5D9C0E]' : 'bg-[#EEF6DF] text-[#5D9C0E]'}`}>{fieldReportsCount}</span>
          )}
        </button>

        <button onClick={() => {setActiveTab('scheduled'); setCurrentFilter('all');}} className={`relative px-4 py-2 rounded-full font-medium text-xs flex items-center gap-1.5 transition-all ${activeTab === 'scheduled' ? 'bg-[#5D9C0E] text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}>
          <CalendarDays size={13} /> Inspection Scheduled
          {scheduledCount > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === 'scheduled' ? 'bg-white text-[#5D9C0E]' : 'bg-[#EEF6DF] text-[#5D9C0E]'}`}>{scheduledCount}</span>
          )}
        </button>

        <button onClick={() => {setActiveTab('all'); setCurrentFilter('all');}} className={`relative px-4 py-2 rounded-full font-medium text-xs flex items-center gap-1.5 transition-all ${activeTab === 'all' ? 'bg-[#5D9C0E] text-white' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}>
          All Applications
          {applications.length > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${activeTab === 'all' ? 'bg-white text-[#5D9C0E]' : 'bg-[#EEF6DF] text-[#5D9C0E]'}`}>{applications.length}</span>
          )}
        </button>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden min-h-[400px] w-full border border-gray-100">
        <div className="overflow-x-auto pb-4 md:pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="min-w-[800px] lg:min-w-[1050px]">
            
            <div className="flex items-center px-6 md:px-8 py-4 md:py-5 border-b border-gray-50 bg-[#FAFCF8]">
              <div className="w-[50px] md:w-[60px]"></div>
              <div className="w-[180px] md:w-[240px]"></div>
              <div className="w-[140px] md:w-[160px] text-[12px] md:text-[13px] font-bold text-gray-500 uppercase tracking-wider">Profession</div>
              <div className="flex-1 text-[12px] md:text-[13px] font-bold text-gray-500 uppercase tracking-wider">Status</div>
              
              <div className="flex items-center gap-3 md:gap-4 pr-2">
                <input type="text" placeholder="Search here" className="w-[160px] md:w-[200px] border border-gray-200 rounded-full py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm outline-none focus:border-[#65A30D]" />
                <div className="relative">
                  <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-1.5 md:gap-2 border px-3 py-2 md:px-4 md:py-2.5 rounded-full text-xs md:text-[13px] font-bold transition-colors ${currentFilter !== 'all' ? 'bg-[#EEF6DF] border-[#65A30D] text-[#65A30D]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'}`}>
                    <Filter size={12} className="md:w-3.5 md:h-3.5" /> Filter
                  </button>
                  
                  {isFilterOpen && (
                    <div className="absolute right-0 top-[110%] w-[200px] md:w-[220px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={() => {setCurrentFilter('all'); setIsFilterOpen(false)}} className={`w-full text-left px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-[13px] font-medium hover:bg-gray-50 ${currentFilter === 'all' ? 'text-[#65A30D] bg-[#EEF6DF]' : 'text-gray-700'}`}>All Applications</button>
                      <button onClick={() => {setCurrentFilter('needs_review'); setIsFilterOpen(false)}} className={`w-full text-left px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-[13px] font-medium hover:bg-gray-50 ${currentFilter === 'needs_review' ? 'text-[#65A30D] bg-[#EEF6DF]' : 'text-gray-700'}`}>Needs Initial Review</button>
                      <button onClick={() => {setCurrentFilter('with_registrar'); setIsFilterOpen(false)}} className={`w-full text-left px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-[13px] font-medium hover:bg-gray-50 ${currentFilter === 'with_registrar' ? 'text-[#65A30D] bg-[#EEF6DF]' : 'text-gray-700'}`}>Awaiting Registrar</button>
                      <button onClick={() => {setCurrentFilter('scheduled'); setIsFilterOpen(false)}} className={`w-full text-left px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-[13px] font-medium hover:bg-gray-50 ${currentFilter === 'scheduled' ? 'text-[#65A30D] bg-[#EEF6DF]' : 'text-gray-700'}`}>Scheduled / Approved</button>
                      <button onClick={() => {setCurrentFilter('rejected'); setIsFilterOpen(false)}} className={`w-full text-left px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-[13px] font-medium hover:bg-gray-50 ${currentFilter === 'rejected' ? 'text-[#65A30D] bg-[#EEF6DF]' : 'text-gray-700'}`}>Rejected</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              {activeTab === 'action_required' && adminRole === 'admin_registrar' && pendingAdminsCount > 0 && (
                <div className="mx-6 md:mx-8 mt-4 mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600 shrink-0">
                      <Users size={18} />
                    </div>
                    <div>
                      <h4 className="text-amber-800 font-semibold text-[14px] leading-tight">Admin Approval Required</h4>
                      <p className="text-amber-750 text-[12px] font-normal mt-0.5">
                        There are {pendingAdminsCount} administrator account(s) pending your review and approval.
                      </p>
                    </div>
                  </div>
                  <Link 
                    href="/admin/manage-admins"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs px-4 py-2 rounded-full transition-all shrink-0"
                  >
                    Manage Admins
                  </Link>
                </div>
              )}

              {finalFilteredApplications.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3"><CheckCircle2 size={28} className="text-gray-300" /></div>
                  <h3 className="text-gray-900 font-semibold text-base mb-1">You're all caught up!</h3>
                  <p className="text-gray-500 text-xs font-normal">No applications match the current filter.</p>
                </div>
              ) : (
                finalFilteredApplications.map((row, index) => (
                  <div key={row.id} className={`flex items-center px-6 md:px-8 py-4 md:py-5 hover:bg-gray-50/50 transition-colors border-b border-gray-50/50 ${index % 2 !== 0 ? 'bg-[#FAFCF8]/50' : 'bg-white'}`}>
                    <div className="w-[50px] md:w-[60px]">
                      <input 
                        type="checkbox" 
                        checked={checkedOrgId === row.id}
                        onChange={() => setCheckedOrgId(checkedOrgId === row.id ? null : row.id)}
                        className="w-4 h-4 md:w-5 md:h-5 rounded-[4px] border-2 border-gray-300 text-[#65A30D] cursor-pointer" 
                      />
                    </div>
                    
                    <div onClick={() => setSelectedUserId(row.id)} className="w-[180px] md:w-[240px] cursor-pointer pr-2 flex flex-col items-start gap-1">
                      <span className="text-[13.5px] md:text-[14.5px] text-[#65A30D] hover:underline font-semibold leading-tight">{row.name}</span>
                      {isActionRequired(row) && (
                        <span className={`px-2 py-0.5 rounded text-[8px] font-medium uppercase tracking-wider border ${row.is_appeal ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-[#EEF6DF] border-[#65A30D]/30 text-[#65A30D]'}`}>
                          {row.is_appeal ? 'Appeal Application' : 'New Application'}
                        </span>
                      )}
                    </div>
                    
                    <div className="w-[140px] md:w-[160px] text-[13px] md:text-[14px] text-gray-500 font-normal">{row.profession}</div>
                    
                    <div className="flex-1 pr-2">{formatStatus(row.status, row.assessment_status, row.is_paid, row.has_finalized_report)}</div>
                    
                    <div className="pr-4">
                      <button 
                        onClick={() => setSelectedUserId(row.id)} 
                        className="px-4 py-1.5 md:px-5 md:py-1.5 border border-gray-200 rounded-full text-xs font-medium text-[#65A30D] hover:bg-[#EEF6DF] transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedUserId && (
        <OrganizationDrawer 
          userId={selectedUserId} 
          adminRole={adminRole}
          onClose={() => setSelectedUserId(null)}
          onRefreshTable={() => fetchApplications(false)}
        />
      )}

      {/* CUSTOM CONFIRMATION OVERLAY */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-[280px] animate-in zoom-in-95 duration-200 border border-gray-100 text-center flex flex-col items-center">
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-3 border border-amber-100 text-amber-500">
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-[13px] font-semibold text-gray-900 mb-1">Secure Logout</h3>
            <p className="text-[11px] text-gray-500 mb-4 leading-relaxed font-normal">
              Are you sure you want to securely log out of your session?
            </p>
            <div className="flex gap-2.5 w-full">
              <button 
                onClick={() => setShowConfirmLogout(false)} 
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium text-[11px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogoutAction} 
                className="flex-1 py-2 rounded-xl bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-medium text-[11px] transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}