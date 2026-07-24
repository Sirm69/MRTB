"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  FileCheck2, 
  DollarSign, 
  Activity,
  Briefcase,
  GraduationCap
} from "lucide-react";

interface AnalyticsResponse {
  metrics: {
    total_registered: number;
    pending_review: number;
    licensed_facilities: number;
    fees_collected: number;
  };
  professions: Record<string, number>;
  categories: {
    clinical: number;
    academic: number;
  };
  facilities: any[];
}

function AnalyticsContent() {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/analytics/data`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
        });
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        } else {
          router.push('/admin/login');
        }
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [router]);

  // Calculations from live database metrics
  const totalRegistrations = analyticsData?.metrics.total_registered ?? 0;
  const pendingAudits = analyticsData?.metrics.pending_review ?? 0;
  const approvedAccreditation = analyticsData?.metrics.licensed_facilities ?? 0;
  const calculatedRevenue = analyticsData?.metrics.fees_collected ?? 0;

  const professionsData = analyticsData?.professions || {};
  const categoriesData = analyticsData?.categories || { clinical: 0, academic: 0 };

  const professions = ["Physiotherapy", "Speech Therapy", "Audiology", "Occupational Therapy", "Prosthetics & Orthotics"];
  const getProfCount = (profName: string) => {
    let sum = 0;
    Object.keys(professionsData).forEach(key => {
      if (key.toLowerCase().includes(profName.toLowerCase().split(" ")[0])) {
        sum += professionsData[key];
      }
    });
    return sum;
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">System Analytics</h1>
        <p className="text-sm text-gray-500">Real-time metrics on facility registrations, progress metrics, and fees collection</p>
      </div>

      {isLoading ? (
        <div className="flex h-[60vh] items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5D9C0E]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
            {/* Metric 1 */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-[#EEF6DF] text-[#5D9C0E] p-3.5 rounded-2xl shrink-0">
                <Users size={22} />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Total Registered</span>
                <span className="text-2xl font-black text-gray-800">{totalRegistrations}</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-[#EEF6DF] text-[#5D9C0E] p-3.5 rounded-2xl shrink-0">
                <Activity size={22} />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Pending Review</span>
                <span className="text-2xl font-black text-gray-800">{pendingAudits}</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-[#EEF6DF] text-[#5D9C0E] p-3.5 rounded-2xl shrink-0">
                <FileCheck2 size={22} />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Licensed Facilities</span>
                <span className="text-2xl font-black text-gray-800">{approvedAccreditation}</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-[#EEF6DF] text-[#5D9C0E] p-3.5 rounded-2xl shrink-0">
                <DollarSign size={22} />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Fees Collected</span>
                <span className="text-xl font-black text-gray-800">₦{calculatedRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Left: Discipline distribution chart */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 md:col-span-2">
              <h3 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-[#5D9C0E]" /> Registrations per Clinical Specialty
              </h3>
              <div className="space-y-4">
                {professions.map((prof, idx) => {
                  const count = getProfCount(prof);
                  const pct = totalRegistrations > 0 ? (count / totalRegistrations) * 100 : 0;
                  return (
                    <div key={idx} className="space-y-1.5 text-xs font-semibold text-gray-700">
                      <div className="flex justify-between">
                        <span>{prof}</span>
                        <span className="text-gray-400">{count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#5D9C0E] h-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Category Distribution */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-6">Sector Breakdown</h3>
                <div className="space-y-4 text-xs font-semibold">
                  {/* Clinical */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Clinical Tiers</p>
                        <p className="text-[10px] text-gray-400">Hospitals, Private Practices</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-800">{categoriesData.clinical}</span>
                  </div>

                  {/* Academic */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                        <GraduationCap size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Academic Tiers</p>
                        <p className="text-[10px] text-gray-400">Universities, Training Centers</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-800">{categoriesData.academic}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-6 text-[10px] text-gray-400 leading-relaxed">
                * Sector breakdown is loaded dynamically based on registered categories compiled from pre-assessment logs.
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
