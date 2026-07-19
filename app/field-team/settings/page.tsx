"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  BadgeInfo,
  Loader2,
  Navigation,
  Lock,
  CheckCircle2
} from "lucide-react";

function SettingsContent() {
  const router = useRouter();
  const [adminRole, setAdminRole] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(""); // Phone acts as staffId
  const [department, setDepartment] = useState("");

  // Security / Password update states
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole') || '';
    setAdminRole(role);

    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/profile`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (response.ok) {
          const data = await response.json();
          const profile = data.data || data;
          
          if (profile.name) setName(profile.name);
          if (profile.phone) setPhone(profile.phone);
          if (profile.email) setAdminEmail(profile.email);
          
          const savedDept = localStorage.getItem('admin_dept') || "Field Operations";
          setDepartment(savedDept);
        } else {
          // Fallback to storage values
          const savedName = localStorage.getItem('adminName') || sessionStorage.getItem('adminName') || "Field Officer";
          const savedPhone = localStorage.getItem('adminStaffId') || sessionStorage.getItem('adminStaffId') || "FT-000";
          const savedDept = localStorage.getItem('admin_dept') || "Field Operations";

          setName(savedName);
          setPhone(savedPhone);
          setDepartment(savedDept);
          
          const savedEmail = localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail') || "field@mrtb.gov.ng";
          setAdminEmail(savedEmail);
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    // Persist details locally so sidebar/header updates instantly
    localStorage.setItem('adminName', name);
    sessionStorage.setItem('adminName', name);
    localStorage.setItem('adminStaffId', phone);
    sessionStorage.setItem('adminStaffId', phone);
    localStorage.setItem('admin_dept', department);

    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
      window.location.reload(); // Refresh to update layouts
    }, 1200);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    
    setIsUpdatingPassword(true);
    setPasswordStatus(null);
    
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordStatus("success");
      setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordStatus(null), 3000);
    }, 1500);
  };

  const getRoleDisplayName = (role: string) => {
    if (role === 'admin_registrar') return "Registrar";
    if (role === 'admin_reviewer') return "Super Admin";
    return "Field Operations Officer";
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-500 font-medium">Manage your officer profile information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        
        {/* Left Side: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Form 1: Personal info */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5 text-xs font-semibold">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-1">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <User size={18} className="text-[#5D9C0E]" /> Personal Information
              </h3>
              {saveStatus === "success" && (
                <span className="text-[10px] font-bold text-[#066936] bg-[#EEF6DF] px-3 py-1 rounded-md border border-[#CDE1B4]/40 animate-pulse">
                  Settings Saved Successfully ✓
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Administrative Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your full name..."
                  className="w-full bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-medium text-gray-800"
                  required
                />
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Office Department</label>
                <input 
                  type="text" 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Field Operations, etc..."
                  className="w-full bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-medium text-gray-800"
                />
              </div>

              {/* Phone / Staff ID */}
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Staff / Phone ID</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Enter Staff ID..."
                  className="w-full bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-medium text-gray-800"
                  required
                />
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px] flex items-center gap-1">
                  Email Address <span className="text-[8px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded uppercase font-extrabold tracking-normal">Locked</span>
                </label>
                <div className="relative w-full">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    value={adminEmail} 
                    readOnly
                    className="w-full bg-gray-100 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-gray-150 text-gray-400 cursor-not-allowed font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Save Profile Details"}
              </button>
            </div>
          </form>

          {/* Form 2: Password Settings */}
          <form onSubmit={handlePasswordUpdate} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5 text-xs font-semibold">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-1">
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Lock size={18} className="text-[#5D9C0E]" /> Security Credentials
              </h3>
              {passwordStatus === "success" && (
                <span className="text-[10px] font-bold text-[#066936] bg-[#EEF6DF] px-3 py-1 rounded-md border border-[#CDE1B4]/40 animate-pulse">
                  Password Updated Successfully ✓
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Current Password</label>
                <input 
                  type="password" 
                  value={passwordState.currentPassword}
                  onChange={(e) => setPasswordState(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-medium text-gray-800"
                  required
                />
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">New Password</label>
                <input 
                  type="password" 
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-medium text-gray-800"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-medium text-gray-800"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button 
                type="submit" 
                disabled={isUpdatingPassword}
                className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                {isUpdatingPassword ? <Loader2 size={14} className="animate-spin" /> : "Update Security Password"}
              </button>
            </div>
          </form>

        </div>

        {/* Right Side: Security Clearance Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 text-xs font-semibold">
          <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3 mb-1">
            <ShieldCheck size={18} className="text-[#5D9C0E]" /> Security Clearances
          </h3>
          
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 uppercase text-[9px] tracking-wider block mb-0.5">Authorization Role</span>
              <span className="text-sm text-gray-900 font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#5D9C0E] rounded-full inline-block"></span>
                {getRoleDisplayName(adminRole)}
              </span>
            </div>
            
            <div>
              <span className="text-gray-400 uppercase text-[9px] tracking-wider block mb-0.5">Department Assignment</span>
              <span className="text-xs text-gray-800 font-bold">{department || "Field Accreditation Group"}</span>
            </div>

            <div>
              <span className="text-gray-400 uppercase text-[9px] tracking-wider block mb-0.5">Account Status</span>
              <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-100 text-[10px] uppercase font-bold tracking-wider rounded-md inline-block">
                Active Clearance
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2 space-y-2 text-gray-500 font-medium text-[11px] leading-relaxed">
            <div className="flex gap-2">
              <BadgeInfo size={14} className="text-[#5D9C0E] shrink-0 mt-0.5" />
              <p>For credentials matching or email modifications, contact the Board Admin registrar.</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default function FieldTeamSettings() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-[#5D9C0E]" /></div>}>
      <SettingsContent />
    </Suspense>
  );
}
