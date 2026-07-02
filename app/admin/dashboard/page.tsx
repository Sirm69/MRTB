"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <-- Imported Link for native routing!
import { Calendar, Bell, Download, Building2, CalendarDays, Loader2, Filter, AlertCircle, CheckCircle2, Users, LogOut, XCircle } from 'lucide-react';
import OrganizationDrawer from '../components/OrganizationDrawer';

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
}

export default function AdminDashboard() {
  const router = useRouter();
  
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminRole, setAdminRole] = useState<string>(''); 
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  const [activeTab, setActiveTab] = useState<"action_required" | "all" | "rejected">("action_required");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all");

  const fetchApplications = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    const role = localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole') || localStorage.getItem('role') || '';
    
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    setAdminRole(role);
    
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
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [router]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to securely log out?")) {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminRole');
      sessionStorage.removeItem('adminAccessToken');
      sessionStorage.removeItem('adminRefreshToken');
      sessionStorage.removeItem('adminRole');
      router.push('/admin/login');
    }
  };

  const isActionRequired = (app: ApplicationData) => {
    const activeStatus = app.status === 'approved' && app.assessment_status ? app.assessment_status : app.status;
    if (adminRole === 'admin_reviewer') return activeStatus === 'under_review' || activeStatus === 'submitted';
    if (adminRole === 'admin_registrar') return activeStatus === 'recommended_accept' || activeStatus === 'recommended_reject';
    return false;
  };

  const actionRequiredCount = applications.filter(isActionRequired).length;
  
  const rejectedCount = applications.filter(app => {
    const activeStatus = app.status === 'approved' && app.assessment_status ? app.assessment_status : app.status;
    return activeStatus === 'rejected';
  }).length;

  const tabFilteredApps = applications.filter(app => {
    const activeStatus = app.status === 'approved' && app.assessment_status ? app.assessment_status : app.status;
    if (activeTab === 'all') return true;
    if (activeTab === 'action_required') return isActionRequired(app);
    if (activeTab === 'rejected') return activeStatus === 'rejected';
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

  const formatStatus = (status: string, assessmentStatus: string | null, isPaid: boolean = false) => {
    if (assessmentStatus) {
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

  return (
    <div className="pb-12 relative w-full">
      
      {/* TOP NAVIGATION */}
      <div className="flex justify-end items-center mb-6 gap-2 md:gap-5 w-full">
        {adminRole === 'admin_reviewer' && (
          // 👇 CONVERTED TO <Link> HERE
          <Link 
            href="/admin/manage-admins"
            className="hidden md:flex items-center gap-2 bg-white px-4 h-[52px] rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-100 font-bold text-[13px] text-gray-700"
          >
            <Users size={18} className="text-[#65A30D]" /> Manage Admins
          </Link>
        )}

        <button className="w-[38px] h-[38px] md:w-[52px] md:h-[52px] bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow shrink-0">
          <Calendar size={18} className="text-[#65A30D] md:w-5 md:h-5" />
        </button>
        <button className="relative w-[38px] h-[38px] md:w-[52px] md:h-[52px] bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow shrink-0">
          <Bell size={18} className="text-[#65A30D] md:w-5 md:h-5" />
          <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="bg-white rounded-full p-1 md:p-1.5 pr-3 md:pr-5 flex items-center gap-2 md:gap-3 shadow-sm hover:shadow-md transition-shadow shrink-0">
          <div className={`w-[30px] h-[30px] md:w-[42px] md:h-[42px] rounded-full flex items-center justify-center text-white ${adminRole === 'admin_registrar' ? 'bg-[#0f172a]' : 'bg-[#65A30D]'}`}>
            <Building2 size={14} className="md:w-[18px] md:h-[18px]" />
          </div>
          <div className="flex flex-col pr-1 md:pr-2 hidden sm:flex">
            <span className="text-xs md:text-sm font-bold text-gray-800 leading-tight">
              {adminRole === 'admin_registrar' ? 'Registrar' : 'Super Admin'}
            </span>
            <span className="text-[10px] md:text-[11px] text-gray-400">Portal Access</span>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-1.5 md:gap-2 bg-red-50 text-red-600 px-3 md:px-4 h-[38px] md:h-[52px] rounded-full shadow-sm hover:bg-red-100 hover:shadow-md transition-all border border-red-100 font-bold text-xs md:text-[13px] shrink-0">
          <LogOut size={14} className="md:w-4 md:h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="bg-white rounded-[20px] md:rounded-[24px] mb-6 p-5 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] w-full">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1.5 md:mb-2 tracking-tight">Welcome back</h1>
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            {adminRole === 'admin_registrar' ? 'Finalize and approve scheduled visitations.' : 'Review new applications and prepare cost estimates.'}
          </p>
        </div>
        
        <div className="flex w-full lg:w-auto items-center gap-2 md:gap-4 mt-5 lg:mt-0">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 md:gap-2 border-2 border-dashed border-gray-300 text-gray-500 px-3 py-2 md:px-5 md:py-2.5 rounded-full hover:border-gray-400 font-bold text-[11px] md:text-[13px] transition-colors whitespace-nowrap">
             <CalendarDays size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Jan 15 - Till date</span><span className="sm:hidden">Jan 15 - Today</span>
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-[#65A30D] text-white px-4 py-2 md:px-8 md:py-3 rounded-full shadow-lg font-bold text-[11px] md:text-[13px] hover:bg-[#578d0b] transition-colors whitespace-nowrap">
            <Download size={14} className="md:w-4 md:h-4" /> Export<span className="hidden sm:inline"> report</span>
          </button>
        </div>
      </div>

      {/* SMART TABS */}
      <div className="mb-5 md:mb-6 flex flex-wrap gap-2 md:gap-4 w-full">
        <button onClick={() => {setActiveTab('action_required'); setCurrentFilter('all');}} className={`relative px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all ${activeTab === 'action_required' ? 'bg-[#65A30D] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'}`}>
          <AlertCircle size={14} className="md:w-4 md:h-4" /> Action Required
          {actionRequiredCount > 0 && (
            <span className={`ml-0.5 md:ml-1 px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[11px] ${activeTab === 'action_required' ? 'bg-white text-[#65A30D]' : 'bg-red-100 text-red-600'}`}>{actionRequiredCount}</span>
          )}
        </button>
        
        <button onClick={() => {setActiveTab('rejected'); setCurrentFilter('all');}} className={`relative px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all ${activeTab === 'rejected' ? 'bg-red-500 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'}`}>
          <XCircle size={14} className="md:w-4 md:h-4" /> Rejected
          {rejectedCount > 0 && (
            <span className={`ml-0.5 md:ml-1 px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[11px] ${activeTab === 'rejected' ? 'bg-white text-red-500' : 'bg-gray-100 text-gray-600'}`}>{rejectedCount}</span>
          )}
        </button>

        <button onClick={() => {setActiveTab('all'); setCurrentFilter('all');}} className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-xs md:text-sm transition-all ${activeTab === 'all' ? 'bg-[#65A30D] text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'}`}>
          All Applications
        </button>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="bg-white rounded-[20px] md:rounded-[24px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] overflow-hidden min-h-[400px] w-full">
        <div className="overflow-x-auto pb-4 md:pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="min-w-[800px] lg:min-w-[1050px]">
            
            <div className="flex items-center px-6 md:px-8 py-4 md:py-6 border-b border-gray-50">
              <div className="w-[50px] md:w-[60px]"></div>
              <div className="w-[180px] md:w-[240px]"></div>
              <div className="w-[140px] md:w-[160px] text-[13px] md:text-[15px] font-semibold text-gray-400">Profession</div>
              <div className="w-[180px] md:w-[200px] text-[13px] md:text-[15px] font-semibold text-gray-400">Status</div>
              <div className="flex-1 text-[13px] md:text-[15px] font-semibold text-gray-400">Email</div>
              
              <div className="flex items-center gap-3 md:gap-4 pr-2">
                <input type="text" placeholder="Search here" className="w-[160px] md:w-[200px] border border-gray-200 rounded-full py-2 px-4 md:py-2.5 md:px-5 text-xs md:text-sm outline-none focus:border-[#65A30D]" />
                <div className="relative">
                  <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-1.5 md:gap-2 border px-3 py-2 md:px-4 md:py-2.5 rounded-full text-xs md:text-[13px] font-bold transition-colors ${currentFilter !== 'all' ? 'bg-[#EEF6DF] border-[#65A30D] text-[#65A30D]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
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
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 size={32} className="animate-spin text-[#65A30D]" /></div>
              ) : finalFilteredApplications.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={32} className="text-gray-300" /></div>
                  <h3 className="text-gray-900 font-bold text-lg mb-1">You're all caught up!</h3>
                  <p className="text-gray-500 text-sm font-medium">No applications match the current filter.</p>
                </div>
              ) : (
                finalFilteredApplications.map((row, index) => (
                  <div key={row.id} className={`flex items-center px-6 md:px-8 py-4 md:py-5 hover:bg-gray-50/50 transition-colors ${index % 2 !== 0 ? 'bg-[#FAFCF8]' : 'bg-white'}`}>
                    <div className="w-[50px] md:w-[60px]"><input type="checkbox" className="w-4 h-4 md:w-5 md:h-5 rounded-[4px] border-2 border-gray-300 text-[#65A30D]" /></div>
                    
                    <div onClick={() => setSelectedUserId(row.id)} className="w-[180px] md:w-[240px] cursor-pointer pr-2 flex flex-col items-start gap-1">
                      <span className="text-[14px] md:text-[15px] text-[#65A30D] hover:underline font-bold leading-tight">{row.name}</span>
                      {isActionRequired(row) && (
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${row.is_appeal ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-[#EEF6DF] border-[#65A30D]/30 text-[#65A30D]'}`}>
                          {row.is_appeal ? 'Appeal Application' : 'New Application'}
                        </span>
                      )}
                    </div>
                    
                    <div className="w-[140px] md:w-[160px] text-[13px] md:text-[14px] text-gray-500 font-medium">{row.profession}</div>
                    
                    <div className="w-[180px] md:w-[200px] pr-2">{formatStatus(row.status, row.assessment_status, row.is_paid)}</div>
                    
                    <div className="flex-1 text-[13px] md:text-[14px] text-gray-500 truncate pr-4">{row.email}</div>
                    <div className="pr-4">
                      <button 
                        onClick={() => setSelectedUserId(row.id)} 
                        className="px-4 py-1.5 md:px-6 md:py-2 border border-gray-200 rounded-lg text-xs md:text-[13px] font-bold text-[#65A30D] hover:bg-gray-50 transition-colors shadow-sm"
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
          onRefreshTable={fetchApplications}
        />
      )}
    </div>
  );
}
