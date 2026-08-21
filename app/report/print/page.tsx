"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PrintReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const facilityId = searchParams.get('id');

  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [fieldOfficerName, setFieldOfficerName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [inspectionReport, setInspectionReport] = useState<any>(null);
  const [panelMembersList, setPanelMembersList] = useState<string[]>([]);

  useEffect(() => {
    if (!facilityId) return;

    const fetchData = async () => {
      const adminToken = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken');
      const userToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

      try {
        let response;
        if (adminToken) {
          response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/admin/user/${facilityId}`, {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${adminToken}`, 
              'ngrok-skip-browser-warning': 'true' 
            }
          });
        } else if (userToken) {
          response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/profile`, {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${userToken}`, 
              'ngrok-skip-browser-warning': 'true' 
            }
          });
        } else {
          alert("Unauthorized access. Please log in first.");
          router.push('/');
          return;
        }

        if (response.ok) {
          const resData = await response.json();
          
          if (adminToken) {
            const realAssessment = resData.full_assessment;
            setProfileData(resData.profile);
            const cachedName = localStorage.getItem('adminStaffName') || "Field Operations Team";
            const panelNames = resData.panel_members || [];
            setPanelMembersList(panelNames);
            setFieldOfficerName(panelNames.length > 0 ? panelNames.join(", ") : cachedName);
            setInspectionReport(resData.inspection_report);
            
            setAssessmentData({
              assessment_type: realAssessment?.assessment_type || 'speech_therapy_clinical',
              spaces: realAssessment?.spaces || [],
              clinicalTraining: realAssessment?.clinicalTraining || [],
              equipment: realAssessment?.equipment || [],
              name: resData.profile?.name || realAssessment?.name || "Facility Document",
              visitation_date: resData.pre_assessment?.visit_date || "",
              ...realAssessment
            });
          } else {
            setProfileData(resData);
            setInspectionReport(resData.inspection_report);
            const reportDate = resData.inspection_report?.step3?.reportDate || resData.visit_date;
            setFieldOfficerName(resData.inspection_report?.step3?.panelMembers?.join(", ") || "Evaluation Team");
            setPanelMembersList(resData.inspection_report?.step3?.panelMembers || []);

            const fullAssessment = resData.full_assessment;
            setAssessmentData({
              assessment_type: fullAssessment?.assessment_type || 'speech_therapy_clinical',
              spaces: fullAssessment?.spaces || [],
              clinicalTraining: fullAssessment?.clinicalTraining || [],
              equipment: fullAssessment?.equipment || [],
              name: resData.name,
              visitation_date: reportDate || "",
              ...fullAssessment
            });
          }
        } else {
          alert("Failed to load evaluation details.");
        }
      } catch (error) {
        console.error("Error loading print data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [facilityId, router]);

  useEffect(() => {
    if (!isLoading && assessmentData) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, assessmentData]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white p-4">
        <p className="text-gray-500 text-xs font-semibold animate-pulse">Preparing document view for print...</p>
      </div>
    );
  }

  if (!assessmentData || !profileData) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <p className="text-red-500 font-bold text-xs">No active report record found.</p>
      </div>
    );
  }

  const resolveGridVal = (
    inputObj: any, 
    prefix: string, 
    item: any, 
    groupIdx: number, 
    idx: number, 
    index: number
  ) => {
    if (!inputObj) return {};
    
    // 1. Try Academic Format (space-groupIdx-idx-sn)
    const academicKey = `${prefix}-${groupIdx}-${idx}-${item.sn}`;
    if (inputObj[academicKey]) return inputObj[academicKey];
    
    // 2. Try Clinical Format (space-sn-index)
    const clinicalKey = `${prefix}-${item.sn}-${index}`;
    if (inputObj[clinicalKey]) return inputObj[clinicalKey];
    
    return {};
  };

  const s1 = inspectionReport?.step1;
  const s2 = inspectionReport?.step2;
  const s3 = inspectionReport?.step3;

  // Helper mappings for preamble & visit info across both step1 (new) and step2 (legacy) records
  const preambleObj = s1?.preamble || s2?.preamble;
  const travelObj = s1?.travelInfo || s2?.travelInfo;
  const repsList: string[] = Array.isArray(s1?.representatives) ? s1.representatives : Array.isArray(s2?.representatives) ? s2.representatives : [];

  const getTravelMode = () => preambleObj?.modeOfTravel || travelObj?.modeOfTravel || "";
  const getArrivalDateTime = () => {
    const date = preambleObj?.arrivalDate || travelObj?.arrivalDate;
    const time = preambleObj?.arrivalTime || travelObj?.arrivalTime;
    if (!date) return "";
    return `${date}${time ? ` at ${time}` : ''}`;
  };
  const getProgram = () => preambleObj?.programToAccredit || "";
  const getPlaceOfReception = () => preambleObj?.placeOfReception || travelObj?.placeOfReception || "";
  const getTypeOfReception = () => {
    if (preambleObj) {
      if (preambleObj.typeWarm) return "Warm";
      if (preambleObj.typeCordial) return "Cordial";
      if (preambleObj.typeHostile) return "Hostile";
      if (preambleObj.typeOthersChecked) return preambleObj.typeOthersText ? `Others (${preambleObj.typeOthersText})` : "Others";
    }
    if (travelObj?.typeOfReception) {
      return `${travelObj.typeOfReception}${travelObj.typeOfReceptionOthers ? ` (${travelObj.typeOfReceptionOthers})` : ''}`;
    }
    return "";
  };

  const getAcademicConforms = () => s2?.academic?.aYes ? "Yes" : s2?.academic?.aNo ? "No" : "";
  const getAdmissionConforms = () => s2?.academic?.bYes ? "Yes" : s2?.academic?.bNo ? "No" : "";
  const getHandbookComplies = () => s2?.academic?.c1Yes ? "Yes" : s2?.academic?.c1No ? "No" : "";
  const getLectureSchedule = () => s2?.academic?.c2Yes ? "Yes" : s2?.academic?.c2No ? "No" : "";
  const getNotesCompliance = () => s2?.academic?.c3Yes ? "Yes" : s2?.academic?.c3No ? "No" : "";
  const getPracticalSchedule = () => s2?.academic?.c4Yes ? "Yes" : s2?.academic?.c4No ? "No" : "";
  const getDressCode = () => s2?.academic?.fDressingModest ? "Modest" : s2?.academic?.fDressingNotModest ? "Not Modest" : "";

  const getSignage = () => s2?.facilities?.signPresent ? "Present (Conspicuous)" : s2?.facilities?.signAbsent ? "Absent" : "";
  const getCleanliness = () => s2?.facilities?.outlookClean ? "Clean & Orderly" : s2?.facilities?.outlookUnclean ? "Unclean / Cluttered" : "";
  const getClinicalStructure = () => s2?.clinical?.deptStructurePurposedBuilt ? "Purpose-built" : s2?.clinical?.deptStructureGeneralPurpose ? "General Purpose" : s2?.clinical?.deptStructureSharedSpace ? "Shared Space" : "";
  const getTherapistsStrength = () => s2?.clinical?.deptTherapistsAdequate ? "Adequate Strength" : s2?.clinical?.deptTherapistsInadequate ? "Inadequate Strength" : "";
  const getWaitingArea = () => s2?.clinical?.deptWaitingAvailable ? "Available" : s2?.clinical?.deptWaitingNotAvailable ? "Not Available" : "";
  const getConveniences = () => s2?.clinical?.deptConveniencesAvailable ? "Available" : s2?.clinical?.deptConveniencesNotAvailable ? "Not Available" : "";

  // Original grouping function identical to step components compilation
  const compileOriginalGroups = (items: any[]) => {
    if (!items || items.length === 0) return [];
    
    const groups: { category: string | null; items: any[] }[] = [];
    let currentGroup = { category: null as string | null, items: [] as any[] };
    let currentMotherQty = "-";

    items.forEach(item => {
      const isCategoryRow = item.availableQuantity === 'Category' || 
                            item.isAvailable === 'Category' || 
                            item.status === 'Category' ||
                            item.isCategoryHeader || 
                            (item.item && /^[ixv0-9]+\.\s/i.test(item.item)) || 
                            (item.item && /^section\s[a-g]/i.test(item.item));
      
      if (isCategoryRow) {
        if (currentGroup.items.length > 0 || currentGroup.category) {
          groups.push(currentGroup);
        }
        const cleanTitle = item.item.replace(/---/g, '').replace(/category/gi, '').trim();
        currentGroup = { category: cleanTitle, items: [] };
        currentMotherQty = "-";
      } else {
        let baseReqQty = item.requiredQuantity || item.required_quantity || "-";
        if (item.isHeader) currentMotherQty = baseReqQty;
        const finalReqQty = (item.isSubItem && baseReqQty === "-") ? currentMotherQty : baseReqQty;

        currentGroup.items.push({ ...item, requiredQuantity: finalReqQty });
      }
    });
    
    if (currentGroup.items.length > 0 || currentGroup.category) {
      groups.push(currentGroup);
    }
    return groups;
  };

  const spaceGroups = compileOriginalGroups(assessmentData.spaces || []);
  const clinicalGroups = compileOriginalGroups(assessmentData.clinicalTraining || []);
  const equipmentGroups = compileOriginalGroups(assessmentData.equipment || []);

  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-8 text-gray-900 font-sans max-w-5xl mx-auto">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
        }
      `}} />
      
      {/* Title Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-[#066936]">MEDICAL REHABILITATION THERAPISTS BOARD OF NIGERIA</h1>
          <p className="text-sm font-semibold text-gray-600 uppercase mt-1">
            Complete Physical Evaluation & Accreditation Report (Form C & E)
          </p>
        </div>
        <button onClick={() => window.print()} className="no-print bg-[#066936] text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-[#05572d] shadow-sm cursor-pointer">
          Print / Save PDF
        </button>
      </div>

      {/* Facility Details Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">Facility Details</h2>
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-semibold">
          <div><span className="text-gray-500">Facility Name:</span> <span className="font-extrabold text-gray-900 text-sm">{assessmentData.name}</span></div>
          <div><span className="text-gray-500">Category:</span> <span className="font-bold text-gray-800">{profileData?.category || 'Accreditation'}</span></div>
          <div><span className="text-gray-500">Profession:</span> <span className="font-bold text-gray-800">{profileData?.profession || '-'}</span></div>
          <div><span className="text-gray-500">Evaluation Date:</span> <span className="font-bold text-gray-800">{assessmentData.visitation_date || 'Pending'}</span></div>
          <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="font-bold text-gray-800">{profileData?.address || `${profileData?.lga || ''}, ${profileData?.state || ''}`}</span></div>
        </div>
      </div>

      <div className="space-y-10">
        
        {/* I. PREAMBLE & VISIT INFORMATION */}
        {(preambleObj || travelObj) && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">I. Preamble & Visit Information</h2>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              {getTravelMode() && (
                <div><span className="text-gray-500">Mode of Travel:</span> <span className="text-gray-900">{getTravelMode()}</span></div>
              )}
              {getArrivalDateTime() && (
                <div><span className="text-gray-500">Arrival Date & Time:</span> <span className="text-gray-900">{getArrivalDateTime()}</span></div>
              )}
              {getProgram() && (
                <div className="col-span-2"><span className="text-gray-500">Program to Accredit:</span> <span className="text-gray-900">{getProgram()}</span></div>
              )}
              {getPlaceOfReception() && (
                <div><span className="text-gray-500">Place of Reception:</span> <span className="text-gray-900">{getPlaceOfReception()}</span></div>
              )}
              {getTypeOfReception() && (
                <div><span className="text-gray-500">Type of Reception:</span> <span className="text-gray-900">{getTypeOfReception()}</span></div>
              )}
            </div>

            {/* Representatives */}
            {(repsList.length > 0 || (s1?.travelInfo?.representatives || s2?.travelInfo?.representatives)) && (
              <div className="pt-3">
                <h3 className="text-xs font-bold text-gray-700 mb-1.5">Facility Representatives Present during Visitation:</h3>
                {repsList.length > 0 ? (
                  <ol className="list-decimal pl-5 text-xs text-gray-800 space-y-1 font-semibold">
                    {repsList.filter((r: string) => r && r.trim() !== "").map((rep: string, idx: number) => (
                      <li key={idx}>{rep}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-xs text-gray-800 font-semibold leading-relaxed whitespace-pre-line pl-2 bg-gray-50 p-3 rounded-lg border border-gray-150">
                    {s1?.travelInfo?.representatives || s2?.travelInfo?.representatives}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* II. ACADEMIC MATTERS EVALUATION */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">II. Academic Matters Evaluation</h2>
          
          {/* Step 1 Table */}
          {((Array.isArray(s1) && s1.length > 0) || (s1?.curriculumGrid && s1.curriculumGrid.length > 0)) && (
            <div className="overflow-hidden border border-gray-300 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold">
                    <th className="p-2.5 w-[50px] text-center border border-gray-300">S/N</th>
                    <th className="p-2.5 border border-gray-300">Item Description</th>
                    <th className="p-2.5 w-[160px] text-center border border-gray-300">Adequacy Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-semibold">
                  {(Array.isArray(s1) ? s1 : (s1?.curriculumGrid || [])).map((row: any) => (
                    <tr key={row.sn}>
                      <td className="p-2.5 text-center border border-gray-300">{row.sn}</td>
                      <td className="p-2.5 border border-gray-300">{row.item}</td>
                      <td className="p-2.5 text-center border border-gray-300 bg-slate-50">{row.adequacy || "Not Evaluated"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Step 2 Conformance Details */}
          {s2?.academic && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2.5 text-xs font-semibold">
              <h3 className="text-xs font-bold text-gray-700 uppercase mb-1">Academic Conformance Details:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                {getAcademicConforms() && (
                  <div>• Curriculum conforms to Board guidelines: <span className="text-gray-900 font-extrabold">{getAcademicConforms()}</span></div>
                )}
                {getAdmissionConforms() && (
                  <div>• Admission requirements conform: <span className="text-gray-900 font-extrabold">{getAdmissionConforms()}</span></div>
                )}
                {getHandbookComplies() && (
                  <div>• Student Handbook complies: <span className="text-gray-900 font-extrabold">{getHandbookComplies()}</span></div>
                )}
                {getLectureSchedule() && (
                  <div>• Lecture Schedule adequacy: <span className="text-gray-900 font-extrabold">{getLectureSchedule()}</span></div>
                )}
                {getNotesCompliance() && (
                  <div>• Timetable & Lecture Notes compliance: <span className="text-gray-900 font-extrabold">{getNotesCompliance()}</span></div>
                )}
                {getPracticalSchedule() && (
                  <div>• Practical Evaluation schedule: <span className="text-gray-900 font-extrabold">{getPracticalSchedule()}</span></div>
                )}
                {getDressCode() && (
                  <div>• Student Dress Code complies: <span className="text-gray-900 font-extrabold">{getDressCode()}</span></div>
                )}
              </div>
              
              {s2.academic.comments && (
                <div className="border-t border-gray-200 pt-2.5 mt-2">
                  <span className="text-gray-500 font-bold">Academic Observations & Comments:</span>
                  <p className="text-gray-800 font-medium leading-relaxed mt-1 whitespace-pre-line">{s2.academic.comments}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* III. STAFFING STRENGTH */}
        {s2?.staffing && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">III. Academic & Clinical Staff Strength</h2>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2.5 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                {s2.staffing.hodName && (
                  <div className="col-span-2"><span className="text-gray-500">HOD Name & Title:</span> <span className="text-gray-900 font-bold">{s2.staffing.hodName}</span></div>
                )}
                {s2.staffing.totalAcademic && (
                  <div><span className="text-gray-500">Total Academic Staff:</span> <span className="text-gray-900 font-bold">{s2.staffing.totalAcademic}</span></div>
                )}
                {s2.staffing.totalPermanentAcademic && (
                  <div><span className="text-gray-500">Permanent Academic Staff:</span> <span className="text-gray-900 font-bold">{s2.staffing.totalPermanentAcademic}</span></div>
                )}
                {s2.staffing.totalPartTime && (
                  <div><span className="text-gray-500">Part-time Academic Staff:</span> <span className="text-gray-900 font-bold">{s2.staffing.totalPartTime}</span></div>
                )}
                {s2.staffing.totalLicensed && (
                  <div><span className="text-gray-500">Registered/Licensed Therapists:</span> <span className="text-gray-900 font-bold">{s2.staffing.totalLicensed}</span></div>
                )}
                {s2.staffing.totalUnlicensed && (
                  <div><span className="text-gray-500">Unregistered/Unlicensed Staff:</span> <span className="text-gray-900 font-bold">{s2.staffing.totalUnlicensed}</span></div>
                )}
                {s2.staffing.totalNonAcademic && (
                  <div><span className="text-gray-500">Support & Non-Academic Staff:</span> <span className="text-gray-900 font-bold">{s2.staffing.totalNonAcademic}</span></div>
                )}
              </div>

              {s2.staffing.comments && (
                <div className="border-t border-gray-200 pt-2.5 mt-2">
                  <span className="text-gray-500 font-bold">Staffing Observations & Comments:</span>
                  <p className="text-gray-800 font-medium leading-relaxed mt-1 whitespace-pre-line">{s2.staffing.comments}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* IIIb. CLINICAL STAFFING ACCREDITATION DETAILS */}
        {(s1?.clinicalStaff || s2?.clinicalStaff) && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">IIIb. Clinical Staff Strength & Accreditation</h2>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3.5 text-xs font-semibold">
              {(s1?.clinicalStaff?.hodName || s2?.clinicalStaff?.hodName) && (
                <div><span className="text-gray-500">HOD Name & Title:</span> <span className="text-gray-900 font-bold">{s1?.clinicalStaff?.hodName || s2?.clinicalStaff?.hodName}</span></div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 border-t border-gray-200 pt-3">
                {[
                  { label: "Total number of Directors", key: "directors" },
                  { label: "Total number of Deputy Directors", key: "deputyDirectors" },
                  { label: "Total number of Assistant Directors", key: "assistantDirectors" },
                  { label: "Total number of Chief Therapists", key: "chiefPhysiotherapists" },
                  { label: "Total number of Senior Therapists", key: "seniorPhysiotherapists" },
                  { label: "Total number of Therapists", key: "audiologists" },
                  { label: "Total number of Intern Therapists", key: "internPhysiotherapists" },
                  { label: "Total number of Locum Therapists", key: "locumPhysiotherapist" },
                  { label: "Total number of NYSC Therapists", key: "nyscPhysiotherapist" },
                  { label: "Total number of Therapists (Total strength)", key: "totalPhysiotherapist" }
                ].map(item => {
                  const val = (s1?.clinicalStaff?.[item.key] || s2?.clinicalStaff?.[item.key]);
                  if (val === undefined || val === null || val === "") return null;
                  return (
                    <div key={item.key} className="flex justify-between items-center py-1 border-b border-gray-100/50">
                      <span className="text-gray-700 font-semibold">{item.label}</span>
                      <span className="font-extrabold text-gray-900 pr-2">{val}</span>
                    </div>
                  );
                })}
              </div>

              {/* Comments & Recommendations */}
              {(s1?.clinicalStaff?.comments || s2?.clinicalStaff?.comments || s1?.clinicalStaff?.recommendations || s2?.clinicalStaff?.recommendations) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-3 text-xs">
                  {(s1?.clinicalStaff?.comments || s2?.clinicalStaff?.comments) && (
                    <div>
                      <span className="text-gray-500 font-bold block mb-1">Clinical Staff Comments:</span>
                      <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line bg-white p-2.5 rounded-lg border border-gray-150">{s1?.clinicalStaff?.comments || s2?.clinicalStaff?.comments}</p>
                    </div>
                  )}
                  {(s1?.clinicalStaff?.recommendations || s2?.clinicalStaff?.recommendations) && (
                    <div>
                      <span className="text-gray-500 font-bold block mb-1">Clinical Staff Recommendations:</span>
                      <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line bg-white p-2.5 rounded-lg border border-gray-150">{s1?.clinicalStaff?.recommendations || s2?.clinicalStaff?.recommendations}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* IIIc. AREAS OF SPECIALIZATION */}
        {(s1?.specialties || s2?.specialties) && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">IIIc. Areas of Specialization Evaluated</h2>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3.5 text-xs font-semibold">
              {(s1?.specialtiesCount || s2?.specialtiesCount) && (
                <div className="mb-2"><span className="text-gray-500">Total number of Areas of Specialization:</span> <span className="text-gray-900 font-bold">{s1?.specialtiesCount || s2?.specialtiesCount}</span></div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-200 pt-3">
                {Object.entries(s1?.specialties || s2?.specialties || {}).map(([key, val]: any) => {
                  if (!val || val === "No") return null;
                  const commentKey = `${key}Comment`;
                  const commentVal = (s1?.specialtiesMeta?.[commentKey] || s2?.specialtiesMeta?.[commentKey] || "");
                  return (
                    <div key={key} className="bg-white p-3 rounded-lg border border-gray-150 shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-900 font-extrabold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="px-2 py-0.5 rounded bg-green-50 text-green-600 border border-green-100 text-[10px] uppercase font-bold">Yes</span>
                      </div>
                      {commentVal && (
                        <p className="text-[11px] text-gray-500 italic mt-1 font-medium">{commentVal}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* IIId. NON-CLINICAL SUPPORT STAFF */}
        {(s1?.nonClinicalStaff || s2?.nonClinicalStaff) && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">IIId. Non-Clinical Support Staff Strength</h2>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3.5 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-1">
                {[
                  { label: "Total number of Administrative Staff", key: "adminStaff" },
                  { label: "Total number of Secretaries/Typists", key: "secretaries" },
                  { label: "Total number of Library Staff", key: "libraryStaff" },
                  { label: "Total number of Ward Assistants", key: "wardAssistants" },
                  { label: "Total number of Cleaners", key: "cleaners" },
                  { label: "Total number of Others", key: "others" }
                ].map(item => {
                  const val = (s1?.nonClinicalStaff?.[item.key] || s2?.nonClinicalStaff?.[item.key]);
                  if (val === undefined || val === null || val === "") return null;
                  return (
                    <div key={item.key} className="flex justify-between items-center py-1 border-b border-gray-100/50">
                      <span className="text-gray-700 font-semibold">{item.label}</span>
                      <span className="font-extrabold text-gray-900 pr-2">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* IV. PHYSICAL INFRASTRUCTURE & SPACES */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">IV. Physical Infrastructure & Space Evaluation</h2>
          
          {spaceGroups.map((group, groupIdx) => {
            if (!group.items.length) return null;
            return (
              <div key={groupIdx} className="space-y-2.5">
                {group.category && (
                  <h3 className="text-xs font-bold text-[#066936] bg-[#EEF6DF] px-3 py-1.5 rounded uppercase tracking-wider">{group.category}</h3>
                )}
                <div className="overflow-hidden border border-gray-300 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-800 text-white font-bold">
                        <th className="p-2 w-[50px] text-center border border-gray-300">S/N</th>
                        <th className="p-2 border border-gray-300">Space Item Description</th>
                        <th className="p-2 w-[100px] text-center border border-gray-300">Status</th>
                        <th className="p-2 w-[130px] text-center border border-gray-300">General Condition</th>
                        <th className="p-2 border border-gray-300">General Comment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-semibold text-gray-800">
                      {group.items.map((item: any, idx: number) => {
                        const index = (assessmentData.spaces || []).findIndex((x: any) => x.item === item.item);
                        const gridVal = resolveGridVal(s1?.spacesInput || s2?.spacesInput, 'space', item, groupIdx, idx, index) || { condition: "", comment: "" };
                        
                        return (
                          <tr key={idx} className={item.isHeader ? "bg-gray-50/50" : ""}>
                            <td className="p-2 text-center border border-gray-300">{item.sn}</td>
                            <td className={`p-2 border border-gray-300 ${item.isSubItem ? 'pl-6 text-gray-600 font-medium' : 'text-gray-800 font-bold'}`}>{item.item}</td>
                            {item.isHeader ? (
                              <td colSpan={3} className="p-2 text-gray-400 italic text-right border border-gray-300">Sub-items listed below</td>
                            ) : (
                              <>
                                <td className="p-2 text-center border border-gray-300">
                                  {item.isAvailable === 'Yes' || item.isAvailable === 'Available' || item.status === 'Available' || item.status === 'Present' ? "Yes" : "No"}
                                </td>
                                <td className="p-2 text-center border border-gray-300 bg-slate-50">{gridVal.condition || "-"}</td>
                                <td className="p-2 border border-gray-300">{gridVal.comment || "-"}</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Step 2 Details */}
          {s2?.facilities && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2.5 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                {s2.facilities.classroomCount && (
                  <div><span className="text-gray-500">Classroom Count:</span> <span className="text-gray-900 font-bold">{s2.facilities.classroomCount}</span></div>
                )}
                {getSignage() && (
                  <div><span className="text-gray-500">Signage Visibility:</span> <span className="text-gray-900 font-bold">{getSignage()}</span></div>
                )}
                {getCleanliness() && (
                  <div><span className="text-gray-500">Building Cleanliness:</span> <span className="text-gray-900 font-bold">{getCleanliness()}</span></div>
                )}
                {s2.facilities.libSittingCapacity && (
                  <div><span className="text-gray-500">Library Sitting Capacity:</span> <span className="text-gray-900 font-bold">{s2.facilities.libSittingCapacity}</span></div>
                )}
                {s2.facilities.libTextbooks && (
                  <div><span className="text-gray-500">Library Textbooks count:</span> <span className="text-gray-900 font-bold">{s2.facilities.libTextbooks}</span></div>
                )}
                {s2.facilities.libJournals && (
                  <div><span className="text-gray-500">Library Journals count:</span> <span className="text-gray-900 font-bold">{s2.facilities.libJournals}</span></div>
                )}
              </div>

              {s2.facilities.signComments && (
                <div className="border-t border-gray-200 pt-2.5 mt-2">
                  <span className="text-gray-500 font-bold">Physical Facilities Observations & Comments:</span>
                  <p className="text-gray-800 font-medium leading-relaxed mt-1 whitespace-pre-line">{s2.facilities.signComments}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* IVb. CLINICAL LIBRARY & WARDS CHECKLISTS */}
        {(s1?.libraryChecklist || s2?.libraryChecklist || s1?.wardsChecklist || s2?.wardsChecklist) && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">IVb. Library & Wards Environment Checklist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Library Checklist */}
              {(s1?.libraryChecklist || s2?.libraryChecklist) && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs font-semibold">
                  <h3 className="text-xs font-bold text-gray-700 uppercase mb-1">Library Facilities Check:</h3>
                  <div className="space-y-1">
                    <div>• Sitting Capacity: <span className="text-gray-900 font-bold">{s1?.libraryChecklist?.sittingCapacity || s2?.libraryChecklist?.sittingCapacity || "-"}</span></div>
                    <div>• Professional Journals: <span className="text-gray-900 font-bold">{s1?.libraryChecklist?.professionalJournals || s2?.libraryChecklist?.professionalJournals || "-"}</span></div>
                    <div>• Recommended Textbooks: <span className="text-gray-900 font-bold">{s1?.libraryChecklist?.recommendedTextbooks || s2?.libraryChecklist?.recommendedTextbooks || "-"}</span></div>
                  </div>
                  {(s1?.libraryChecklist?.comment || s2?.libraryChecklist?.comment) && (
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <span className="text-gray-500 font-bold block mb-0.5">Library Observations:</span>
                      <p className="text-gray-800 font-medium leading-relaxed mt-0.5">{s1?.libraryChecklist?.comment || s2?.libraryChecklist?.comment}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Wards Checklist */}
              {(s1?.wardsChecklist || s2?.wardsChecklist) && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs font-semibold">
                  <h3 className="text-xs font-bold text-gray-700 uppercase mb-1">Wards Checklist & Access:</h3>
                  <div className="space-y-1">
                    <div>• Accessibility to Wards: <span className="text-gray-900 font-bold">{s1?.wardsChecklist?.accessibility || s2?.wardsChecklist?.accessibility || "-"}</span></div>
                    <div>• Ventilation & Illumination: <span className="text-gray-900 font-bold">{s1?.wardsChecklist?.ventilation || s2?.wardsChecklist?.ventilation || "-"}</span></div>
                    <div>• Space between Bed Areas: <span className="text-gray-900 font-bold">{s1?.wardsChecklist?.spaceBetweenBeds || s2?.wardsChecklist?.spaceBetweenBeds || "-"}</span></div>
                  </div>
                  {(s1?.wardsChecklist?.comment || s2?.wardsChecklist?.comment) && (
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <span className="text-gray-500 font-bold block mb-0.5">Wards Observations:</span>
                      <p className="text-gray-800 font-medium leading-relaxed mt-0.5">{s1?.wardsChecklist?.comment || s2?.wardsChecklist?.comment}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* V. CLINICAL TRAINING FACILITIES */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">V. Clinical Training Facilities Evaluation</h2>
          
          {clinicalGroups.map((group, groupIdx) => {
            if (!group.items.length) return null;
            return (
              <div key={groupIdx} className="space-y-2.5">
                {group.category && (
                  <h3 className="text-xs font-bold text-[#066936] bg-[#EEF6DF] px-3 py-1.5 rounded uppercase tracking-wider">{group.category}</h3>
                )}
                <div className="overflow-hidden border border-gray-300 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-800 text-white font-bold">
                        <th className="p-2 w-[50px] text-center border border-gray-300">S/N</th>
                        <th className="p-2 border border-gray-300">Requirement Description</th>
                        <th className="p-2 w-[80px] text-center border border-gray-300">Req. Qty</th>
                        <th className="p-2 w-[100px] text-center border border-gray-300">Status</th>
                        <th className="p-2 w-[110px] text-center border border-gray-300">Observed Qty</th>
                        <th className="p-2 border border-gray-300">Comment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-semibold text-gray-800">
                      {group.items.map((item: any, idx: number) => {
                        const index = (assessmentData.clinicalTraining || []).findIndex((x: any) => (x.item || x.description) === (item.item || item.description));
                        const gridVal = resolveGridVal(s1?.clinicalInput || s2?.clinicalInput, 'clinical', item, groupIdx, idx, index) || { observed: "", comment: "" };
                        
                        return (
                          <tr key={idx} className={item.isHeader ? "bg-gray-50/50" : ""}>
                            <td className="p-2 text-center border border-gray-300">{item.sn}</td>
                            <td className={`p-2 border border-gray-300 ${item.isSubItem ? 'pl-6 text-gray-600 font-medium' : 'text-gray-800 font-bold'}`}>{item.item || item.description}</td>
                            {item.isHeader ? (
                              <td colSpan={4} className="p-2 text-gray-400 italic text-right border border-gray-300">Sub-items listed below</td>
                            ) : (
                              <>
                                <td className="p-2 text-center border border-gray-300">{item.requiredQuantity || "-"}</td>
                                <td className="p-2 text-center border border-gray-300">
                                  {item.status === 'Yes' || item.status === 'Available' || item.isAvailable === 'Available' ? "Yes" : "No"}
                                </td>
                                <td className="p-2 text-center border border-gray-300 bg-slate-50">{gridVal.observed || "-"}</td>
                                <td className="p-2 border border-gray-300">{gridVal.comment || "-"}</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Step 2 Details */}
          {s2?.clinical && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2.5 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                {getClinicalStructure() && (
                  <div><span className="text-gray-500">Department Structure:</span> <span className="text-gray-900 font-bold">{getClinicalStructure()}</span></div>
                )}
                {s2.clinical.hospitalBedSpace && (
                  <div><span className="text-gray-500">Hospital Bed Space:</span> <span className="text-gray-900 font-bold">{s2.clinical.hospitalBedSpace}</span></div>
                )}
                {getTherapistsStrength() && (
                  <div><span className="text-gray-500">Therapists Strength:</span> <span className="text-gray-900 font-bold">{getTherapistsStrength()}</span></div>
                )}
                {getWaitingArea() && (
                  <div><span className="text-gray-500">Patient Waiting Area:</span> <span className="text-gray-900 font-bold">{getWaitingArea()}</span></div>
                )}
                {getConveniences() && (
                  <div><span className="text-gray-500">Convenient Toilets:</span> <span className="text-gray-900 font-bold">{getConveniences()}</span></div>
                )}
              </div>

              {s2.clinical.deptComments && (
                <div className="border-t border-gray-200 pt-2.5 mt-2">
                  <span className="text-gray-500 font-bold">Clinical Observations & Comments:</span>
                  <p className="text-gray-800 font-medium leading-relaxed mt-1 whitespace-pre-line">{s2.clinical.deptComments}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* VI. EQUIPMENT & INSTRUMENTS INVENTORIES */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">VI. Equipment & Instruments Checklist</h2>
          
          {equipmentGroups.map((group, groupIdx) => {
            if (!group.items.length) return null;
            return (
              <div key={groupIdx} className="space-y-2.5">
                {group.category && (
                  <h3 className="text-xs font-bold text-[#066936] bg-[#EEF6DF] px-3 py-1.5 rounded uppercase tracking-wider">{group.category}</h3>
                )}
                <div className="overflow-hidden border border-gray-300 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-800 text-white font-bold">
                        <th className="p-2 w-[50px] text-center border border-gray-300">S/N</th>
                        <th className="p-2 border border-gray-300">Equipment Item Description</th>
                        <th className="p-2 w-[90px] text-center border border-gray-300">Req. Qty</th>
                        <th className="p-2 w-[90px] text-center border border-gray-300">Avail. Qty</th>
                        <th className="p-2 w-[110px] text-center border border-gray-300">Observed Qty</th>
                        <th className="p-2 w-[130px] text-center border border-gray-300">Functionality Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-semibold text-gray-800">
                      {group.items.map((item: any, idx: number) => {
                        const index = (assessmentData.equipment || []).findIndex((x: any) => x.item === item.item);
                        const gridVal = resolveGridVal(s1?.equipmentInput || s2?.equipmentInput, 'equip', item, groupIdx, idx, index) || { observed: "", functionality: "" };
                        
                        return (
                          <tr key={idx} className={item.isHeader ? "bg-gray-50/50" : ""}>
                            <td className="p-2 text-center border border-gray-300">{item.sn}</td>
                            <td className={`p-2 border border-gray-300 ${item.isSubItem ? 'pl-6 text-gray-600 font-medium' : 'text-gray-800 font-bold'}`}>{item.item}</td>
                            {item.isHeader ? (
                              <td colSpan={4} className="p-2 text-gray-400 italic text-right border border-gray-300">Sub-items listed below</td>
                            ) : (
                              <>
                                <td className="p-2 text-center border border-gray-300">{item.requiredQuantity || "-"}</td>
                                <td className="p-2 text-center border border-gray-300">{item.availableQuantity || "-"}</td>
                                <td className="p-2 text-center border border-gray-300 bg-slate-50">{gridVal.observed || "-"}</td>
                                <td className="p-2 text-center border border-gray-300 bg-slate-50">{gridVal.functionality || "-"}</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* VII. ACCREDITATION PANEL DECISION & REASONINGS (Form E) */}
        {(s3 || s1?.manpowerAndSummary || s2?.manpowerAndSummary) && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-[#066936] border-b-2 border-[#5D9C0E] pb-1.5">VII. Accreditation Decision & Findings (Form E)</h2>
            <div className="bg-[#FAFCF8] border border-[#CDE1B4] p-5 rounded-2xl space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-0.5">Accreditation Decision</span>
                  <span className="text-base font-extrabold text-[#066936]">
                    {s3?.decision || s1?.manpowerAndSummary?.finalRecommendation || s2?.manpowerAndSummary?.finalRecommendation || "Full Accreditation"}
                  </span>
                </div>
                {(s3?.duration || s1?.manpowerAndSummary?.finalDuration || s2?.manpowerAndSummary?.finalDuration) && (
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider block text-[10px] mb-0.5">Duration Granted</span>
                    <span className="text-base font-extrabold text-gray-900">
                      {s3?.duration || s1?.manpowerAndSummary?.finalDuration || s2?.manpowerAndSummary?.finalDuration} Years
                    </span>
                  </div>
                )}
              </div>

              {panelMembersList.length > 0 && (
                <div className="border-t border-gray-200/80 pt-3">
                  <span className="text-gray-500 block text-[10px] uppercase mb-1">Accreditation Panel Members:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {panelMembersList.map((member, idx) => (
                      <span key={idx} className="bg-[#EEF6DF] text-[#066936] px-2.5 py-1 rounded-md text-[10px] font-bold border border-[#CDE1B4]/40">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 Findings */}
              {s3?.panelFindings && (
                <div className="border-t border-gray-200/80 pt-3 space-y-3.5">
                  <span className="text-gray-500 block text-[10px] uppercase">Panel Recommendations Summary:</span>
                  {Object.entries(s3.panelFindings).map(([key, section]: [string, any], idx) => {
                    if (!section.comment && !section.recommendation) return null;
                    return (
                      <div key={idx} className="space-y-1 pl-1">
                        <h4 className="font-bold text-gray-800 text-[11px] mb-0.5">{section.title || key}</h4>
                        {section.comment && (
                          <p className="text-gray-600 font-medium leading-relaxed pl-2.5 border-l-2 border-gray-300">
                            <span className="text-[10px] font-bold text-gray-400 block uppercase">Observations</span>
                            {section.comment}
                          </p>
                        )}
                        {section.recommendation && (
                          <p className="text-gray-600 font-medium leading-relaxed pl-2.5 border-l-2 border-red-300 mt-1">
                            <span className="text-[10px] font-bold text-red-400 block uppercase">Remedial Action Recommendations</span>
                            {section.recommendation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Clinical Manpower & Summary Fallback */}
              {(s1?.manpowerAndSummary || s2?.manpowerAndSummary) && (
                <div className="border-t border-gray-200/80 pt-3 space-y-3">
                  <span className="text-gray-500 block text-[10px] uppercase">Clinical Inspection Comments & Recommendations:</span>
                  {(s1?.manpowerAndSummary?.overallSummary || s2?.manpowerAndSummary?.overallSummary) && (
                    <div className="pl-1">
                      <h4 className="font-bold text-gray-800 text-[11px] mb-0.5">Overall Inspection Summary</h4>
                      <p className="text-gray-600 font-medium leading-relaxed pl-2.5 border-l-2 border-gray-300">
                        {s1?.manpowerAndSummary?.overallSummary || s2?.manpowerAndSummary?.overallSummary}
                      </p>
                    </div>
                  )}
                  {(s1?.manpowerAndSummary?.manpowerComments || s2?.manpowerAndSummary?.manpowerComments || s1?.manpowerAndSummary?.manpowerRecs || s2?.manpowerAndSummary?.manpowerRecs) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      {(s1?.manpowerAndSummary?.manpowerComments || s2?.manpowerAndSummary?.manpowerComments) && (
                        <div>
                          <span className="text-gray-500 font-bold block mb-1">Manpower Observations:</span>
                          <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line bg-white p-2.5 rounded-lg border border-gray-150">
                            {s1?.manpowerAndSummary?.manpowerComments || s2?.manpowerAndSummary?.manpowerComments}
                          </p>
                        </div>
                      )}
                      {(s1?.manpowerAndSummary?.manpowerRecs || s2?.manpowerAndSummary?.manpowerRecs) && (
                        <div>
                          <span className="text-gray-500 font-bold block mb-1">Manpower Recommendations:</span>
                          <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line bg-white p-2.5 rounded-lg border border-gray-150">
                            {s1?.manpowerAndSummary?.manpowerRecs || s2?.manpowerAndSummary?.manpowerRecs}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PrintReportPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><p className="text-xs font-bold text-gray-500 animate-pulse">Initializing printer engine...</p></div>}>
      <PrintReportContent />
    </Suspense>
  );
}
