"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Calendar, Loader2, Navigation, ClipboardCheck, Search, Filter, CheckCircle2, ChevronRight, X } from 'lucide-react';
import OrganizationDrawer from '../../admin/components/OrganizationDrawer';

interface AssignedFacility {
  id: number;
  name: string;
  profession: string;
  category: string;
  sub_category: string;
  status: string;
  assessment_status: string;
  is_paid: boolean;
  lga: string;
  state: string;
  date: string;
}

export default function FieldTeamInspections() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<AssignedFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState({ name: 'Field Officer', staffId: 'FT-000' });
  
  // Modal / Drawer state
  const [showOrgDrawerId, setShowOrgDrawerId] = useState<number | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    const role = localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole') || '';
    const name = localStorage.getItem('adminName') || sessionStorage.getItem('adminName') || 'Field Officer';
    const staffId = localStorage.getItem('adminStaffId') || sessionStorage.getItem('adminStaffId') || 'FT-000';
    setAdminData({ name, staffId });

    // Protect Route
    if (role !== 'admin_field' && role !== 'Field Team') {
      router.push('/admin/login');
      return;
    }

    const fetchAssignments = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/accreditation/assignments`, {
          headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
        });
        if (response.ok) {
          const data = await response.json();
          setFacilities(data.data || []);
          if (data.admin) setAdminData(data.admin);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, [router]);

  const handleStartAccreditation = (facilityId: number) => {
    router.push(`/field-team/examine?id=${facilityId}`);
  };

  // Helper to determine if status is pending vs completed
  // Completed means the accreditation result has been submitted to the admins
  const isCompleted = (status: string) => {
    return ['finalized', 'forwarded', 'rejected'].includes(status);
  };

  // Filtered List calculation
  const filteredFacilities = facilities.filter(fac => {
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fac.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.lga.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.profession.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === 'pending') {
      return !isCompleted(fac.status);
    } else if (filterStatus === 'completed') {
      return isCompleted(fac.status);
    }
    
    return true;
  });

  return (
    <div className="pb-12 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Info */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">My Inspection Records</h2>
          <p className="text-gray-500 text-sm font-medium">Manage and review your physical evaluation assignments and reports.</p>
        </div>
        
        {/* Quick status summary pills */}
        <div className="flex gap-3 text-xs font-bold uppercase tracking-wider">
          <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-2">
            <span className="text-gray-400">Total Assigned:</span>
            <span className="text-gray-900 font-black">{facilities.length}</span>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-2">
            <span className="text-emerald-500">Completed:</span>
            <span className="text-emerald-700 font-black">{facilities.filter(f => isCompleted(f.status)).length}</span>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-2">
            <span className="text-orange-500">Pending:</span>
            <span className="text-orange-700 font-black">{facilities.filter(f => !isCompleted(f.status)).length}</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER CONTROL PANEL */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        {/* Search bar */}
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search facility name, state..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-[#5D9C0E] focus:bg-white transition-all text-gray-800"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-150 text-[11px] font-bold w-full sm:w-auto">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-1.5 rounded-lg transition-all ${filterStatus === 'all' ? 'bg-[#5D9C0E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            All Assignments
          </button>
          <button 
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-1.5 rounded-lg transition-all ${filterStatus === 'pending' ? 'bg-[#5D9C0E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Pending ({facilities.filter(f => !isCompleted(f.status)).length})
          </button>
          <button 
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-1.5 rounded-lg transition-all ${filterStatus === 'completed' ? 'bg-[#5D9C0E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Completed ({facilities.filter(f => isCompleted(f.status)).length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-[#65A30D]" /></div>
      ) : filteredFacilities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 flex flex-col items-center text-center shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <ClipboardCheck size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Inspections Found</h3>
          <p className="text-gray-500 text-sm font-medium">No facility evaluations match your current filters or search term.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] overflow-hidden w-full border border-gray-100">
          <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="min-w-[950px]">
              {/* Table Header */}
              <div className="flex items-center px-6 py-5 border-b border-gray-50 bg-[#FAFCF8]">
                <div className="w-[260px] text-[13px] font-medium text-gray-500 uppercase tracking-wider">Facility Details</div>
                <div className="w-[160px] text-[13px] font-medium text-gray-500 uppercase tracking-wider">Location</div>
                <div className="w-[150px] text-[13px] font-medium text-gray-500 uppercase tracking-wider">Evaluation Date</div>
                <div className="w-[130px] text-[13px] font-medium text-gray-500 uppercase tracking-wider">Status</div>
                <div className="flex-1 text-[13px] font-medium text-gray-500 uppercase tracking-wider text-right pr-4">Actions</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {filteredFacilities.map((org, index) => (
                  <div key={org.id} className={`flex items-center px-6 py-4 hover:bg-gray-50/50 transition-colors border-b border-gray-50/50 ${index % 2 !== 0 ? 'bg-[#FAFCF8]/50' : 'bg-white'}`}>
                    
                    {/* Facility details */}
                    <div className="w-[260px] pr-4 flex items-start gap-3">
                       <div className="w-8 h-8 bg-[#EEF6DF] rounded-full flex items-center justify-center text-[#65A30D] shrink-0 mt-0.5">
                         <Building2 size={14} />
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[15px] font-medium text-gray-900 leading-tight mb-1">{org.name}</span>
                         <span className="text-[11px] text-gray-500 font-medium">{org.category} • {org.profession}</span>
                       </div>
                    </div>
                    
                    {/* Location */}
                    <div className="w-[160px] pr-4 flex flex-col">
                       <span className="text-[13px] font-medium text-gray-800">{org.lga}</span>
                       <span className="text-[12px] text-gray-500 font-medium">{org.state}</span>
                    </div>

                    {/* Scheduled date */}
                    <div className="w-[150px] pr-4">
                      <div className="flex items-center gap-1.5 text-gray-800 font-medium text-[13px]">
                        <Calendar size={14} className="text-[#65A30D]" /> {org.date}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="w-[130px] pr-4">
                      {org.status === 'approved' ? (
                        <span className="bg-[#FAFCF8] text-[#5D9C0E] px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-[#5D9C0E]/30">
                          Scheduled
                        </span>
                      ) : org.status === 'finalized' || org.status === 'forwarded' ? (
                        <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-green-150">
                          Submitted
                        </span>
                      ) : org.status === 'inspected' ? (
                        <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-150">
                          Draft Report
                        </span>
                      ) : (
                        <span className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-wider border border-orange-100">
                          {org.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-1 flex justify-end items-center gap-2 pr-4">
                      <button 
                        onClick={() => setShowOrgDrawerId(org.id)} 
                        className="px-4 py-2 border border-gray-300 rounded-full text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        View Profile
                      </button>
                      
                      {org.status === 'finalized' || org.status === 'forwarded' || org.status === 'rejected' ? (
                        <button 
                          onClick={() => handleStartAccreditation(org.id)} 
                          className="flex items-center gap-1.5 px-4 py-2 bg-slate-600 border border-slate-600 rounded-full text-[12px] font-medium text-white hover:bg-slate-700 transition-colors shadow-sm"
                        >
                          <ClipboardCheck size={14} /> View Report
                        </button>
                      ) : org.status === 'inspected' ? (
                        <button 
                          onClick={() => handleStartAccreditation(org.id)} 
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 border border-blue-600 rounded-full text-[12px] font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          <ClipboardCheck size={14} /> Review Report
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStartAccreditation(org.id)} 
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#65A30D] border border-[#65A30D] rounded-full text-[12px] font-medium text-white hover:bg-[#558B0A] transition-colors shadow-sm"
                        >
                          <ClipboardCheck size={14} /> Start Accreditation
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Drawer Overlay */}
      {showOrgDrawerId !== null && (
        <div className="fixed inset-0 z-[150]">
          <OrganizationDrawer 
            userId={showOrgDrawerId} 
            adminRole="admin_field"
            onClose={() => setShowOrgDrawerId(null)} 
            onRefreshTable={() => {}}
          />
        </div>
      )}

    </div>
  );
}
