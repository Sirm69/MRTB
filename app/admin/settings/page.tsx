"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  BadgeInfo,
  Loader2
} from "lucide-react";

function SettingsContent() {
  const router = useRouter();
  const [adminRole, setAdminRole] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form states initialize empty and populate on mount
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

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
          
          // Populate states with database fields if they exist
          if (profile.name) setName(profile.name);
          if (profile.phone) setPhone(profile.phone);
          if (profile.email) setAdminEmail(profile.email);
          
          // Load department from local storage (sideloaded field)
          const savedDept = localStorage.getItem('admin_dept') || "";
          setDepartment(savedDept);
        } else {
          // Fallback to local storage (e.g. for hardcoded admin review bypasses)
          const savedName = localStorage.getItem('admin_name') || "";
          const savedPhone = localStorage.getItem('admin_phone') || "";
          const savedDept = localStorage.getItem('admin_dept') || "";

          setName(savedName);
          setPhone(savedPhone);
          setDepartment(savedDept);

          if (role === 'admin_registrar') {
            setAdminEmail("registrar@mrtb.gov.ng");
          } else if (role === 'admin_reviewer') {
            const savedEmail = localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail') || "admin@mrtb.gov.ng";
            setAdminEmail(savedEmail);
          } else {
            setAdminEmail("support@mrtb.gov.ng");
          }
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

    // Persist details locally
    localStorage.setItem('admin_name', name);
    localStorage.setItem('admin_phone', phone);
    localStorage.setItem('admin_dept', department);

    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1500);
  };

  const getRoleDisplayName = (role: string) => {
    if (role === 'admin_registrar') return "Registrar";
    if (role === 'admin_reviewer') {
      const email = localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail') || '';
      return email === 'admin@mrtb.gov.ng' ? "Super Admin" : "Reviewer";
    }
    if (role === 'admin_field') return "Field Inspector";
    return "Board Administrator";
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-500">Manage your administrative credentials and verify security clearances</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        
        {/* Left Card: Settings Form */}
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5 lg:col-span-2 text-xs">
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
                placeholder="Enter administrative name..."
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
                placeholder="Enter department name..."
                className="w-full bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-medium text-gray-800"
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Registry Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={adminEmail} 
                  disabled
                  className="w-full bg-gray-100 text-xs rounded-xl pl-10 pr-4 py-2.5 border border-gray-150 focus:outline-none text-gray-400 font-medium cursor-not-allowed"
                />
                <Mail className="absolute left-3.5 top-3 text-gray-400" size={14} />
              </div>
            </div>

            {/* Contact Phone */}
            <div className="space-y-1">
              <label className="font-bold text-gray-400 uppercase tracking-wider text-[9px]">Contact Phone</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number..."
                className="w-full bg-gray-50 text-xs rounded-xl px-4 py-2.5 border border-gray-150 focus:outline-none focus:border-[#5D9C0E] font-medium text-gray-800"
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold px-6 py-2.5 rounded-full shadow-sm transition-colors cursor-pointer flex justify-center items-center gap-1.5"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Right Card: Security / Clearances */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4 text-xs text-gray-700">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#5D9C0E]" /> Security Clearance
            </h3>
            
            <div className="space-y-3 pt-1">
              <div>
                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider mb-0.5">Assigned Level Role</span>
                <span className="font-extrabold text-gray-800">{getRoleDisplayName(adminRole)}</span>
              </div>
              
              <div>
                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider mb-0.5">Clearance Status</span>
                <span className="text-[10px] font-bold text-[#066936] bg-[#EEF6DF] px-2.5 py-1 rounded-md border border-[#CDE1B4]/40 inline-flex items-center gap-1">
                  Active Officer
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-3 text-xs leading-relaxed">
            <BadgeInfo size={20} className="text-[#5D9C0E] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-800 block mb-0.5">Password Policy:</span>
              To change your system administrator password, please contact the MRTB IT department at <span className="font-semibold text-gray-500">it-support@mrtb.gov.ng</span>.
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default function SettingsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
