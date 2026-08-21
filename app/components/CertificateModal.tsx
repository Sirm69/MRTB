"use client";

import React, { useState, useRef } from "react";
import { 
  X, 
  Download, 
  Printer, 
  Award, 
  CheckCircle2, 
  Loader2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import CertificateView, { CertificateData, detectTemplateType } from "./CertificateView";
import { downloadCertificatePDF } from "../utils/certificatePdfGenerator";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateData: CertificateData;
}

export default function CertificateModal({
  isOpen,
  onClose,
  certificateData,
}: CertificateModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>("");
  const [scale, setScale] = useState<number>(0.75);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const template = detectTemplateType(certificateData);
  const templateName =
    template === "academic"
      ? "Academic Accreditation (Degree Programmes)"
      : template === "internship"
      ? "Internship Training Accreditation (Hospitals)"
      : "Clinical Safe Practice Accreditation (Clinics)";

  const filename = `MRTB_Certificate_${(certificateData.registrationNumber || "ACCREDITED").replace(/[\/\\]/g, "_")}.pdf`;

  const handleDownload = async () => {
    setIsDownloading(true);
    setProgressStatus("Preparing official certificate...");

    try {
      await downloadCertificatePDF({
        elementId: "mrtb-certificate-container",
        filename,
        onProgress: (msg) => setProgressStatus(msg),
      });
      setTimeout(() => {
        setIsDownloading(false);
        setProgressStatus("");
      }, 1000);
    } catch (err) {
      console.error("Certificate download error:", err);
      alert("Failed to generate certificate PDF. Please try again or use the Print button.");
      setIsDownloading(false);
      setProgressStatus("");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("mrtb_print_certificate_data", JSON.stringify(certificateData));
      } catch (e) {
        console.error("Failed to store cert data in sessionStorage:", e);
      }
      const printUrl = `/certificate/print?id=${certificateData.id || ""}`;
      window.open(printUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#FAFCF8] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6DF] flex items-center justify-center text-[#066936] shadow-sm">
              <Award size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  Official MRTB Accreditation Certificate
                </h3>
                <span className="bg-[#5D9C0E]/15 text-[#066936] text-[10.5px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={12} /> Issued
                </span>
              </div>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                {templateName} • Ref: {certificateData.registrationNumber || "Official Record"}
              </p>
            </div>
          </div>

          {/* Action Buttons & Close */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 mr-2 text-gray-600">
              <button
                onClick={() => setScale((s) => Math.max(0.4, Number((s - 0.1).toFixed(2))))}
                className="p-1 hover:bg-gray-100 rounded text-xs"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>
              <span className="text-[11px] font-mono px-1.5 font-medium">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(1.2, Number((s + 0.1).toFixed(2))))}
                className="p-1 hover:bg-gray-100 rounded text-xs"
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={() => setScale(0.75)}
                className="p-1 hover:bg-gray-100 rounded text-xs text-gray-400 hover:text-gray-700"
                title="Reset Zoom"
              >
                <RotateCcw size={13} />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
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
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={15} />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer ml-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PROGRESS BANNER WHEN DOWNLOADING */}
        {progressStatus && (
          <div className="bg-[#EEF6DF] px-6 py-2 border-b border-[#BDE0A6]/40 flex items-center justify-between text-xs text-[#066936] font-medium">
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[#5D9C0E]" />
              {progressStatus}
            </span>
            <span className="text-[11px] text-gray-500 font-normal">Please wait while document renders...</span>
          </div>
        )}

        {/* CERTIFICATE PREVIEW VIEWER AREA */}
        <div className="flex-1 overflow-auto bg-slate-200/80 p-4 sm:p-8 flex justify-center items-start min-h-[500px]">
          <div 
            ref={printRef}
            className="transition-transform duration-150 origin-top shadow-2xl rounded-sm"
          >
            <CertificateView 
              data={certificateData} 
              scale={scale} 
            />
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3 border-t border-gray-100 bg-white flex flex-wrap items-center justify-between text-xs text-gray-500 shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#5D9C0E]" />
            <span>High-resolution statutory accreditation document generated by MRTB Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="sm:hidden text-gray-600 hover:underline text-xs flex items-center gap-1"
            >
              <Printer size={13} /> Print
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xs font-medium px-2 py-1 rounded hover:bg-gray-100"
            >
              Close Preview
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
