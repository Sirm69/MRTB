"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SpeechTherapyClinicalStep1 } from '@/app/field-team/components/SpeechTherapyClinicalStep1';
import { SpeechTherapyClinicalStep2 } from '@/app/field-team/components/SpeechTherapyClinicalStep2';
import { SpeechAcademicTablesStep1 } from '@/app/field-team/components/SpeechAcademicTablesStep1';
import { SpeechAcademicFormStep2 } from '@/app/field-team/components/SpeechAcademicFormStep2';
import { AudiologyAcademicTablesStep1 } from '@/app/field-team/components/AudiologyAcademicTablesStep1';
import { AudiologyAcademicFormStep2 } from '@/app/field-team/components/AudiologyAcademicFormStep2';
import { AudiologyClinicalStep1 } from '@/app/field-team/components/AudiologyClinicalStep1';
import { AudiologyClinicalStep2 } from '@/app/field-team/components/AudiologyClinicalStep2';
import { OccupationalTherapyAcademicTablesStep1 } from '@/app/field-team/components/OccupationalTherapyAcademicTablesStep1';
import { OccupationalTherapyAcademicFormStep2 } from '@/app/field-team/components/OccupationalTherapyAcademicFormStep2';
import { OccupationalTherapyClinicalStep1 } from '@/app/field-team/components/OccupationalTherapyClinicalStep1';
import { OccupationalTherapyClinicalStep2 } from '@/app/field-team/components/OccupationalTherapyClinicalStep2';
import { PhysiotherapyAcademicTablesStep1 } from '@/app/field-team/components/PhysiotherapyAcademicTablesStep1';
import { PhysiotherapyAcademicFormStep2 } from '@/app/field-team/components/PhysiotherapyAcademicFormStep2';
import { PhysiotherapyClinicalStep1 } from '@/app/field-team/components/PhysiotherapyClinicalStep1';
import { PhysiotherapyClinicalStep2 } from '@/app/field-team/components/PhysiotherapyClinicalStep2';
import { ProstheticsOrthoticsAcademicTablesStep1 } from '@/app/field-team/components/ProstheticsOrthoticsAcademicTablesStep1';
import { ProstheticsOrthoticsAcademicFormStep2 } from '@/app/field-team/components/ProstheticsOrthoticsAcademicFormStep2';
import { ProstheticsOrthoticsClinicalStep1 } from '@/app/field-team/components/ProstheticsOrthoticsClinicalStep1';
import { ProstheticsOrthoticsClinicalStep2 } from '@/app/field-team/components/ProstheticsOrthoticsClinicalStep2';
import { FormEReportStep3 } from '@/app/field-team/components/FormEReportStep3';
import { FileText, ArrowLeft, ShieldCheck, CheckCircle2, Building2, Calendar, Users, Loader2 } from 'lucide-react';

