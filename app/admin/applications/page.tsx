"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Download, 
  Loader2, 
  AlertCircle, 
  XCircle, 
  ClipboardCheck, 
  FileText, 
  Calendar 
} from 'lucide-react';
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
  has_finalized_report?: boolean;
  visit_date?: string;
  visitation_accepted?: boolean;
  is_rescheduled?: boolean;
}

function ApplicationsContent() {
  const router = useRouter();
  
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminRole, setAdminRole] = useState<string>(''); 
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [checkedOrgId, setCheckedOrgId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeTab, setActiveTab] = useState<"action_required" | "awaiting_registrar" | "all" | "rejected" | "field_reports" | "scheduled">("all");

  const fetchApplications = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
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
      console.error("Error loading admin applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole') || localStorage.getItem('role') || '';
    setAdminRole(role);

    if (role === 'admin_field' || role === 'Field Team') {
      router.push('/field-team/dashboard');
      return;
    }

    fetchApplications();
  }, [router, adminRole]);

  const handleDownloadCheckedReport = () => {
    if (!checkedOrgId) {
      alert("Please select a facility checkbox to download their evaluation report.");
      return;
    }
    window.open(`/report/print?id=${checkedOrgId}`, '_blank');
  };

  const isActionRequired = (app: ApplicationData) => {
    const activeStatus = app.status;
    const assessmentStatus = app.assessment_status;

    if (adminRole === 'admin_reviewer') {
      return activeStatus === 'under_review' || activeStatus === 'submitted' || assessmentStatus === 'submitted' || assessmentStatus === 'inspected';
    }
    if (adminRole === 'admin_registrar') {
      return activeStatus === 'recommended_accept' || activeStatus === 'recommended_reject' || assessmentStatus === 'forwarded';
    }
    return false;
  };

  const getFilteredApplications = () => {
    let list = applications;

    if (searchQuery.trim() !== "") {
      list = list.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeTab) {
      case 'action_required':
        return list.filter(isActionRequired);
      case 'awaiting_registrar':
        return list.filter(app => app.status === 'recommended_accept' || app.status === 'recommended_reject' || app.assessment_status === 'forwarded');
      case 'rejected':
        return list.filter(app => app.status === 'rejected' || app.assessment_status === 'rejected');
      case 'field_reports':
        return list.filter(app => app.has_finalized_report === true);
      case 'scheduled':
        return list.filter(app => !!app.visit_date);
      case 'all':
      default:
        return list;
    }
  };

  const filteredApps = getFilteredApplications();

  // Correct formatStatus function matching the dashboard page
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
        return <span className="text-red-650 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Final Rejected</span>;
      default: 
        return <span className="text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{status.replace('_', ' ')}</span>;
    }
  };

  return (
    <div className="pb-12 relative w-full">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">All Applications</h1>
          <p className="text-sm text-gray-500">Track and review registry applications across categories</p>
        </div>
        <button 
          onClick={handleDownloadCheckedReport}
          className="flex items-center justify-center gap-2 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-6 py-2.5 rounded-full shadow-md font-bold text-xs transition-colors self-start sm:self-auto"
        >
          <Download size={14} /> Download Report
        </button>
      </div>

      {/* CENTRALIZED TABS */}
      <div className="mb-6 flex flex-wrap gap-2 md:gap-4 w-full justify-center">
        <button 
          onClick={() => setActiveTab('all')} 
          className={`px-5 py-2.5 rounded-full font-bold text-xs transition-all ${
            activeTab === 'all' ? 'bg-[#5D9C0E] text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          All Applications
        </button>
        
        <button 
          onClick={() => setActiveTab('action_required')} 
          className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
            activeTab === 'action_required' ? 'bg-[#5D9C0E] text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <AlertCircle size={14} /> Action Required
        </button>

        <button 
          onClick={() => setActiveTab('awaiting_registrar')} 
          className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
            activeTab === 'awaiting_registrar' ? 'bg-[#5D9C0E] text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <ClipboardCheck size={14} /> Awaiting Registrar
        </button>

        <button 
          onClick={() => setActiveTab('rejected')} 
          className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
            activeTab === 'rejected' ? 'bg-[#5D9C0E] text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <XCircle size={14} /> Rejected
        </button>

        <button 
          onClick={() => setActiveTab('field_reports')} 
          className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
            activeTab === 'field_reports' ? 'bg-[#5D9C0E] text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <FileText size={14} /> Field Reports
        </button>

        <button 
          onClick={() => setActiveTab('scheduled')} 
          className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all ${
            activeTab === 'scheduled' ? 'bg-[#5D9C0E] text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <Calendar size={14} /> Inspection Scheduled
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-3xl p-4 mb-6 shadow-sm border border-gray-100 flex items-center gap-3">
        <input 
          type="text" 
          placeholder="Search by facility name, specialty discipline, or account email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-medium text-gray-800"
        />
      </div>

      {/* APPLICATIONS TABLE CARD */}
      {isLoading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <Loader2 className="animate-spin text-[#5D9C0E]" size={36} />
        </div>
      ) : (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 w-[60px] text-center">Select</th>
                  <th className="p-4">Facility Name</th>
                  <th className="p-4">Discipline</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredApps.length > 0 ? (
                  filteredApps.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-center">
                        <input 
                          type="checkbox"
                          checked={checkedOrgId === item.id}
                          onChange={(e) => setCheckedOrgId(e.target.checked ? item.id : null)}
                          className="w-4 h-4 accent-[#5D9C0E] cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-gray-800 text-sm leading-tight mb-0.5">{item.name}</p>
                          <p className="text-gray-400 text-[10px]">{item.email}</p>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gray-700">{item.profession}</td>
                      <td className="p-4 font-semibold text-gray-700">{item.category}</td>
                      <td className="p-4">{formatStatus(item.status, item.assessment_status, item.is_paid, item.has_finalized_report)}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => setSelectedUserId(item.id)}
                          className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold px-4 py-2 rounded-full transition-colors cursor-pointer text-[11px] shadow-sm"
                        >
                          Review Case
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 italic">No applications match the active filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REVIEW DRAWER MODAL */}
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

export default function ApplicationsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <ApplicationsContent />
    </Suspense>
  );
}
