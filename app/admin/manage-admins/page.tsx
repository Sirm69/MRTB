"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, CheckCircle2, Loader2, ChevronDown, Building2, ArrowLeft, X, Search, ShieldCheck, AlertTriangle } from 'lucide-react';
import AdminActionMenu from '../components/AdminActionMenu';
import AdminApprovalDrawer from '../components/AdminApprovalDrawer';
import AlertModal from '../../components/AlertModal';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  staffId: string;
  role: string;
  status: string;
  assigned_admin_id?: number | null;
  assigned_admin_ids?: number[];
}

interface ApplicationData {
  id: number;
  name: string;
  profession: string;
  category: string;
  status: string;
  assessment_status: string | null;
  assigned_admin_id?: number | null;
  has_finalized_report?: boolean;
}

export default function ManageAdmins() {
  const [activeView, setActiveView] = useState<'list' | 'create'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminRole, setAdminRole] = useState<string>('');

  const [editMode, setEditMode] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [adminToApprove, setAdminToApprove] = useState<AdminUser | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [adminToAssign, setAdminToAssign] = useState<AdminUser | null>(null);
  const [assignableApps, setAssignableApps] = useState<ApplicationData[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<number[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignAsLeader, setAssignAsLeader] = useState(false);

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState<{ isOpen: boolean; message: string; type?: 'success' | 'error' | 'warning' }>({ isOpen: false, message: "" });

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const defaultFormState = { name: '', email: '', staffId: '', role: 'Reviewer', status: 'pending_approval' };
  const [formData, setFormData] = useState(defaultFormState);

  const fetchAdmins = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    const role = localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole') || '';
    setAdminRole(role);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/list`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'list') fetchAdmins();
  }, [activeView]);

  const handleOpenCreate = () => {
    setEditMode(false);
    setSelectedAdminId(null);
    const generatedId = `098${Math.floor(1000000 + Math.random() * 9000000)}`;
    setFormData({ ...defaultFormState, staffId: generatedId });
    setActiveView('create');
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setEditMode(true);
    setSelectedAdminId(admin.id);
    const reverseRoleMapping: Record<string, string> = {
      "admin_reviewer": "Reviewer", "admin_field": "Field Team"
    };
    setFormData({
      name: admin.name, email: admin.email, staffId: admin.staffId,
      role: reverseRoleMapping[admin.role] || "Reviewer",
      status: admin.status
    });
    setActiveView('create');
  };

  const handleToggleStatus = (admin: AdminUser) => {
    setConfirmModal({
      isOpen: true,
      title: admin.status === 'Active' ? 'Suspend Admin' : 'Restore Admin',
      message: `Are you sure you want to ${admin.status === 'Active' ? 'suspend' : 'restore'} this admin?`,
      onConfirm: () => {
        setAdmins(admins.map(a => a.id === admin.id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a));
        setConfirmModal(null);
      }
    });
  };

  const handleDelete = (admin: AdminUser) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Admin',
      message: `CRITICAL: Are you sure you want to permanently delete ${admin.name}?`,
      onConfirm: async () => {
        setConfirmModal(null);
        const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/delete-admin/${admin.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
          });
          if (response.ok) {
            setAdmins(admins.filter(a => a.id !== admin.id));
          } else {
            setCustomAlert({ isOpen: true, message: "Failed to delete admin from server.", type: "error" });
          }
        } catch (error) {
          console.error("Delete error:", error);
          setCustomAlert({ isOpen: true, message: "Network error.", type: "error" });
        }
      }
    });
  };

  const handleOpenAssignModal = async (admin: AdminUser) => {
    setAdminToAssign(admin);
    setSelectedAppIds([]);
    setSearchQuery('');
    setAssignAsLeader(false);
    setIsAssignModalOpen(true);
    setIsLoadingApps(true);

    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/applications`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) {
        const data = await response.json();
        const apps = data.data || [];
        // Filter: only organizations approved by Registrar (status === "approved") are qualified for Field Team assignment
        const approvedApps = apps.filter((app: ApplicationData) => app.status === 'approved');
        setAssignableApps(approvedApps);
        const alreadyAssignedIds = approvedApps.filter((app: ApplicationData) => 
          app.assigned_admin_id === admin.id || (admin.assigned_admin_ids && admin.assigned_admin_ids.includes(app.id))
        ).map((app: ApplicationData) => app.id);
        setSelectedAppIds(alreadyAssignedIds);
        
        const isLeader = approvedApps.some((app: ApplicationData) => app.assigned_admin_id === admin.id);
        setAssignAsLeader(isLeader);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoadingApps(false);
    }
  };

  const handleToggleAppSelection = (appId: number) => {
    setSelectedAppIds(prev => prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]);
  };

  const handleSaveAssignments = async () => {
    if (!adminToAssign) return;
    setIsSubmitting(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/assign-organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ admin_id: adminToAssign.id, application_ids: selectedAppIds, is_leader: assignAsLeader })
      });
      if (response.ok) {
        setIsAssignModalOpen(false);
        fetchAdmins();
      } else {
        setCustomAlert({ isOpen: true, message: 'Failed to assign organizations.', type: "error" });
      }
    } catch (error) {
      console.error("Assignment error:", error);
      setCustomAlert({ isOpen: true, message: "Network error occurred.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredApps = assignableApps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const generatedPassword = Math.random().toString(36).slice(-8) + "Aa1@";
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    
    const roleMapping: Record<string, string> = {
      "Reviewer": "admin_reviewer", "Field Team": "admin_field"
    };

    const finalStatus = (editMode && formData.status.toLowerCase() === 'rejected') ? 'pending_approval' : formData.status;

    try {
      const url = editMode 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/update-admin/${selectedAdminId}` 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/create-admin`;
      
      const method = editMode ? 'PUT' : 'POST';
      const bodyPayload = editMode 
        ? { name: formData.name, email: formData.email, role: roleMapping[formData.role] || "admin_custom", staff_id: formData.staffId, status: finalStatus }
        : { name: formData.name, email: formData.email, password: generatedPassword, role: roleMapping[formData.role] || "admin_custom", staff_id: formData.staffId, status: "pending_approval" };

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(bodyPayload)
      });

      if (response.ok) {
        if (!editMode) {
          setCustomAlert({ isOpen: true, message: `Success! Profile sent to Registrar for approval.\nPassword: ${generatedPassword}`, type: "success" });
        } else if (editMode && formData.status.toLowerCase() === 'rejected') {
          setCustomAlert({ isOpen: true, message: `Profile has been successfully appealed and resubmitted to the Registrar.`, type: "success" });
        }
        setActiveView('list');
      } else {
        const err = await response.json();
        setCustomAlert({ isOpen: true, message: `Failed to save: ${err.detail || 'Unknown error'}`, type: "error" });
      }
    } catch (error) {
      console.error("Error saving admin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRoleDisplay = (rawRole: string, email?: string) => {
    if (rawRole === 'admin_reviewer' && email === 'admin@mrtb.gov.ng') return "Super Admin";
    const roles: Record<string, string> = {
      "admin_accreditation": "Accreditation Team", "admin_field": "Field Team",
      "admin_inspectorate": "Inspectorate", "admin_registrar": "Registrar", "admin_reviewer": "Reviewer"
    };
    return roles[rawRole] || rawRole;
  };

  return (
    <div className="w-full h-full pb-10 max-w-[1200px] mx-auto relative pt-4 md:pt-0 px-3 md:px-0">
      
      <div className="flex justify-end w-full mb-8">
        <div className="bg-white rounded-full p-1.5 pr-4 flex items-center gap-3 shadow-sm w-max">
          <div className="w-[36px] h-[36px] rounded-full bg-[#65A30D] flex items-center justify-center text-white shrink-0">
            <Building2 size={16} />
          </div>
          <div className="flex flex-col pr-2">
            <span className="text-[13px] font-bold text-gray-800 leading-tight">Admin</span>
            <span className="text-[10px] text-gray-400">{(adminRole === 'admin_registrar') ? 'Registrar' : (adminRole === 'admin_reviewer' && (localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail')) === 'admin@mrtb.gov.ng') ? 'Super Admin' : adminRole === 'admin_reviewer' ? 'Reviewer' : 'Super Admin'}</span>
          </div>
        </div>
      </div>

      <div className="bg-transparent mb-8">
        <h1 className="text-[24px] md:text-[28px] font-bold text-gray-800 tracking-wide mb-4">
          {adminRole === 'admin_registrar' ? 'Approve Admins' : 'Admin Profile'}
        </h1>
        <div className="w-full h-[1px] bg-gray-200"></div>
      </div>

      {activeView === 'list' ? (
        <div className="animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-[20px] md:text-[22px] text-gray-800 tracking-wide">
               {adminRole === 'admin_registrar' ? 'Pending & Active Staff' : 'Personal Information'}
            </h2>
            
            {adminRole !== 'admin_registrar' && (
              <button onClick={handleOpenCreate} className="bg-[#65A30D] hover:bg-[#578d0b] text-white px-8 py-3 rounded-full font-bold text-sm shadow-md transition-all w-full sm:w-auto text-center tracking-wide">
                ADD NEW PROFILE
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-[300px]"><Loader2 size={40} className="animate-spin text-[#65A30D]" /></div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <div className="min-w-[950px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible">
                  <div className="flex items-center px-6 py-5 border-b border-gray-100 bg-white">
                    <div className="w-[220px] text-[15px] font-bold text-[#65A30D]">Full Name</div>
                    <div className="w-[260px] text-[15px] font-bold text-[#65A30D]">Email Address</div>
                    <div className="w-[140px] text-[15px] font-bold text-[#65A30D]">Staff ID</div>
                    <div className="w-[160px] text-[15px] font-bold text-[#65A30D]">Role</div>
                    <div className="w-[140px] text-[15px] font-bold text-[#65A30D]">Status</div>
                    <div className="flex-1 text-[15px] font-bold text-[#65A30D] text-right">Action</div>
                  </div>

                  <div className="flex flex-col pb-50">
                    {admins.map((admin, index) => (
                      <div key={admin.id} className={`flex items-center px-6 py-3 border-b border-gray-50 transition-colors ${index % 2 !== 0 ? 'bg-white' : 'bg-[#f8faf6]'}`}>
                        <div className="w-[220px] text-[14px] text-gray-800 font-medium truncate pr-4">{admin.name}</div>
                        <div className="w-[260px] text-[14px] text-gray-800 truncate pr-4">{admin.email}</div>
                        <div className="w-[140px] text-[14px] text-gray-800">{admin.staffId}</div>
                        <div className="w-[160px] text-[14px] text-gray-800">{formatRoleDisplay(admin.role, admin.email)}</div>
                        <div className="w-[140px]">
                          <span className={`flex items-center gap-1.5 w-max px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${admin.status === 'Active' ? 'bg-[#EEF6DF] text-[#65A30D]' : admin.status === 'pending_approval' ? 'bg-orange-100 text-orange-600' : admin.status.toLowerCase() === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                            {admin.status === 'pending_approval' ? 'Pending' : admin.status}
                          </span>
                        </div>
                        
                        <div className="flex-1 flex justify-end">
                          {adminRole === 'admin_registrar' ? (
                             <button 
                               onClick={() => setAdminToApprove(admin)}
                               className="px-4 py-1.5 border border-gray-200 rounded-lg text-[12px] font-bold text-[#65A30D] hover:bg-[#EEF6DF] transition-colors"
                             >
                               {admin.status === 'pending_approval' ? 'Review & Approve' : 'View Details'}
                             </button>
                          ) : (
                             <AdminActionMenu admin={admin} onEdit={handleEditAdmin} onToggleStatus={handleToggleStatus} onAssign={handleOpenAssignModal} onDelete={handleDelete} />
                          )}
                        </div>
                      </div>
                    ))}
                    {admins.length === 0 && <div className="py-12 text-center text-gray-500">No admins found.</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <button onClick={() => setActiveView('list')} className="flex items-center gap-1.5 text-gray-500 hover:text-[#65A30D] text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to List
          </button>

          <h2 className="text-[22px] text-gray-800 mb-6 tracking-wide">{editMode ? 'Edit Profile Information' : 'Personal Information'}</h2>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
              <div>
                <label className="block text-gray-800 text-[16px] mb-2">Full Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-[#65A30D] transition-colors" />
              </div>
              <div>
                <label className="block text-gray-800 text-[16px] mb-2">Email Address</label>
                <input required type="email" disabled={editMode} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-[#65A30D] transition-colors disabled:opacity-50 disabled:bg-gray-50" />
              </div>
              <div>
                <label className="block text-gray-800 text-[16px] mb-2">Staff ID</label>
                <input type="text" disabled value={formData.staffId} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed outline-none opacity-80" />
              </div>
              <div>
                <label className="block text-gray-800 text-[16px] mb-2">Staff Role</label>
                <div className="relative">
                  <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-transparent border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-[#65A30D] transition-colors appearance-none">
                    <option value="Reviewer">Reviewer (Subordinate Admin)</option>
                    <option value="Field Team">Field Team</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 max-w-[600px] mt-12">
              <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto flex-1 bg-[#65A30D] hover:bg-[#578d0b] text-white px-8 py-3.5 rounded-full font-bold text-[14px] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : editMode ? 'SAVE CHANGES' : 'CREATE & REQUEST APPROVAL'}
              </button>
              <button type="button" onClick={() => setActiveView('list')} className="w-full sm:w-auto flex-1 bg-transparent hover:bg-gray-50 border border-[#65A30D] text-[#65A30D] px-8 py-3.5 rounded-full font-bold text-[14px] transition-all text-center">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REGISTRAR APPROVAL DRAWER */}
      {adminToApprove && (
         <AdminApprovalDrawer 
           admin={adminToApprove} 
           onClose={() => setAdminToApprove(null)} 
           onRefresh={fetchAdmins} 
         />
      )}

      {/* ASSIGNMENT MODAL WITH STRICT FADING LOGIC */}
      {isAssignModalOpen && adminToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-[550px] rounded-[24px] p-6 shadow-2xl animate-in zoom-in-95 duration-200 relative flex flex-col max-h-[90vh]">
            <button onClick={() => setIsAssignModalOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"><X size={18} /></button>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Assign Organizations</h3>
            <p className="text-sm text-gray-500 mb-5">Select facilities to assign to <strong className="text-[#65A30D]">{adminToAssign.name}</strong>.</p>
            <div className="relative mb-4">
               <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
               <input type="text" placeholder="Search by facility name or category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border border-gray-200 bg-gray-50 rounded-xl py-3 pl-10 pr-4 text-[13px] outline-none focus:border-[#65A30D] focus:bg-white transition-colors" />
            </div>
            <div className="flex-1 overflow-y-auto border border-gray-100 rounded-xl mb-6 min-h-[250px]">
              {isLoadingApps ? (
                <div className="flex justify-center items-center h-full min-h-[200px]"><Loader2 size={24} className="animate-spin text-[#65A30D]" /></div>
              ) : filteredApps.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full min-h-[200px] text-gray-400 p-6 text-center"><Building2 size={32} className="mb-2 opacity-50" /><p className="text-sm font-medium">No organizations found.</p></div>
              ) : (
                <div className="flex flex-col">
                  {filteredApps.map(app => {
                    // --- SMART ELIGIBILITY LOGIC ---
                    const isFieldTeam = adminToAssign.role === 'admin_field' || adminToAssign.role === 'Field Team';
                    const isConcluded = app.has_finalized_report || app.assessment_status === 'finalized' || app.assessment_status === 'forwarded';
                    const isAppEligible = !isFieldTeam || (
                      app.status === 'approved' && 
                      (app.assessment_status === 'approved' || app.assessment_status === 'inspected') &&
                      !isConcluded
                    );
                    const showNotCompletedLabel = isFieldTeam && (!app.assessment_status || app.assessment_status === 'submitted');

                    return (
                      <label key={app.id} className={`flex items-center gap-3 p-3.5 border-b border-gray-50 transition-colors group ${(!isAppEligible || isConcluded) ? 'opacity-40 cursor-not-allowed bg-gray-100' : 'hover:bg-[#FAFCF8] cursor-pointer'}`}>
                        <input 
                          type="checkbox" 
                          disabled={!isAppEligible || isConcluded}
                          checked={selectedAppIds.includes(app.id)} 
                          onChange={() => handleToggleAppSelection(app.id)} 
                          className="w-4 h-4 rounded border-gray-300 text-[#65A30D] accent-[#65A30D] disabled:opacity-50 disabled:cursor-not-allowed" 
                        />
                        <div className="flex flex-col">
                          <span className={`text-[14px] font-bold ${(!isAppEligible || isConcluded) ? 'text-gray-400' : 'text-gray-800 group-hover:text-[#65A30D]'} transition-colors`}>{app.name}</span>
                          <span className="text-[11.5px] text-gray-500 flex items-center gap-2">
                             {app.category} • {app.profession}
                             {showNotCompletedLabel && <span className="text-red-650 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[9px] uppercase tracking-wider">Assessment Not Completed</span>}
                             {isConcluded && <span className="text-green-650 font-bold bg-[#EEF6DF] px-2 py-0.5 rounded border border-[#CDE1B4]/40 text-[9px] uppercase tracking-wider">Concluded</span>}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* DESIGNATE AS LEADER TOGGLE */}
            {(() => {
              const selectedAppsWithLeaders = adminToAssign ? assignableApps.filter((app: ApplicationData) => 
                selectedAppIds.includes(app.id) && app.assigned_admin_id && app.assigned_admin_id !== adminToAssign.id
              ) : [];
              const hasOtherLeader = selectedAppsWithLeaders.length > 0;

              return (
                <div className={`flex flex-col mb-5 px-1 animate-in fade-in ${hasOtherLeader ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      id="assignAsLeader"
                      disabled={hasOtherLeader}
                      checked={assignAsLeader && !hasOtherLeader}
                      onChange={(e) => setAssignAsLeader(e.target.checked)}
                      className="w-4 h-4 rounded text-[#65A30D] accent-[#65A30D] disabled:opacity-50 disabled:cursor-not-allowed" 
                    />
                    <label htmlFor="assignAsLeader" className={`text-[12.5px] text-gray-600 font-bold ${hasOtherLeader ? 'cursor-not-allowed' : 'cursor-pointer'} select-none`}>
                      Designate <span className="text-[#65A30D]">{adminToAssign.name}</span> as the Team Leader for these facilities
                    </label>
                  </div>
                  {hasOtherLeader && (
                    <span className="text-[10px] text-amber-600 font-extrabold mt-1 ml-6 uppercase tracking-wider">
                      ⚠️ Some selected organizations already have an assigned Leader.
                    </span>
                  )}
                </div>
              );
            })()}

            <button onClick={handleSaveAssignments} disabled={isSubmitting} className="w-full py-3.5 bg-[#65A30D] text-white font-bold rounded-full text-[14px] hover:bg-[#578d0b] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : `Save Assignments`}
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM ALERT MODAL */}
      <AlertModal 
        isOpen={customAlert.isOpen} 
        message={customAlert.message} 
        type={customAlert.type} 
        onClose={() => setCustomAlert(prev => ({ ...prev, isOpen: false }))} 
      />

      {/* CUSTOM CONFIRMATION OVERLAY */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-[280px] animate-in zoom-in-95 duration-200 border border-gray-100 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3 border border-amber-100 text-amber-500">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-[13px] font-bold text-gray-900 mb-1.5">{confirmModal.title}</h3>
            <p className="text-[11px] text-gray-500 mb-5 leading-relaxed font-medium">
              {confirmModal.message}
            </p>
            <div className="flex gap-2.5 w-full">
              <button 
                onClick={() => setConfirmModal(null)} 
                className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-[11px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmModal.onConfirm} 
                className="flex-1 py-2 rounded-xl bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold text-[11px] shadow-sm transition-all"
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
