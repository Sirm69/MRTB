"use client";

import React, { useState, useEffect } from 'react';
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
import { FileText } from 'lucide-react';

export default function ExaminePage() {
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
    <div className="w-full min-h-screen bg-[#FAFAFA] px-2 sm:px-4 py-5 md:p-8 pb-24 text-gray-800">
      
      {/* CENTRED NAVIGATION HEADER */}
      <div className="max-w-5xl mx-auto border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center justify-between mb-2">
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
            className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs font-semibold transition-colors"
          >
            {currentStep === 3 ? '← Back to Step 2 Form' : currentStep === 2 ? '← Back to Step 1 Tables' : ((adminRole === 'admin_reviewer' || adminRole === 'admin_registrar') && !targetAdminId) ? '← Select Report' : '← Dashboard'}
          </button>
          <span className="text-[10px] uppercase font-extrabold text-[#066936] border border-[#CDE1B4] px-3 py-1 bg-[#EEF6DF] rounded-full tracking-wider shadow-sm">
            Official Form Mode
          </span>
        </div>
        
        <h2 className="text-center text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-tight mt-3">
          Accreditation Assessment Dashboard
        </h2>
      </div>

      {/* METADATA SUMMARY INFO: MODIFIED TO RENDER ONLY ON THE FIRST WORK VIEW */}
      {currentStep === 1 && (
        <div className="max-w-5xl mx-auto bg-white border border-[#CDE1B4]/70 rounded-2xl p-5 md:p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-4 border-b border-gray-100/80 gap-3">
            <div>
              <h3 className="text-[10px] font-bold text-[#5D9C0E] uppercase tracking-wider mb-0.5">Facility Under Inspection</h3>
              <p className="font-extrabold text-gray-900 text-base md:text-lg tracking-tight leading-tight">{assessmentData.name}</p>
            </div>
            <div className="bg-[#EEF6DF] px-4 py-1.5 rounded-full border border-[#CDE1B4]/50 text-right w-fit">
              <span className="text-[10px] uppercase font-black text-[#066936] tracking-wide">
                {profileData?.category || (isAcademicFlow ? 'Academic Category' : 'Clinical Category')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 font-semibold text-gray-600">
            <div className="flex items-start gap-2.5">
              <span className="text-gray-400 font-medium">Profession:</span> 
              <span className="text-gray-800 font-bold">{profileData?.profession || '-'}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-gray-400 font-medium">Address:</span> 
              <span className="text-gray-800 font-bold leading-relaxed">{profileData?.address || `${profileData?.lga || ''}, ${profileData?.state || ''}`}</span>
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