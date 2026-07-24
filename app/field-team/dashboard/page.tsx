"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Calendar, Loader2, Navigation, ClipboardCheck, CheckCircle2, LogOut, AlertTriangle } from 'lucide-react';
// Verify this path points correctly to your existing admin component!
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

export default function FieldTeamDashboard() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<AssignedFacility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState({ name: 'Field Officer', staffId: 'FT-000' });
  const [showOrgDrawerId, setShowOrgDrawerId] = useState<number | null>(null);
  
  // Custom Confirmation state
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

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

  // Handles moving to the upcoming examination/accreditation page
  const handleStartAccreditation = (facilityId: number) => {
    router.push(`/field-team/examine?id=${facilityId}`);
  };

  return (
    <div className="pb-12 relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* FIELD TEAM HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 md:p-6 rounded-[24px] shadow-sm border border-gray-100 mb-8 w-full gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-[#EEF6DF] rounded-full flex items-center justify-center text-[#65A30D] shrink-0">
             <Navigation size={24} />
           </div>
           <div>
             <h1 className="text-xl font-medium text-gray-900 leading-tight">{adminData.name}</h1>
             <p className="text-gray-500 text-xs font-medium">Field Operations • ID: {adminData.staffId}</p>
           </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-5 py-3 rounded-full hover:bg-red-100 transition-colors shadow-sm font-bold text-xs uppercase tracking-wider w-full sm:w-auto border border-red-100"
        >
          <LogOut size={14} /> Log out
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-800">Your Assigned Facilities</h2>
        <p className="text-gray-500 text-sm font-medium">Review your upcoming physical inspection schedule below.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-[#65A30D]" /></div>
      ) : facilities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 flex flex-col items-center text-center shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <CheckCircle2 size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Assignments Yet</h3>
          <p className="text-gray-500 text-sm font-medium">The Super Admin has not assigned any facilities to your schedule.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] overflow-hidden w-full border border-gray-100">
          <div className="overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="min-w-[950px]">
              <div className="flex items-center px-6 py-5 border-b border-gray-50 bg-[#FAFCF8]">
                <div className="w-[260px] text-[13px] font-medium text-gray-500 uppercase tracking-wider">Facility Details</div>
                <div className="w-[160px] text-[13px] font-medium text-gray-500 uppercase tracking-wider">Location</div>
                <div className="w-[150px] text-[13px] font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</div>
                <div className="w-[130px] text-[13px] font-medium text-gray-500 uppercase tracking-wider">Status</div>
                <div className="flex-1 text-[13px] font-medium text-gray-500 uppercase tracking-wider text-right pr-4">Actions</div>
              </div>

              <div className="flex flex-col">
                {facilities.map((org, index) => (
                  <div key={org.id} className={`flex items-center px-6 py-4 hover:bg-gray-50/50 transition-colors border-b border-gray-50/50 ${index % 2 !== 0 ? 'bg-[#FAFCF8]/50' : 'bg-white'}`}>
                    <div className="w-[260px] pr-4 flex items-start gap-3">
                       <div className="w-8 h-8 bg-[#EEF6DF] rounded-full flex items-center justify-center text-[#65A30D] shrink-0 mt-0.5">
                         <Building2 size={14} />
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[15px] font-medium text-gray-900 leading-tight mb-1">{org.name}</span>
                         <span className="text-[11px] text-gray-500 font-medium">{org.category} • {org.profession}</span>
                       </div>
                    </div>
                    
                    <div className="w-[160px] pr-4 flex flex-col">
                      <span className="text-[13px] font-medium text-gray-800">{org.lga}</span>
                      <span className="text-[12px] text-gray-500 font-medium">{org.state}</span>
                    </div>

                    <div className="w-[150px] pr-4">
                      <div className="flex items-center gap-1.5 text-gray-800 font-medium text-[13px]">
                        <Calendar size={14} className="text-[#65A30D]" /> {org.date}
                      </div>
                    </div>

                    <div className="w-[130px] pr-4">
                      {org.status === 'approved' ? (
                        <span className="bg-[#FAFCF8] text-[#5D9C0E] px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-[#5D9C0E]/30">
                          Scheduled
                        </span>
                      ) : (
                        <span className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-wider border border-orange-100">
                          {org.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    {/* TWO ACTIONS: View Profile & Start Accreditation / Review Report */}
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

      {/* MAIN ORG DRAWER */}
      {showOrgDrawerId && (
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