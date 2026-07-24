"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, UserX, UserCheck, ShieldPlus, Trash2, RefreshCcw } from 'lucide-react';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  staffId: string;
  role: string;
  status: string;
}

interface AdminActionMenuProps {
  admin: AdminUser;
  onEdit: (admin: AdminUser) => void;
  onToggleStatus: (admin: AdminUser) => void;
  onAssign: (admin: AdminUser) => void;
  onDelete: (admin: AdminUser) => void;
}

export default function AdminActionMenu({ admin, onEdit, onToggleStatus, onAssign, onDelete }: AdminActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPending = admin.status === 'pending_approval';
  const isRejected = admin.status.toLowerCase() === 'rejected';

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
          
          <button 
            onClick={() => { setIsOpen(false); onEdit(admin); }} 
            className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            {isRejected ? <RefreshCcw size={14} className="text-orange-500" /> : <Edit2 size={14} className="text-[#65A30D]" />} 
            {isRejected ? 'Appeal / Edit Profile' : 'Edit Profile'}
          </button>

          {/* HIDE THESE OPTIONS IF PENDING OR REJECTED */}
          {!isPending && !isRejected && (
            <>
              <button 
                onClick={() => { setIsOpen(false); onAssign(admin); }} 
                className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <ShieldPlus size={14} className="text-blue-500" /> Assign Organizations
              </button>

              <button 
                onClick={() => { setIsOpen(false); onToggleStatus(admin); }} 
                className={`w-full text-left px-4 py-2.5 text-[13px] font-bold flex items-center gap-2 transition-colors hover:bg-gray-50 ${admin.status === 'Active' ? 'text-orange-600' : 'text-green-600'}`}
              >
                {admin.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                {admin.status === 'Active' ? 'Suspend Account' : 'Restore Account'}
              </button>
            </>
          )}

          <div className="w-full h-[1px] bg-gray-100 my-1"></div>
          
          <button 
            onClick={() => { setIsOpen(false); onDelete(admin); }} 
            className="w-full text-left px-4 py-2.5 text-[13px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <Trash2 size={14} /> Delete Admin
          </button>
        </div>
      )}
    </div>
  );
}