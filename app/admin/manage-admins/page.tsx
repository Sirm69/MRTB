"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, CheckCircle2, Loader2, ChevronDown, Building2, ArrowLeft, X, Search, ShieldCheck, AlertTriangle, Plus, Users, Shield, UserCheck } from 'lucide-react';
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

  // Custom Alert Modal State
  const [customAlert, setCustomAlert] = useState<{ isOpen: boolean; message: string; type?: 'success' | 'error' | 'warning' }>({ isOpen: false, message: "" });

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const generateStaffId = (role: string = 'Reviewer') => {
    const prefix = role === 'Field Team' ? 'MRTB-FLD' : 'MRTB-ADM';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  };

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
        setAdmins(data.data || []);
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
    const generatedId = generateStaffId('Reviewer');
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
      
      {/* TOP HEADER WITH ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
            {adminRole === 'admin_registrar' ? 'Staff Clearance & Approvals' : 'Admin & Staff Management'}
          </h1>
          <p className="text-xs text-gray-400 font-normal mt-0.5">
            {adminRole === 'admin_registrar' 
              ? 'Review, verify, and authorize administrative profiles and field inspectors' 
              : 'Manage subordinate reviewers, field inspection officers, and role assignments'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {activeView === 'list' && adminRole !== 'admin_registrar' && (
            <button 
              onClick={handleOpenCreate} 
              className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-3.5 h-9 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={14} /> Add New Profile
            </button>
          )}

          <div className="bg-white rounded-xl h-9 px-3 flex items-center gap-2 border border-gray-200/80 shrink-0">
            <div className="w-6 h-6 rounded-lg bg-[#EEF6DF] flex items-center justify-center text-[#066936] shrink-0">
              <Shield size={12} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11.5px] font-medium text-gray-800 leading-tight">Admin Portal</span>
              <span className="text-[9.5px] text-gray-400 font-normal">
                {(adminRole === 'admin_registrar') ? 'Registrar' : (adminRole === 'admin_reviewer' && (localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail')) === 'admin@mrtb.gov.ng') ? 'Super Admin' : adminRole === 'admin_reviewer' ? 'Reviewer' : 'Super Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {activeView === 'list' ? (
        <div className="animate-in fade-in duration-300">
          {isLoading ? (
            <div className="flex justify-center items-center h-[300px]"><Loader2 size={32} className="animate-spin text-[#5D9C0E]" /></div>
          ) : (
            <div className="w-full">
              <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <div className="min-w-[950px] bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-visible">
                  <div className="flex items-center px-6 py-3.5 border-b border-gray-100 bg-gray-50/50">
                    <div className="w-[220px] text-[11px] font-medium text-gray-400 uppercase tracking-wider">Full Name</div>
                    <div className="w-[260px] text-[11px] font-medium text-gray-400 uppercase tracking-wider">Email Address</div>
                    <div className="w-[150px] text-[11px] font-medium text-gray-400 uppercase tracking-wider">Staff ID</div>
                    <div className="w-[160px] text-[11px] font-medium text-gray-400 uppercase tracking-wider">Role</div>
                    <div className="w-[140px] text-[11px] font-medium text-gray-400 uppercase tracking-wider">Status</div>
                    <div className="flex-1 text-[11px] font-medium text-gray-400 uppercase tracking-wider text-right">Action</div>
                  </div>

                  <div className="flex flex-col pb-50">
                    {admins.map((admin, index) => (
                      <div key={admin.id} className={`flex items-center px-6 py-3.5 border-b border-gray-50 transition-colors ${index % 2 !== 0 ? 'bg-white' : 'bg-[#f8faf6]/40'}`}>
                        <div className="w-[220px] text-xs font-medium text-gray-900 truncate pr-4">{admin.name}</div>
                        <div className="w-[260px] text-xs text-gray-500 truncate pr-4 font-normal">{admin.email}</div>
                        <div className="w-[150px]">
                          <span className="text-[11px] font-mono font-medium text-gray-700 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                            {admin.staffId}
                          </span>
                        </div>
                        <div className="w-[160px] text-xs text-gray-700 font-normal">{formatRoleDisplay(admin.role, admin.email)}</div>
                        <div className="w-[140px]">
                          <span className={`flex items-center gap-1.5 w-max px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${admin.status === 'Active' ? 'bg-[#EEF6DF] text-[#066936]' : admin.status === 'pending_approval' ? 'bg-amber-50 text-amber-700' : admin.status.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                            {admin.status === 'pending_approval' ? 'Pending' : admin.status}
                          </span>
                        </div>
                        
                        <div className="flex-1 flex justify-end">
                          {adminRole === 'admin_registrar' ? (
                             <button 
                               onClick={() => setAdminToApprove(admin)}
                               className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-normal text-[#066936] hover:bg-[#EEF6DF] transition-colors cursor-pointer"
                             >
                               {admin.status === 'pending_approval' ? 'Review & Approve' : 'View Details'}
                             </button>
                          ) : (
                             <AdminActionMenu admin={admin} onEdit={handleEditAdmin} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
                          )}
                        </div>
                      </div>
                    ))}
                    {admins.length === 0 && <div className="py-12 text-center text-gray-400 font-normal text-xs">No admins found.</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <button 
            onClick={() => setActiveView('list')} 
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#5D9C0E] text-xs font-medium mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Staff Directory
          </button>

          <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-8 border border-gray-100 w-full">
            <div className="mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
                {editMode ? 'Edit Staff Profile' : 'Create New Staff Profile'}
              </h2>
              <p className="text-xs text-gray-400 font-normal mt-0.5">
                {editMode 
                  ? 'Update administrative details and submit for re-clearance if required' 
                  : 'Fill in the information below to provision a subordinate admin or field team member'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Dr. Jane Doe"
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E] transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="staff@mrtb.gov.ng"
                    disabled={editMode} 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E] transition-all disabled:opacity-60 disabled:bg-gray-50" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Staff ID (Auto-generated)</label>
                  <input 
                    type="text" 
                    disabled 
                    value={formData.staffId} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-gray-600 cursor-not-allowed outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Administrative Role</label>
                  <div className="relative">
                    <select 
                      value={formData.role} 
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setFormData(prev => ({
                          ...prev, 
                          role: newRole, 
                          staffId: editMode ? prev.staffId : generateStaffId(newRole)
                        }));
                      }} 
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E] transition-all appearance-none cursor-pointer"
                    >
                      <option value="Reviewer">Reviewer (Subordinate Admin)</option>
                      <option value="Field Team">Field Team (Inspector)</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full sm:w-auto bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-6 py-2.5 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : editMode ? 'Save Changes' : 'Create & Request Approval'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveView('list')} 
                  className="w-full sm:w-auto bg-gray-50 hover:bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-medium text-xs transition-colors text-center cursor-pointer border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
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

      {/* CONFIRM MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 border border-gray-100 max-w-[400px] w-full text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{confirmModal.title}</h3>
            <p className="text-xs text-gray-500 font-normal mb-5 leading-relaxed">{confirmModal.message}</p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setConfirmModal(null)} 
                className="flex-1 py-2 px-4 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmModal.onConfirm} 
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERT MODAL */}
      <AlertModal 
        isOpen={customAlert.isOpen} 
        onClose={() => setCustomAlert({ ...customAlert, isOpen: false })} 
        message={customAlert.message} 
        type={customAlert.type} 
      />
    </div>
  );
}
