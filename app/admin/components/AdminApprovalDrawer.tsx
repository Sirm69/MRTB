"use client";

import React, { useState } from 'react';
import { X, ShieldCheck, Loader2, UserCheck, AlertTriangle } from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  staffId: string;
  role: string;
  status: string;
}

interface AdminApprovalDrawerProps {
  admin: AdminUser;
  onClose: () => void;
  onRefresh: () => void;
}

export default function AdminApprovalDrawer({ admin, onClose, onRefresh }: AdminApprovalDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const formatRoleDisplay = (rawRole: string) => {
    const roles: Record<string, string> = { "admin_field": "Field Team", "admin_reviewer": "Reviewer" };
    return roles[rawRole] || rawRole;
  };

  const handleDecision = async (decision: 'Active' | 'Rejected') => {
    setIsSubmitting(true);
    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/update-admin/${admin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({
          name: admin.name,
          email: admin.email,
          role: admin.role,
          staff_id: admin.staffId,
          status: decision
        })
      });

      if (response.ok) {
        alert(`Account has been successfully ${decision === 'Active' ? 'Approved & Activated' : 'Rejected'}.`);
        onRefresh();
        onClose();
      } else {
        alert("Failed to save decision.");
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerDecision = (decision: 'Active' | 'Rejected') => {
    setConfirmModal({
      isOpen: true,
      title: decision === 'Active' ? 'Approve Account' : 'Reject Account',
      message: `Are you sure you want to ${decision === 'Active' ? 'Approve & Activate' : 'Reject'} this administrator account?`,
      onConfirm: () => {
        handleDecision(decision);
        setConfirmModal(null);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-[2px] transition-opacity">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-[780px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden rounded-l-2xl md:rounded-l-3xl">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>

        {/* DRAWER HEADER */}
        <div className="bg-white border-b border-gray-100 px-6 py-6 md:px-8 md:py-6 shrink-0">
          <div className="w-10 h-10 bg-[#EEF6DF] text-[#066936] rounded-xl flex items-center justify-center mb-3">
             <ShieldCheck size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Admin Approval Request</h2>
          <p className="text-gray-400 text-xs mt-0.5 font-normal">Review the details requested by the Super Admin before granting system clearance and access.</p>
        </div>

        {/* DRAWER CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-6 bg-white flex flex-col space-y-5">
           <div className="bg-gray-50/70 rounded-2xl border border-gray-100 p-5 md:p-6">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2.5">
                Profile Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div>
                    <span className="text-[11px] text-gray-400 block mb-1 uppercase tracking-wider font-medium">Full Name</span>
                    <span className="text-sm font-medium text-gray-900">{admin.name}</span>
                 </div>
                 <div>
                    <span className="text-[11px] text-gray-400 block mb-1 uppercase tracking-wider font-medium">Email Address</span>
                    <span className="text-xs font-medium text-gray-800 break-all">{admin.email}</span>
                 </div>
                 <div>
                    <span className="text-[11px] text-gray-400 block mb-1 uppercase tracking-wider font-medium">Staff ID</span>
                    <span className="font-mono text-xs font-medium text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-lg inline-block">
                      {admin.staffId}
                    </span>
                 </div>
                 <div>
                    <span className="text-[11px] text-gray-400 block mb-1 uppercase tracking-wider font-medium">Requested Role</span>
                    <span className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-lg inline-block">
                      {formatRoleDisplay(admin.role)}
                    </span>
                 </div>
              </div>
           </div>

           {admin.status === 'pending_approval' ? (
             <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex gap-3 text-amber-800">
                <AlertTriangle size={16} className="shrink-0 text-amber-500 mt-0.5" />
                <p className="text-xs leading-relaxed font-normal">This administrative account cannot log in or access portal records until you authorize it.</p>
             </div>
           ) : (
             <div className="bg-[#EEF6DF] border border-[#CDE1B4]/60 rounded-xl p-4 flex items-center justify-center text-[#066936] font-medium text-xs gap-2">
                <UserCheck size={16} /> Account Status: <span className="font-semibold">{admin.status}</span>
             </div>
           )}
        </div>

        {/* DRAWER FOOTER ACTIONS */}
        {admin.status === 'pending_approval' && (
          <div className="bg-white border-t border-gray-100 p-5 md:p-6 flex flex-row gap-3 shrink-0">
             <button 
               onClick={() => triggerDecision('Rejected')}
               disabled={isSubmitting}
               className="flex-1 bg-red-50/70 text-red-600 border border-red-100 h-10 rounded-xl font-medium text-xs hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center"
             >
                Reject Request
             </button>
             <button 
               onClick={() => triggerDecision('Active')}
               disabled={isSubmitting}
               className="flex-1 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white h-10 rounded-xl font-medium text-xs shadow-sm transition-colors flex justify-center items-center gap-1.5 disabled:opacity-50 cursor-pointer"
             >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "Approve & Activate"}
             </button>
          </div>
        )}

        {/* CUSTOM CONFIRMATION OVERLAY */}
        {confirmModal && confirmModal.isOpen && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 rounded-l-2xl md:rounded-l-3xl transition-opacity">
            <div className="bg-white p-6 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-[320px] animate-in zoom-in-95 duration-200 border border-gray-100 text-center flex flex-col items-center">
              <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-3 text-amber-500">
                <AlertTriangle size={18} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{confirmModal.title}</h3>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed font-normal">
                {confirmModal.message}
              </p>
              <div className="flex gap-2.5 w-full">
                <button 
                  onClick={() => setConfirmModal(null)} 
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmModal.onConfirm} 
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-medium text-xs shadow-sm transition-all flex justify-center items-center gap-1 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}