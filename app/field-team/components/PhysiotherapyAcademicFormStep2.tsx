"use client";

import React, { useState, useEffect } from 'react';
import { Truck, Users, Building2, BookOpen, ClipboardCheck, Plus, Trash2, Save, Layers, ArrowLeft, ArrowRight } from 'lucide-react';

interface Step2Props {
  visitationDate: string;
  fieldTeamMembers: string;
  institutionName: string;
  onComplete: (formData: any) => void;
  inspectionReport?: any;
  isReviewMode?: boolean;
  isReadOnly?: boolean;
  onBack: () => void;
}

export function PhysiotherapyAcademicFormStep2({ visitationDate, fieldTeamMembers, institutionName, onComplete, inspectionReport, isReviewMode, isReadOnly, onBack}: Step2Props) {
  const getSerialized = (data: any) => {
    if (!data) return "";
    const keys = ['representatives', 'preamble', 'academic', 'staffing', 'facilities', 'clinical', 'travelInfo', 'clinicalStaff', 'nonClinicalStaff', 'spaceEval', 'qualitySystems', 'performanceMeasures', 'equipEval', 'overallSummary'];
    const obj: any = {};
    keys.forEach(k => {
      if (data[k] !== undefined) obj[k] = data[k];
    });
    return JSON.stringify(obj);
  };

  const [initialDataString, setInitialDataString] = React.useState("");

  const handleFieldUpdate = (setter: any, field: string, value: any) => {
    setter((prev: any) => ({ ...prev, [field]: value }));
  };

  const [representatives, setRepresentatives] = useState<string[]>(["", "", ""]);

  const [preamble, setPreamble] = useState({
    modeOfTravel: "", arrivalDate: "", arrivalTime: "", placeOfReception: "",
    typeWarm: false, typeCordial: false, typeHostile: false, typeOthersChecked: false, typeOthersText: "",
    programToAccredit: ""
  });

  const [academic, setAcademic] = useState({
    aYes: false, aNo: false, aOthersChecked: false, aOthersText: "",
    bYes: false, bNo: false, bOthersChecked: false, bOthersText: "",
    c1Yes: false, c1No: false, c1OthersChecked: false, c1OthersText: "",
    c2Yes: false, c2No: false, c2OthersChecked: false, c2OthersText: "",
    c3Yes: false, c3No: false, c3OthersChecked: false, c3OthersText: "",
    c4Yes: false, c4No: false, c4OthersChecked: false, c4OthersText: "",
    c5Yes: false, c5No: false, c5OthersChecked: false, c5OthersText: "",
    c6Yes: false, c6No: false, c6OthersChecked: false, c6OthersText: "",
    dYes: false, dNo: false, dOthersChecked: false, dOthersText: "",
    e1Yes: false, e1No: false, e1OthersChecked: false, e1OthersText: "",
    e2Yes: false, e2No: false, e2OthersChecked: false, e2OthersText: "",
    fNotesAdequate: false, fNotesNotAdequate: false,
    fTimetableAvailable: false, fTimetableNotAvailable: false,
    fScheduleAdequate: false, fScheduleNotAdequate: false,
    fPracticalAdequate: false, fPracticalNotAdequate: false,
    fReportAvailable: false, fReportNotAvailable: false,
    fDressingModest: false, fDressingNotModest: false,
    comments: "", recommendations: ""
  });

  const [staffing, setStaffing] = useState({
    totalAcademic: "", totalPermanentAcademic: "", totalPartTime: "", totalELecturers: "",
    totalLicensed: "", totalUnlicensed: "", totalNonAcademic: "", hodName: "",
    profFT: "", profAdj: "", assocFT: "", assocAdj: "", seniorFT: "", seniorAdj: "",
    lect1FT: "", lecturers1Adj: "", lect2FT: "", lecturers2Adj: "", asstFT: "", asstAdj: "",
    totalAssociateLecturers: "", totalClinicalInstructors: "", totalSpecialties: "", totalAvailableSpecialists: "",
    supportAdmin: "", supportClerical: "", supportCleaners: "", supportSecurity: "", queriedCredentials: "",
    comments: "", recommendations: "", sponsoredMSc: "", sponsoredPhD: "", sponsoredTdpt: "", otherDegreesCount: "", otherDegreesSpecify: "", attendedCPD: ""
  });

  const [facilities, setFacilities] = useState({
    signAbsent: false, signPresent: false, signInconspicuous: false, signConspicuous: false, signOthersChecked: false, signOthersText: "", signComments: "", signRecs: "",
    entLarge: false, entSmall: false, entDisability: false, entOthersChecked: false, entOthersText: "", entComments: "", entRecs: "",
    outlookClean: false, outlookUnclean: false, outlookOrderly: false, outlookCluttered: false, outlookOthersChecked: false, outlookOthersText: "", outlookComments: "", outlookRecs: "",
    classroomCount: "", classSmall: false, classLarge: false, classSpacious: false, classOthersChecked: false, classOthersText: "", classComments: "", classRecs: "",
    anatomySmall: false, anatomyLarge: false, anatomySpacious: false, anatomyOthersChecked: false, anatomyOthersText: "", anatomyCadaversAdequate: false, anatomyCadaversInadequate: false, anatomyCadaversOthersChecked: false, anatomyCadaversOthersText: "", anatomyFacilityAdequate: false, anatomyFacilityInadequate: false, anatomyFacilityOthersChecked: false, anatomyFacilityOthersText: "", anatomyEquipmentAdequate: false, anatomyEquipmentInadequate: false, anatomyEquipmentOthersChecked: false, anatomyEquipmentOthersText: "", anatomyComments: "", anatomyRecs: "",
    histologySmall: false, histologyLarge: false, histologySpacious: false, histologyOthersChecked: false, histologyOthersText: "", histologyFacilityAdequate: false, histologyFacilityInadequate: false, histologyFacilityOthersChecked: false, histologyFacilityOthersText: "", histologyEquipmentAdequate: false, histologyEquipmentInadequate: false, histologyEquipmentOthersChecked: false, histologyEquipmentOthersText: "", histologyComments: "", histologyRecs: "",
    biochemistrySmall: false, biochemistryLarge: false, biochemistrySpacious: false, biochemistryOthersChecked: false, biochemistryOthersText: "", biochemistryFacilityAdequate: false, biochemistryFacilityInadequate: false, biochemistryFacilityOthersChecked: false, biochemistryFacilityOthersText: "", biochemistryReagentsAdequate: false, biochemistryReagentsInadequate: false, biochemistryReagentsOthersChecked: false, biochemistryReagentsOthersText: "", biochemistryComments: "", biochemistryRecs: "",
    physiologySmall: false, physiologyLarge: false, physiologySpacious: false, physiologyOthersChecked: false, physiologyOthersText: "", physiologyFacilityAdequate: false, physiologyFacilityInadequate: false, physiologyFacilityOthersChecked: false, physiologyFacilityOthersText: "", physiologyEquipmentAdequate: false, physiologyEquipmentInadequate: false, physiologyEquipmentOthersChecked: false, physiologyEquipmentOthersText: "", physiologyComments: "", physiologyRecs: "",
    demoSmall: false, demoLarge: false, demoCrowded: false, demoSpacious: false, demoAccessLarge: false, demoAccessSmall: false, demoAccessDisability: false, demoEquipAdequate: false, demoEquipInadequate: false, demoScreensAdequate: false, demoScreensInadequate: false, demoVentGood: false, demoVentFair: false, demoVentPoor: false, demoIllumGood: false, demoIllumFair: false, demoIllumPoor: false, demoComments: "", demoRecs: "",
    specScreensAvailable: false, specializedScreensNotAvailable: false, specSmall: false, specLarge: false, specSpacious: false, specOthersChecked: false, specOthersText: "", specVentGood: false, specVentFair: false, specVentPoor: false, specIllumGood: false, specIllumFair: false, specIllumPoor: false, specComments: "", specRecs: "",
    
    // Gym
    gymAdultAvailable: "", gymPaediatricAvailable: "", gymSize: "", gymFloorStructure: "", gymAccessibility: "", gymEquipment: "", gymScreens: "", gymVentilation: "", gymIllumination: "", gymComments: "", gymRecs: "",
    // Pool
    poolAvailable: "", poolSize: "", poolFloorStructure: "", poolLifeJackets: "", poolEquipment: "", poolMaintenance: "", poolComments: "", poolRecs: "",

    hodSmall: false, hodLarge: false, hodOvercrowded: false, hodSpacious: false, hodOthersChecked: false, hodOthersText: "", hodFurnishingsAdequate: false, hodFurnishingsInadequate: false, hodVentGood: false, hodVentFair: false, hodVentPoor: false, hodIllumGood: false, hodIllumFair: false, hodIllumPoor: false, hodSecretariatAttached: false, hodSecretariatNotAttached: false, hodConvenienceAttached: false, hodConvenienceNotAttached: false, hodComments: "", hodRecs: "",
    officesProfessors: "", officesAssociate: "", officesSenior: "", officesLecturersI: "", officesLecturersII: "", officesAssistant: "", officesClinical: "", officesSupport: "", officesTotal: "", officesAcademic: "", officesNonAcademic: "", officesFurnishingAdequate: false, officesFurnishingInadequate: false, officesLarge: false, officesSmall: false, officesSpacious: false, officesOvercrowded: false, officesVentGood: false, officesVentFair: false, officesVentPoor: false, officesIllumGood: false, officesIllumFair: false, officesIllumPoor: false, officesComments: "", officesRecs: "",
    
    toiletsStaffAdequate: false, toiletsStaffInadequate: false, toiletsStaffClean: false, toiletsStaffUnclean: false, toiletsStaffGenderSensitiveYes: false, toiletsStaffGenderSensitiveNo: false,
    toiletsStudentAdequate: false, toiletsStudentInadequate: false, toiletsStudentClean: false, toiletsStudentUnclean: false, toiletsStudentGenderSensitiveYes: false, toiletsStudentGenderSensitiveNo: false,
    toiletsComments: "", toiletsRecs: "",
    seminarAvailable: false, seminarNotAvailable: false, seminarSmall: false, seminarLarge: false, seminarOvercrowded: false, seminarSpacious: false, seminarFurnishingsAdequate: false, seminarFurnishingsInadequate: false, seminarAidsAvailable: false, seminarAidsNotAvailable: false, seminarAidsAdequate: false, seminarAidsInadequate: false, seminarVentGood: false, seminarVentFair: false, seminarVentPoor: false, seminarIllumGood: false, seminarIllumFair: false, seminarIllumPoor: false, seminarComments: "", seminarRecs: "",
    libAvailable: false, libNotAvailable: false, libOthersChecked: false, libOthersText: "", libSittingCapacity: "", libSafetyExit: false, libSafetyAlarm: false, libSafetyExtinguisher: false, libSafetyBucket: false, libSafetyMuster: false, libSafetyBlanket: false, libTextbooks: "", libJournals: "", libPeriodicals: "", libMonographs: "", libComments: "", libRecs: "",
    libDatabaseSubs: "", libEBooks: "", libOfflineBooks: "", libEJournals: "", libComputers: "", libBandwidth: ""
  });

  const [clinical, setClinical] = useState({
    hospitalBedSpace: "", hospitalSpecialtiesCount: "", hospitalWardsCount: "", hospitalComments: "", hospitalRecommendations: "",
    deptStructurePurposedBuilt: false, deptStructureGeneralPurpose: false, deptStructureSharedSpace: false, deptStructureOthersChecked: false, deptStructureOthersText: "",
    deptEntranceLarge: false, deptEntranceSmall: false, deptEntranceDisability: false, deptExitAvailable: false, deptExitNotAvailable: false,
    deptTherapistsAdequate: false, deptTherapistsInadequate: false, deptSpecialtiesList: "",
    deptCubiclesAdequate: false, deptCubiclesInadequate: false, deptWaitingAvailable: false, deptWaitingNotAvailable: false,
    deptOfficesAvailable: false, deptOfficesNotAvailable: false, 
    deptConveniencesAvailable: false, deptConveniencesNotAvailable: false,
    deptChangingAvailable: false, deptChangingNotAvailable: false, 
    deptCommonRoomAvailable: false, deptCommonRoomNotAvailable: false,
    deptSeminarRoomAvailable: false, deptSeminarRoomNotAvailable: false, 
    deptCallRoomAvailable: false, deptCallRoomNotAvailable: false,
    deptGenderSensitivityYes: false, deptGenderSensitivityNo: false,
    deptFurnishingAdequate: false, deptFurnishingInadequate: false,
    deptConvenienceAttachmentYes: false, deptConvenienceAttachmentNo: false,
    deptComments: "", deptRecommendations: ""
  });

  const updateRepValue = (index: number, val: string) => {
    const updated = [...representatives];
    updated[index] = val;
    setRepresentatives(updated);
  };

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ representatives, preamble, academic, staffing, facilities, clinical , _action: (window as any)._actionType || 'save' });
  };
  
  React.useEffect(() => {
    if (inspectionReport?.step2) {
      const s = inspectionReport.step2;
      if (s.representatives !== undefined) setRepresentatives(s.representatives);
      if (s.preamble !== undefined) setPreamble(s.preamble);
      if (s.academic !== undefined) setAcademic(s.academic);
      if (s.staffing !== undefined) setStaffing(s.staffing);
      if (s.facilities !== undefined) setFacilities(s.facilities);
      if (s.clinical !== undefined) setClinical(s.clinical);
      setInitialDataString(getSerialized(s));
    }
  }, [inspectionReport]);
  
  React.useEffect(() => {
    if (!inspectionReport?.step2) {
      setInitialDataString(getSerialized({ representatives, preamble, academic, staffing, facilities, clinical }));
    }
  }, []);

  
  const currentDataString = getSerialized({ representatives, preamble, academic, staffing, facilities, clinical });
  const isDirty = initialDataString !== "" && currentDataString !== initialDataString;

  return (
    <form onSubmit={handleFormSubmission} className="space-y-6 w-full max-w-5xl mx-auto text-xs text-gray-800 antialiased font-normal pb-20">
      <fieldset disabled={isReadOnly} className="space-y-6 w-full block border-0 p-0 m-0 min-w-0 pb-16">

      {/* 1. ACADEMIC MATTERS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-150 shadow-xs space-y-3.5">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <BookOpen size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">1. Academic Matters & Curriculum</h3>
            <p className="text-xs text-gray-500 font-normal">Evaluate curriculum structure, progression rules, and academic policies.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {[
            { q: "Is the programme philosophy and objectives well stated?", kYes: "aYes", kNo: "aNo", kOthersCh: "aOthersChecked", kOthersTxt: "aOthersText", title: "a. Programme Philosophy and Objectives" },
            { q: "Are the admission requirements adequately captured in the Curriculum?", kYes: "bYes", kNo: "bNo", kOthersCh: "bOthersChecked", kOthersTxt: "bOthersText", title: "b. Admission Requirements" },
            { q: "Is the curriculum and structure of the programme available?", kYes: "c1Yes", kNo: "c1No", kOthersCh: "c1OthersChecked", kOthersTxt: "c1OthersText", title: "c. The Curriculum" },
            { q: "Is the classification of degree and graduation criteria well stated in the curriculum?", kYes: "c2Yes", kNo: "c2No", kOthersCh: "c2OthersChecked", kOthersTxt: "c2OthersText" },
            { q: "Are Clinical Postings in the Areas of Specialization well defined?", kYes: "c3Yes", kNo: "c3No", kOthersCh: "c3OthersChecked", kOthersTxt: "c3OthersText" },
            { q: "Is the progression from one level to another clearly defined in the curriculum", kYes: "c4Yes", kNo: "c4No", kOthersCh: "c4OthersChecked", kOthersTxt: "c4OthersText" },
            { q: "Is the minimum and maximum duration of study clearly stated in the curriculum", kYes: "c5Yes", kNo: "c5No", kOthersCh: "c5OthersChecked", kOthersTxt: "c5OthersText" },
            { q: "Are evidences of all examinations available?", kYes: "c6Yes", kNo: "c6No", kOthersCh: "c6OthersChecked", kOthersTxt: "c6OthersText" },
            { q: "Are the Academic Regulations well defined?", kYes: "dYes", kNo: "dNo", kOthersCh: "dOthersChecked", kOthersTxt: "dOthersText", title: "d. Academic Regulations" },
            { q: "Is external examination system used?", kYes: "e1Yes", kNo: "e1No", kOthersCh: "e1OthersChecked", kOthersTxt: "e1OthersText", title: "e. External Examination System" },
            { q: "Are competent external examiners used for exam moderation?", kYes: "e2Yes", kNo: "e2No", kOthersCh: "e2OthersChecked", kOthersTxt: "e2OthersText" }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.title && (
                <div className="pt-2 pb-0.5">
                  <span className="text-[11px] font-semibold text-[#066936] bg-[#F8FCF5] border border-[#CDE1B4]/40 px-2 py-0.5 rounded-md inline-block">
                    {item.title}
                  </span>
                </div>
              )}
              <div className="p-2.5 rounded-xl bg-gray-50/60 hover:bg-gray-50 border border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-2 transition-colors">
                <span className="text-xs text-gray-800 font-medium leading-relaxed">{item.q}</span>
                <div className="flex items-center gap-3 shrink-0 text-xs font-normal">
                  <label className="flex items-center gap-1 cursor-pointer hover:text-gray-900"><input type="checkbox" checked={(academic as any)[item.kYes]} onChange={(e) => setAcademic(p => ({ ...p, [item.kYes]: e.target.checked, [item.kNo]: false, [item.kOthersCh]: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Yes</label>
                  <label className="flex items-center gap-1 cursor-pointer hover:text-gray-900"><input type="checkbox" checked={(academic as any)[item.kNo]} onChange={(e) => setAcademic(p => ({ ...p, [item.kNo]: e.target.checked, [item.kYes]: false, [item.kOthersCh]: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> No</label>
                  <label className="flex items-center gap-1 cursor-pointer hover:text-gray-900"><input type="checkbox" checked={(academic as any)[item.kOthersCh]} onChange={(e) => setAcademic(p => ({ ...p, [item.kOthersCh]: e.target.checked, [item.kYes]: false, [item.kNo]: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Others pls specify</label>
                </div>
              </div>
              {(academic as any)[item.kOthersCh] && (
                <div className="pl-2 pt-0.5">
                  <input type="text" value={(academic as any)[item.kOthersTxt]} onChange={(e) => handleFieldUpdate(setAcademic, item.kOthersTxt, e.target.value)} className="w-full py-1 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs outline-none transition-colors" placeholder="Specify details..." />
                </div>
              )}
            </div>
          ))}

          <div className="pt-3 space-y-2">
            <span className="text-[11px] font-semibold text-[#066936] bg-[#F8FCF5] border border-[#CDE1B4]/40 px-2 py-0.5 rounded-md inline-block">
              f. Students’ Matters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { label: "Students Lecture Notes", y: "fNotesAdequate", n: "fNotesNotAdequate", lblY: "Adequate", lblN: "Not Adequate" },
                { label: "Lecture Time-Table", y: "fTimetableAvailable", n: "fTimetableNotAvailable", lblY: "Available", lblN: "Not Available" },
                { label: "Lecture Schedule", y: "fScheduleAdequate", n: "fScheduleNotAdequate", lblY: "Adequate", lblN: "Not Adequate" },
                { label: "Practical Exposure", y: "fPracticalAdequate", n: "fPracticalNotAdequate", lblY: "Adequate", lblN: "Not Adequate" },
                { label: "External Examiner’s Report", y: "fReportAvailable", n: "fReportNotAvailable", lblY: "Available", lblN: "Not Available" },
                { label: "Students Mode of dressing", y: "fDressingModest", n: "fDressingNotModest", lblY: "Modest", lblN: "Not Modest" }
              ].map((m, mIdx) => (
                <div key={mIdx} className="p-2 rounded-lg bg-gray-50/60 border border-gray-150 flex items-center justify-between gap-2 text-xs">
                  <span className="text-gray-700 font-medium text-[11px] truncate">{m.label}</span>
                  <div className="flex gap-2 shrink-0">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={(academic as any)[m.y]} onChange={(e) => setAcademic(p => ({ ...p, [m.y]: e.target.checked, [m.n]: false }))} className="rounded accent-[#5D9C0E] w-3 h-3" /> <span className="text-[10.5px]">{m.lblY}</span></label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={(academic as any)[m.n]} onChange={(e) => setAcademic(p => ({ ...p, [m.n]: e.target.checked, [m.y]: false }))} className="rounded accent-[#5D9C0E] w-3 h-3" /> <span className="text-[10.5px]">{m.lblN}</span></label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <div><label className="font-medium text-gray-500 block mb-1 text-[11px]">Academic Comments</label><textarea value={academic.comments} onChange={(e) => handleFieldUpdate(setAcademic, 'comments', e.target.value)} className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg h-16 resize-none outline-none text-xs bg-white" placeholder="Observations on curriculum..." /></div>
          <div><label className="font-medium text-gray-500 block mb-1 text-[11px]">Recommendations</label><textarea value={academic.recommendations} onChange={(e) => handleFieldUpdate(setAcademic, 'recommendations', e.target.value)} className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg h-16 resize-none outline-none text-xs bg-white" placeholder="Remedies or adjustments..." /></div>
        </div>
      </div>

      {/* 3. STAFFING */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-150 shadow-xs space-y-3.5">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <Users size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">2. Staffing & Faculty Audit</h3>
            <p className="text-xs text-gray-500 font-normal">Audit academic staff strength, cadre distributions, and support personnel.</p>
          </div>
        </div>
        
        <div className="space-y-2.5">
          <span className="text-[11px] font-semibold text-[#066936] bg-[#F8FCF5] border border-[#CDE1B4]/40 px-2 py-0.5 rounded-md inline-block">
            A. Staff Strength Summary
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {[
              { label: "Total Academic Staff", f: "totalAcademic" },
              { label: "Permanent Academic Staff", f: "totalPermanentAcademic" },
              { label: "Part-time Lecturers", f: "totalPartTime" },
              { label: "E-Lecturers", f: "totalELecturers" },
              { label: "Lecturers with Practicing License", f: "totalLicensed" },
              { label: "Lecturers without License", f: "totalUnlicensed" },
              { label: "Non-academic Staff", f: "totalNonAcademic" }
            ].map(item => (
              <div key={item.f} className="p-2 rounded-lg bg-gray-50/60 border border-gray-150 flex items-center justify-between gap-2">
                <label className="text-gray-700 text-[11px] font-medium leading-tight">{item.label}</label>
                <input type="number" min="0" value={(staffing as any)[item.f]} onChange={(e) => handleFieldUpdate(setStaffing, item.f, e.target.value)} className="w-16 py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-md font-semibold text-center bg-white outline-none text-xs" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-[#066936] bg-[#F8FCF5] border border-[#CDE1B4]/40 px-2 py-0.5 rounded-md inline-block">
              B. Staff Credential Verification • Academic Staff
            </span>
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-600 text-[11px] whitespace-nowrap">HOD Name:</label>
              <input type="text" value={staffing.hodName} onChange={(e) => handleFieldUpdate(setStaffing, 'hodName', e.target.value)} className="py-1 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg text-xs outline-none bg-white font-medium min-w-[180px]" placeholder="Enter HOD name..." />
            </div>
          </div>
          
          <div className="overflow-x-auto w-full border border-gray-150 rounded-xl">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 font-semibold text-gray-700 text-[11px]">
                  <th className="py-2 px-3 text-center w-[50px] border-r border-gray-100">S/N</th>
                  <th className="py-2 px-3 border-r border-gray-100">Designation / Cadre</th>
                  <th className="py-2 px-3 text-center w-[120px] border-r border-gray-100 bg-[#F4F9EE] text-[#066936]">Full-time</th>
                  <th className="py-2 px-3 text-center w-[120px] bg-[#F4F9EE] text-[#066936]">Adjunct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-normal">
                {[
                  { sn: "1.", cadre: "Professors", ft: "profFT", adj: "profAdj" },
                  { sn: "2.", cadre: "Associate Professors / Readers", ft: "assocFT", adj: "assocAdj" },
                  { sn: "3.", cadre: "Senior Lecturers", ft: "seniorFT", adj: "seniorAdj" },
                  { sn: "4.", cadre: "Lecturers I", ft: "lect1FT", adj: "lecturers1Adj" },
                  { sn: "5.", cadre: "Lecturers II", ft: "lect2FT", adj: "lecturers2Adj" },
                  { sn: "6.", cadre: "Assistant Lecturers", ft: "asstFT", adj: "asstAdj" }
                ].map(row => (
                  <tr key={row.sn} className="hover:bg-gray-50/50">
                    <td className="py-1.5 px-3 text-center font-medium text-gray-400 border-r border-gray-100 text-[11px]">{row.sn}</td>
                    <td className="py-1.5 px-3 text-gray-800 font-medium border-r border-gray-100 text-xs">{row.cadre}</td>
                    <td className="p-1 bg-[#FAFCF8] border-r border-gray-100"><input type="number" min="0" value={(staffing as any)[row.ft]} onChange={(e) => handleFieldUpdate(setStaffing, row.ft, e.target.value)} className="w-16 mx-auto block py-0.5 px-1.5 text-center font-semibold outline-none border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-md text-xs bg-white" /></td>
                    <td className="p-1 bg-[#FAFCF8]"><input type="number" min="0" value={(staffing as any)[row.adj]} onChange={(e) => handleFieldUpdate(setStaffing, row.adj, e.target.value)} className="w-16 mx-auto block py-0.5 px-1.5 text-center font-semibold outline-none border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-md text-xs bg-white" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150"><label className="text-gray-600 block mb-1 font-medium text-[10.5px]">Associate Lecturers</label><input type="number" min="0" value={staffing.totalAssociateLecturers} onChange={(e) => handleFieldUpdate(setStaffing, 'totalAssociateLecturers', e.target.value)} className="w-full py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 text-center rounded-md font-semibold outline-none text-xs bg-white" /></div>
          <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150"><label className="text-gray-600 block mb-1 font-medium text-[10.5px]">Clinical Instructors</label><input type="number" min="0" value={staffing.totalClinicalInstructors} onChange={(e) => handleFieldUpdate(setStaffing, 'totalClinicalInstructors', e.target.value)} className="w-full py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 text-center rounded-md font-semibold outline-none text-xs bg-white" /></div>
          <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150"><label className="text-gray-600 block mb-1 font-medium text-[10.5px]">Specialties Count</label><input type="number" min="0" value={staffing.totalSpecialties} onChange={(e) => handleFieldUpdate(setStaffing, 'totalSpecialties', e.target.value)} className="w-full py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 text-center rounded-md font-semibold outline-none text-xs bg-white" /></div>
          <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150"><label className="text-gray-600 block mb-1 font-medium text-[10.5px]">Available Specialists</label><input type="number" min="0" value={staffing.totalAvailableSpecialists} onChange={(e) => handleFieldUpdate(setStaffing, 'totalAvailableSpecialists', e.target.value)} className="w-full py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 text-center rounded-md font-semibold outline-none text-xs bg-white" /></div>
        </div>

        {/* SUPPORT STAFF MEMBERS */}
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <span className="text-[11px] font-semibold text-[#066936] bg-[#F8FCF5] border border-[#CDE1B4]/40 px-2 py-0.5 rounded-md inline-block">
            C. Support Staff Strength
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-medium text-gray-700">
            <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150"><label className="text-gray-600 block mb-1 text-[10.5px]">Admin Staff</label><input type="number" min="0" value={staffing.supportAdmin} onChange={(e) => handleFieldUpdate(setStaffing, 'supportAdmin', e.target.value)} className="w-full py-1 px-1.5 border border-gray-200 focus:border-[#5D9C0E] text-center rounded-md font-semibold outline-none text-xs bg-white" /></div>
            <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150"><label className="text-gray-600 block mb-1 text-[10.5px]">Clerical Staff</label><input type="number" min="0" value={staffing.supportClerical} onChange={(e) => handleFieldUpdate(setStaffing, 'supportClerical', e.target.value)} className="w-full py-1 px-1.5 border border-gray-200 focus:border-[#5D9C0E] text-center rounded-md font-semibold outline-none text-xs bg-white" /></div>
            <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150"><label className="text-gray-600 block mb-1 text-[10.5px]">Cleaners</label><input type="number" min="0" value={staffing.supportCleaners} onChange={(e) => handleFieldUpdate(setStaffing, 'supportCleaners', e.target.value)} className="w-full py-1 px-1.5 border border-gray-200 focus:border-[#5D9C0E] text-center rounded-md font-semibold outline-none text-xs bg-white" /></div>
            <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150"><label className="text-gray-600 block mb-1 text-[10.5px]">Security</label><input type="number" min="0" value={staffing.supportSecurity} onChange={(e) => handleFieldUpdate(setStaffing, 'supportSecurity', e.target.value)} className="w-full py-1 px-1.5 border border-gray-200 focus:border-[#5D9C0E] text-center rounded-md font-semibold outline-none text-xs bg-white" /></div>
            <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150"><label className="text-gray-600 block mb-1 text-[10.5px]">Queried</label><input type="number" min="0" value={staffing.queriedCredentials} onChange={(e) => handleFieldUpdate(setStaffing, 'queriedCredentials', e.target.value)} className="w-full py-1 px-1.5 border border-gray-200 focus:border-[#5D9C0E] text-center rounded-md font-semibold outline-none text-xs bg-white" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div><label className="font-medium text-gray-500 block mb-1 text-[11px]">Staffing Comments</label><textarea value={staffing.comments} onChange={(e) => handleFieldUpdate(setStaffing, 'comments', e.target.value)} className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg h-16 resize-none outline-none text-xs bg-white" placeholder="Comments on staff strength..." /></div>
            <div><label className="font-medium text-gray-500 block mb-1 text-[11px]">Staffing Recommendations</label><textarea value={staffing.recommendations} onChange={(e) => handleFieldUpdate(setStaffing, 'recommendations', e.target.value)} className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg h-16 resize-none outline-none text-xs bg-white" placeholder="Recommendations on staffing..." /></div>
          </div>
        </div>

        {/* D. STAFF DEVELOPMENT SYSTEM */}
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <span className="text-[11px] font-semibold text-[#066936] bg-[#F8FCF5] border border-[#CDE1B4]/40 px-2 py-0.5 rounded-md inline-block">
            D. Staff Development System (Last 3 Years)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150 flex items-center justify-between gap-2">
              <label className="text-gray-700 text-[11px] font-medium leading-tight">Sponsored for MSc or equivalent</label>
              <input type="number" min="0" value={staffing.sponsoredMSc} onChange={(e) => handleFieldUpdate(setStaffing, 'sponsoredMSc', e.target.value)} className="w-16 py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] rounded-md font-semibold text-center text-xs bg-white outline-none" />
            </div>
            <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150 flex items-center justify-between gap-2">
              <label className="text-gray-700 text-[11px] font-medium leading-tight">Sponsored for PhD or equivalent</label>
              <input type="number" min="0" value={staffing.sponsoredPhD} onChange={(e) => handleFieldUpdate(setStaffing, 'sponsoredPhD', e.target.value)} className="w-16 py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] rounded-md font-semibold text-center text-xs bg-white outline-none" />
            </div>
            <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150 space-y-1">
              <label className="text-gray-700 text-[11px] font-medium block">Staff with Other Degrees</label>
              <div className="flex gap-2">
                <input type="number" min="0" value={staffing.otherDegreesCount} onChange={(e) => handleFieldUpdate(setStaffing, 'otherDegreesCount', e.target.value)} placeholder="Count" className="w-16 py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] rounded-md font-semibold text-center text-xs bg-white outline-none" />
                <input type="text" value={staffing.otherDegreesSpecify} onChange={(e) => handleFieldUpdate(setStaffing, 'otherDegreesSpecify', e.target.value)} placeholder="Specify degrees..." className="flex-1 py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] rounded-md text-xs bg-white outline-none" />
              </div>
            </div>
            <div className="p-2 rounded-lg bg-gray-50/60 border border-gray-150 flex items-center justify-between gap-2">
              <label className="text-gray-700 text-[11px] font-medium leading-tight">Attended CPD Programme (Last 12m)</label>
              <input type="number" min="0" value={staffing.attendedCPD} onChange={(e) => handleFieldUpdate(setStaffing, 'attendedCPD', e.target.value)} className="w-16 py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] rounded-md font-semibold text-center text-xs bg-white outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. PHYSICAL FACILITIES */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-150 shadow-xs space-y-3.5">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <Building2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">3. Physical Facilities & Infrastructure</h3>
            <p className="text-xs text-gray-500 font-normal">Audit sign posts, entrances, classrooms, science laboratories, and gymnasiums.</p>
          </div>
        </div>

        {/* SIGN POST */}
        <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-150 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-gray-800 text-xs">Departmental Sign Post</span>
            <div className="flex gap-3 items-center flex-wrap text-xs text-gray-700 font-medium">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signAbsent} onChange={(e) => setFacilities(p => ({ ...p, signAbsent: e.target.checked, signPresent: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Absent</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signPresent} onChange={(e) => setFacilities(p => ({ ...p, signPresent: e.target.checked, signAbsent: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Present</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signInconspicuous} onChange={(e) => setFacilities(p => ({ ...p, signInconspicuous: e.target.checked, signConspicuous: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Inconspicuous</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signConspicuous} onChange={(e) => setFacilities(p => ({ ...p, signConspicuous: e.target.checked, signInconspicuous: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Conspicuous</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, signOthersChecked: e.target.checked }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Others</label>
            </div>
          </div>
          {facilities.signOthersChecked && (
            <input type="text" value={facilities.signOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'signOthersText', e.target.value)} className="w-full max-w-sm py-1 px-2.5 border border-gray-200 focus:border-[#5D9C0E] rounded-lg bg-white text-xs outline-none" placeholder="Specify sign post details..." />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <textarea value={facilities.signComments} onChange={(e) => handleFieldUpdate(setFacilities, 'signComments', e.target.value)} placeholder="Sign post comments..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
            <textarea value={facilities.signRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'signRecs', e.target.value)} placeholder="Sign post recommendations..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
          </div>
        </div>

        {/* ENTRANCE */}
        <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-150 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-gray-800 text-xs">Department Entrance</span>
            <div className="flex gap-3 items-center flex-wrap text-xs text-gray-700 font-medium">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.entLarge} onChange={(e) => setFacilities(p => ({ ...p, entLarge: e.target.checked, entSmall: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Large</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.entSmall} onChange={(e) => setFacilities(p => ({ ...p, entSmall: e.target.checked, entLarge: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Small</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.entDisability} onChange={(e) => setFacilities(p => ({ ...p, entDisability: e.target.checked }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Disability Compliant</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.entOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, entOthersChecked: e.target.checked }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Others</label>
            </div>
          </div>
          {facilities.entOthersChecked && (
            <input type="text" value={facilities.entOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'entOthersText', e.target.value)} className="w-full max-w-sm py-1 px-2.5 border border-gray-200 focus:border-[#5D9C0E] rounded-lg bg-white text-xs outline-none" placeholder="Specify entrance details..." />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <textarea value={facilities.entComments} onChange={(e) => handleFieldUpdate(setFacilities, 'entComments', e.target.value)} placeholder="Entrance comments..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
            <textarea value={facilities.entRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'entRecs', e.target.value)} placeholder="Entrance recommendations..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
          </div>
        </div>

        {/* GENERAL OUTLOOK */}
        <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-150 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-gray-800 text-xs">General Outlook of Department</span>
            <div className="flex gap-3 items-center flex-wrap text-xs text-gray-700 font-medium">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookClean} onChange={(e) => setFacilities(p => ({ ...p, outlookClean: e.target.checked, outlookUnclean: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Clean</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookUnclean} onChange={(e) => setFacilities(p => ({ ...p, outlookUnclean: e.target.checked, outlookClean: false, outlookOrderly: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Unclean</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookOrderly} onChange={(e) => setFacilities(p => ({ ...p, outlookOrderly: e.target.checked, outlookCluttered: false, outlookUnclean: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Orderly</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookCluttered} onChange={(e) => setFacilities(p => ({ ...p, outlookCluttered: e.target.checked, outlookOrderly: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Cluttered</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, outlookOthersChecked: e.target.checked }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Others</label>
            </div>
          </div>
          {facilities.outlookOthersChecked && (
            <input type="text" value={facilities.outlookOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'outlookOthersText', e.target.value)} className="w-full max-w-sm py-1 px-2.5 border border-gray-200 focus:border-[#5D9C0E] rounded-lg bg-white text-xs outline-none" placeholder="Specify outlook details..." />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <textarea value={facilities.outlookComments} onChange={(e) => handleFieldUpdate(setFacilities, 'outlookComments', e.target.value)} placeholder="Outlook comments..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
            <textarea value={facilities.outlookRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'outlookRecs', e.target.value)} placeholder="Outlook recommendations..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
          </div>
        </div>

        {/* CLASSROOMS */}
        <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-150 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 text-xs">Classrooms / Lecture Theatres</span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-gray-500">Count:</span>
                <input type="number" min="0" value={facilities.classroomCount} onChange={(e) => handleFieldUpdate(setFacilities, 'classroomCount', e.target.value)} className="w-14 py-0.5 px-1.5 border border-gray-200 focus:border-[#5D9C0E] rounded-md text-center font-semibold text-xs bg-white" />
              </div>
            </div>
            <div className="flex gap-3 items-center flex-wrap text-xs text-gray-700 font-medium">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.classSmall} onChange={(e) => setFacilities(p => ({ ...p, classSmall: e.target.checked }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Small</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.classLarge} onChange={(e) => setFacilities(p => ({ ...p, classLarge: e.target.checked }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Large</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.classSpacious} onChange={(e) => setFacilities(p => ({ ...p, classSpacious: e.target.checked }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Spacious</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.classOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, classOthersChecked: e.target.checked }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Others</label>
            </div>
          </div>
          {facilities.classOthersChecked && (
            <input type="text" value={facilities.classOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'classOthersText', e.target.value)} className="w-full max-w-sm py-1 px-2.5 border border-gray-200 focus:border-[#5D9C0E] rounded-lg bg-white text-xs outline-none" placeholder="Specify classroom details..." />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <textarea value={facilities.classComments} onChange={(e) => handleFieldUpdate(setFacilities, 'classComments', e.target.value)} placeholder="Classroom comments..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
            <textarea value={facilities.classRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'classRecs', e.target.value)} placeholder="Classroom recommendations..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
          </div>
        </div>

        {/* SCIENCE LABS GRID */}
        <div className="space-y-3 pt-1">
          <span className="text-[11px] font-semibold text-[#066936] bg-[#F8FCF5] border border-[#CDE1B4]/40 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
            <Layers size={12}/> Academic Laboratory Specifications
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Gross Anatomy & Embryology Lab", prefix: "anatomy", hasCadaver: true },
              { label: "Histology Laboratory", prefix: "histology" },
              { label: "Biochemistry Laboratory", prefix: "biochemistry", isReagent: true },
              { label: "Physiology Laboratory", prefix: "physiology" }
            ].map((lab) => (
              <div key={lab.prefix} className="p-3 bg-gray-50/60 border border-gray-150 rounded-xl space-y-2.5">
                <span className="font-semibold text-gray-900 block text-xs border-b border-gray-100 pb-1">{lab.label}</span>
                
                <div className="space-y-2 text-xs">
                  {/* Size */}
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <span className="text-gray-600 font-medium">Size:</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}Small`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}Small`]: e.target.checked, [`${lab.prefix}Large`]: false, [`${lab.prefix}Spacious`]: false }))} className="accent-[#5D9C0E] scale-90" /> Small</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}Large`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}Large`]: e.target.checked, [`${lab.prefix}Small`]: false, [`${lab.prefix}Spacious`]: false }))} className="accent-[#5D9C0E] scale-90" /> Large</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}Spacious`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}Spacious`]: e.target.checked, [`${lab.prefix}Small`]: false, [`${lab.prefix}Large`]: false }))} className="accent-[#5D9C0E] scale-90" /> Spacious</label>
                    </div>
                  </div>

                  {/* Required Facility */}
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <span className="text-gray-600 font-medium">Facility:</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}FacilityAdequate`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}FacilityAdequate`]: e.target.checked, [`${lab.prefix}FacilityInadequate`]: false }))} className="accent-[#5D9C0E] scale-90" /> Adequate</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}FacilityInadequate`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}FacilityInadequate`]: e.target.checked, [`${lab.prefix}FacilityAdequate`]: false }))} className="accent-[#5D9C0E] scale-90" /> Inadequate</label>
                    </div>
                  </div>

                  {/* Equipment / Reagents */}
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                    <span className="text-gray-600 font-medium">{lab.isReagent ? "Reagents:" : "Equipment:"}</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1">
                        <input 
                          type="checkbox" 
                          checked={!!(facilities as any)[lab.isReagent ? "biochemistryReagentsAdequate" : `${lab.prefix}EquipmentAdequate`]} 
                          onChange={(e) => setFacilities(p => ({ ...p, [lab.isReagent ? "biochemistryReagentsAdequate" : `${lab.prefix}EquipmentAdequate`]: e.target.checked, [lab.isReagent ? "biochemistryReagentsInadequate" : `${lab.prefix}EquipmentInadequate`]: false }))} 
                          className="accent-[#5D9C0E] scale-90" 
                        /> Adequate
                      </label>
                      <label className="flex items-center gap-1">
                        <input 
                          type="checkbox" 
                          checked={!!(facilities as any)[lab.isReagent ? "biochemistryReagentsInadequate" : `${lab.prefix}EquipmentInadequate`]} 
                          onChange={(e) => setFacilities(p => ({ ...p, [lab.isReagent ? "biochemistryReagentsInadequate" : `${lab.prefix}EquipmentInadequate`]: e.target.checked, [lab.isReagent ? "biochemistryReagentsAdequate" : `${lab.prefix}EquipmentAdequate`]: false }))} 
                          className="accent-[#5D9C0E] scale-90" 
                        /> Inadequate
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                  <input type="text" placeholder="Comments..." value={(facilities as any)[`${lab.prefix}Comments`] || ""} onChange={(e) => handleFieldUpdate(setFacilities, `${lab.prefix}Comments`, e.target.value)} className="w-full py-1 px-2 border border-gray-200 rounded-md text-[11px] bg-white outline-none" />
                  <input type="text" placeholder="Recommendations..." value={(facilities as any)[`${lab.prefix}Recs`] || ""} onChange={(e) => handleFieldUpdate(setFacilities, `${lab.prefix}Recs`, e.target.value)} className="w-full py-1 px-2 border border-gray-200 rounded-md text-[11px] bg-white outline-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GYMNASIUM */}
        <div className="p-3.5 bg-gray-50/60 border border-gray-150 rounded-xl space-y-2.5">
          <span className="font-semibold text-gray-900 block text-xs">Gymnasium Specifications</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-medium text-xs">
            <div className="bg-white p-2 border border-gray-150 rounded-lg space-y-1">
              <span className="text-gray-500 block text-[10.5px]">Adult Gym:</span>
              <div className="flex gap-2 text-[11px]">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymAd" checked={facilities.gymAdultAvailable === 'Available'} onChange={() => handleFieldUpdate(setFacilities, 'gymAdultAvailable', 'Available')} className="accent-[#5D9C0E]" /> Avail</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymAd" checked={facilities.gymAdultAvailable === 'Unavailable'} onChange={() => handleFieldUpdate(setFacilities, 'gymAdultAvailable', 'Unavailable')} className="accent-[#5D9C0E]" /> Unavail</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-150 rounded-lg space-y-1">
              <span className="text-gray-500 block text-[10.5px]">Paediatric Gym:</span>
              <div className="flex gap-2 text-[11px]">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymPaed" checked={facilities.gymPaediatricAvailable === 'Available'} onChange={() => handleFieldUpdate(setFacilities, 'gymPaediatricAvailable', 'Available')} className="accent-[#5D9C0E]" /> Avail</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymPaed" checked={facilities.gymPaediatricAvailable === 'Unavailable'} onChange={() => handleFieldUpdate(setFacilities, 'gymPaediatricAvailable', 'Unavailable')} className="accent-[#5D9C0E]" /> Unavail</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-150 rounded-lg space-y-1">
              <span className="text-gray-500 block text-[10.5px]">Equipment:</span>
              <div className="flex gap-2 text-[11px]">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymEq" checked={facilities.gymEquipment === 'Adequate'} onChange={() => handleFieldUpdate(setFacilities, 'gymEquipment', 'Adequate')} className="accent-[#5D9C0E]" /> Adeq</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymEq" checked={facilities.gymEquipment === 'Inadequate'} onChange={() => handleFieldUpdate(setFacilities, 'gymEquipment', 'Inadequate')} className="accent-[#5D9C0E]" /> Inadeq</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-150 rounded-lg space-y-1">
              <span className="text-gray-500 block text-[10.5px]">Ventilation:</span>
              <div className="flex gap-2 text-[11px]">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymV" checked={facilities.gymVentilation === 'Good'} onChange={() => handleFieldUpdate(setFacilities, 'gymVentilation', 'Good')} className="accent-[#5D9C0E]" /> Good</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymV" checked={facilities.gymVentilation === 'Fair'} onChange={() => handleFieldUpdate(setFacilities, 'gymVentilation', 'Fair')} className="accent-[#5D9C0E]" /> Fair</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <textarea value={facilities.gymComments} onChange={(e) => handleFieldUpdate(setFacilities, 'gymComments', e.target.value)} placeholder="Gym comments..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
            <textarea value={facilities.gymRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'gymRecs', e.target.value)} placeholder="Gym recommendations..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
          </div>
        </div>

        {/* PRACTICAL DEMONSTRATION & LIBRARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* TOILETS/CONVENIENCES */}
          <div className="bg-gray-50/60 p-3 border border-gray-150 rounded-xl space-y-2 font-medium text-gray-700">
            <span className="font-semibold text-gray-900 block text-xs">Toilets / Conveniences</span>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1 bg-white p-2 border border-gray-150 rounded-lg">
                <span className="font-semibold text-gray-700 block text-[11px]">Staff Toilets:</span>
                <div className="flex flex-col gap-1 text-[10.5px]">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStaffAdequate} onChange={(e) => setFacilities(p => ({ ...p, toiletsStaffAdequate: e.target.checked, toiletsStaffInadequate: false }))} className="accent-[#5D9C0E]" /> Adequate</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStaffClean} onChange={(e) => setFacilities(p => ({ ...p, toiletsStaffClean: e.target.checked, toiletsStaffUnclean: false }))} className="accent-[#5D9C0E]" /> Clean</label>
                </div>
              </div>

              <div className="space-y-1 bg-white p-2 border border-gray-150 rounded-lg">
                <span className="font-semibold text-gray-700 block text-[11px]">Student Toilets:</span>
                <div className="flex flex-col gap-1 text-[10.5px]">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStudentAdequate} onChange={(e) => setFacilities(p => ({ ...p, toiletsStudentAdequate: e.target.checked, toiletsStudentInadequate: false }))} className="accent-[#5D9C0E]" /> Adequate</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStudentClean} onChange={(e) => setFacilities(p => ({ ...p, toiletsStudentClean: e.target.checked, toiletsStudentUnclean: false }))} className="accent-[#5D9C0E]" /> Clean</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <input type="text" placeholder="Comments..." value={facilities.toiletsComments} onChange={(e) => handleFieldUpdate(setFacilities, 'toiletsComments', e.target.value)} className="w-full py-1 px-2 border border-gray-200 rounded-md text-[11px] bg-white outline-none" />
              <input type="text" placeholder="Recommendations..." value={facilities.toiletsRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'toiletsRecs', e.target.value)} className="w-full py-1 px-2 border border-gray-200 rounded-md text-[11px] bg-white outline-none" />
            </div>
          </div>

          {/* INSTITUTIONAL LIBRARY */}
          <div className="bg-gray-50/60 p-3 border border-gray-150 rounded-xl space-y-2 font-medium text-gray-700">
            <span className="font-semibold text-gray-900 block text-xs">Library Holdings & Resources</span>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-1.5 border border-gray-150 rounded-lg">
                <span className="text-gray-500 block text-[10px]">Sitting Cap:</span>
                <input type="text" value={facilities.libSittingCapacity} onChange={(e) => handleFieldUpdate(setFacilities, 'libSittingCapacity', e.target.value)} className="w-full text-center font-semibold text-xs outline-none" placeholder="Count" />
              </div>
              <div className="bg-white p-1.5 border border-gray-150 rounded-lg">
                <span className="text-gray-500 block text-[10px]">Textbooks:</span>
                <input type="number" min="0" value={facilities.libTextbooks} onChange={(e) => handleFieldUpdate(setFacilities, 'libTextbooks', e.target.value)} className="w-full text-center font-semibold text-xs outline-none" />
              </div>
              <div className="bg-white p-1.5 border border-gray-150 rounded-lg">
                <span className="text-gray-500 block text-[10px]">eJournals:</span>
                <input type="number" min="0" value={facilities.libEJournals} onChange={(e) => handleFieldUpdate(setFacilities, 'libEJournals', e.target.value)} className="w-full text-center font-semibold text-xs outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <input type="text" placeholder="Comments..." value={facilities.libComments} onChange={(e) => handleFieldUpdate(setFacilities, 'libComments', e.target.value)} className="w-full py-1 px-2 border border-gray-200 rounded-md text-[11px] bg-white outline-none" />
              <input type="text" placeholder="Recommendations..." value={facilities.libRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'libRecs', e.target.value)} className="w-full py-1 px-2 border border-gray-200 rounded-md text-[11px] bg-white outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. CLINICAL TRAINING */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-150 shadow-xs space-y-3.5">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <ClipboardCheck size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">4. Clinical Training Ecosystem</h3>
            <p className="text-xs text-gray-500 font-normal">Teaching hospital capacity, cubicles, waiting areas, and physiotherapy postings.</p>
          </div>
        </div>

        {/* TEACHING HOSPITAL */}
        <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-150 space-y-2">
          <span className="font-semibold text-gray-900 block text-xs">Teaching Hospital Profile Metrics</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-2 rounded-lg bg-white border border-gray-150 flex items-center justify-between gap-2">
              <label className="text-gray-700 text-[11px] font-medium">Hospital Bed Space:</label>
              <input type="text" value={clinical.hospitalBedSpace} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalBedSpace', e.target.value)} className="w-16 py-0.5 px-1.5 border border-gray-200 rounded-md text-xs font-semibold text-center outline-none" />
            </div>
            <div className="p-2 rounded-lg bg-white border border-gray-150 flex items-center justify-between gap-2">
              <label className="text-gray-700 text-[11px] font-medium">Hospital Specialties:</label>
              <input type="number" min="0" value={clinical.hospitalSpecialtiesCount} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalSpecialtiesCount', e.target.value)} className="w-16 py-0.5 px-1.5 border border-gray-200 rounded-md text-xs font-semibold text-center outline-none" />
            </div>
            <div className="p-2 rounded-lg bg-white border border-gray-150 flex items-center justify-between gap-2">
              <label className="text-gray-700 text-[11px] font-medium">Number of Wards:</label>
              <input type="number" min="0" value={clinical.hospitalWardsCount} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalWardsCount', e.target.value)} className="w-16 py-0.5 px-1.5 border border-gray-200 rounded-md text-xs font-semibold text-center outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <textarea value={clinical.hospitalComments} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalComments', e.target.value)} placeholder="Hospital comments..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
            <textarea value={clinical.hospitalRecommendations} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalRecommendations', e.target.value)} placeholder="Hospital recommendations..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 resize-none outline-none text-xs bg-white" />
          </div>
        </div>

        {/* PHYSIOTHERAPY CLINICAL DEPARTMENT */}
        <div className="p-3 rounded-xl bg-gray-50/60 border border-gray-150 space-y-2.5">
          <span className="font-semibold text-gray-900 block text-xs">Departmental Postings & Clinical Resources</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-medium text-gray-700">
            {[
              { label: "Physiotherapists Count", ok: "deptTherapistsAdequate", bad: "deptTherapistsInadequate" },
              { label: "Treatment Cubicles", ok: "deptCubiclesAdequate", bad: "deptCubiclesInadequate" },
              { label: "Patient Waiting Area", ok: "deptWaitingAvailable", bad: "deptWaitingNotAvailable", toggleOnly: true },
              { label: "Clinical Staff Offices", ok: "deptOfficesAvailable", bad: "deptOfficesNotAvailable", toggleOnly: true },
              { label: "Conveniences Available", ok: "deptConveniencesAvailable", bad: "deptConveniencesNotAvailable", toggleOnly: true },
              { label: "Departmental Seminar Room", ok: "deptSeminarRoomAvailable", bad: "deptSeminarRoomNotAvailable", toggleOnly: true }
            ].map((row, idx) => (
              <div key={idx} className="bg-white p-2 rounded-lg border border-gray-150 flex items-center justify-between gap-1">
                <span className="text-gray-700 text-[11px] truncate">{row.label}</span>
                <div className="flex gap-1.5 shrink-0 text-[10.5px]">
                  <label className="flex items-center gap-0.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!(clinical as any)[row.ok]} 
                      onChange={(e) => setClinical(p => ({ ...p, [row.ok]: e.target.checked, [row.bad]: false }))} 
                      className="accent-[#5D9C0E]" 
                    /> {row.toggleOnly ? "Yes" : "Adeq"}
                  </label>
                  <label className="flex items-center gap-0.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!(clinical as any)[row.bad]} 
                      onChange={(e) => setClinical(p => ({ ...p, [row.bad]: e.target.checked, [row.ok]: false }))} 
                      className="accent-[#5D9C0E]" 
                    /> {row.toggleOnly ? "No" : "Inadeq"}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <label className="font-medium text-gray-700 block mb-1 text-[11px]">Areas of Specialization listed in Department:</label>
            <input type="text" value={clinical.deptSpecialtiesList} onChange={(e) => handleFieldUpdate(setClinical, 'deptSpecialtiesList', e.target.value)} placeholder="Specify specialized focus groups..." className="w-full py-1.5 px-2.5 border border-gray-200 focus:border-[#5D9C0E] rounded-lg text-xs outline-none bg-white font-medium" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <textarea value={clinical.deptComments} onChange={(e) => handleFieldUpdate(setClinical, 'deptComments', e.target.value)} placeholder="Department clinical comments..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 bg-white resize-none outline-none text-xs" />
            <textarea value={clinical.deptRecommendations} onChange={(e) => handleFieldUpdate(setClinical, 'deptRecommendations', e.target.value)} placeholder="Department clinical recommendations..." className="w-full p-2 border border-gray-200 focus:border-[#5D9C0E] rounded-lg h-14 bg-white resize-none outline-none text-xs" />
          </div>
        </div>
      </div>

      </fieldset>

      {/* FLOATING ACTION BOTTOM NAVIGATOR */}
      <div className="bg-white border border-gray-150 shadow-xs p-3 sm:p-3.5 flex flex-row justify-between items-center gap-2 max-w-5xl mx-auto rounded-2xl z-10 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        
        <div className="flex flex-row gap-2 items-center">
          {!isReadOnly && (
            <button
              type="submit"
              disabled={!isDirty}
              onClick={() => { (window as any)._actionType = 'save'; }}
              className={`px-4 py-2 font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${!isDirty ? "border border-gray-200 text-gray-400 bg-gray-50 opacity-60 cursor-not-allowed" : "border border-[#5D9C0E] text-[#5D9C0E] hover:bg-[#EEF6DF] bg-white shadow-xs"}`}
            >
              <Save size={13} />
              <span>Save Progress</span>
            </button>
          )}
          
          {isReviewMode && !isReadOnly && (
            <button
              type="submit"
              disabled={isDirty}
              onClick={() => { (window as any)._actionType = 'proceed'; }}
              className={`px-5 py-2 text-white font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs shadow-md ${isDirty ? "bg-[#5D9C0E]/50 cursor-not-allowed" : "bg-[#5D9C0E] hover:bg-[#4a7c0b] cursor-pointer"}`}
            >
              <span>Proceed to Report</span>
              <ArrowRight size={13} />
            </button>
          )}
          
          {isReadOnly && isReviewMode && (
            <button
              type="button"
              onClick={() => onComplete({ _action: 'proceed' })}
              className="px-5 py-2 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md text-xs cursor-pointer"
            >
              <span>View Summary Report</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

    </form>
  );
}