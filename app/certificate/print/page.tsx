"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Download, Printer, ArrowLeft, Loader2, Award } from "lucide-react";
import CertificateView, { CertificateData } from "@/app/components/CertificateView";
import { downloadCertificatePDF } from "@/app/utils/certificatePdfGenerator";

function CertificatePrintContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const facilityId = searchParams.get("id");

  // First try to synchronously initialize from sessionStorage for instant, exact rendering
  const [certData, setCertData] = useState<CertificateData | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("mrtb_print_certificate_data");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!facilityId || String(parsed.id) === String(facilityId)) {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Error reading stored certificate data:", e);
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(() => !certData);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If certData was already restored from sessionStorage, no need to re-fetch unless requested
    if (certData && (!facilityId || String(certData.id) === String(facilityId))) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      const adminToken = localStorage.getItem("adminAccessToken") || sessionStorage.getItem("adminAccessToken") || localStorage.getItem("token") || sessionStorage.getItem("token");
      const userToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken") || localStorage.getItem("token") || sessionStorage.getItem("token");

      try {
        let response;
        if (facilityId && adminToken) {
          response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${facilityId}`, {
            method: "GET",
            headers: { 
              "Authorization": `Bearer ${adminToken}`, 
              "ngrok-skip-browser-warning": "true" 
            },
          });
        } else if (userToken) {
          response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/profile`, {
            method: "GET",
            headers: { 
              "Authorization": `Bearer ${userToken}`, 
              "ngrok-skip-browser-warning": "true" 
            },
          });
        } else {
          const stored = sessionStorage.getItem("mrtb_print_certificate_data");
          if (stored) {
            setCertData(JSON.parse(stored));
            setIsLoading(false);
            return;
          }
          setError("Unauthorized access. Please log in first.");
          setIsLoading(false);
          return;
        }

        if (response.ok) {
          const resData = await response.json();
          const profile = resData.profile || resData.data || resData;
          const report = resData.inspection_report || profile.inspection_report;
          const assessment = resData.full_assessment || profile.full_assessment || resData.pre_assessment;

          // Format dates
          const today = new Date();
          const dayNum = today.getDate();
          const daySuffix = (day: number) => {
            if (day > 3 && day < 21) return `${day}th`;
            switch (day % 10) {
              case 1: return `${day}st`;
              case 2: return `${day}nd`;
              case 3: return `${day}rd`;
              default: return `${day}th`;
            }
          };

          const monthYear = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

          // Extract location
          const state = profile.state || assessment?.state || resData.state || "";
          const city = profile.lga || profile.city || assessment?.lga || resData.lga || "";
          const address = profile.address || assessment?.address || resData.address || "";
          const locString = [city, state].filter(Boolean).join(", ") || address || "NIGERIA";

          // Extract duration and decision
          const decision = report?.step3?.decision || report?.decision || "Full Accreditation";
          const duration = report?.step3?.duration || "Five (5) Years";

          // Format visit date
          const visitDate = profile.visit_date || profile.inspection_date || resData.visit_date || "";
          const accDate = visitDate 
            ? new Date(visitDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
            : today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

          const discipline = profile.discipline || profile.profession || resData.discipline || resData.profession || "Physiotherapy";
          const orgName = profile.institution_name || profile.facility_name || profile.name || resData.institution_name || resData.facility_name || resData.name || "ACCREDITED FACILITY";

          // Construct formatted certificate data
          const formattedData: CertificateData = {
            id: profile.id || facilityId || resData.id,
            organizationName: orgName,
            location: locString,
            programmeName: profile.programme_name || resData.programme_name || (discipline ? `Bachelor of ${discipline} Training Programme` : undefined),
            discipline: discipline,
            decisionType: decision,
            duration: duration,
            registrationNumber: profile.registration_number || profile.accreditation_number || profile.user_code || resData.registration_number || resData.accreditation_number || resData.user_code || `MRTB/SPP/${(discipline || "PT").slice(0,2).toUpperCase()}/${String(profile.id || facilityId || 1).padStart(4, "0")}`,
            accreditationDate: accDate,
            issueDay: daySuffix(dayNum),
            issueMonthYear: monthYear,
          };

          setCertData(formattedData);
        } else {
          const stored = sessionStorage.getItem("mrtb_print_certificate_data");
          if (stored) {
            setCertData(JSON.parse(stored));
          } else {
            setError("Failed to load official accreditation data.");
          }
        }
      } catch (err: any) {
        console.error("Error loading certificate data:", err);
        const stored = sessionStorage.getItem("mrtb_print_certificate_data");
        if (stored) {
          setCertData(JSON.parse(stored));
        } else {
          setError("Error connecting to server.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [facilityId]);

  const handleDownload = async () => {
    if (!certData) return;
    setIsDownloading(true);
    const filename = `MRTB_Certificate_${(certData.registrationNumber || "ACCREDITED").replace(/[\/\\]/g, "_")}.pdf`;

    try {
      await downloadCertificatePDF({
        elementId: "mrtb-certificate-container",
        filename,
      });
    } catch (e) {
      console.error(e);
      alert("Failed to download PDF. Please use the Print option.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#5D9C0E] mb-3" size={36} />
        <p className="text-sm font-medium text-gray-700">Loading Official Certificate...</p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
          <Award size={28} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Certificate Unavailable</h2>
        <p className="text-sm text-gray-500 max-w-md mt-1 mb-5">{error || "Could not retrieve certificate information."}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200/90 py-8 px-4 flex flex-col items-center print:bg-white print:p-0">
      
      {/* Top Floating Control Bar (Hidden when printing) */}
      <div className="w-full max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-4 bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-sm border border-gray-200 print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h2 className="text-sm font-bold text-gray-800">MRTB Accreditation Certificate</h2>
          <p className="text-[11px] text-gray-500">{certData.organizationName}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            <Printer size={15} />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5D9C0E] hover:bg-[#4a7c0b] disabled:bg-gray-300 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {isDownloading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Certificate Viewer Wrapper */}
      <div className="shadow-2xl print:shadow-none print:m-0 flex justify-center">
        <CertificateView data={certData} />
      </div>

    </div>
  );
}

export default function CertificatePrintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#5D9C0E]" size={36} />
      </div>
    }>
      <CertificatePrintContent />
    </Suspense>
  );
}
