"use client";

import React, { Suspense } from "react";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  Briefcase 
} from "lucide-react";
import { useUser } from "../layout";

function ProfileContent() {
  const { userData } = useUser();

  const preAssessment = userData?.pre_assessment || {};
  const contactPerson = preAssessment.contactPerson || "Not Submitted";
  const physicalAddress = preAssessment.address || "Not Submitted";
  const registeredState = userData?.state || "N/A";
  const registeredLGA = userData?.lga || "N/A";

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Registry Profile</h1>
        <p className="text-xs text-gray-400 font-normal mt-0.5">Official verified details of your organization in the MRTB database</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        
        {/* Operations & Location details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-100 space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3.5">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#5D9C0E]" /> Verified Facility Records
              </h3>
              <span className="text-[10.5px] font-medium text-[#066936] bg-[#EEF6DF] px-3 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={12} /> Active Status
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Authorized Director */}
              <div className="flex gap-3">
                <div className="bg-[#EEF6DF] text-[#066936] p-2.5 rounded-xl shrink-0 h-fit">
                  <User size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-gray-400 block mb-0.5">Authorized Officer / Director</span>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">{contactPerson}</p>
                  <span className="text-[10px] text-gray-400 font-normal mt-0.5 block">From Pre-Assessment</span>
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex gap-3">
                <div className="bg-[#EEF6DF] text-[#066936] p-2.5 rounded-xl shrink-0 h-fit">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-gray-400 block mb-0.5">Physical Address</span>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight break-words">{physicalAddress}</p>
                  <span className="text-[10px] text-gray-400 font-normal mt-0.5 block">From Pre-Assessment</span>
                </div>
              </div>

              {/* State */}
              <div className="flex gap-3">
                <div className="bg-[#EEF6DF] text-[#066936] p-2.5 rounded-xl shrink-0 h-fit">
                  <Globe size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-gray-400 block mb-0.5">Registered State</span>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">{registeredState}</p>
                  <span className="text-[10px] text-gray-400 font-normal mt-0.5 block">Registered Location</span>
                </div>
              </div>

              {/* LGA */}
              <div className="flex gap-3">
                <div className="bg-[#EEF6DF] text-[#066936] p-2.5 rounded-xl shrink-0 h-fit">
                  <Globe size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-gray-400 block mb-0.5">Local Government Area (LGA)</span>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">{registeredLGA}</p>
                  <span className="text-[10px] text-gray-400 font-normal mt-0.5 block">Registered Location</span>
                </div>
              </div>

              {/* Contact Email */}
              <div className="flex gap-3">
                <div className="bg-[#EEF6DF] text-[#066936] p-2.5 rounded-xl shrink-0 h-fit">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-gray-400 block mb-0.5">Primary Email</span>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">{userData?.email || "-"}</p>
                  <span className="text-[10px] text-gray-400 font-normal mt-0.5 block">Registered Account</span>
                </div>
              </div>

              {/* Contact Phone */}
              <div className="flex gap-3">
                <div className="bg-[#EEF6DF] text-[#066936] p-2.5 rounded-xl shrink-0 h-fit">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-gray-400 block mb-0.5">Primary Phone Number</span>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 leading-tight">{userData?.phone || "-"}</p>
                  <span className="text-[10px] text-gray-400 font-normal mt-0.5 block">Registered Account</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Board Credentials Column */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-gray-100 space-y-4 text-xs text-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Building size={16} className="text-[#5D9C0E]" /> Board Registry Details
          </h3>
          <div className="space-y-3.5 pt-1">
            <div>
              <span className="font-medium text-gray-400 block text-[10px] mb-0.5">Facility Registry Name</span>
              <span className="font-medium text-gray-900 text-xs">{userData?.name || "-"}</span>
            </div>
            
            <div>
              <span className="font-medium text-gray-400 block text-[10px] mb-0.5">Discipline / Specialty</span>
              <span className="font-medium text-gray-900 text-xs flex items-center gap-1.5"><Briefcase size={12} className="text-gray-400" /> {userData?.profession || "-"}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-gray-400 block text-[10px] mb-0.5">Category</span>
                <span className="font-medium text-gray-900 text-xs">{userData?.category || "-"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-400 block text-[10px] mb-0.5">Classification Tier</span>
                <span className="font-medium text-gray-900 text-xs">{userData?.sub_category || "-"}</span>
              </div>
            </div>

            <div>
              <span className="font-medium text-gray-400 block text-[10px] mb-0.5">Registry Reference Code</span>
              <span className="font-mono text-gray-800 font-medium text-xs">MRTB-FAC-{userData?.id || "PENDING"}</span>
            </div>
          </div>

          <div className="bg-gray-50/70 p-3.5 rounded-xl text-[10.5px] text-gray-400 leading-relaxed mt-4 font-normal">
            <span className="font-medium text-gray-600 block mb-0.5">Registry Database Lock:</span>
            In compliance with MRTB guidelines, facility registration data are locked after submission to ensure verification consistency. If you need to make changes to your profile records, please open a thread in the <a href="/dashboard/messages" className="text-[#5D9C0E] hover:underline font-medium">Support Messages</a> panel.
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
