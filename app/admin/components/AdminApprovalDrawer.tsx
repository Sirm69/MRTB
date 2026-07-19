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

      <div className="relative w-full max-w-[450px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden rounded-l-3xl">
        <button onClick={onClose} className="absolute top-3 right-3 md:right-4 z-50 w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors">
          <X size={16} />
        </button>

        <div className="bg-slate-50 border-b border-gray-100 px-6 py-6 md:px-8 md:py-8 shadow-sm shrink-0">
          <div className="w-12 h-12 bg-[#EEF6DF] text-[#066936] rounded-full flex items-center justify-center mb-3">
             <ShieldCheck size={24} />
          </div>
          <h2 className="text-xl font-medium text-gray-900 leading-tight">Admin Approval</h2>
          <p className="text-gray-500 text-xs mt-1">Review the details requested by the Super Admin before granting system access.</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-6 bg-white flex flex-col">
           <div className="bg-slate-50 rounded-2xl border border-gray-100 p-5 mb-6">
              <h3 className="text-[11px] font-bold text-[#066936] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Profile Details</h3>
              
              <div className="flex flex-col gap-4">
                 <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider font-semibold">Full Name</span>
                    <span className="text-[15px] font-medium text-gray-900">{admin.name}</span>
                 </div>
                 <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider font-semibold">Email Address</span>
                    <span className="text-[14px] font-medium text-gray-800 break-all">{admin.email}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider font-semibold">Staff ID</span>
                       <span className="text-[14px] font-medium text-gray-800">{admin.staffId}</span>
                    </div>
                    <div>
                       <span className="text-[10px] text-gray-400 block mb-0.5 uppercase tracking-wider font-semibold">Requested Role</span>
                       <span className="inline-block bg-white border border-[#CDE1B4]/50 text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide mt-0.5">
                          {formatRoleDisplay(admin.role)}
                       </span>
                    </div>
                 </div>
              </div>
           </div>

           {admin.status === 'pending_approval' ? (
             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
                <AlertTriangle size={18} className="shrink-0 text-amber-500 mt-0.5" />
                <p className="text-[11px] leading-relaxed font-medium">This account cannot log in or access any data until you explicitly approve it.</p>
             </div>
           ) : (
             <div className="bg-[#EEF6DF] border border-[#5D9C0E]/30 rounded-xl p-4 flex items-center justify-center text-[#066936] font-bold text-[12px] gap-2 shadow-sm animate-in zoom-in duration-200">
                <UserCheck size={16} /> Account Processed ({admin.status})
             </div>
           )}
        </div>

        {admin.status === 'pending_approval' && (
          <div className="bg-white border-t border-gray-100 p-6 flex flex-row gap-3 shrink-0">
             <button 
               onClick={() => triggerDecision('Rejected')}
               disabled={isSubmitting}
               className="flex-1 bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors disabled:opacity-50"
             >
                Reject Request
             </button>
             <button 
               onClick={() => triggerDecision('Active')}
               disabled={isSubmitting}
               className="flex-1 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-colors flex justify-center items-center gap-1.5 disabled:opacity-50"
             >
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : "Approve & Activate"}
             </button>
          </div>
        )}

        {/* CUSTOM CONFIRMATION OVERLAY */}
        {confirmModal && confirmModal.isOpen && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 rounded-l-3xl transition-opacity">
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
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-[11px] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmModal.onConfirm} 
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-xl bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold text-[11px] shadow-sm transition-all flex justify-center items-center gap-1"
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