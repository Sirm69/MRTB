"use client";

import React, { useState, Suspense } from "react";
import { 
  FileText, 
  Award, 
  UploadCloud, 
  Trash2, 
  FileCheck2,
  Lock
} from "lucide-react";
import { useUser } from "../layout";

function DocumentsContent() {
  const { userData } = useUser();
  
  // Local state for uploaded files simulation
  const [uploads, setUploads] = useState<any[]>([
    { name: "cac_incorporation_certificate.pdf", size: "1.4 MB", type: "application/pdf", date: "01 Aug 2025" }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const assessmentStatus = userData?.assessment_status;
  const hasFinalizedReport = userData?.has_finalized_report === true;
  const isAccredited = hasFinalizedReport && assessmentStatus === "approved";
  const isAccreditationRejected = hasFinalizedReport && assessmentStatus === "rejected";

  const handleDownloadReport = () => {
    if (!userData) return;
    window.open(`/report/print?id=${userData.id}`, '_blank');
  };

  const handleDownloadCertificate = () => {
    alert("Downloading your official MRTB Accreditation Certificate...");
  };

  // Drag and drop simulation
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setTimeout(() => {
      const newUpload = {
        name: file.name.toLowerCase(),
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        type: file.type || "application/octet-stream",
        date: new Date().toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })
      };
      setUploads([...uploads, newUpload]);
      setIsUploading(false);
    }, 1500);
  };

  const handleDeleteUpload = (index: number) => {
    setUploads(uploads.filter((_, idx) => idx !== index));
  };

  return (
    <>
      {/* Title Header */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Documents & Certificates</h1>
        <p className="text-sm text-gray-500">Download evaluation files and upload mandatory clinic compliance credentials</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        
        {/* Reports & Certificates section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Evaluation Report Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="bg-[#EEF6DF] text-[#5D9C0E] p-2.5 rounded-2xl w-fit mb-3">
                  <FileText size={20} />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Evaluation Report</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  The detailed audit findings and requirements checklist submitted by the inspection panel.
                </p>
              </div>
              <div className="mt-4 border-t border-gray-50 pt-3">
                {hasFinalizedReport ? (
                  <button 
                    onClick={handleDownloadReport}
                    className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold text-xs py-2 px-4 rounded-full w-full transition-colors cursor-pointer text-center"
                  >
                    Download Report (PDF)
                  </button>
                ) : (
                  <span className="text-gray-400 text-[11px] font-bold flex items-center gap-1.5 justify-center py-2"><Lock size={12}/> Locked (Awaiting Inspection)</span>
                )}
              </div>
            </div>

            {/* Accreditation Certificate Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="bg-[#EEF6DF] text-[#5D9C0E] p-2.5 rounded-2xl w-fit mb-3">
                  <Award size={20} />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Official Certification</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Your official MRTB Accreditation Certificate indicating registration tier, discipline, and validity.
                </p>
              </div>
              <div className="mt-4 border-t border-gray-50 pt-3">
                {isAccredited ? (
                  <button 
                    onClick={handleDownloadCertificate}
                    className="bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold text-xs py-2 px-4 rounded-full w-full transition-colors cursor-pointer text-center"
                  >
                    Download Certificate
                  </button>
                ) : (
                  <span className="text-gray-400 text-[11px] font-bold flex items-center gap-1.5 justify-center py-2"><Lock size={12}/> Locked (Awaiting Approval)</span>
                )}
              </div>
            </div>

          </div>

          {/* Document Vault / Upload list */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileCheck2 size={18} className="text-[#5D9C0E]" /> Document Vault
            </h3>

            {uploads.length > 0 ? (
              <div className="space-y-2">
                {uploads.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg border border-gray-100 text-[#5D9C0E] font-bold text-[10px] shrink-0 uppercase">
                        {file.name.split('.').pop()}
                      </div>
                      <div className="leading-tight">
                        <p className="font-bold text-gray-800 truncate max-w-[150px] sm:max-w-xs">{file.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{file.size} • Uploaded on {file.date}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteUpload(idx)} 
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                      title="Delete document"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 py-3 italic">Vault is empty. Upload your facility documents below.</p>
            )}
          </div>
        </div>

        {/* Drag and Drop Uploader Zone */}
        <div className="space-y-6">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`bg-white rounded-3xl p-6 shadow-sm border-2 border-dashed text-center flex flex-col items-center justify-center min-h-[220px] transition-colors relative ${
              dragActive ? "border-[#5D9C0E] bg-[#FAFCF8]" : "border-gray-200 hover:border-[#5D9C0E]/40"
            }`}
          >
            <input 
              type="file" 
              id="file-upload-input" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D9C0E]"></div>
                <p className="text-xs font-bold text-[#5D9C0E]">Uploading file...</p>
              </div>
            ) : (
              <>
                <div className="bg-[#EEF6DF] text-[#5D9C0E] p-3 rounded-2xl mb-4">
                  <UploadCloud size={24} />
                </div>
                <h4 className="font-bold text-gray-800 text-xs mb-1">Drag and drop file here</h4>
                <p className="text-[10px] text-gray-400 mb-3">or browse from device storage</p>
                <span className="bg-gray-100 text-gray-500 font-bold px-4 py-1.5 rounded-full text-[9px] pointer-events-none">
                  PDF, JPG or PNG up to 10MB
                </span>
              </>
            )}
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-[11px] text-gray-400 leading-relaxed">
            <span className="font-bold text-gray-600 block mb-1">Notice:</span>
            Documents uploaded here are reviewed and processed by the registration board. Ensure scans are legible and valid.
          </div>
        </div>

      </div>
    </>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D9C0E]"></div>
        </div>
      }
    >
      <DocumentsContent />
    </Suspense>
  );
}