function ExaminePageContent() {
  const forceScrollToTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Reset scroll positions of any scrollable container on the page
    const allElements = document.querySelectorAll('*');
    allElements.forEach((el) => {
      if (el.scrollTop > 0) {
        el.scrollTop = 0;
      }
    });
  };

  const searchParams = useSearchParams();
  const router = useRouter();
  const facilityId = searchParams.get('id');
  const targetAdminId = searchParams.get('target_admin_id');

  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [fieldOfficerName, setFieldOfficerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [adminRole, setAdminRole] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [completeAuditPayload, setCompleteAuditPayload] = useState<any>(null);
  const [inspectionReport, setInspectionReport] = useState<any>(null);
  const [assessmentStatus, setAssessmentStatus] = useState<string>("submitted");
  const [panelMembersList, setPanelMembersList] = useState<string[]>([]);
  const [allInspectionReports, setAllInspectionReports] = useState<any[]>([]);
  const [selectedReportAdminId, setSelectedReportAdminId] = useState<number | null>(() => {
    return targetAdminId ? parseInt(targetAdminId) : null;
  });

  const isStepReadOnly = assessmentStatus === 'finalized' || assessmentStatus === 'forwarded' || assessmentStatus === 'approved' || assessmentStatus === 'rejected';
  const isStepReviewMode = assessmentStatus === 'inspected' || assessmentStatus === 'finalized' || assessmentStatus === 'forwarded' || assessmentStatus === 'approved' || assessmentStatus === 'rejected';

  const isReadOnlyForStep3 = () => {
    if (adminRole === 'admin_reviewer') {
      return assessmentStatus === 'forwarded' || assessmentStatus === 'approved' || assessmentStatus === 'rejected';
    }
    if (adminRole === 'admin_registrar') {
      return assessmentStatus !== 'forwarded';
    }
    return assessmentStatus === 'finalized' || assessmentStatus === 'forwarded' || assessmentStatus === 'approved' || assessmentStatus === 'rejected';
  };

  useEffect(() => {
    const role = localStorage.getItem('adminRole') || sessionStorage.getItem('adminRole') || '';
    setAdminRole(role);
  }, []);

  useEffect(() => {
    if (!facilityId) return;

    const fetchRealAssessment = async () => {
      const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const url = selectedReportAdminId 
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${facilityId}?target_admin_id=${selectedReportAdminId}`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${facilityId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'ngrok-skip-browser-warning': 'true' 
          }
        });

        if (response.ok) {
          const resData = await response.json();
          const realAssessment = resData.full_assessment;
          setAllInspectionReports(resData.all_inspection_reports || []);
          
          if (realAssessment) {
            setProfileData(resData.profile);
            const cachedName = localStorage.getItem('adminStaffName') || "Field Operations Team";
            const panelNames = resData.panel_members || [];
            setPanelMembersList(panelNames);
            const joinedNames = panelNames.length > 0 ? panelNames.join(", ") : cachedName;
            setFieldOfficerName(joinedNames);
            
            const sanitizeNulls = (obj: any): any => {
              if (obj === null || obj === undefined) return "";
              if (Array.isArray(obj)) return obj.map(sanitizeNulls);
              if (typeof obj === 'object') {
                const cleaned: any = {};
                for (const key in obj) {
                  if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    cleaned[key] = sanitizeNulls(obj[key]);
                  }
                }
                return cleaned;
              }
              return obj;
            };

            const sanitizedReport = resData.inspection_report ? sanitizeNulls(resData.inspection_report) : null;
            setInspectionReport(sanitizedReport);
            if (sanitizedReport) {
              setCompleteAuditPayload(sanitizedReport);
            }
            
            const status = resData.profile?.assessment_status || 'submitted';
            setAssessmentStatus(status);

            setAssessmentData({
              assessment_type: realAssessment.assessment_type || 'speech_therapy_clinical',
              spaces: realAssessment.spaces || [],
              clinicalTraining: realAssessment.clinicalTraining || [],
              equipment: realAssessment.equipment || [],
              name: resData.profile?.name || realAssessment.name || "Facility Document",
              visitation_date: resData.pre_assessment?.visit_date || "",
              ...realAssessment
            });
          }
        }
      } catch (error) {
        console.error("Network communication failure to endpoint:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealAssessment();
  }, [facilityId, router, selectedReportAdminId]);

  const handleStep1Complete = (step1TableData: any) => {
    setCompleteAuditPayload((prev: any) => ({ ...prev, step1: step1TableData }));
    setCurrentStep(2);
    setTimeout(() => forceScrollToTop(), 50);
  };

  const handleStep2CompleteSave = async (step2FormData: any) => {
    if (assessmentStatus === 'finalized' || assessmentStatus === 'forwarded' || assessmentStatus === 'approved' || assessmentStatus === 'rejected') {
      setCurrentStep(3);
      setTimeout(() => forceScrollToTop(), 50);
      return;
    }

    const action = step2FormData._action || 'save';
    const { _action, ...cleanFormData } = step2FormData;

    const finalReportBundle = { ...completeAuditPayload, step2: cleanFormData, finalizedAt: new Date().toISOString() };
    setCompleteAuditPayload(finalReportBundle);

    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    if (!token) {
      alert("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${facilityId}/inspection`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ report: finalReportBundle })
      });

      if (response.ok) {
        setInspectionReport(finalReportBundle);
        if (assessmentStatus === 'submitted') {
          setAssessmentStatus('inspected');
        }
        if (action === 'proceed') {
          setCurrentStep(3);
          setTimeout(() => forceScrollToTop(), 50);
        } else {
          alert("Accreditation progress saved successfully as draft!");
        }
      } else {
        const errData = await response.json();
        alert(`Error saving report: ${errData.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit report. Please check your network connection.");
    }
  };

  const handleFinalSubmit = async (formEData: any) => {
    const { _forwardToRegistrar, ...cleanFormEData } = formEData;
    const finalReportBundle = { ...completeAuditPayload, step3: cleanFormEData, finalizedAt: new Date().toISOString() };

    const token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
    if (!token) {
      alert("Session expired. Please log in again.");
      return;
    }

    const isForward = _forwardToRegistrar === true;
    const finalizeParam = isForward ? "true" : "false";

    try {
      const postUrl = selectedReportAdminId 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${facilityId}/inspection?finalize=${finalizeParam}&target_admin_id=${selectedReportAdminId}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${facilityId}/inspection?finalize=${finalizeParam}`;
      const response = await fetch(postUrl, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ report: finalReportBundle })
      });

      if (response.ok) {
        if (adminRole === 'admin_reviewer' || adminRole === 'admin_registrar') {
          if (adminRole === 'admin_registrar') {
            alert("Accreditation report changes saved successfully!");
            setInspectionReport(finalReportBundle);
            setCompleteAuditPayload(finalReportBundle);
            router.push('/admin/dashboard');
          } else if (isForward) {
            alert("Accreditation report review completed and forwarded to the Registrar successfully! The report is now locked.");
            router.push('/admin/dashboard');
          } else {
            alert("Accreditation report draft changes saved successfully!");
            // Refresh local report state
            setInspectionReport(finalReportBundle);
            setCompleteAuditPayload(finalReportBundle);
          }
        } else {
          alert("Accreditation report finalized and submitted successfully! The report is now locked.");
          router.push('/field-team/dashboard');
        }
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit final report. Please check your network connection.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-gray-500 text-xs font-semibold animate-pulse">Loading data environment...</p>
      </div>
    );
  }

  if (!assessmentData || !profileData) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] p-6">
        <p className="text-red-500 font-bold text-xs">No active record log found.</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg">Go Back</button>
      </div>
    );
  }

  const isAcademicFlow = assessmentData.assessment_type === 'speech_therapy_academic' || 
                         assessmentData.assessment_type === 'audiology_academic' ||
                         assessmentData.assessment_type === 'occupational_therapy_academic' ||
                         assessmentData.assessment_type === 'physiotherapy_academic' ||
                         assessmentData.assessment_type === 'prosthetics_orthotics_academic';

  if ((adminRole === 'admin_reviewer' || adminRole === 'admin_registrar') && !selectedReportAdminId) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in">
        <div className="bg-white rounded-3xl border border-gray-150 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] p-6 sm:p-8 max-w-xl w-full">
          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Submitted Field Reports</h2>
            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">{profileData?.name || "Facility Assessment"}</p>
          </div>
          
          <div className="space-y-3">
            {allInspectionReports.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-8">No inspection reports submitted yet.</p>
            ) : (
              allInspectionReports.map((rep: any) => (
                <button
                  key={rep.admin_id}
                  onClick={() => setSelectedReportAdminId(rep.admin_id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    rep.is_leader 
                      ? 'border-[#CDE1B4] bg-[#FAFCF8] hover:bg-[#EEF6DF]/40' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="truncate pr-4">
                    <span className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5 leading-tight mb-1 group-hover:text-[#65A30D] transition-colors truncate">
                      <FileText size={16} className={rep.is_leader ? "text-[#65A30D]" : "text-gray-400"} />
                      {rep.admin_name}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      {rep.is_leader ? "⭐ Designated Inspection Leader" : "Inspection Panel Member"}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                    rep.status === 'forwarded' 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                      : 'bg-green-50 text-green-600 border border-green-100'
                  }`}>
                    {rep.status}
                  </span>
                </button>
              ))
            )}
          </div>
          
          <button 
            onClick={() => router.back()}
            className="w-full mt-6 py-3.5 border border-gray-200 text-gray-650 hover:bg-gray-50 transition-all rounded-xl text-xs font-bold uppercase tracking-wider text-center"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] px-3 sm:px-6 py-4 md:py-5 pb-20 text-gray-800 antialiased">
      
      {/* COMPACT CENTRED NAVIGATION & STEPPER HEADER */}
      <div className="max-w-5xl mx-auto space-y-3 mb-4">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
          <button 
            onClick={() => { 
              if (currentStep === 3) {
                setCurrentStep(2);
                setTimeout(() => forceScrollToTop(), 50);
              } else if (currentStep === 2) {
                setCurrentStep(1); 
                setTimeout(() => forceScrollToTop(), 50);
              } else {
                if ((adminRole === 'admin_reviewer' || adminRole === 'admin_registrar') && !targetAdminId) {
                  setSelectedReportAdminId(null);
                } else {
                  router.back();
                }
              }
            }} 
            className="h-8 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>{currentStep === 3 ? 'Back to Step 2 Form' : currentStep === 2 ? 'Back to Step 1 Tables' : ((adminRole === 'admin_reviewer' || adminRole === 'admin_registrar') && !targetAdminId) ? 'Select Report' : 'Dashboard'}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#066936] border border-[#CDE1B4]/70 px-2.5 py-0.5 bg-[#EEF6DF] rounded-full inline-flex items-center gap-1 shadow-xs">
              <ShieldCheck size={12} className="text-[#066936]" /> Official Assessment Mode
            </span>
          </div>
        </div>

        {/* SLIM 3-STEP PROGRESS STEPPER */}
        <div className="bg-white rounded-xl border border-gray-150 p-1.5 shadow-xs">
          <div className="grid grid-cols-3 gap-1.5">
            
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(1);
                  setTimeout(() => forceScrollToTop(), 50);
                }
              }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                currentStep === 1
                  ? 'bg-[#EEF6DF] text-[#066936]'
                  : currentStep > 1
                    ? 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                    : 'text-gray-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentStep === 1
                  ? 'bg-[#5D9C0E] text-white shadow-xs'
                  : currentStep > 1
                    ? 'bg-[#066936] text-white'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {currentStep > 1 ? <CheckCircle2 size={12} /> : '1'}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium truncate block leading-tight">Phase 1: Verification</span>
              </div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (currentStep > 2) {
                  setCurrentStep(2);
                  setTimeout(() => forceScrollToTop(), 50);
                }
              }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                currentStep === 2
                  ? 'bg-[#EEF6DF] text-[#066936]'
                  : currentStep > 2
                    ? 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                    : 'text-gray-400 opacity-60'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentStep === 2
                  ? 'bg-[#5D9C0E] text-white shadow-xs'
                  : currentStep > 2
                    ? 'bg-[#066936] text-white'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                {currentStep > 2 ? <CheckCircle2 size={12} /> : '2'}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium truncate block leading-tight">Phase 2: Questionnaire</span>
              </div>
            </button>

            {/* Step 3 */}
            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                currentStep === 3
                  ? 'bg-[#EEF6DF] text-[#066936]'
                  : 'text-gray-400 opacity-60'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                currentStep === 3
                  ? 'bg-[#5D9C0E] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                3
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-medium truncate block leading-tight">Phase 3: Form E Report</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* COMPACT FACILITY UNDER INSPECTION CARD */}
      {currentStep === 1 && (
        <div className="max-w-5xl mx-auto bg-white border border-gray-150 rounded-xl p-3.5 sm:p-4 mb-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
                <Building2 size={16} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm tracking-tight truncate">{assessmentData.name}</h3>
                <p className="text-[11px] text-gray-400 truncate">{profileData?.address || `${profileData?.lga || ''}, ${profileData?.state || ''}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-medium text-[#066936] bg-[#EEF6DF] px-2.5 py-0.5 rounded-full border border-[#CDE1B4]/50">
                {profileData?.category || (isAcademicFlow ? 'Academic Category' : 'Clinical Category')}
              </span>
              <span className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                {profileData?.profession || '-'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Scheduled Date:</span>
              <span className="text-gray-800 font-medium inline-flex items-center gap-1">
                <Calendar size={12} className="text-[#5D9C0E]" /> {assessmentData.visitation_date || "Scheduled"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Lead Inspector:</span>
              <span className="text-gray-800 font-medium">{fieldOfficerName || "Designated Lead"}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* PIPELINE DISPATCH CONTROLLER LAYER */}
      <div className="max-w-5xl mx-auto">
        {currentStep === 3 ? (
          <FormEReportStep3
            assessmentType={assessmentData.assessment_type}
            step2Data={completeAuditPayload?.step2}
            onComplete={handleFinalSubmit}
            onBack={() => { 
              setCurrentStep(2); 
              setTimeout(() => forceScrollToTop(), 50);
            }}
            inspectionReport={inspectionReport}
            isReadOnly={isReadOnlyForStep3()}
            adminRole={adminRole}
            prefilledPanelMembers={panelMembersList}
          />
        ) : isAcademicFlow ? (
          currentStep === 1 ? (
            assessmentData.assessment_type === 'speech_therapy_academic' ? (
              <SpeechAcademicTablesStep1 
                isReadOnly={isStepReadOnly}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name}
                spacesData={assessmentData.spaces}
                clinicalData={assessmentData.clinicalTraining}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            ) : assessmentData.assessment_type === 'audiology_academic' ? (
              <AudiologyAcademicTablesStep1 
                isReadOnly={isStepReadOnly}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name}
                spacesData={assessmentData.spaces}
                clinicalData={assessmentData.clinicalTraining}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            ) : assessmentData.assessment_type === 'occupational_therapy_academic' ? (
              <OccupationalTherapyAcademicTablesStep1 
                isReadOnly={isStepReadOnly}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name}
                spacesData={assessmentData.spaces}
                clinicalData={assessmentData.clinicalTraining}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            ) : assessmentData.assessment_type === 'physiotherapy_academic' ? (
              <PhysiotherapyAcademicTablesStep1 
                isReadOnly={isStepReadOnly}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name}
                spacesData={assessmentData.spaces}
                clinicalData={assessmentData.clinicalTraining}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            ) : (
              <ProstheticsOrthoticsAcademicTablesStep1 
                isReadOnly={isStepReadOnly}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name}
                spacesData={assessmentData.spaces}
                clinicalData={assessmentData.clinicalTraining}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            )
          ) : (
            assessmentData.assessment_type === 'speech_therapy_academic' ? (
              <SpeechAcademicFormStep2 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name} // Pass verified data attribute here
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport}
              />
            ) : assessmentData.assessment_type === 'audiology_academic' ? (
              <AudiologyAcademicFormStep2 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name} // Pass verified data attribute here
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport}
              />
            ) : assessmentData.assessment_type === 'occupational_therapy_academic' ? (
              <OccupationalTherapyAcademicFormStep2 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name} // Pass verified data attribute here
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport}
              />
            ) : assessmentData.assessment_type === 'physiotherapy_academic' ? (
              <PhysiotherapyAcademicFormStep2 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name} // Pass verified data attribute here
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport}
              />
            ) : (
              <ProstheticsOrthoticsAcademicFormStep2 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date}
                fieldTeamMembers={fieldOfficerName}
                institutionName={assessmentData.name} // Pass verified data attribute here
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport}
              />
            )
          )
        ) : (
          currentStep === 1 ? (
            assessmentData.assessment_type === 'speech_therapy_clinical' ? (
              <SpeechTherapyClinicalStep2 
                isReadOnly={isStepReadOnly}
                spacesData={assessmentData.spaces}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            ) : assessmentData.assessment_type === 'audiology_clinical' ? (
              <AudiologyClinicalStep2 
                isReadOnly={isStepReadOnly}
                spacesData={assessmentData.spaces}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            ) : assessmentData.assessment_type === 'occupational_therapy_clinical' ? (
              <OccupationalTherapyClinicalStep2 
                isReadOnly={isStepReadOnly}
                spacesData={assessmentData.spaces}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            ) : assessmentData.assessment_type === 'physiotherapy_clinical' ? (
              <PhysiotherapyClinicalStep2 
                isReadOnly={isStepReadOnly}
                spacesData={assessmentData.spaces}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            ) : (
              <ProstheticsOrthoticsClinicalStep2 
                isReadOnly={isStepReadOnly}
                spacesData={assessmentData.spaces}
                equipmentData={assessmentData.equipment}
                assessmentType={assessmentData.assessment_type}
                onComplete={handleStep1Complete}
                inspectionReport={inspectionReport}
              />
            )
          ) : (
            assessmentData.assessment_type === 'speech_therapy_clinical' ? (
              <SpeechTherapyClinicalStep1 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date} 
                fieldTeamMembers={fieldOfficerName} 
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport} 
              />
            ) : assessmentData.assessment_type === 'audiology_clinical' ? (
              <AudiologyClinicalStep1 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date} 
                fieldTeamMembers={fieldOfficerName} 
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport} 
              />
            ) : assessmentData.assessment_type === 'occupational_therapy_clinical' ? (
              <OccupationalTherapyClinicalStep1 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date} 
                fieldTeamMembers={fieldOfficerName} 
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport} 
              />
            ) : assessmentData.assessment_type === 'physiotherapy_clinical' ? (
              <PhysiotherapyClinicalStep1 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date} 
                fieldTeamMembers={fieldOfficerName} 
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport} 
              />
            ) : (
              <ProstheticsOrthoticsClinicalStep1 
                isReviewMode={isStepReviewMode}
                isReadOnly={isStepReadOnly}
                onBack={() => { setCurrentStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                visitationDate={assessmentData.visitation_date} 
                fieldTeamMembers={fieldOfficerName} 
                onComplete={handleStep2CompleteSave}
                inspectionReport={inspectionReport} 
              />
            )
          )
        )}
      </div>
    </div>
  );
}

export default function ExaminePage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAFCF8]">
          <Loader2 className="animate-spin text-[#5D9C0E]" size={40} />
        </div>
      }
    >
      <ExaminePageContent />
    </Suspense>
  );
}