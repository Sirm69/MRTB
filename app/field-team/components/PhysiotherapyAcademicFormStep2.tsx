"use client";

import React, { useState, useEffect } from 'react';
import { Truck, Users, Building2, BookOpen, ClipboardCheck, Plus, Trash2, Save, Layers } from 'lucide-react';

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
    <form onSubmit={handleFormSubmission} className="space-y-6 w-full max-w-5xl mx-auto text-xs text-gray-800 antialiased font-medium pb-24">
      <fieldset disabled={isReadOnly} className="space-y-6 w-full pb-20 contents">
      
      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm text-center">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          INTERIM REPORT FOR ACADEMIC ACCREDITATION EXERCISE OF PHYSIOTHERAPY PROGRAMME FOR THE MEDICAL REHABILITATION BOARD
        </h2>
      </div>

      {/* PREAMBLE */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Truck size={14} /> PREAMBLE/INTRODUCTION
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-gray-600 block">Date</label>
            <input type="text" value={visitationDate || "Not Scheduled"} readOnly className="w-full mt-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-500 font-semibold cursor-not-allowed" />
          </div>
          <div className="sm:col-span-2">
            <label className="font-bold text-gray-600 block">Accreditation Team Members</label>
            <input type="text" value={fieldTeamMembers} readOnly className="w-full mt-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-gray-500 font-semibold cursor-not-allowed" />
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Mode of travel</label>
            <input type="text" value={preamble.modeOfTravel} onChange={(e) => handleFieldUpdate(setPreamble, 'modeOfTravel', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded bg-white" />
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Arrival date</label>
            <input type="date" value={preamble.arrivalDate} onChange={(e) => handleFieldUpdate(setPreamble, 'arrivalDate', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded bg-white" />
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Arrival Time</label>
            <input type="time" value={preamble.arrivalTime} onChange={(e) => handleFieldUpdate(setPreamble, 'arrivalTime', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded bg-white" />
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Place of reception</label>
            <input type="text" value={preamble.placeOfReception} onChange={(e) => handleFieldUpdate(setPreamble, 'placeOfReception', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded bg-white" />
          </div>
          
          <div className="sm:col-span-2">
            <label className="font-bold text-gray-600 block">Type of reception:</label>
            <div className="flex gap-4 mt-2 font-semibold items-center flex-wrap">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={preamble.typeWarm} onChange={(e) => setPreamble(p => ({ ...p, typeWarm: e.target.checked, typeCordial: false, typeHostile: false, typeOthersChecked: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Warm</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={preamble.typeCordial} onChange={(e) => setPreamble(p => ({ ...p, typeCordial: e.target.checked, typeWarm: false, typeHostile: false, typeOthersChecked: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Cordial</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={preamble.typeHostile} onChange={(e) => setPreamble(p => ({ ...p, typeHostile: e.target.checked, typeWarm: false, typeCordial: false, typeOthersChecked: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Hostile</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={preamble.typeOthersChecked} onChange={(e) => setPreamble(p => ({ ...p, typeOthersChecked: e.target.checked, typeWarm: false, typeCordial: false, typeHostile: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Others, please specify</label>
            </div>
          </div>
          {preamble.typeOthersChecked && (
            <div className="sm:col-span-3">
              <input type="text" value={preamble.typeOthersText} onChange={(e) => handleFieldUpdate(setPreamble, 'typeOthersText', e.target.value)} className="w-full p-1.5 border border-purple-300 rounded bg-white outline-none font-bold text-purple-950" placeholder="Specify reception particulars..." />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-3 space-y-3">
          <span className="font-bold text-gray-900 block uppercase tracking-wide text-[10px]">The Institution</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-600 block">Name of Institution</label>
              <input type="text" value={institutionName} readOnly className="w-full mt-1 p-1.5 border border-gray-200 bg-gray-50 rounded text-gray-500 font-bold cursor-not-allowed" />
            </div>
            <div>
              <label className="font-bold text-gray-600 block">Program to be Accredited</label>
              <input type="text" value={preamble.programToAccredit} onChange={(e) => handleFieldUpdate(setPreamble, 'programToAccredit', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded bg-white" />
            </div>
            
            <div className="sm:col-span-2 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-bold text-gray-700 block">Representatives of Institution:</label>
                <button type="button" onClick={() => setRepresentatives(p => [...p, ""])} className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 font-bold text-[10px] rounded-lg flex items-center gap-1 transition-all"><Plus size={12} /> Add Line</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {representatives.map((rep, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-400 w-4 text-right">{idx + 1}.</span>
                    <input type="text" value={rep} onChange={(e) => updateRepValue(idx, e.target.value)} className="flex-1 p-1.5 border border-gray-300 rounded outline-none font-semibold bg-white" placeholder="Enter full name..." />
                    {representatives.length > 3 && (
                      <button type="button" onClick={() => setRepresentatives(p => p.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={13} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACADEMIC MATTERS */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <BookOpen size={14} /> 2 ACADEMIC MATTERS (Tick as appropriate)
        </h3>
        
        <div className="space-y-4 divide-y divide-gray-100 font-semibold text-gray-700">
          {[
            { q: "Is the programme philosophy and objectives well stated?", kYes: "aYes", kNo: "aNo", kOthersCh: "aOthersChecked", kOthersTxt: "aOthersText", title: "a. Programme Philosophy and Objectives" },
            { q: "Are the admission requirements adequately captured in the Curriculum?", kYes: "bYes", kNo: "bNo", kOthersCh: "bOthersChecked", kOthersTxt: "bOthersText", title: "b. Admission Requirements" },
            { q: "Is the curriculum and structure of the programme available?", kYes: "c1Yes", kNo: "c1No", kOthersCh: "c1OthersChecked", kOthersTxt: "c1OthersText", title: "c. The Curriculum" },
            { q: "Is the classification of degree and graduation criteria well stated in the curriculum?", kYes: "c2Yes", kNo: "c2No", kOthersCh: "c2OthersChecked", kOthersTxt: "c2OthersText" },
            { q: "Are Clinical Postings in the Areas of Specialization well defined?", kYes: "c3Yes", kNo: "c3No", kOthersCh: "c3OthersChecked", kOthersTxt: "c3OthersText" },
            { q: "Is the progression from one level to another clearly defined in the curriculum", kYes: "c4Yes", kNo: "c4No", kOthersCh: "c4OthersChecked", kOthersTxt: "c4OthersText" },
            { q: "Is the minimum and maximum duration of study clearly stated in the curriculum", kYes: "c5Yes", kNo: "c5No", kOthersCh: "c5OthersChecked", kOthersTxt: "c5OthersText" },
            { q: "Are evidences of all examinations available?", kYes: "c6Yes", kNo: "c6No", kOthersCh: "c6OthersChecked", kOthersTxt: "c6OthersText" },
            { q: "Are the Academic Regulations well defined?", kYes: "dYes", kNo: "dNo", kOthersCh: "dOthersChecked", kOthersTxt: "dOthersText", title: "d. Are the Academic Regulations well defined?" },
            { q: "Is external examination system used?", kYes: "e1Yes", kNo: "e1No", kOthersCh: "e1OthersChecked", kOthersTxt: "e1OthersText", title: "e. External Examination System" },
            { q: "Are competent external examiners used for exam moderation?", kYes: "e2Yes", kNo: "e2No", kOthersCh: "e2OthersChecked", kOthersTxt: "e2OthersText" }
          ].map((item, idx) => (
            <div key={idx} className="pt-3 space-y-1">
              {item.title && <span className="font-bold text-gray-900 block text-[11px] mb-1">{item.title}</span>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-start">
                <span className="text-gray-800 font-bold">{item.q}</span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={(academic as any)[item.kYes]} onChange={(e) => setAcademic(p => ({ ...p, [item.kYes]: e.target.checked, [item.kNo]: false, [item.kOthersCh]: false }))} className="rounded text-purple-900 w-3.5 h-3.5 focus:ring-0" /> Yes</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={(academic as any)[item.kNo]} onChange={(e) => setAcademic(p => ({ ...p, [item.kNo]: e.target.checked, [item.kYes]: false, [item.kOthersCh]: false }))} className="rounded text-purple-900 w-3.5 h-3.5 focus:ring-0" /> No</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={(academic as any)[item.kOthersCh]} onChange={(e) => setAcademic(p => ({ ...p, [item.kOthersCh]: e.target.checked, [item.kYes]: false, [item.kNo]: false }))} className="rounded text-purple-900 w-3.5 h-3.5 focus:ring-0" /> Others pls specify</label>
                  </div>
                  {(academic as any)[item.kOthersCh] && (
                    <input type="text" value={(academic as any)[item.kOthersTxt]} onChange={(e) => handleFieldUpdate(setAcademic, item.kOthersTxt, e.target.value)} className="w-full p-1 border border-purple-300 rounded font-semibold text-purple-950 bg-white outline-none text-xs" placeholder="Specify details..." />
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 space-y-3">
            <span className="font-bold text-gray-900 block text-[11px]">f. Students’ Matters</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
              {[
                { label: "Students Lecture Notes", y: "fNotesAdequate", n: "fNotesNotAdequate", lblY: "Adequate", lblN: "Not Adequate" },
                { label: "Lecture Time-Table", y: "fTimetableAvailable", n: "fTimetableNotAvailable", lblY: "Available", lblN: "Not Available" },
                { label: "Lecture Schedule", y: "fScheduleAdequate", n: "fScheduleNotAdequate", lblY: "Adequate", lblN: "Not Adequate" },
                { label: "Practical Exposure", y: "fPracticalAdequate", n: "fPracticalNotAdequate", lblY: "Adequate", lblN: "Not Adequate" },
                { label: "External Examiner’s Report", y: "fReportAvailable", n: "fReportNotAvailable", lblY: "Available", lblN: "Not Available" },
                { label: "Students Mode of dressing", y: "fDressingModest", n: "fDressingNotModest", lblY: "Modest", lblN: "Not Modest" }
              ].map((m, mIdx) => (
                <div key={mIdx} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-700 font-semibold">{m.label}</span>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={(academic as any)[m.y]} onChange={(e) => setAcademic(p => ({ ...p, [m.y]: e.target.checked, [m.n]: false }))} className="rounded text-purple-900 w-3 h-3" /> {m.lblY}</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={(academic as any)[m.n]} onChange={(e) => setAcademic(p => ({ ...p, [m.n]: e.target.checked, [m.y]: false }))} className="rounded text-purple-900 w-3 h-3" /> {m.lblN}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={academic.comments} onChange={(e) => handleFieldUpdate(setAcademic, 'comments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
          <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={academic.recommendations} onChange={(e) => handleFieldUpdate(setAcademic, 'recommendations', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
        </div>
      </div>

      {/* STAFFING */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Users size={14} /> 3 STAFFING
        </h3>
        
        <div className="space-y-3">
          <span className="font-bold text-gray-900 block text-[11px]">A. STAFF STRENGTH</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
            {[
              { label: "Total number of Academic Staff", f: "totalAcademic" },
              { label: "Total number of Permanent Academic Staff", f: "totalPermanentAcademic" },
              { label: "Total number of part time Lecturers", f: "totalPartTime" },
              { label: "Total number of E-Lecturers", f: "totalELecturers" },
              { label: "Total number of Lecturers with current practicing license", f: "totalLicensed" },
              { label: "Total number of Lecturers without current practicing license", f: "totalUnlicensed" },
              { label: "Total number of Non-academic Staff", f: "totalNonAcademic" }
            ].map(item => (
              <div key={item.f} className="flex flex-col justify-end">
                <label className="text-gray-600 block mb-0.5 leading-tight font-bold">{item.label}</label>
                <input type="number" min="0" value={(staffing as any)[item.f]} onChange={(e) => handleFieldUpdate(setStaffing, item.f, e.target.value)} className="w-20 p-1 border border-gray-300 rounded font-bold text-center bg-white outline-none" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2">
          <span className="font-bold text-gray-900 block uppercase tracking-wider text-[10px]">B. STAFF CREDENTIAL VERIFICATION • Academic Staff Members</span>
          <div className="max-w-sm mb-2">
            <label className="font-bold text-gray-600 block">Name of the Head of Department</label>
            <input type="text" value={staffing.hodName} onChange={(e) => handleFieldUpdate(setStaffing, 'hodName', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded font-bold outline-none" />
          </div>
          
          <div className="overflow-x-auto w-full border border-gray-200 rounded-lg">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 font-bold text-gray-600">
                  <th className="p-2 text-center w-[50px]">S/N</th>
                  <th className="p-2">Designation/cadre</th>
                  <th className="p-2 text-center w-[120px]">Full -time</th>
                  <th className="p-2 text-center w-[120px]">Adjunct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {[
                  { sn: "1.", cadre: "Total number of Professors", ft: "profFT", adj: "profAdj" },
                  { sn: "2.", cadre: "Total number of Associate Profs/Readers", ft: "assocFT", adj: "assocAdj" },
                  { sn: "3.", cadre: "Total number of Senior Lecturers", ft: "seniorFT", adj: "seniorAdj" },
                  { sn: "4.", cadre: "Total number of Lecturers I", ft: "lect1FT", adj: "lecturers1Adj" },
                  { sn: "5.", cadre: "Total number of Lecturers II", ft: "lect2FT", adj: "lecturers2Adj" },
                  { sn: "6.", cadre: "Total number of Assistant Lecturer", ft: "asstFT", adj: "asstAdj" }
                ].map(row => (
                  <tr key={row.sn}>
                    <td className="p-2 text-center font-bold text-gray-400">{row.sn}</td>
                    <td className="p-2 text-gray-800 font-bold">{row.cadre}</td>
                    <td className="p-1"><input type="number" min="0" value={(staffing as any)[row.ft]} onChange={(e) => handleFieldUpdate(setStaffing, row.ft, e.target.value)} className="w-20 mx-auto block p-1 text-center font-bold outline-none border border-gray-300 rounded" /></td>
                    <td className="p-1"><input type="number" min="0" value={(staffing as any)[row.adj]} onChange={(e) => handleFieldUpdate(setStaffing, row.adj, e.target.value)} className="w-20 mx-auto block p-1 text-center font-bold outline-none border border-gray-300 rounded" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-semibold text-gray-700">
          <div><label className="text-gray-600 block mb-1 font-bold">Total Associate Lecturers</label><input type="number" min="0" value={staffing.totalAssociateLecturers} onChange={(e) => handleFieldUpdate(setStaffing, 'totalAssociateLecturers', e.target.value)} className="w-20 p-1 border border-gray-300 text-center rounded font-bold outline-none" /></div>
          <div><label className="text-gray-600 block mb-1 font-bold">Total Clinical Instructors</label><input type="number" min="0" value={staffing.totalClinicalInstructors} onChange={(e) => handleFieldUpdate(setStaffing, 'totalClinicalInstructors', e.target.value)} className="w-20 p-1 border border-gray-300 text-center rounded font-bold outline-none" /></div>
          <div><label className="text-gray-600 block mb-1 font-bold">Total number of Specialties</label><input type="number" min="0" value={staffing.totalSpecialties} onChange={(e) => handleFieldUpdate(setStaffing, 'totalSpecialties', e.target.value)} className="w-20 p-1 border border-gray-300 text-center rounded font-bold outline-none" /></div>
          <div><label className="text-gray-600 block mb-1 font-bold">Total Available Specialists</label><input type="number" min="0" value={staffing.totalAvailableSpecialists} onChange={(e) => handleFieldUpdate(setStaffing, 'totalAvailableSpecialists', e.target.value)} className="w-20 p-1 border border-gray-300 text-center rounded font-bold outline-none" /></div>
        </div>

        {/* SUPPORT STAFF MEMBERS - COMPLETED FROM CUTOFF */}
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <span className="font-bold text-gray-900 block uppercase tracking-wider text-[10px]">Support Staff Members</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-semibold text-gray-700">
            <div><label className="text-gray-600 block mb-1 font-bold">Administrative Staff</label><input type="number" min="0" value={staffing.supportAdmin} onChange={(e) => handleFieldUpdate(setStaffing, 'supportAdmin', e.target.value)} className="w-20 p-1 border border-gray-300 text-center rounded font-bold outline-none" /></div>
            <div><label className="text-gray-600 block mb-1 font-bold">Clerical Staff</label><input type="number" min="0" value={staffing.supportClerical} onChange={(e) => handleFieldUpdate(setStaffing, 'supportClerical', e.target.value)} className="w-20 p-1 border border-gray-300 text-center rounded font-bold outline-none" /></div>
            <div><label className="text-gray-600 block mb-1 font-bold">Cleaners</label><input type="number" min="0" value={staffing.supportCleaners} onChange={(e) => handleFieldUpdate(setStaffing, 'supportCleaners', e.target.value)} className="w-20 p-1 border border-gray-300 text-center rounded font-bold outline-none" /></div>
            <div><label className="text-gray-600 block mb-1 font-bold">Security Personnel</label><input type="number" min="0" value={staffing.supportSecurity} onChange={(e) => handleFieldUpdate(setStaffing, 'supportSecurity', e.target.value)} className="w-20 p-1 border border-gray-300 text-center rounded font-bold outline-none" /></div>
            <div><label className="text-gray-600 block mb-1 font-bold">Queried Credentials</label><input type="number" min="0" value={staffing.queriedCredentials} onChange={(e) => handleFieldUpdate(setStaffing, 'queriedCredentials', e.target.value)} className="w-20 p-1 border border-gray-300 text-center rounded font-bold outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={staffing.comments} onChange={(e) => handleFieldUpdate(setStaffing, 'comments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
            <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={staffing.recommendations} onChange={(e) => handleFieldUpdate(setStaffing, 'recommendations', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
          </div>
        </div>

        {/* D. STAFF DEVELOPMENT SYSTEM */}
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <span className="font-bold text-gray-900 block text-[11px]">D. Staff Development System (Last 3 Years)</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-semibold text-gray-700">
            <div>
              <label className="text-gray-600 block mb-1 font-bold">Total staff sponsored for MSc or equivalent</label>
              <input type="number" min="0" value={staffing.sponsoredMSc} onChange={(e) => handleFieldUpdate(setStaffing, 'sponsoredMSc', e.target.value)} className="w-20 p-1 border border-gray-300 rounded font-bold outline-none" />
            </div>
            <div>
              <label className="text-gray-600 block mb-1 font-bold">Total staff sponsored for PhD or equivalent</label>
              <input type="number" min="0" value={staffing.sponsoredPhD} onChange={(e) => handleFieldUpdate(setStaffing, 'sponsoredPhD', e.target.value)} className="w-20 p-1 border border-gray-300 rounded font-bold outline-none" />
            </div>
            <div>
              <label className="text-gray-600 block mb-1 font-bold">Total staff with other degrees (Count)</label>
              <div className="flex gap-2">
                <input type="number" min="0" value={staffing.otherDegreesCount} onChange={(e) => handleFieldUpdate(setStaffing, 'otherDegreesCount', e.target.value)} className="w-20 p-1 border border-gray-300 rounded font-bold outline-none" />
                <input type="text" value={staffing.otherDegreesSpecify} onChange={(e) => handleFieldUpdate(setStaffing, 'otherDegreesSpecify', e.target.value)} placeholder="Specify degrees..." className="flex-1 p-1 border border-gray-300 rounded outline-none" />
              </div>
            </div>
            <div>
              <label className="text-gray-600 block mb-1 font-bold">Total staff attended CPD programme (Last 12 months)</label>
              <input type="number" min="0" value={staffing.attendedCPD} onChange={(e) => handleFieldUpdate(setStaffing, 'attendedCPD', e.target.value)} className="w-20 p-1 border border-gray-300 rounded font-bold outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* PHYSICAL FACILITIES */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Building2 size={14} /> PHYSICAL FACILITIES
        </h3>

        {/* SIGN POST */}
        <div className="space-y-2 py-2 border-b border-gray-100">
          <span className="font-bold text-gray-900 block">Departmental Sign Post</span>
          <div className="flex gap-4 items-center flex-wrap">
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signAbsent} onChange={(e) => setFacilities(p => ({ ...p, signAbsent: e.target.checked, signPresent: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Absent</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signPresent} onChange={(e) => setFacilities(p => ({ ...p, signPresent: e.target.checked, signAbsent: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Present</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signInconspicuous} onChange={(e) => setFacilities(p => ({ ...p, signInconspicuous: e.target.checked, signConspicuous: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Inconspicuous</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signConspicuous} onChange={(e) => setFacilities(p => ({ ...p, signConspicuous: e.target.checked, signInconspicuous: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Conspicuous</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.signOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, signOthersChecked: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Others pls specify</label>
          </div>
          {facilities.signOthersChecked && (
            <div className="pt-1">
              <input type="text" value={facilities.signOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'signOthersText', e.target.value)} className="w-full max-w-sm p-1.5 border border-purple-300 rounded bg-white outline-none" placeholder="Specify sign post details..." />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={facilities.signComments} onChange={(e) => handleFieldUpdate(setFacilities, 'signComments', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none outline-none font-semibold" /></div>
            <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={facilities.signRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'signRecs', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none outline-none font-semibold" /></div>
          </div>
        </div>

        {/* ENTRANCE */}
        <div className="space-y-2 py-2 border-b border-gray-100">
          <span className="font-bold text-gray-900 block">Entrance</span>
          <div className="flex gap-4 items-center flex-wrap">
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.entLarge} onChange={(e) => setFacilities(p => ({ ...p, entLarge: e.target.checked, entSmall: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Large</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.entSmall} onChange={(e) => setFacilities(p => ({ ...p, entSmall: e.target.checked, entLarge: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Small</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.entDisability} onChange={(e) => setFacilities(p => ({ ...p, entDisability: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Disability Compliant</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.entOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, entOthersChecked: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Others pls specify</label>
          </div>
          {facilities.entOthersChecked && (
            <div className="pt-1">
              <input type="text" value={facilities.entOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'entOthersText', e.target.value)} className="w-full max-w-sm p-1.5 border border-purple-300 rounded bg-white outline-none" placeholder="Specify entrance details..." />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={facilities.entComments} onChange={(e) => handleFieldUpdate(setFacilities, 'entComments', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none outline-none font-semibold" /></div>
            <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={facilities.entRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'entRecs', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none outline-none font-semibold" /></div>
          </div>
        </div>

        {/* GENERAL OUTLOOK */}
        <div className="space-y-2 py-2 border-b border-gray-100">
          <span className="font-bold text-gray-900 block">General Outlook of the Department</span>
          <div className="flex gap-4 items-center flex-wrap">
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookClean} onChange={(e) => setFacilities(p => ({ ...p, outlookClean: e.target.checked, outlookUnclean: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Clean</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookUnclean} onChange={(e) => setFacilities(p => ({ ...p, outlookUnclean: e.target.checked, outlookClean: false, outlookOrderly: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Unclean</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookOrderly} onChange={(e) => setFacilities(p => ({ ...p, outlookOrderly: e.target.checked, outlookCluttered: false, outlookUnclean: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Orderly</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookCluttered} onChange={(e) => setFacilities(p => ({ ...p, outlookCluttered: e.target.checked, outlookOrderly: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Cluttered</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.outlookOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, outlookOthersChecked: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Others pls specify</label>
          </div>
          {facilities.outlookOthersChecked && (
            <div className="pt-1">
              <input type="text" value={facilities.outlookOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'outlookOthersText', e.target.value)} className="w-full max-w-sm p-1.5 border border-purple-300 rounded bg-white outline-none" placeholder="Specify outlook details..." />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={facilities.outlookComments} onChange={(e) => handleFieldUpdate(setFacilities, 'outlookComments', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none outline-none font-semibold" /></div>
            <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={facilities.outlookRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'outlookRecs', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none outline-none font-semibold" /></div>
          </div>
        </div>

        {/* CLASSROOMS */}
        <div className="space-y-2 py-2 border-b border-gray-100">
          <span className="font-bold text-gray-900 block">Classrooms/Lecture Theatres</span>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-1.5">
              <label className="font-bold text-gray-600">Number of Classrooms:</label>
              <input type="number" min="0" value={facilities.classroomCount} onChange={(e) => handleFieldUpdate(setFacilities, 'classroomCount', e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center font-bold" />
            </div>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.classSmall} onChange={(e) => setFacilities(p => ({ ...p, classSmall: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Small</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.classLarge} onChange={(e) => setFacilities(p => ({ ...p, classLarge: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Large</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.classSpacious} onChange={(e) => setFacilities(p => ({ ...p, classSpacious: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Spacious</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.classOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, classOthersChecked: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Others pls specify</label>
          </div>
          {facilities.classOthersChecked && (
            <div className="pt-1">
              <input type="text" value={facilities.classOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'classOthersText', e.target.value)} className="w-full max-w-sm p-1.5 border border-purple-300 rounded bg-white outline-none" placeholder="Specify classroom details..." />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={facilities.classComments} onChange={(e) => handleFieldUpdate(setFacilities, 'classComments', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none outline-none font-semibold" /></div>
            <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={facilities.classRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'classRecs', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none outline-none font-semibold" /></div>
          </div>
        </div>

        {/* SCIENCE LABS GRID */}
        <div className="space-y-4 pt-2">
          <span className="font-bold text-gray-950 block uppercase tracking-wider text-[10px] flex items-center gap-1"><Layers size={12}/> Academic Laboratory Specifications</span>
          
          {[
            { label: "Gross Anatomy and Embryology Laboratory", prefix: "anatomy", hasCadaver: true },
            { label: "Histology Laboratory", prefix: "histology" },
            { label: "Biochemistry Laboratory", prefix: "biochemistry", isReagent: true },
            { label: "Physiology Laboratory", prefix: "physiology" }
          ].map((lab) => (
            <div key={lab.prefix} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
              <span className="font-bold text-gray-900 block text-xs border-b border-gray-200 pb-1.5">{lab.label}</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-semibold">
                {/* Size */}
                <div className="space-y-1 bg-white p-2 border border-gray-200 rounded-lg">
                  <span className="font-bold text-gray-700 block">Size of Laboratory:</span>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}Small`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}Small`]: e.target.checked, [`${lab.prefix}Large`]: false, [`${lab.prefix}Spacious`]: false, [`${lab.prefix}OthersChecked`]: false }))} className="scale-90" /> Small</label>
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}Large`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}Large`]: e.target.checked, [`${lab.prefix}Small`]: false, [`${lab.prefix}Spacious`]: false, [`${lab.prefix}OthersChecked`]: false }))} className="scale-90" /> Large</label>
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}Spacious`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}Spacious`]: e.target.checked, [`${lab.prefix}Small`]: false, [`${lab.prefix}Large`]: false, [`${lab.prefix}OthersChecked`]: false }))} className="scale-90" /> Spacious</label>
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}OthersChecked`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}OthersChecked`]: e.target.checked, [`${lab.prefix}Small`]: false, [`${lab.prefix}Large`]: false, [`${lab.prefix}Spacious`]: false }))} className="scale-90" /> Others</label>
                  </div>
                  {(facilities as any)[`${lab.prefix}OthersChecked`] && (
                    <input type="text" value={(facilities as any)[`${lab.prefix}OthersText`] || ""} onChange={(e) => handleFieldUpdate(setFacilities, `${lab.prefix}OthersText`, e.target.value)} className="w-full mt-1.5 p-1 border rounded text-[10px] font-semibold bg-white" placeholder="Specify size details..." />
                  )}
                </div>

                {/* Cadavers (gross anatomy only) */}
                {lab.hasCadaver ? (
                  <div className="space-y-1 bg-white p-2 border border-gray-200 rounded-lg">
                    <span className="font-bold text-gray-700 block">Adequacy of Cadavers:</span>
                    <div className="flex flex-wrap gap-2">
                      <label className="flex items-center gap-1"><input type="checkbox" checked={facilities.anatomyCadaversAdequate} onChange={(e) => setFacilities(p => ({ ...p, anatomyCadaversAdequate: e.target.checked, anatomyCadaversInadequate: false }))} className="scale-90" /> Adequate</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={facilities.anatomyCadaversInadequate} onChange={(e) => setFacilities(p => ({ ...p, anatomyCadaversInadequate: e.target.checked, anatomyCadaversAdequate: false }))} className="scale-90" /> Inadequate</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={facilities.anatomyCadaversOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, anatomyCadaversOthersChecked: e.target.checked }))} className="scale-90" /> Others</label>
                    </div>
                    {facilities.anatomyCadaversOthersChecked && (
                      <input type="text" value={facilities.anatomyCadaversOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'anatomyCadaversOthersText', e.target.value)} className="w-full mt-1.5 p-1 border rounded text-[10px] font-semibold bg-white" placeholder="Specify details..." />
                    )}
                  </div>
                ) : (
                  <div className="hidden lg:block"></div>
                )}

                {/* Required Facility */}
                <div className="space-y-1 bg-white p-2 border border-gray-200 rounded-lg">
                  <span className="font-bold text-gray-700 block">Required Facility:</span>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}FacilityAdequate`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}FacilityAdequate`]: e.target.checked, [`${lab.prefix}FacilityInadequate`]: false }))} className="scale-90" /> Adequate</label>
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}FacilityInadequate`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}FacilityInadequate`]: e.target.checked, [`${lab.prefix}FacilityAdequate`]: false }))} className="scale-90" /> Inadequate</label>
                    <label className="flex items-center gap-1"><input type="checkbox" checked={!!(facilities as any)[`${lab.prefix}FacilityOthersChecked`]} onChange={(e) => setFacilities(p => ({ ...p, [`${lab.prefix}FacilityOthersChecked`]: e.target.checked }))} className="scale-90" /> Others</label>
                  </div>
                  {(facilities as any)[`${lab.prefix}FacilityOthersChecked`] && (
                    <input type="text" value={(facilities as any)[`${lab.prefix}FacilityOthersText`] || ""} onChange={(e) => handleFieldUpdate(setFacilities, `${lab.prefix}FacilityOthersText`, e.target.value)} className="w-full mt-1.5 p-1 border rounded text-[10px] font-semibold bg-white" placeholder="Specify facility details..." />
                  )}
                </div>

                {/* Equipment / Reagents */}
                <div className="space-y-1 bg-white p-2 border border-gray-200 rounded-lg">
                  <span className="font-bold text-gray-700 block">{lab.isReagent ? "Adequacy of Reagents:" : "Adequacy of Equipment:"}</span>
                  <div className="flex flex-wrap gap-2">
                    <label className="flex items-center gap-1">
                      <input 
                        type="checkbox" 
                        checked={!!(facilities as any)[lab.isReagent ? "biochemistryReagentsAdequate" : `${lab.prefix}EquipmentAdequate`]} 
                        onChange={(e) => setFacilities(p => ({ ...p, [lab.isReagent ? "biochemistryReagentsAdequate" : `${lab.prefix}EquipmentAdequate`]: e.target.checked, [lab.isReagent ? "biochemistryReagentsInadequate" : `${lab.prefix}EquipmentInadequate`]: false }))} 
                        className="scale-90" 
                      /> Adequate
                    </label>
                    <label className="flex items-center gap-1">
                      <input 
                        type="checkbox" 
                        checked={!!(facilities as any)[lab.isReagent ? "biochemistryReagentsInadequate" : `${lab.prefix}EquipmentInadequate`]} 
                        onChange={(e) => setFacilities(p => ({ ...p, [lab.isReagent ? "biochemistryReagentsInadequate" : `${lab.prefix}EquipmentInadequate`]: e.target.checked, [lab.isReagent ? "biochemistryReagentsAdequate" : `${lab.prefix}EquipmentAdequate`]: false }))} 
                        className="scale-90" 
                      /> Inadequate
                    </label>
                    <label className="flex items-center gap-1">
                      <input 
                        type="checkbox" 
                        checked={!!(facilities as any)[lab.isReagent ? "biochemistryReagentsOthersChecked" : `${lab.prefix}EquipmentOthersChecked`]} 
                        onChange={(e) => setFacilities(p => ({ ...p, [lab.isReagent ? "biochemistryReagentsOthersChecked" : `${lab.prefix}EquipmentOthersChecked`]: e.target.checked }))} 
                        className="scale-90" 
                      /> Others
                    </label>
                  </div>
                  {(facilities as any)[lab.isReagent ? "biochemistryReagentsOthersChecked" : `${lab.prefix}EquipmentOthersChecked`] && (
                    <input 
                      type="text" 
                      value={(facilities as any)[lab.isReagent ? "biochemistryReagentsOthersText" : `${lab.prefix}EquipmentOthersText`] || ""} 
                      onChange={(e) => handleFieldUpdate(setFacilities, lab.isReagent ? "biochemistryReagentsOthersText" : `${lab.prefix}EquipmentOthersText`, e.target.value)} 
                      className="w-full mt-1.5 p-1 border rounded text-[10px] font-semibold bg-white" 
                      placeholder={lab.isReagent ? "Specify reagents details..." : "Specify equipment details..."} 
                    />
                  )}
                </div>
              </div>

              {/* Lab comments and recommendations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-200/60">
                <div>
                  <label className="font-bold text-gray-500 block">Comments</label>
                  <textarea 
                    value={(facilities as any)[`${lab.prefix}Comments`] || ""} 
                    onChange={(e) => handleFieldUpdate(setFacilities, `${lab.prefix}Comments`, e.target.value)} 
                    className="w-full mt-1 p-1 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" 
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 block">Recommendations</label>
                  <textarea 
                    value={(facilities as any)[`${lab.prefix}Recs`] || ""} 
                    onChange={(e) => handleFieldUpdate(setFacilities, `${lab.prefix}Recs`, e.target.value)} 
                    className="w-full mt-1 p-1 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* GYMNASIUM */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
          <span className="font-bold text-gray-950 block uppercase tracking-wider text-[10px]">Gymnasium Specifications</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-semibold">
            {/* Adult & Paediatric Gym Availability */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Adult Gym:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymAd" checked={facilities.gymAdultAvailable === 'Available'} onChange={() => handleFieldUpdate(setFacilities, 'gymAdultAvailable', 'Available')} /> Available</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymAd" checked={facilities.gymAdultAvailable === 'Unavailable'} onChange={() => handleFieldUpdate(setFacilities, 'gymAdultAvailable', 'Unavailable')} /> Unavailable</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Paediatric Gym:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymPaed" checked={facilities.gymPaediatricAvailable === 'Available'} onChange={() => handleFieldUpdate(setFacilities, 'gymPaediatricAvailable', 'Available')} /> Available</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymPaed" checked={facilities.gymPaediatricAvailable === 'Unavailable'} onChange={() => handleFieldUpdate(setFacilities, 'gymPaediatricAvailable', 'Unavailable')} /> Unavailable</label>
              </div>
            </div>

            {/* Size */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Gymnasium Size:</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1"><input type="radio" name="gymSz" checked={facilities.gymSize === 'Small'} onChange={() => handleFieldUpdate(setFacilities, 'gymSize', 'Small')} /> Small</label>
                <label className="flex items-center gap-1"><input type="radio" name="gymSz" checked={facilities.gymSize === 'Large'} onChange={() => handleFieldUpdate(setFacilities, 'gymSize', 'Large')} /> Large</label>
                <label className="flex items-center gap-1"><input type="radio" name="gymSz" checked={facilities.gymSize === 'Crowded'} onChange={() => handleFieldUpdate(setFacilities, 'gymSize', 'Crowded')} /> Crowded</label>
                <label className="flex items-center gap-1"><input type="radio" name="gymSz" checked={facilities.gymSize === 'Spacious'} onChange={() => handleFieldUpdate(setFacilities, 'gymSize', 'Spacious')} /> Spacious</label>
              </div>
            </div>

            {/* Floor Structure */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Floor Structure:</span>
              <select value={facilities.gymFloorStructure} onChange={(e) => handleFieldUpdate(setFacilities, 'gymFloorStructure', e.target.value)} className="w-full p-1 border rounded bg-white text-xs outline-none">
                <option value="">Select Floor Structure</option>
                <option value="Wooden">Wooden</option>
                <option value="Tiled">Tiled</option>
                <option value="Rugged">Rugged</option>
                <option value="Concrete">Concrete</option>
                <option value="Synthetic">Synthetic</option>
              </select>
            </div>

            {/* Accessibility */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Accessibility:</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1"><input type="radio" name="gymAcc" checked={facilities.gymAccessibility === 'Large'} onChange={() => handleFieldUpdate(setFacilities, 'gymAccessibility', 'Large')} /> Large</label>
                <label className="flex items-center gap-1"><input type="radio" name="gymAcc" checked={facilities.gymAccessibility === 'Small'} onChange={() => handleFieldUpdate(setFacilities, 'gymAccessibility', 'Small')} /> Small</label>
                <label className="flex items-center gap-1"><input type="radio" name="gymAcc" checked={facilities.gymAccessibility === 'Disability Compliant'} onChange={() => handleFieldUpdate(setFacilities, 'gymAccessibility', 'Disability Compliant')} /> Disability Compliant</label>
              </div>
            </div>

            {/* Equipment Adequacy */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Equipment Adequacy:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymEq" checked={facilities.gymEquipment === 'Adequate'} onChange={() => handleFieldUpdate(setFacilities, 'gymEquipment', 'Adequate')} /> Adequate</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymEq" checked={facilities.gymEquipment === 'Inadequate'} onChange={() => handleFieldUpdate(setFacilities, 'gymEquipment', 'Inadequate')} /> Inadequate</label>
              </div>
            </div>

            {/* Screens Adequacy */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Screens Adequacy:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymSc" checked={facilities.gymScreens === 'Adequate'} onChange={() => handleFieldUpdate(setFacilities, 'gymScreens', 'Adequate')} /> Adequate</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymSc" checked={facilities.gymScreens === 'Inadequate'} onChange={() => handleFieldUpdate(setFacilities, 'gymScreens', 'Inadequate')} /> Inadequate</label>
              </div>
            </div>

            {/* Ventilation */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Ventilation:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymV" checked={facilities.gymVentilation === 'Good'} onChange={() => handleFieldUpdate(setFacilities, 'gymVentilation', 'Good')} /> Good</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymV" checked={facilities.gymVentilation === 'Fair'} onChange={() => handleFieldUpdate(setFacilities, 'gymVentilation', 'Fair')} /> Fair</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymV" checked={facilities.gymVentilation === 'Poor'} onChange={() => handleFieldUpdate(setFacilities, 'gymVentilation', 'Poor')} /> Poor</label>
              </div>
            </div>

            {/* Illumination */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Illumination:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymI" checked={facilities.gymIllumination === 'Good'} onChange={() => handleFieldUpdate(setFacilities, 'gymIllumination', 'Good')} /> Good</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymI" checked={facilities.gymIllumination === 'Fair'} onChange={() => handleFieldUpdate(setFacilities, 'gymIllumination', 'Fair')} /> Fair</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="gymI" checked={facilities.gymIllumination === 'Poor'} onChange={() => handleFieldUpdate(setFacilities, 'gymIllumination', 'Poor')} /> Poor</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-200/60">
            <div>
              <label className="font-bold text-gray-500 block">Gymnasium Comments</label>
              <textarea value={facilities.gymComments} onChange={(e) => handleFieldUpdate(setFacilities, 'gymComments', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" />
            </div>
            <div>
              <label className="font-bold text-gray-500 block">Gymnasium Recommendations</label>
              <textarea value={facilities.gymRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'gymRecs', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" />
            </div>
          </div>
        </div>

        {/* HYDROTHERAPY POOL */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
          <span className="font-bold text-gray-950 block uppercase tracking-wider text-[10px]">Hydrotherapy Pool</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-semibold">
            {/* Availability */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Pool Status:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolAv" checked={facilities.poolAvailable === 'Available'} onChange={() => handleFieldUpdate(setFacilities, 'poolAvailable', 'Available')} /> Available</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolAv" checked={facilities.poolAvailable === 'Not Available'} onChange={() => handleFieldUpdate(setFacilities, 'poolAvailable', 'Not Available')} /> Not Available</label>
              </div>
            </div>

            {/* Size */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Pool Size:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolSz" checked={facilities.poolSize === 'Small'} onChange={() => handleFieldUpdate(setFacilities, 'poolSize', 'Small')} /> Small</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolSz" checked={facilities.poolSize === 'Medium'} onChange={() => handleFieldUpdate(setFacilities, 'poolSize', 'Medium')} /> Medium</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolSz" checked={facilities.poolSize === 'Large'} onChange={() => handleFieldUpdate(setFacilities, 'poolSize', 'Large')} /> Large</label>
              </div>
            </div>

            {/* Floor Structure */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Floor Structure:</span>
              <select value={facilities.poolFloorStructure} onChange={(e) => handleFieldUpdate(setFacilities, 'poolFloorStructure', e.target.value)} className="w-full p-1 border rounded bg-white text-xs outline-none">
                <option value="">Select Floor Structure</option>
                <option value="Wooden">Wooden</option>
                <option value="Tiled">Tiled</option>
                <option value="Rugged">Rugged</option>
                <option value="Concrete">Concrete</option>
                <option value="Synthetic">Synthetic</option>
              </select>
            </div>

            {/* Life Jackets */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Life Jackets:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolLf" checked={facilities.poolLifeJackets === 'Available'} onChange={() => handleFieldUpdate(setFacilities, 'poolLifeJackets', 'Available')} /> Available</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolLf" checked={facilities.poolLifeJackets === 'Not Available'} onChange={() => handleFieldUpdate(setFacilities, 'poolLifeJackets', 'Not Available')} /> Not Available</label>
              </div>
            </div>

            {/* Equipment Adequacy */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Equipment:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolEq" checked={facilities.poolEquipment === 'Adequate'} onChange={() => handleFieldUpdate(setFacilities, 'poolEquipment', 'Adequate')} /> Adequate</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolEq" checked={facilities.poolEquipment === 'Inadequate'} onChange={() => handleFieldUpdate(setFacilities, 'poolEquipment', 'Inadequate')} /> Inadequate</label>
              </div>
            </div>

            {/* Maintenance */}
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-700 block">Maintenance:</span>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolMn" checked={facilities.poolMaintenance === 'Good'} onChange={() => handleFieldUpdate(setFacilities, 'poolMaintenance', 'Good')} /> Good</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolMn" checked={facilities.poolMaintenance === 'Fair'} onChange={() => handleFieldUpdate(setFacilities, 'poolMaintenance', 'Fair')} /> Fair</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="poolMn" checked={facilities.poolMaintenance === 'Poor'} onChange={() => handleFieldUpdate(setFacilities, 'poolMaintenance', 'Poor')} /> Poor</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-200/60">
            <div>
              <label className="font-bold text-gray-500 block">Pool Comments</label>
              <textarea value={facilities.poolComments} onChange={(e) => handleFieldUpdate(setFacilities, 'poolComments', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" />
            </div>
            <div>
              <label className="font-bold text-gray-500 block">Pool Recommendations</label>
              <textarea value={facilities.poolRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'poolRecs', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" />
            </div>
          </div>
        </div>

        {/* PRACTICAL DEMONSTRATION ROOMS */}
        <div className="p-4 bg-[#F5F8F2] border border-[#CDE1B4] rounded-xl space-y-4">
          <span className="font-bold text-gray-950 block uppercase tracking-wider text-[10px]">Practical Demonstration Rooms</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-semibold text-gray-700">
            {/* General Demo Room */}
            <div className="bg-white p-3 border border-gray-200 rounded-lg space-y-3">
              <span className="font-bold text-gray-900 block">General Practical Demonstration Rooms</span>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Size/Layout:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoSmall} onChange={(e) => setFacilities(p => ({ ...p, demoSmall: e.target.checked, demoLarge: false, demoCrowded: false, demoSpacious: false }))} className="rounded" /> Small</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoLarge} onChange={(e) => setFacilities(p => ({ ...p, demoLarge: e.target.checked, demoSmall: false, demoCrowded: false, demoSpacious: false }))} className="rounded" /> Large</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoCrowded} onChange={(e) => setFacilities(p => ({ ...p, demoCrowded: e.target.checked, demoSmall: false, demoLarge: false, demoSpacious: false }))} className="rounded" /> Crowded</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoSpacious} onChange={(e) => setFacilities(p => ({ ...p, demoSpacious: e.target.checked, demoSmall: false, demoLarge: false, demoCrowded: false }))} className="rounded" /> Spacious</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Accessibility:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoAccessLarge} onChange={(e) => setFacilities(p => ({ ...p, demoAccessLarge: e.target.checked, demoAccessSmall: false }))} className="rounded" /> Large</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoAccessSmall} onChange={(e) => setFacilities(p => ({ ...p, demoAccessSmall: e.target.checked, demoAccessLarge: false }))} className="rounded" /> Small</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoAccessDisability} onChange={(e) => setFacilities(p => ({ ...p, demoAccessDisability: e.target.checked }))} className="rounded" /> Disability Compliant</label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Equipment:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoEquipAdequate} onChange={(e) => setFacilities(p => ({ ...p, demoEquipAdequate: e.target.checked, demoEquipInadequate: false }))} className="rounded" /> Adequate</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoEquipInadequate} onChange={(e) => setFacilities(p => ({ ...p, demoEquipInadequate: e.target.checked, demoEquipAdequate: false }))} className="rounded" /> Inadequate</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Screens:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoScreensAdequate} onChange={(e) => setFacilities(p => ({ ...p, demoScreensAdequate: e.target.checked, demoScreensInadequate: false }))} className="rounded" /> Adequate</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoScreensInadequate} onChange={(e) => setFacilities(p => ({ ...p, demoScreensInadequate: e.target.checked, demoScreensAdequate: false }))} className="rounded" /> Inadequate</label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Ventilation:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoVentGood} onChange={(e) => setFacilities(p => ({ ...p, demoVentGood: e.target.checked, demoVentFair: false, demoVentPoor: false }))} className="rounded" /> Good</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoVentFair} onChange={(e) => setFacilities(p => ({ ...p, demoVentFair: e.target.checked, demoVentGood: false, demoVentPoor: false }))} className="rounded" /> Fair</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoVentPoor} onChange={(e) => setFacilities(p => ({ ...p, demoVentPoor: e.target.checked, demoVentGood: false, demoVentFair: false }))} className="rounded" /> Poor</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Illumination:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoIllumGood} onChange={(e) => setFacilities(p => ({ ...p, demoIllumGood: e.target.checked, demoIllumFair: false, demoIllumPoor: false }))} className="rounded" /> Good</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoIllumFair} onChange={(e) => setFacilities(p => ({ ...p, demoIllumFair: e.target.checked, demoIllumGood: false, demoIllumPoor: false }))} className="rounded" /> Fair</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.demoIllumPoor} onChange={(e) => setFacilities(p => ({ ...p, demoIllumPoor: e.target.checked, demoIllumGood: false, demoIllumFair: false }))} className="rounded" /> Poor</label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-gray-100 font-bold text-gray-500">
                <div><label className="block text-[10px]">Comments</label><textarea value={facilities.demoComments} onChange={(e) => handleFieldUpdate(setFacilities, 'demoComments', e.target.value)} className="w-full mt-0.5 p-1 border border-gray-300 rounded h-10 resize-none outline-none text-[11px] font-semibold text-gray-900" /></div>
                <div><label className="block text-[10px]">Recommendations</label><textarea value={facilities.demoRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'demoRecs', e.target.value)} className="w-full mt-0.5 p-1 border border-gray-300 rounded h-10 resize-none outline-none text-[11px] font-semibold text-gray-900" /></div>
              </div>
            </div>

            {/* Specialized Demo Room */}
            <div className="bg-white p-3 border border-gray-200 rounded-lg space-y-3">
              <span className="font-bold text-gray-900 block">Specialized Practical Demonstration Rooms</span>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Availability of screens:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specScreensAvailable} onChange={(e) => setFacilities(p => ({ ...p, specScreensAvailable: e.target.checked, specializedScreensNotAvailable: false }))} className="rounded" /> Available</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specializedScreensNotAvailable} onChange={(e) => setFacilities(p => ({ ...p, specializedScreensNotAvailable: e.target.checked, specScreensAvailable: false }))} className="rounded" /> Not Available</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Size/Layout:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specSmall} onChange={(e) => setFacilities(p => ({ ...p, specSmall: e.target.checked, specLarge: false, specSpacious: false, specOthersChecked: false }))} className="rounded" /> Small</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specLarge} onChange={(e) => setFacilities(p => ({ ...p, specLarge: e.target.checked, specSmall: false, specSpacious: false, specOthersChecked: false }))} className="rounded" /> Large</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specSpacious} onChange={(e) => setFacilities(p => ({ ...p, specSpacious: e.target.checked, specSmall: false, specLarge: false, specOthersChecked: false }))} className="rounded" /> Spacious</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, specOthersChecked: e.target.checked, specSmall: false, specLarge: false, specSpacious: false }))} className="rounded" /> Others</label>
                  </div>
                </div>
              </div>
              
              {facilities.specOthersChecked && (
                <div className="pt-1">
                  <input type="text" value={facilities.specOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'specOthersText', e.target.value)} className="w-full p-1.5 border border-purple-300 rounded bg-white outline-none text-[10px]" placeholder="Specify details..." />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Ventilation:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specVentGood} onChange={(e) => setFacilities(p => ({ ...p, specVentGood: e.target.checked, specVentFair: false, specVentPoor: false }))} className="rounded" /> Good</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specVentFair} onChange={(e) => setFacilities(p => ({ ...p, specVentFair: e.target.checked, specVentGood: false, specVentPoor: false }))} className="rounded" /> Fair</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specVentPoor} onChange={(e) => setFacilities(p => ({ ...p, specVentPoor: e.target.checked, specVentGood: false, specVentFair: false }))} className="rounded" /> Poor</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-600 block">Illumination:</span>
                  <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specIllumGood} onChange={(e) => setFacilities(p => ({ ...p, specIllumGood: e.target.checked, specIllumFair: false, specIllumPoor: false }))} className="rounded" /> Good</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specIllumFair} onChange={(e) => setFacilities(p => ({ ...p, specIllumFair: e.target.checked, specIllumGood: false, specIllumPoor: false }))} className="rounded" /> Fair</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.specIllumPoor} onChange={(e) => setFacilities(p => ({ ...p, specIllumPoor: e.target.checked, specIllumGood: false, specIllumFair: false }))} className="rounded" /> Poor</label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-gray-100 font-bold text-gray-500">
                <div><label className="block text-[10px]">Comments</label><textarea value={facilities.specComments} onChange={(e) => handleFieldUpdate(setFacilities, 'specComments', e.target.value)} className="w-full mt-0.5 p-1 border border-gray-300 rounded h-10 resize-none outline-none text-[11px] font-semibold text-gray-900" /></div>
                <div><label className="block text-[10px]">Recommendations</label><textarea value={facilities.specRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'specRecs', e.target.value)} className="w-full mt-0.5 p-1 border border-gray-300 rounded h-10 resize-none outline-none text-[11px] font-semibold text-gray-900" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* HEAD OF DEPARTMENT OFFICE */}
        <div className="p-4 border border-gray-200 rounded-xl space-y-4 bg-gray-50/50">
          <span className="font-bold text-gray-900 block">Head of Department's Office</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700 text-xs">
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1.5">
              <span className="font-bold text-gray-600 block">Size/Layout:</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodSmall} onChange={(e) => setFacilities(p => ({ ...p, hodSmall: e.target.checked }))} className="rounded" /> Small</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodLarge} onChange={(e) => setFacilities(p => ({ ...p, hodLarge: e.target.checked }))} className="rounded" /> Large</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodOvercrowded} onChange={(e) => setFacilities(p => ({ ...p, hodOvercrowded: e.target.checked }))} className="rounded" /> Overcrowded</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodSpacious} onChange={(e) => setFacilities(p => ({ ...p, hodSpacious: e.target.checked }))} className="rounded" /> Spacious</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, hodOthersChecked: e.target.checked }))} className="rounded" /> Others</label>
              </div>
              {facilities.hodOthersChecked && (
                <input type="text" value={facilities.hodOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'hodOthersText', e.target.value)} className="w-full mt-1 p-1 border rounded text-[10px] bg-white font-semibold" placeholder="Specify size details..." />
              )}
            </div>

            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1.5">
              <span className="font-bold text-gray-600 block">Secretariat Office:</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodSecretariatAttached} onChange={(e) => setFacilities(p => ({ ...p, hodSecretariatAttached: e.target.checked, hodSecretariatNotAttached: false }))} className="rounded" /> Attached</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodSecretariatNotAttached} onChange={(e) => setFacilities(p => ({ ...p, hodSecretariatNotAttached: e.target.checked, hodSecretariatAttached: false }))} className="rounded" /> Not Attached</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1.5">
              <span className="font-bold text-gray-600 block">Convenience:</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodConvenienceAttached} onChange={(e) => setFacilities(p => ({ ...p, hodConvenienceAttached: e.target.checked, hodConvenienceNotAttached: false }))} className="rounded" /> Attached</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodConvenienceNotAttached} onChange={(e) => setFacilities(p => ({ ...p, hodConvenienceNotAttached: e.target.checked, hodConvenienceAttached: false }))} className="rounded" /> Not Attached</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1.5">
              <span className="font-bold text-gray-600 block">Furnishings:</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodFurnishingsAdequate} onChange={(e) => setFacilities(p => ({ ...p, hodFurnishingsAdequate: e.target.checked, hodFurnishingsInadequate: false }))} className="rounded" /> Adequate</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodFurnishingsInadequate} onChange={(e) => setFacilities(p => ({ ...p, hodFurnishingsInadequate: e.target.checked, hodFurnishingsAdequate: false }))} className="rounded" /> Inadequate</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1.5">
              <span className="font-bold text-gray-600 block">Ventilation:</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodVentGood} onChange={(e) => setFacilities(p => ({ ...p, hodVentGood: e.target.checked, hodVentFair: false, hodVentPoor: false }))} className="rounded" /> Good</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodVentFair} onChange={(e) => setFacilities(p => ({ ...p, hodVentFair: e.target.checked, hodVentGood: false, hodVentPoor: false }))} className="rounded" /> Fair</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodVentPoor} onChange={(e) => setFacilities(p => ({ ...p, hodVentPoor: e.target.checked, hodVentGood: false, hodVentFair: false }))} className="rounded" /> Poor</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1.5">
              <span className="font-bold text-gray-600 block">Illumination:</span>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodIllumGood} onChange={(e) => setFacilities(p => ({ ...p, hodIllumGood: e.target.checked, hodIllumFair: false, hodIllumPoor: false }))} className="rounded" /> Good</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodIllumFair} onChange={(e) => setFacilities(p => ({ ...p, hodIllumFair: e.target.checked, hodIllumGood: false, hodIllumPoor: false }))} className="rounded" /> Fair</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.hodIllumPoor} onChange={(e) => setFacilities(p => ({ ...p, hodIllumPoor: e.target.checked, hodIllumGood: false, hodIllumFair: false }))} className="rounded" /> Poor</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-200">
            <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={facilities.hodComments} onChange={(e) => handleFieldUpdate(setFacilities, 'hodComments', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
            <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={facilities.hodRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'hodRecs', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
          </div>
        </div>

        {/* STAFF OFFICE COUNTS */}
        <div className="p-4 border border-gray-200 bg-gray-50/30 rounded-xl space-y-4">
          <span className="font-bold text-gray-900 block text-xs border-b border-gray-200 pb-1.5">Other Offices</span>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-semibold text-gray-700 text-xs">
            <div><label className="text-gray-600 block">Professors</label><input type="number" min="0" value={facilities.officesProfessors} onChange={(e) => handleFieldUpdate(setFacilities, 'officesProfessors', e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center bg-white font-bold" /></div>
            <div><label className="text-gray-600 block">Associate Profs</label><input type="number" min="0" value={facilities.officesAssociate} onChange={(e) => handleFieldUpdate(setFacilities, 'officesAssociate', e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center bg-white font-bold" /></div>
            <div><label className="text-gray-600 block">Senior Lecturers</label><input type="number" min="0" value={facilities.officesSenior} onChange={(e) => handleFieldUpdate(setFacilities, 'officesSenior', e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center bg-white font-bold" /></div>
            <div><label className="text-gray-600 block">Lecturers I</label><input type="number" min="0" value={facilities.officesLecturersI} onChange={(e) => handleFieldUpdate(setFacilities, 'officesLecturersI', e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center bg-white font-bold" /></div>
            <div><label className="text-gray-600 block">Lecturers II</label><input type="number" min="0" value={facilities.officesLecturersII} onChange={(e) => handleFieldUpdate(setFacilities, 'officesLecturersII', e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center bg-white font-bold" /></div>
            <div><label className="text-gray-600 block">Asst Lecturers</label><input type="number" min="0" value={facilities.officesAssistant} onChange={(e) => handleFieldUpdate(setFacilities, 'officesAssistant', e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center bg-white font-bold" /></div>
            <div><label className="text-gray-600 block">Clinical Instructors</label><input type="number" min="0" value={facilities.officesClinical} onChange={(e) => handleFieldUpdate(setFacilities, 'officesClinical', e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center bg-white font-bold" /></div>
            <div><label className="text-gray-600 block">Supportive Staff</label><input type="number" min="0" value={facilities.officesSupport} onChange={(e) => handleFieldUpdate(setFacilities, 'officesSupport', e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center bg-white font-bold" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-semibold text-gray-700 text-xs border-t border-gray-200 pt-3">
            <div>
              <label className="text-gray-600 block mb-1">Total Offices:</label>
              <input type="number" min="0" value={facilities.officesTotal} onChange={(e) => handleFieldUpdate(setFacilities, 'officesTotal', e.target.value)} className="w-20 p-1 border border-gray-300 rounded text-center bg-white font-bold" />
            </div>
            <div>
              <label className="text-gray-600 block mb-1">Academic Offices:</label>
              <input type="number" min="0" value={facilities.officesAcademic} onChange={(e) => handleFieldUpdate(setFacilities, 'officesAcademic', e.target.value)} className="w-20 p-1 border border-gray-300 rounded text-center bg-white font-bold" />
            </div>
            <div>
              <label className="text-gray-600 block mb-1">Non-Academic Offices:</label>
              <input type="number" min="0" value={facilities.officesNonAcademic} onChange={(e) => handleFieldUpdate(setFacilities, 'officesNonAcademic', e.target.value)} className="w-20 p-1 border border-gray-300 rounded text-center bg-white font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-semibold text-gray-700 text-xs border-t border-gray-200 pt-3">
            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-600 block">Furnishing:</span>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesFurnishingAdequate} onChange={(e) => setFacilities(p => ({ ...p, officesFurnishingAdequate: e.target.checked, officesFurnishingInadequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Adequate</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesFurnishingInadequate} onChange={(e) => setFacilities(p => ({ ...p, officesFurnishingInadequate: e.target.checked, officesFurnishingAdequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Inadequate</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-600 block">Size/Layout:</span>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesLarge} onChange={(e) => setFacilities(p => ({ ...p, officesLarge: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Large</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesSmall} onChange={(e) => setFacilities(p => ({ ...p, officesSmall: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Small</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesSpacious} onChange={(e) => setFacilities(p => ({ ...p, officesSpacious: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Spacious</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesOvercrowded} onChange={(e) => setFacilities(p => ({ ...p, officesOvercrowded: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Overcrowded</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-600 block">Ventilation:</span>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesVentGood} onChange={(e) => setFacilities(p => ({ ...p, officesVentGood: e.target.checked, officesVentFair: false, officesVentPoor: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Good</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesVentFair} onChange={(e) => setFacilities(p => ({ ...p, officesVentFair: e.target.checked, officesVentGood: false, officesVentPoor: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Fair</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesVentPoor} onChange={(e) => setFacilities(p => ({ ...p, officesVentPoor: e.target.checked, officesVentGood: false, officesVentFair: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Poor</label>
              </div>
            </div>

            <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1">
              <span className="font-bold text-gray-600 block">Illumination:</span>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesIllumGood} onChange={(e) => setFacilities(p => ({ ...p, officesIllumGood: e.target.checked, officesIllumFair: false, officesIllumPoor: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Good</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesIllumFair} onChange={(e) => setFacilities(p => ({ ...p, officesIllumFair: e.target.checked, officesIllumGood: false, officesIllumPoor: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Fair</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.officesIllumPoor} onChange={(e) => setFacilities(p => ({ ...p, officesIllumPoor: e.target.checked, officesIllumGood: false, officesIllumFair: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Poor</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-200">
            <div><label className="font-bold text-gray-500 block text-xs">Comments</label><textarea value={facilities.officesComments} onChange={(e) => handleFieldUpdate(setFacilities, 'officesComments', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
            <div><label className="font-bold text-gray-500 block text-xs">Recommendations</label><textarea value={facilities.officesRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'officesRecs', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
          </div>
        </div>

        {/* CONVENIENCES & SEMINAR ROOMS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-3">
          {/* TOILETS/CONVENIENCES */}
          <div className="bg-white p-3 border border-gray-200 rounded-lg space-y-3 font-semibold text-gray-700">
            <span className="font-bold text-gray-950 block">Toilets/Conveniences</span>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 bg-gray-50/50 p-2 border border-gray-100 rounded">
                <span className="font-bold text-gray-600 block">Staff Toilets:</span>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStaffAdequate} onChange={(e) => setFacilities(p => ({ ...p, toiletsStaffAdequate: e.target.checked, toiletsStaffInadequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Adequate</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStaffInadequate} onChange={(e) => setFacilities(p => ({ ...p, toiletsStaffInadequate: e.target.checked, toiletsStaffAdequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Inadequate</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStaffClean} onChange={(e) => setFacilities(p => ({ ...p, toiletsStaffClean: e.target.checked, toiletsStaffUnclean: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Clean</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStaffUnclean} onChange={(e) => setFacilities(p => ({ ...p, toiletsStaffUnclean: e.target.checked, toiletsStaffClean: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Unclean</label>
                </div>
              </div>

              <div className="space-y-1 bg-gray-50/50 p-2 border border-gray-100 rounded">
                <span className="font-bold text-gray-600 block">Student Toilets:</span>
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStudentAdequate} onChange={(e) => setFacilities(p => ({ ...p, toiletsStudentAdequate: e.target.checked, toiletsStudentInadequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Adequate</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStudentInadequate} onChange={(e) => setFacilities(p => ({ ...p, toiletsStudentInadequate: e.target.checked, toiletsStudentAdequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Inadequate</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStudentClean} onChange={(e) => setFacilities(p => ({ ...p, toiletsStudentClean: e.target.checked, toiletsStudentUnclean: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Clean</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.toiletsStudentUnclean} onChange={(e) => setFacilities(p => ({ ...p, toiletsStudentUnclean: e.target.checked, toiletsStudentClean: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Unclean</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-gray-100 font-bold text-gray-500">
              <div><label className="block text-[10px]">Comments</label><textarea value={facilities.toiletsComments} onChange={(e) => handleFieldUpdate(setFacilities, 'toiletsComments', e.target.value)} className="w-full mt-0.5 p-1 border border-gray-300 rounded h-10 resize-none outline-none text-[11px] font-semibold text-gray-900" /></div>
              <div><label className="block text-[10px]">Recommendations</label><textarea value={facilities.toiletsRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'toiletsRecs', e.target.value)} className="w-full mt-0.5 p-1 border border-gray-300 rounded h-10 resize-none outline-none text-[11px] font-semibold text-gray-900" /></div>
            </div>
          </div>

          {/* SEMINAR ROOMS */}
          <div className="bg-white p-3 border border-gray-200 rounded-lg space-y-3 font-semibold text-gray-700">
            <span className="font-bold text-gray-950 block">Seminar Rooms</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 bg-gray-50/50 p-2 border border-gray-100 rounded">
                <span className="font-bold text-gray-600 block">Availability & Layout:</span>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarAvailable} onChange={(e) => setFacilities(p => ({ ...p, seminarAvailable: e.target.checked, seminarNotAvailable: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Available</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarNotAvailable} onChange={(e) => setFacilities(p => ({ ...p, seminarNotAvailable: e.target.checked, seminarAvailable: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Not Available</label>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarSmall} onChange={(e) => setFacilities(p => ({ ...p, seminarSmall: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Small</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarLarge} onChange={(e) => setFacilities(p => ({ ...p, seminarLarge: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Large</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarOvercrowded} onChange={(e) => setFacilities(p => ({ ...p, seminarOvercrowded: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Overcrowded</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarSpacious} onChange={(e) => setFacilities(p => ({ ...p, seminarSpacious: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Spacious</label>
                  </div>
                </div>
              </div>

              <div className="space-y-1 bg-gray-50/50 p-2 border border-gray-100 rounded">
                <span className="font-bold text-gray-600 block">Furnishings & Teaching Aids:</span>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarFurnishingsAdequate} onChange={(e) => setFacilities(p => ({ ...p, seminarFurnishingsAdequate: e.target.checked, seminarFurnishingsInadequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Furnishings Adeq</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarFurnishingsInadequate} onChange={(e) => setFacilities(p => ({ ...p, seminarFurnishingsInadequate: e.target.checked, seminarFurnishingsAdequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Inadeq</label>
                  </div>
                  <div className="flex gap-2 pt-1 border-t border-gray-200/40">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarAidsAvailable} onChange={(e) => setFacilities(p => ({ ...p, seminarAidsAvailable: e.target.checked, seminarAidsNotAvailable: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Teaching Aids Available</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarAidsNotAvailable} onChange={(e) => setFacilities(p => ({ ...p, seminarAidsNotAvailable: e.target.checked, seminarAidsAvailable: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Not Available</label>
                  </div>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarAidsAdequate} onChange={(e) => setFacilities(p => ({ ...p, seminarAidsAdequate: e.target.checked, seminarAidsInadequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Aids Adequate</label>
                    <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarAidsInadequate} onChange={(e) => setFacilities(p => ({ ...p, seminarAidsInadequate: e.target.checked, seminarAidsAdequate: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Inadequate</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-gray-100">
              <div className="space-y-1">
                <span className="font-bold text-gray-600 block">Ventilation:</span>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarVentGood} onChange={(e) => setFacilities(p => ({ ...p, seminarVentGood: e.target.checked, seminarVentFair: false, seminarVentPoor: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Good</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarVentFair} onChange={(e) => setFacilities(p => ({ ...p, seminarVentFair: e.target.checked, seminarVentGood: false, seminarVentPoor: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Fair</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarVentPoor} onChange={(e) => setFacilities(p => ({ ...p, seminarVentPoor: e.target.checked, seminarVentGood: false, seminarVentFair: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Poor</label>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-gray-600 block">Illumination:</span>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarIllumGood} onChange={(e) => setFacilities(p => ({ ...p, seminarIllumGood: e.target.checked, seminarIllumFair: false, seminarIllumPoor: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Good</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarIllumFair} onChange={(e) => setFacilities(p => ({ ...p, seminarIllumFair: e.target.checked, seminarIllumGood: false, seminarIllumPoor: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Fair</label>
                  <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.seminarIllumPoor} onChange={(e) => setFacilities(p => ({ ...p, seminarIllumPoor: e.target.checked, seminarIllumGood: false, seminarIllumFair: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Poor</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-gray-100 font-bold text-gray-500">
              <div><label className="block text-[10px]">Comments</label><textarea value={facilities.seminarComments} onChange={(e) => handleFieldUpdate(setFacilities, 'seminarComments', e.target.value)} className="w-full mt-0.5 p-1 border border-gray-300 rounded h-10 resize-none outline-none text-[11px] font-semibold text-gray-900" /></div>
              <div><label className="block text-[10px]">Recommendations</label><textarea value={facilities.seminarRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'seminarRecs', e.target.value)} className="w-full mt-0.5 p-1 border border-gray-300 rounded h-10 resize-none outline-none text-[11px] font-semibold text-gray-900" /></div>
            </div>
          </div>
        </div>

        {/* INSTITUTIONAL LIBRARY */}
        <div className="border-t border-gray-100 pt-3 space-y-4">
          <span className="font-bold text-gray-950 block uppercase tracking-wide text-[10px]">v). Institutional / Departmental / Hospital Library</span>
          
          <div className="flex gap-4 items-center flex-wrap font-semibold">
            <span className="font-bold text-gray-700">Availability:</span>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.libAvailable} onChange={(e) => setFacilities(p => ({ ...p, libAvailable: e.target.checked, libNotAvailable: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Available</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.libNotAvailable} onChange={(e) => setFacilities(p => ({ ...p, libNotAvailable: e.target.checked, libAvailable: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Not Available</label>
            <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.libOthersChecked} onChange={(e) => setFacilities(p => ({ ...p, libOthersChecked: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Others pls specify</label>
          </div>
          {facilities.libOthersChecked && (
            <div className="pt-1">
              <input type="text" value={facilities.libOthersText} onChange={(e) => handleFieldUpdate(setFacilities, 'libOthersText', e.target.value)} className="w-full max-w-sm p-1.5 border border-purple-300 rounded bg-white outline-none" placeholder="Specify library details..." />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className="text-gray-600 block font-bold text-[10px]">Sitting Capacity</label><input type="text" value={facilities.libSittingCapacity} onChange={(e) => handleFieldUpdate(setFacilities, 'libSittingCapacity', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-semibold text-center" /></div>
            <div><label className="text-gray-600 block font-bold text-[10px]">Number of Textbooks</label><input type="number" min="0" value={facilities.libTextbooks} onChange={(e) => handleFieldUpdate(setFacilities, 'libTextbooks', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-bold text-center" /></div>
            <div><label className="text-gray-600 block font-bold text-[10px]">Offline Books</label><input type="number" min="0" value={facilities.libOfflineBooks} onChange={(e) => handleFieldUpdate(setFacilities, 'libOfflineBooks', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-bold text-center" /></div>
            <div><label className="text-gray-600 block font-bold text-[10px]">Academic Journals</label><input type="number" min="0" value={facilities.libJournals} onChange={(e) => handleFieldUpdate(setFacilities, 'libJournals', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-bold text-center" /></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className="text-gray-600 block font-bold text-[10px]">eJournals holdings</label><input type="number" min="0" value={facilities.libEJournals} onChange={(e) => handleFieldUpdate(setFacilities, 'libEJournals', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-bold text-center" /></div>
            <div><label className="text-gray-600 block font-bold text-[10px]">Periodicals count</label><input type="number" min="0" value={facilities.libPeriodicals} onChange={(e) => handleFieldUpdate(setFacilities, 'libPeriodicals', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-bold text-center" /></div>
            <div><label className="text-gray-600 block font-bold text-[10px]">Monographs count</label><input type="number" min="0" value={facilities.libMonographs} onChange={(e) => handleFieldUpdate(setFacilities, 'libMonographs', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-bold text-center" /></div>
            <div><label className="text-gray-600 block font-bold text-[10px]">Database Subscriptions</label><input type="number" min="0" value={facilities.libDatabaseSubs} onChange={(e) => handleFieldUpdate(setFacilities, 'libDatabaseSubs', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-bold text-center" /></div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-gray-600 block font-bold text-[10px]">eBooks holdings</label><input type="number" min="0" value={facilities.libEBooks} onChange={(e) => handleFieldUpdate(setFacilities, 'libEBooks', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-bold text-center" /></div>
            <div><label className="text-gray-600 block font-bold text-[10px]">Computers available</label><input type="number" min="0" value={facilities.libComputers} onChange={(e) => handleFieldUpdate(setFacilities, 'libComputers', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-bold text-center" /></div>
            <div><label className="text-gray-600 block font-bold text-[10px]">Network & Bandwidth</label><input type="text" value={facilities.libBandwidth} onChange={(e) => handleFieldUpdate(setFacilities, 'libBandwidth', e.target.value)} className="w-full mt-0.5 p-1 border rounded bg-white font-semibold text-center" placeholder="e.g. 100 Mbps" /></div>
          </div>

          <div className="bg-amber-50/50 p-3 border border-amber-200/60 rounded-lg space-y-1.5">
            <span className="font-bold text-amber-900 block">Safety Measures Audit Check:</span>
            <div className="flex gap-4 items-center flex-wrap font-semibold text-amber-950">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.libSafetyExit} onChange={(e) => setFacilities(p => ({ ...p, libSafetyExit: e.target.checked }))} className="rounded text-amber-900" /> Exit Door</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.libSafetyAlarm} onChange={(e) => setFacilities(p => ({ ...p, libSafetyAlarm: e.target.checked }))} className="rounded text-amber-900" /> Fire Alarm</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.libSafetyExtinguisher} onChange={(e) => setFacilities(p => ({ ...p, libSafetyExtinguisher: e.target.checked }))} className="rounded text-amber-900" /> Extinguisher</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.libSafetyBucket} onChange={(e) => setFacilities(p => ({ ...p, libSafetyBucket: e.target.checked }))} className="rounded text-amber-900" /> Sand Bucket</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.libSafetyMuster} onChange={(e) => setFacilities(p => ({ ...p, libSafetyMuster: e.target.checked }))} className="rounded text-amber-900" /> Muster Point</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={facilities.libSafetyBlanket} onChange={(e) => setFacilities(p => ({ ...p, libSafetyBlanket: e.target.checked }))} className="rounded text-amber-900" /> Fire Blanket</label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-gray-200">
            <div><label className="font-bold text-gray-500 block text-xs">Comments</label><textarea value={facilities.libComments} onChange={(e) => handleFieldUpdate(setFacilities, 'libComments', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
            <div><label className="font-bold text-gray-500 block text-xs">Recommendations</label><textarea value={facilities.libRecs} onChange={(e) => handleFieldUpdate(setFacilities, 'libRecs', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
          </div>
        </div>
      </div>

      {/* CLINICAL TRAINING */}
      {/* CLINICAL TRAINING */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <ClipboardCheck size={14} /> CLINICAL TRAINING
        </h3>

        {/* TEACHING HOSPITAL */}
        <div className="space-y-3">
          <span className="font-bold text-gray-900 block text-xs">Teaching Hospital Profile Metrics</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-gray-600 block font-bold">Hospital bed space</label>
              <input type="text" value={clinical.hospitalBedSpace} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalBedSpace', e.target.value)} className="w-full mt-1 p-1.5 border rounded bg-white outline-none font-semibold text-center" />
            </div>
            <div>
              <label className="text-gray-600 block font-bold">Number of Specialties in Hospital</label>
              <input type="number" value={clinical.hospitalSpecialtiesCount} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalSpecialtiesCount', e.target.value)} className="w-full mt-1 p-1.5 border rounded bg-white outline-none font-bold text-center" />
            </div>
            <div>
              <label className="text-gray-600 block font-bold">Number of wards</label>
              <input type="number" value={clinical.hospitalWardsCount} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalWardsCount', e.target.value)} className="w-full mt-1 p-1.5 border rounded bg-white outline-none font-bold text-center" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div><label className="font-bold text-gray-500 block text-xs">Teaching Hospital Comments</label><textarea value={clinical.hospitalComments} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalComments', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
            <div><label className="font-bold text-gray-500 block text-xs">Teaching Hospital Recommendations</label><textarea value={clinical.hospitalRecommendations} onChange={(e) => handleFieldUpdate(setClinical, 'hospitalRecommendations', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
          </div>
        </div>

        {/* PHYSIOTHERAPY DEPARTMENT */}
        <div className="border-t border-gray-100 pt-3 space-y-3">
          <span className="font-bold text-gray-900 block text-xs">Physiotherapy Department Ecosystem</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold text-xs">
            <div className="space-y-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span className="block font-bold text-gray-800 mb-1">Structural Build Type:</span>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={clinical.deptStructurePurposedBuilt} onChange={(e) => setClinical(p => ({ ...p, deptStructurePurposedBuilt: e.target.checked, deptStructureGeneralPurpose: false, deptStructureSharedSpace: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Purpose Built</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={clinical.deptStructureGeneralPurpose} onChange={(e) => setClinical(p => ({ ...p, deptStructureGeneralPurpose: e.target.checked, deptStructurePurposedBuilt: false, deptStructureSharedSpace: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> General Purpose Built</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={clinical.deptStructureSharedSpace} onChange={(e) => setClinical(p => ({ ...p, deptStructureSharedSpace: e.target.checked, deptStructurePurposedBuilt: false, deptStructureGeneralPurpose: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Shared Space</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={clinical.deptStructureOthersChecked} onChange={(e) => setClinical(p => ({ ...p, deptStructureOthersChecked: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Others pls specify</label>
              </div>
              {clinical.deptStructureOthersChecked && (
                <div className="pt-1">
                  <input type="text" value={clinical.deptStructureOthersText} onChange={(e) => handleFieldUpdate(setClinical, 'deptStructureOthersText', e.target.value)} className="w-full p-1 border rounded text-[10px] bg-white font-semibold" placeholder="Specify details..." />
                </div>
              )}
            </div>

            <div className="space-y-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex flex-col justify-center">
              <span className="block font-bold text-gray-800 mb-1">Entrance & Exit Layout:</span>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={clinical.deptEntranceLarge} onChange={(e) => setClinical(p => ({ ...p, deptEntranceLarge: e.target.checked, deptEntranceSmall: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Large Entrance</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={clinical.deptEntranceSmall} onChange={(e) => setClinical(p => ({ ...p, deptEntranceSmall: e.target.checked, deptEntranceLarge: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Small Entrance</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={clinical.deptEntranceDisability} onChange={(e) => setClinical(p => ({ ...p, deptEntranceDisability: e.target.checked }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Disability Compliant Entrance</label>
              </div>
              <div className="flex gap-4 flex-wrap pt-2 border-t border-gray-200/50">
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={clinical.deptExitAvailable} onChange={(e) => setClinical(p => ({ ...p, deptExitAvailable: e.target.checked, deptExitNotAvailable: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Exit Doors Available</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={clinical.deptExitNotAvailable} onChange={(e) => setClinical(p => ({ ...p, deptExitNotAvailable: e.target.checked, deptExitAvailable: false }))} className="rounded text-purple-900 w-3.5 h-3.5" /> Exit Doors Absent</label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 pt-2 text-gray-700 font-bold">
            {[
              { label: "Number of Physiotherapists", ok: "deptTherapistsAdequate", bad: "deptTherapistsInadequate" },
              { label: "Examination/Treatment Cubicles", ok: "deptCubiclesAdequate", bad: "deptCubiclesInadequate" },
              { label: "Patient Waiting Area Available", ok: "deptWaitingAvailable", bad: "deptWaitingNotAvailable", toggleOnly: true },
              { label: "Clinical Staff Offices Available", ok: "deptOfficesAvailable", bad: "deptOfficesNotAvailable", toggleOnly: true },
              { label: "Conveniences Available", ok: "deptConveniencesAvailable", bad: "deptConveniencesNotAvailable", toggleOnly: true },
              { label: "Student Changing Area Available", ok: "deptChangingAvailable", bad: "deptChangingNotAvailable", toggleOnly: true },
              { label: "Staff Common Room Available", ok: "deptCommonRoomAvailable", bad: "deptCommonRoomNotAvailable", toggleOnly: true },
              { label: "Departmental Seminar Room", ok: "deptSeminarRoomAvailable", bad: "deptSeminarRoomNotAvailable", toggleOnly: true },
              { label: "Call Room Available", ok: "deptCallRoomAvailable", bad: "deptCallRoomNotAvailable", toggleOnly: true }
            ].map((row, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-100 py-1.5">
                <span className="text-gray-600 font-bold max-w-[180px] leading-tight">{row.label}</span>
                <div className="flex gap-1.5 text-[10px]">
                  <label className="flex items-center gap-0.5 font-semibold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!(clinical as any)[row.ok]} 
                      onChange={(e) => setClinical(p => ({ ...p, [row.ok]: e.target.checked, [row.bad]: false }))} 
                      className="scale-90 text-purple-900" 
                    /> {row.toggleOnly ? "Yes" : "Adeq"}
                  </label>
                  <label className="flex items-center gap-0.5 font-semibold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!(clinical as any)[row.bad]} 
                      onChange={(e) => setClinical(p => ({ ...p, [row.bad]: e.target.checked, [row.ok]: false }))} 
                      className="scale-90 text-purple-900" 
                    /> {row.toggleOnly ? "No" : "Inadeq"}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <label className="font-bold text-gray-600 block mb-1">Areas of Specialization listed in Department:</label>
            <input type="text" value={clinical.deptSpecialtiesList} onChange={(e) => handleFieldUpdate(setClinical, 'deptSpecialtiesList', e.target.value)} placeholder="Specify specialized focus groups..." className="w-full p-2 border border-gray-300 rounded font-semibold text-gray-900 outline-none bg-white" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={clinical.deptComments} onChange={(e) => handleFieldUpdate(setClinical, 'deptComments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
            <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={clinical.deptRecommendations} onChange={(e) => handleFieldUpdate(setClinical, 'deptRecommendations', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 bg-white resize-none outline-none font-semibold text-gray-900" /></div>
          </div>
        </div>
      </div>

      
      </fieldset>

      
      
      
      
      {/* FLOATING ACTION BOTTOM NAVIGATOR */}
      <div className="bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-3 sm:p-4 flex flex-row justify-between items-center gap-2 max-w-5xl mx-auto rounded-2xl z-10 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-2.5 py-2 sm:px-5 sm:py-2.5 border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Back
        </button>
        
        <div className="flex flex-row gap-2 items-center">
          {!isReadOnly && (
            <button
              type="submit"
              disabled={!isDirty}
              onClick={() => { (window as any)._actionType = 'save'; }}
              className={`px-2.5 py-2 sm:px-5 sm:py-2.5 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap ${!isDirty ? "border border-green-300 text-green-300 opacity-50 cursor-not-allowed" : "border border-green-600 text-green-600 hover:bg-green-50 cursor-pointer"}`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              Save
            </button>
          )}
          
          {isReviewMode && !isReadOnly && (
            <button
              type="submit"
              disabled={isDirty}
              onClick={() => { (window as any)._actionType = 'proceed'; }}
              className={`px-2.5 py-2 sm:px-5 sm:py-2.5 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap ${isDirty ? "bg-green-650 opacity-40 cursor-not-allowed" : "bg-green-700 hover:bg-green-800 cursor-pointer"}`}
            >
              Proceed to Report
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          )}
          
          {isReadOnly && isReviewMode && (
            <button
              type="button"
              onClick={() => onComplete({ _action: 'proceed' })}
              className="px-2.5 py-2 sm:px-5 sm:py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap"
            >
              View Summary Report
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          )}
        </div>
      </div>






    </form>
  );
}