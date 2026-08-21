"use client";

import React, { useState, useEffect } from 'react';
import { Truck, Users, BookOpen, Wrench, Building2, ClipboardCheck, Save } from 'lucide-react';

interface Step1Props {
  visitationDate: string;
  fieldTeamMembers: string;
  onComplete: (formData: any) => void;
  inspectionReport?: any;
  isReviewMode?: boolean;
  isReadOnly?: boolean;
  onBack: () => void;
}

export function SpeechTherapyClinicalStep1({ visitationDate, fieldTeamMembers, onComplete, inspectionReport, isReviewMode, isReadOnly, onBack}: Step1Props) {
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

  // Travel Information
  const [travelInfo, setTravelInfo] = useState({
    modeOfTravel: "", arrivalDate: "", arrivalTime: "", placeOfReception: "",
    typeOfReception: "", typeOfReceptionOthers: "", representatives: ""
  });

  // Clinical Staff
  const [clinicalStaff, setClinicalStaff] = useState({
    hodName: "", directors: "", deputyDirectors: "", assistantDirectors: "",
    chiefSpeechTherapists: "", seniorSpeechTherapists: "", speechTherapists: "",
    internSpeechTherapists: "", locumSpeechTherapist: "", nyscSpeechTherapist: "",
    totalSpeechTherapist: "", comments: "", recommendations: ""
  });

  // Specialties
  const [specialtiesCount, setSpecialtiesCount] = useState("");
  const [specialties, setSpecialties] = useState<Record<string, string>>({
    "Orofacial Myology": "", "Language Disorders": "", "Fluency Disorders": "", 
    "Voice and Resonance Disorders": "", "Literacy Unit": "", "Cognitive Communication Disorders": "", 
    "Swallowing and Feeding Disorders": "", "Augmentative and Alternative Communication": "", 
    "Social communication Disorders": "", "Gender-Affirming Voice": ""
  });
  const [specialtiesMeta, setSpecialtiesMeta] = useState({ comments: "", recommendations: "" });

  // Non-Clinical Staff
  const [nonClinicalStaff, setNonClinicalStaff] = useState({
    adminStaff: "", healthRecordOfficers: "", nyscStaff: "", porters: "", cleaners: "", securityPersonnel: "",
    comments: "", recommendations: ""
  });

  // Space Evaluation
  const [spaceEval, setSpaceForm] = useState({
    signPost: "", signPostVisibility: "", signPostOthers: "", signPostComments: "", signPostRecs: "",
    entranceSize: "", entranceDisability: "", entranceOthers: "", exitDoors: "", entranceComments: "", entranceRecs: "",
    outlookCondition: "", outlookOthers: "", outlookComments: "", outlookRecs: "",
    waitingSize: "", waitingCondition: "", waitingVentilation: "", waitingIllumination: "",
    recordsOffice: "", recordsSize: "", recordsCondition: "", recordsCabinets: "", recordsSecurity: "", recordsEmr: "", recordsLinked: "", recordsVentilation: "", recordsIllumination: "", recordsComments: "", recordsRecs: "",
    cubiclesExam: "", cubiclesTreatment: "", cubiclesScreens: "", cubiclesSize: "", cubiclesCondition: "", cubiclesVentilation: "", cubiclesIllumination: "", cubiclesComments: "", cubiclesRecs: "",
    
    // Head of Departments Office
    hodSize: "", hodCondition: "", hodOthers: "", hodFurnishings: "", hodVentilation: "", hodIllumination: "", hodSecretarial: "", hodConvenience: "", hodComments: "", hodRecs: "",
    
    // Other Offices Section
    otherOfficesDirectors: "", otherOfficesDeputy: "", otherOfficesAssistant: "", otherOfficesChief: "", 
    otherOfficesPrincipal: "", otherOfficesSenior: "", otherOfficesTherapist: "", otherOfficesInterns: "", 
    otherOfficesLocumCorp: "", otherOfficesNonClinicalTotal: "", otherOfficesRecordOfficersTotal: "",
    otherOfficesSufficiency: "", otherOfficesFurnishing: "", otherOfficesSize: "", otherOfficesCondition: "", 
    otherOfficesVentilation: "", otherOfficesIllumination: "", otherOfficesComments: "", otherOfficesRecs: "",
    
    // Conveniences
    conveniencesStaffCount: "", conveniencesStaffSufficiency: "", conveniencesStaffClean: "", 
    conveniencesPatientCount: "", conveniencesPatientSufficiency: "", conveniencesPatientClean: "", 
    conveniencesLabels: "", conveniencesComments: "", conveniencesRecs: "",
    
    // Call Duty Room
    callDutyAvailability: "", callDutyLabels: "", callDutyVentilation: "", callDutyIllumination: "", 
    callDutyFurnishing: "", callDutyFurnishingAdequacy: "", callDutyComments: "", callDutyRecs: "",
    
    // Seminar Room
    seminarAvailability: "", seminarSize: "", seminarCondition: "", seminarFurnishings: "", 
    seminarAids: "", seminarAidsAdequacy: "", seminarVentilation: "", seminarIllumination: "", 
    seminarComments: "", seminarRecs: "",
    
    // Student Changing Room
    changingAvailability: "", changingSize: "", changingCondition: "", changingFurnishings: "", 
    changingVentilation: "", changingIllumination: "", changingComments: "", changingRecs: ""
  });

  // Library Facility
  const [libraryChecklist, setLibraryChecklist] = useState({
    available: "", others: "", seatingCapacity: "",
    safetyExit: false, safetyAlarm: false, safetyExtinguisher: false, safetyBucket: false, safetyMuster: false, safetyBlanket: false,
    textbooks: "", journals: "", periodicals: "", monographs: "",
    subscriptions: "", eBooks: "", offlineBooks: "", eJournals: "", computers: "", bandwidth: "",
    comments: "", recommendations: ""
  });

  // Visits to Wards
  const [wardsChecklist, setWardsChecklist] = useState({
    list: "", entranceSetting: "", ventilation: "", illumination: "", sideWards: "", equipment: "", ergonomics: "", screens: "",
    comments: "", recommendations: ""
  });

  // Equipment Evaluation / Verification metrics
  const [equipEval, setEquipEval] = useState({
    therapyMaterials: "", diagnostics: "", infectiousControl: "", safetyMeasures: "", consumables: "",
    orofacialMyology: "", languageDisorders: "", fluencyDisorders: "", voiceResonance: "", literacyUnit: "",
    cognitiveCommunication: "", swallowingFeeding: "", aac: "", socialCommunication: "", genderAffirmingVoice: "",
    comments: "", recommendation: ""
  });

  // Closures
  const [manpowerAndSummary, setManpowerAndSummary] = useState({
    manpowerDetails: "", manpowerComments: "", manpowerRecs: "",
    overallSummary: "", finalRecommendation: "", finalDuration: ""
  });

  const handleFieldUpdate = (setter: any, field: string, value: any) => {
    setter((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ travelInfo, clinicalStaff, specialties, specialtiesCount, specialtiesMeta, nonClinicalStaff, spaceEval, libraryChecklist, wardsChecklist, equipEval, manpowerAndSummary , _action: (window as any)._actionType || 'save' });
  };
  
  React.useEffect(() => {
    if (inspectionReport?.step2) {
      const s = inspectionReport.step2;
      if (s.travelInfo !== undefined) setTravelInfo(s.travelInfo);
      if (s.clinicalStaff !== undefined) setClinicalStaff(s.clinicalStaff);
      if (s.nonClinicalStaff !== undefined) setNonClinicalStaff(s.nonClinicalStaff);
      if (s.spaceEval !== undefined) setSpaceForm(s.spaceEval);
      if (s.equipEval !== undefined) setEquipEval(s.equipEval);
      if (s.specialties !== undefined) setSpecialties(s.specialties);
      if (s.specialtiesCount !== undefined) setSpecialtiesCount(s.specialtiesCount);
      if (s.specialtiesMeta !== undefined) setSpecialtiesMeta(s.specialtiesMeta);
      setInitialDataString(getSerialized(s));
    }
  }, [inspectionReport]);
  
  React.useEffect(() => {
    if (!inspectionReport?.step2) {
      setInitialDataString(getSerialized({ travelInfo, clinicalStaff, specialties, specialtiesCount, specialtiesMeta, nonClinicalStaff, spaceEval, libraryChecklist, wardsChecklist, equipEval, manpowerAndSummary }));
    }
  }, []);

  
  const currentDataString = getSerialized({ travelInfo, clinicalStaff, specialties, specialtiesCount, specialtiesMeta, nonClinicalStaff, spaceEval, libraryChecklist, wardsChecklist, equipEval, manpowerAndSummary });
  const isDirty = initialDataString !== "" && currentDataString !== initialDataString;

  return (
    <form onSubmit={handleFormSubmission} className="space-y-6 w-full max-w-5xl mx-auto text-xs text-gray-800 antialiased font-medium pb-12">
      <fieldset disabled={isReadOnly} className="space-y-6 w-full block border-0 p-0 m-0 min-w-0">
      
      {/* 1. TRAVEL INFORMATION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Truck size={14} /> Travel Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-gray-600 block">Date</label>
            <input type="text" value={visitationDate || "Not Scheduled"} readOnly className="w-full mt-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded outline-none text-gray-500 font-semibold cursor-not-allowed" />
          </div>
          <div className="sm:col-span-2">
            <label className="font-bold text-gray-600 block">Accreditation Team Members</label>
            <input type="text" value={fieldTeamMembers} readOnly className="w-full mt-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded outline-none text-gray-500 font-semibold cursor-not-allowed" />
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Mode of Travel</label>
            <select value={travelInfo.modeOfTravel} onChange={(e) => handleFieldUpdate(setTravelInfo, 'modeOfTravel', e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded bg-white outline-none">
              <option value="">Select Option</option>
              <option value="Air">Air</option>
              <option value="Road">Road</option>
              <option value="Water">Water</option>
              <option value="Train">Train</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Arrival Date</label>
            <input type="date" value={travelInfo.arrivalDate} onChange={(e) => handleFieldUpdate(setTravelInfo, 'arrivalDate', e.target.value)} className="w-full mt-1 px-2 py-1 border border-gray-300 rounded outline-none" />
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Arrival Time</label>
            <input type="time" value={travelInfo.arrivalTime} onChange={(e) => handleFieldUpdate(setTravelInfo, 'arrivalTime', e.target.value)} className="w-full mt-1 px-2 py-1 border border-gray-300 rounded outline-none" />
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Place of Reception</label>
            <input type="text" value={travelInfo.placeOfReception} onChange={(e) => handleFieldUpdate(setTravelInfo, 'placeOfReception', e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded outline-none" />
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Type of Reception</label>
            <div className="flex gap-4 mt-2">
              {['Warm', 'Cordial', 'Hostile'].map(t => (
                <label key={t} className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input type="radio" name="reception" checked={travelInfo.typeOfReception === t} onChange={() => handleFieldUpdate(setTravelInfo, 'typeOfReception', t)} className="w-3.5 h-3.5 text-gray-900 focus:ring-0" /> {t}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Others, please specify</label>
            <input type="text" value={travelInfo.typeOfReceptionOthers} onChange={(e) => handleFieldUpdate(setTravelInfo, 'typeOfReceptionOthers', e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded outline-none" />
          </div>
          <div className="sm:col-span-2 md:col-span-3">
            <label className="font-bold text-gray-600 block">Representatives of Hospital/clinic</label>
            <textarea value={travelInfo.representatives} onChange={(e) => handleFieldUpdate(setTravelInfo, 'representatives', e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded h-14 resize-none outline-none" />
          </div>
        </div>
      </div>

      {/* 2. CLINICAL STAFF ACCREDITATION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Users size={14} /> Staff Accreditation • Clinical Staff
        </h3>
        <div className="space-y-3">
          <div className="max-w-sm">
            <label className="font-bold text-gray-600 block">Name of HOD</label>
            <input type="text" value={clinicalStaff.hodName} onChange={(e) => handleFieldUpdate(setClinicalStaff, 'hodName', e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 pt-1">
            {[
              { label: "Total number of Directors", f: "directors" },
              { label: "Total number of Deputy Directors", f: "deputyDirectors" },
              { label: "Total number of Assistant Directors", f: "assistantDirectors" },
              { label: "Total number of Chief Speech therapists", f: "chiefSpeechTherapists" },
              { label: "Total number of Senior Speech therapists", f: "seniorSpeechTherapists" },
              { label: "Total number of Speech therapists", f: "speechTherapists" },
              { label: "Total number of Intern Speech therapists", f: "internSpeechTherapists" },
              { label: "Total number of Locum Speech therapist", f: "locumSpeechTherapist" },
              { label: "Total number of NYSC Speech therapist", f: "nyscSpeechTherapist" },
              { label: "Total number of Speech therapist", f: "totalSpeechTherapist" }
            ].map(item => (
              <div key={item.f} className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-700 font-semibold">{item.label}</span>
                <input type="number" min="0" value={clinicalStaff[item.f as keyof typeof clinicalStaff]} onChange={(e) => handleFieldUpdate(clinicalStaff, item.f, e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center font-bold outline-none" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={clinicalStaff.comments} onChange={(e) => handleFieldUpdate(setClinicalStaff, 'comments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
          <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={clinicalStaff.recommendations} onChange={(e) => handleFieldUpdate(setClinicalStaff, 'recommendations', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
        </div>
      </div>

      {/* 3. AREAS OF SPECIALIZATION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <BookOpen size={14} /> Areas of Specialization
        </h3>
        <div className="max-w-xs">
          <label className="font-bold text-gray-600 block">Total number of Areas of Specialization</label>
          <input type="number" min="0" value={specialtiesCount} onChange={(e) => setSpecialtiesCount(e.target.value)} className="w-16 mt-1 p-1 border border-gray-300 rounded text-center font-bold outline-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 pt-1">
          {Object.keys(specialties).map(key => (
            <div key={key} className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="text-gray-700 font-semibold">{key}</span>
              <input type="number" min="0" value={specialties[key]} onChange={(e) => handleFieldUpdate(setSpecialties, key, e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center font-bold outline-none" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={specialtiesMeta.comments} onChange={(e) => handleFieldUpdate(setSpecialtiesMeta, 'comments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
          <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={specialtiesMeta.recommendations} onChange={(e) => handleFieldUpdate(setSpecialtiesMeta, 'recommendations', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
        </div>
      </div>

      {/* 4. NON-CLINICAL STAFF */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Users size={14} /> Non-clinical staff
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
          {[
            { label: "Total number of Administrative Staff", f: "adminStaff" },
            { label: "Total number of Health Record Officers", f: "healthRecordOfficers" },
            { label: "Total number of NYSC Staff", f: "nyscStaff" },
            { label: "Total number of Porters", f: "porters" },
            { label: "Total number of Cleaners", f: "cleaners" },
            { label: "Total number of Security Personnel", f: "securityPersonnel" }
          ].map(item => (
            <div key={item.f} className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="text-gray-700 font-semibold">{item.label}</span>
              <input type="number" min="0" value={nonClinicalStaff[item.f as keyof typeof nonClinicalStaff]} onChange={(e) => handleFieldUpdate(setNonClinicalStaff, item.f, e.target.value)} className="w-14 p-0.5 border border-gray-300 rounded text-center font-bold outline-none" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={nonClinicalStaff.comments} onChange={(e) => handleFieldUpdate(setNonClinicalStaff, 'comments', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none" /></div>
          <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={nonClinicalStaff.recommendations} onChange={(e) => handleFieldUpdate(setNonClinicalStaff, 'recommendations', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none" /></div>
        </div>
      </div>

      {/* 5. SPACE EVALUATION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Building2 size={14} /> Space Evaluation
        </h3>
        
        <div className="space-y-4 divide-y divide-gray-100">
          {/* Sign Post */}
          <div className="pt-1 space-y-2">
            <span className="font-bold text-gray-700 block">Sign post:</span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-1.5"><input type="radio" name="sign" checked={spaceEval.signPost === 'Absent'} onChange={() => {
                handleFieldUpdate(setSpaceForm, 'signPost', 'Absent');
                handleFieldUpdate(setSpaceForm, 'signPostVisibility', '');
              }} /> Absent</label>
              <label className="flex items-center gap-1.5"><input type="radio" name="sign" checked={spaceEval.signPost === 'Present'} onChange={() => handleFieldUpdate(setSpaceForm, 'signPost', 'Present')} /> Present</label>
            </div>
            
            <div className={`flex flex-wrap gap-4 p-2 bg-slate-50 border border-gray-200 rounded-lg transition-all duration-200 ${spaceEval.signPost !== 'Present' ? 'opacity-40 pointer-events-none bg-gray-100/50' : ''}`}>
              <label className="flex items-center gap-1.5"><input type="radio" name="signVis" disabled={spaceEval.signPost !== 'Present'} checked={spaceEval.signPostVisibility === 'Inconspicuous'} onChange={() => handleFieldUpdate(setSpaceForm, 'signPostVisibility', 'Inconspicuous')} /> Inconspicuous</label>
              <label className="flex items-center gap-1.5"><input type="radio" name="signVis" disabled={spaceEval.signPost !== 'Present'} checked={spaceEval.signPostVisibility === 'Conspicuous'} onChange={() => handleFieldUpdate(setSpaceForm, 'signPostVisibility', 'Conspicuous')} /> Conspicuous</label>
            </div>
            
            <div>
              <label className="font-bold text-gray-600 block mb-1">Others pls specify</label>
              <input type="text" value={spaceEval.signPostOthers} onChange={(e) => handleFieldUpdate(setSpaceForm, 'signPostOthers', e.target.value)} className="w-full max-w-sm p-1.5 border border-gray-300 rounded outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" value={spaceEval.signPostComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'signPostComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /><textarea placeholder="Recommendations" value={spaceEval.signPostRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'signPostRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /></div>
          </div>

          {/* Entrance */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Entrance:</span>
            <div className="flex flex-wrap gap-4"><label><input type="radio" name="entranceSize" checked={spaceEval.entranceSize === 'Large'} onChange={() => handleFieldUpdate(setSpaceForm, 'entranceSize', 'Large')} /> Large</label><label><input type="radio" name="entranceSize" checked={spaceEval.entranceSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'entranceSize', 'Small')} /> Small</label><label><input type="checkbox" checked={spaceEval.entranceDisability === 'Disability Compliant'} onChange={(e) => handleFieldUpdate(setSpaceForm, 'entranceDisability', e.target.checked ? 'Disability Compliant' : '')} /> Disability Compliant</label></div>
            <div>
              <label className="font-bold text-gray-600 block mb-1">Others pls specify</label>
              <input type="text" value={spaceEval.entranceOthers} onChange={(e) => handleFieldUpdate(setSpaceForm, 'entranceOthers', e.target.value)} className="w-full max-w-sm p-1.5 border border-gray-300 rounded outline-none" />
            </div>
            <div className="flex flex-wrap gap-4 mt-1"><span className="font-bold text-gray-700 block">Exit doors:</span><label><input type="radio" name="exit" checked={spaceEval.exitDoors === 'Available'} onChange={() => handleFieldUpdate(setSpaceForm, 'exitDoors', 'Available')} /> Available</label><label><input type="radio" name="exit" checked={spaceEval.exitDoors === 'Not Available'} onChange={() => handleFieldUpdate(setSpaceForm, 'exitDoors', 'Not Available')} /> Not Available</label></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" value={spaceEval.entranceComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'entranceComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /><textarea placeholder="Recommendations" value={spaceEval.entranceRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'entranceRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /></div>
          </div>

          {/* Departmental Outlook */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Departmental/Clinic Outlook:</span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-1.5"><input type="radio" name="outlookCombined" checked={spaceEval.outlookCondition === 'Clean and orderly'} onChange={() => handleFieldUpdate(setSpaceForm, 'outlookCondition', 'Clean and orderly')} /> Clean and orderly</label>
              <label className="flex items-center gap-1.5"><input type="radio" name="outlookCombined" checked={spaceEval.outlookCondition === 'Unclean/cluttered'} onChange={() => handleFieldUpdate(setSpaceForm, 'outlookCondition', 'Unclean/cluttered')} /> Unclean/cluttered</label>
            </div>
            <div>
              <label className="font-bold text-gray-600 block mb-1">Others pls specify</label>
              <input type="text" value={spaceEval.outlookOthers} onChange={(e) => handleFieldUpdate(setSpaceForm, 'outlookOthers', e.target.value)} className="w-full max-w-sm p-1.5 border border-gray-300 rounded outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" value={spaceEval.outlookComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'outlookComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /><textarea placeholder="Recommendations" value={spaceEval.outlookRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'outlookRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /></div>
          </div>

          {/* Patients Waiting Area */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Patients Waiting Area:</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2 bg-slate-50 p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-2"><span>Size:</span><label><input type="radio" name="waitSize" checked={spaceEval.waitingSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingSize', 'Small')} /> Small</label><label><input type="radio" name="waitSize" checked={spaceEval.waitingSize === 'Large'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingSize', 'Large')} /> Large</label></div>
              <div className="flex items-center gap-2"><span>Density:</span><label><input type="radio" name="waitCond" checked={spaceEval.waitingCondition === 'Crowded'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingCondition', 'Crowded')} /> Crowded</label><label><input type="radio" name="waitCond" checked={spaceEval.waitingCondition === 'Spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingCondition', 'Spacious')} /> Spacious</label></div>
              <div className="flex items-center gap-2"><span>Ventilation:</span><label><input type="radio" name="waitVent" checked={spaceEval.waitingVentilation === 'Good'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingVentilation', 'Good')} /> Good</label><label><input type="radio" name="waitVent" checked={spaceEval.waitingVentilation === 'Fair'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingVentilation', 'Fair')} /> Fair</label><label><input type="radio" name="waitVent" checked={spaceEval.waitingVentilation === 'Poor'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingVentilation', 'Poor')} /> Poor</label></div>
              <div className="flex items-center gap-2"><span>Illumination:</span><label><input type="radio" name="waitIllum" checked={spaceEval.waitingIllumination === 'Good'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingIllumination', 'Good')} /> Good</label><label><input type="radio" name="waitIllum" checked={spaceEval.waitingIllumination === 'Fair'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingIllumination', 'Fair')} /> Fair</label><label><input type="radio" name="waitIllum" checked={spaceEval.waitingIllumination === 'Poor'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingIllumination', 'Poor')} /> Poor</label></div>
            </div>
          </div>

          {/* Departmental Health Records Unit */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Departmental Health Records Unit:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded"><span>Office:</span><div className="flex gap-2"><label><input type="radio" name="recOff" checked={spaceEval.recordsOffice === 'Available'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsOffice', 'Available')} /> Avail</label><label><input type="radio" name="recOff" checked={spaceEval.recordsOffice === 'Not Available'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsOffice', 'Not Available')} /> N/A</label></div></div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded"><span>Size:</span><div className="flex gap-2"><label><input type="radio" name="recSize" checked={spaceEval.recordsSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsSize', 'Small')} /> Small</label><label><input type="radio" name="recSize" checked={spaceEval.recordsSize === 'Large'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsSize', 'Large')} /> Large</label></div></div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded"><span>Layout:</span><div className="flex gap-2"><label><input type="radio" name="recCrowd" checked={spaceEval.recordsCondition === 'Crowded'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsCondition', 'Crowded')} /> Crowded</label><label><input type="radio" name="recCrowd" checked={spaceEval.recordsCondition === 'Spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsCondition', 'Spacious')} /> Spacious</label></div></div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded"><span>Cabinets:</span><div className="flex gap-2"><label><input type="radio" name="recCab" checked={spaceEval.recordsCabinets === 'Available'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsCabinets', 'Available')} /> Avail</label><label><input type="radio" name="recCab" checked={spaceEval.recordsCabinets === 'Not Available'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsCabinets', 'Not Available')} /> N/A</label></div></div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded"><span>Security:</span><div className="flex gap-2"><label><input type="radio" name="recSec" checked={spaceEval.recordsSecurity === 'Secured'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsSecurity', 'Secured')} /> Secured</label><label><input type="radio" name="recSec" checked={spaceEval.recordsSecurity === 'Not Secured'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsSecurity', 'Not Secured')} /> Unsec</label></div></div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded"><span>EMR:</span><div className="flex gap-2"><label><input type="radio" name="recEmr" checked={spaceEval.recordsEmr === 'Present'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsEmr', 'Present')} /> Pres</label><label><input type="radio" name="recEmr" checked={spaceEval.recordsEmr === 'Not Present'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsEmr', 'Not Present')} /> N/P</label></div></div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded"><span>Linked:</span><div className="flex gap-2"><label><input type="radio" name="recLink" checked={spaceEval.recordsLinked === 'Linked'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsLinked', 'Linked')} /> Yes</label><label><input type="radio" name="recLink" checked={spaceEval.recordsLinked === 'Not Linked'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsLinked', 'Not Linked')} /> No</label></div></div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded"><span>Ventilation:</span><div className="flex gap-1.5"><label><input type="radio" name="recVent" checked={spaceEval.recordsVentilation === 'Good'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsVentilation', 'Good')} /> G</label><label><input type="radio" name="recVent" checked={spaceEval.recordsVentilation === 'Fair'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsVentilation', 'Fair')} /> F</label><label><input type="radio" name="recVent" checked={spaceEval.recordsVentilation === 'Poor'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsVentilation', 'Poor')} /> P</label></div></div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded"><span>Illumination:</span><div className="flex gap-1.5"><label><input type="radio" name="recIllum" checked={spaceEval.recordsIllumination === 'Good'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsIllumination', 'Good')} /> G</label><label><input type="radio" name="recIllum" checked={spaceEval.recordsIllumination === 'Fair'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsIllumination', 'Fair')} /> F</label><label><input type="radio" name="recIllum" checked={spaceEval.recordsIllumination === 'Poor'} onChange={() => handleFieldUpdate(setSpaceForm, 'recordsIllumination', 'Poor')} /> P</label></div></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" value={spaceEval.recordsComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'recordsComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /><textarea placeholder="Recommendations" value={spaceEval.recordsRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'recordsRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /></div>
          </div>

          {/* Examination/Treatment Cubicles */}
          <div className="pt-3 space-y-3">
            <span className="font-bold text-gray-700 block">Examination/Treatment Cubicles:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className="font-bold text-gray-600 block mb-1">Number of Examination Cubicles</label><input type="text" value={spaceEval.cubiclesExam} onChange={(e) => handleFieldUpdate(setSpaceForm, 'cubiclesExam', e.target.value)} className="w-full p-2 border border-gray-300 rounded outline-none font-bold" /></div>
              <div><label className="font-bold text-gray-600 block mb-1">Number of Treatment Cubicles</label><input type="text" value={spaceEval.cubiclesTreatment} onChange={(e) => handleFieldUpdate(setSpaceForm, 'cubiclesTreatment', e.target.value)} className="w-full p-2 border border-gray-300 rounded outline-none font-bold" /></div>
              <div><label className="font-bold text-gray-600 block mb-1">Number of Screens</label><input type="text" value={spaceEval.cubiclesScreens} onChange={(e) => handleFieldUpdate(setSpaceForm, 'cubiclesScreens', e.target.value)} className="w-full p-2 border border-gray-300 rounded outline-none font-bold" /></div>
            </div>
            <div className="flex flex-wrap gap-4 font-semibold text-gray-700 mt-1 bg-slate-50 p-2 border border-gray-100 rounded-lg">
              <div className="flex items-center gap-2"><span>Size:</span><label><input type="radio" name="cubSize" checked={spaceEval.cubiclesSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesSize', 'Small')} /> Small</label><label><input type="radio" name="cubSize" checked={spaceEval.cubiclesSize === 'Large'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesSize', 'Large')} /> Large</label></div>
              <div className="flex items-center gap-2"><span>Layout:</span><label><input type="radio" name="cubCond" checked={spaceEval.cubiclesCondition === 'Crowded'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesCondition', 'Crowded')} /> Crowded</label><label><input type="radio" name="cubCond" checked={spaceEval.cubiclesCondition === 'Spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesCondition', 'Spacious')} /> Spacious</label></div>
              <div className="flex items-center gap-2"><span>Ventilation:</span><label><input type="radio" name="cubVent" checked={spaceEval.cubiclesVentilation === 'Good'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesVentilation', 'Good')} /> Good</label><label><input type="radio" name="cubVent" checked={spaceEval.cubiclesVentilation === 'Fair'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesVentilation', 'Fair')} /> Fair</label><label><input type="radio" name="cubVent" checked={spaceEval.cubiclesVentilation === 'Poor'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesVentilation', 'Poor')} /> Poor</label></div>
              <div className="flex items-center gap-2"><span>Illumination:</span><label><input type="radio" name="cubIllum" checked={spaceEval.cubiclesIllumination === 'Good'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesIllumination', 'Good')} /> Good</label><label><input type="radio" name="cubIllum" checked={spaceEval.cubiclesIllumination === 'Fair'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesIllumination', 'Fair')} /> Fair</label><label><input type="radio" name="cubIllum" checked={spaceEval.cubiclesIllumination === 'Poor'} onChange={() => handleFieldUpdate(setSpaceForm, 'cubiclesIllumination', 'Poor')} /> Poor</label></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" value={spaceEval.cubiclesComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'cubiclesComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /><textarea placeholder="Recommendations" value={spaceEval.cubiclesRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'cubiclesRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" /></div>
          </div>

          {/* Offices Section */}
          <div className="pt-3 space-y-4">
            <span className="font-bold text-gray-950 uppercase tracking-wide block">Offices</span>
            
            {/* HOD Office Details */}
            <div className="p-3 border border-gray-200 bg-slate-50/50 rounded-lg space-y-2">
              <span className="font-bold text-gray-700 block">Head of Departments Office:</span>
              <div className="flex flex-wrap gap-4 font-semibold text-gray-700">
                <div className="flex items-center gap-2"><span>Size:</span><label><input type="radio" name="hodSz" checked={spaceEval.hodSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSize', 'Small')} /> Small</label><label><input type="radio" name="hodSz" checked={spaceEval.hodSize === 'Large'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSize', 'Large')} /> Large</label></div>
                <div className="flex items-center gap-2"><span>Density:</span><label><input type="radio" name="hodCrd" checked={spaceEval.hodCondition === 'Overcrowded'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodCondition', 'Overcrowded')} /> Overcrowded</label><label><input type="radio" name="hodCrd" checked={spaceEval.hodCondition === 'Spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodCondition', 'Spacious')} /> Spacious</label></div>
                <div className="flex items-center gap-2"><span>Furnishings:</span><label><input type="radio" name="hodFur" checked={spaceEval.hodFurnishings === 'Adequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodFurnishings', 'Adequate')} /> Adequate</label><label><input type="radio" name="hodFur" checked={spaceEval.hodFurnishings === 'Inadequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodFurnishings', 'Inadequate')} /> Inadequate</label></div>
                <div className="flex items-center gap-2"><span>Ventilation:</span><label><input type="radio" name="hodVnt" checked={spaceEval.hodVentilation === 'Good'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodVentilation', 'Good')} /> Good</label><label><input type="radio" name="hodVnt" checked={spaceEval.hodVentilation === 'Fair'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodVentilation', 'Fair')} /> Fair</label><label><input type="radio" name="hodVnt" checked={spaceEval.hodVentilation === 'Poor'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodVentilation', 'Poor')} /> Poor</label></div>
                <div className="flex items-center gap-2"><span>Illumination:</span><label><input type="radio" name="hodIll" checked={spaceEval.hodIllumination === 'Good'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodIllumination', 'Good')} /> Good</label><label><input type="radio" name="hodIll" checked={spaceEval.hodIllumination === 'Fair'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodIllumination', 'Fair')} /> Fair</label><label><input type="radio" name="hodIll" checked={spaceEval.hodIllumination === 'Poor'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodIllumination', 'Poor')} /> Poor</label></div>
                <div className="flex items-center gap-2"><span>Secretarial:</span><label><input type="radio" name="hodSec" checked={spaceEval.hodSecretarial === 'Attached'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSecretarial', 'Attached')} /> Attached</label><label><input type="radio" name="hodSec" checked={spaceEval.hodSecretarial === 'Not Attached'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSecretarial', 'Not Attached')} /> Not Attached</label></div>
                <div className="flex items-center gap-2"><span>Convenience:</span><label><input type="radio" name="hodCon" checked={spaceEval.hodConvenience === 'Attached'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodConvenience', 'Attached')} /> Attached</label><label><input type="radio" name="hodCon" checked={spaceEval.hodConvenience === 'Not Attached'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodConvenience', 'Not Attached')} /> Not Attached</label></div>
              </div>
              <label className="font-bold text-gray-600 block mt-1">Others pls specify</label>
              <input type="text" value={spaceEval.hodOthers} onChange={(e) => handleFieldUpdate(setSpaceForm, 'hodOthers', e.target.value)} className="w-full max-w-sm p-1.5 border border-gray-300 rounded bg-white outline-none" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" value={spaceEval.hodComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'hodComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /><textarea placeholder="Recommendations" value={spaceEval.hodRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'hodRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /></div>
            </div>

            {/* Other Offices Sub-Forms */}
            <div className="p-3 border border-gray-200 bg-slate-50/50 rounded-xl space-y-3">
              <span className="font-bold text-gray-700 block border-b border-gray-200 pb-1">Other offices:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
                {[
                  { label: "Number of offices for Directors", f: "otherOfficesDirectors" },
                  { label: "Number of offices for Deputy Directors", f: "otherOfficesDeputy" },
                  { label: "Number of offices for assistant Directors", f: "otherOfficesAssistant" },
                  { label: "Number of offices for Chief Speech therapist", f: "otherOfficesChief" },
                  { label: "Number of offices for Principal Speech therapist", f: "otherOfficesPrincipal" },
                  { label: "Number of offices for Senior Speech therapist", f: "otherOfficesSenior" },
                  { label: "Number of offices for Speech therapist", f: "otherOfficesTherapist" },
                  { label: "Number of offices for Interns", f: "otherOfficesInterns" },
                  { label: "Number of offices for Locum/Corp members Speech therapist", f: "otherOfficesLocumCorp" },
                  { label: "Total number of Non-clinical staff", f: "otherOfficesNonClinicalTotal" },
                  { label: "Total number for Heath Record Officers", f: "otherOfficesRecordOfficersTotal" }
                ].map((off, oIdx) => (
                  <div key={oIdx} className="flex flex-col justify-end">
                    <label className="text-gray-600 block mb-0.5 font-bold leading-tight">{off.label}</label>
                    <input type="text" value={(spaceEval as any)[off.f]} onChange={(e) => handleFieldUpdate(setSpaceForm, off.f, e.target.value)} className="w-full p-1.5 border border-gray-300 bg-white font-bold rounded text-center outline-none" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 font-semibold text-gray-700 mt-2 p-2 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2"><span>Total offices:</span><label><input type="radio" name="oOffSuf" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesSufficiency', 'Adequate')} /> Adequate</label><label><input type="radio" name="oOffSuf" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesSufficiency', 'Inadequate')} /> Inadequate</label></div>
                <div className="flex items-center gap-2"><span>Furnishing:</span><label><input type="radio" name="oOffFur" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesFurnishing', 'Adequate')} /> Adequate</label><label><input type="radio" name="oOffFur" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesFurnishing', 'Inadequate')} /> Inadequate</label></div>
                <div className="flex items-center gap-2"><span>Size:</span><label><input type="radio" name="oOffSz" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesSize', 'Large')} /> Large</label><label><input type="radio" name="oOffSz" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesSize', 'Small')} /> Small</label></div>
                <div className="flex items-center gap-2"><span>Layout:</span><label><input type="radio" name="oOffCond" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesCondition', 'Spacious')} /> Spacious</label><label><input type="radio" name="oOffCond" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesCondition', 'Overcrowded')} /> Overcrowded</label></div>
                <div className="flex items-center gap-2"><span>Ventilation:</span><label><input type="radio" name="oOffV" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesVentilation', 'Good')} /> Good</label><label><input type="radio" name="oOffV" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesVentilation', 'Fair')} /> Fair</label><label><input type="radio" name="oOffV" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesVentilation', 'Poor')} /> Poor</label></div>
                <div className="flex items-center gap-2"><span>Illumination:</span><label><input type="radio" name="oOffI" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesIllumination', 'Good')} /> Good</label><label><input type="radio" name="oOffI" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesIllumination', 'Fair')} /> Fair</label><label><input type="radio" name="oOffI" onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesIllumination', 'Poor')} /> Poor</label></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" onChange={(e) => handleFieldUpdate(setSpaceForm, 'otherOfficesComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /><textarea placeholder="Recommendations" onChange={(e) => handleFieldUpdate(setSpaceForm, 'otherOfficesRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /></div>
            </div>

            {/* Conveniences Sub-Forms */}
            <div className="p-3 border border-gray-200 bg-slate-50/50 rounded-xl space-y-2">
              <span className="font-bold text-gray-700 block border-b border-gray-200 pb-1">Conveniences:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold text-gray-700">
                <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1.5">
                  <label className="font-bold text-gray-900 block">Number of Staff Toilets</label>
                  <input type="text" value={spaceEval.conveniencesStaffCount} onChange={(e) => handleFieldUpdate(setSpaceForm, 'conveniencesStaffCount', e.target.value)} className="w-full p-1.5 border border-gray-300 rounded max-w-xs outline-none font-bold" />
                  <div className="flex gap-4 mt-1"><label><input type="radio" name="stSuf" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesStaffSufficiency', 'Adequate')} /> Adequate</label><label><input type="radio" name="stSuf" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesStaffSufficiency', 'Inadequate')} /> Inadequate</label></div>
                  <div className="flex gap-4"><label><input type="radio" name="stCln" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesStaffClean', 'Clean')} /> Clean</label><label><input type="radio" name="stCln" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesStaffClean', 'Unclean')} /> Unclean</label></div>
                </div>
                <div className="bg-white p-2 border border-gray-200 rounded-lg space-y-1.5">
                  <label className="font-bold text-gray-900 block">Number of Patient's Toilet</label>
                  <input type="text" value={spaceEval.conveniencesPatientCount} onChange={(e) => handleFieldUpdate(setSpaceForm, 'conveniencesPatientCount', e.target.value)} className="w-full p-1.5 border border-gray-300 rounded max-w-xs outline-none font-bold" />
                  <div className="flex gap-4 mt-1"><label><input type="radio" name="ptSuf" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesPatientSufficiency', 'Adequate')} /> Adequate</label><label><input type="radio" name="ptSuf" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesPatientSufficiency', 'Inadequate')} /> Inadequate</label></div>
                  <div className="flex gap-4"><label><input type="radio" name="ptCln" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesPatientClean', 'Clean')} /> Clean</label><label><input type="radio" name="ptCln" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesPatientClean', 'Unclean')} /> Unclean</label></div>
                </div>
              </div>
              <div className="flex gap-4 font-semibold text-gray-700 bg-white p-2 border border-gray-200 rounded-lg"><span className="font-bold">Labels (Male/Female):</span><label><input type="radio" name="convLbl" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesLabels', 'Clearly Labeled')} /> Clearly Labeled</label><label><input type="radio" name="convLbl" onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesLabels', 'Not Labeled')} /> Not Labeled</label></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" onChange={(e) => handleFieldUpdate(setSpaceForm, 'conveniencesComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /><textarea placeholder="Recommendations" onChange={(e) => handleFieldUpdate(setSpaceForm, 'conveniencesRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /></div>
            </div>

            {/* Call Duty Room */}
            <div className="p-3 border border-gray-200 bg-slate-50/50 rounded-xl space-y-2">
              <span className="font-bold text-gray-700 block border-b border-gray-200 pb-1">Call Duty Room:</span>
              <div className="flex flex-wrap gap-4 font-semibold text-gray-700 bg-white p-2 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2"><span>Availability:</span><label><input type="radio" name="cdAv" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyAvailability', 'Available')} /> Available</label><label><input type="radio" name="cdAv" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyAvailability', 'Not Available')} /> Not Available</label></div>
                <div className="flex items-center gap-2"><span>Labels (Male/Female):</span><label><input type="radio" name="cdLb" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyLabels', 'Clearly Labeled')} /> Clearly Labeled</label><label><input type="radio" name="cdLb" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyLabels', 'Not Labeled')} /> Not Labeled</label></div>
                <div className="flex items-center gap-2"><span>Ventilation:</span><label><input type="radio" name="cdV" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyVentilation', 'Good')} /> Good</label><label><input type="radio" name="cdV" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyVentilation', 'Fair')} /> Fair</label><label><input type="radio" name="cdV" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyVentilation', 'Poor')} /> Poor</label></div>
                <div className="flex items-center gap-2"><span>Illumination:</span><label><input type="radio" name="cdI" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyIllumination', 'Good')} /> Good</label><label><input type="radio" name="cdI" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyIllumination', 'Fair')} /> Fair</label><label><input type="radio" name="cdI" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyIllumination', 'Poor')} /> Poor</label></div>
                <div className="flex items-center gap-2"><span>Furnishing:</span><label><input type="radio" name="cdFn" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyFurnishing', 'Available')} /> Available</label><label><input type="radio" name="cdFn" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyFurnishing', 'Not Available')} /> Not Available</label></div>
                <div className="flex items-center gap-2"><span>Adequacy:</span><label><input type="radio" name="cdFnS" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyFurnishingAdequacy', 'Adequate')} /> Adequate</label><label><input type="radio" name="cdFnS" onChange={() => handleFieldUpdate(setSpaceForm, 'callDutyFurnishingAdequacy', 'Inadequate')} /> Inadequate</label></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" onChange={(e) => handleFieldUpdate(setSpaceForm, 'callDutyComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /><textarea placeholder="Recommendations" onChange={(e) => handleFieldUpdate(setSpaceForm, 'callDutyRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /></div>
            </div>

            {/* Seminar Room */}
            <div className="p-3 border border-gray-200 bg-slate-50/50 rounded-xl space-y-2">
              <span className="font-bold text-gray-700 block border-b border-gray-200 pb-1">Seminar Room:</span>
              <div className="flex flex-wrap gap-4 font-semibold text-gray-700 bg-white p-2 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-1.5"><span>Availability:</span><label><input type="radio" name="semAv" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarAvailability', 'Available')} /> Available</label><label><input type="radio" name="semAv" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarAvailability', 'Not Available')} /> Not Available</label></div>
                <div className="flex items-center gap-1.5"><span>Size:</span><label><input type="radio" name="semSz" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarSize', 'Large')} /> Large</label><label><input type="radio" name="semSz" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarSize', 'Small')} /> Small</label></div>
                <div className="flex items-center gap-1.5"><span>Layout:</span><label><input type="radio" name="semCn" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarCondition', 'Spacious')} /> Spacious</label><label><input type="radio" name="semCn" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarCondition', 'Overcrowded')} /> Overcrowded</label></div>
                <div className="flex items-center gap-1.5"><span>Furnishings:</span><label><input type="radio" name="semFur" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarFurnishings', 'Adequate')} /> Adequate</label><label><input type="radio" name="semFur" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarFurnishings', 'Inadequate')} /> Inadequate</label></div>
                <div className="flex items-center gap-1.5"><span>Teaching Aids:</span><label><input type="radio" name="semAid" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarAids', 'Available')} /> Available</label><label><input type="radio" name="semAid" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarAids', 'Not Available')} /> Not Available</label></div>
                <div className="flex items-center gap-1.5"><span>Aids Adequacy:</span><label><input type="radio" name="semAidS" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarAidsAdequacy', 'Adequate')} /> Adequate</label><label><input type="radio" name="semAidS" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarAidsAdequacy', 'Inadequate')} /> Inadequate</label></div>
                <div className="flex items-center gap-1.5"><span>Ventilation:</span><label><input type="radio" name="semV" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarVentilation', 'Good')} /> Good</label><label><input type="radio" name="semV" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarVentilation', 'Fair')} /> Fair</label><label><input type="radio" name="semV" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarVentilation', 'Poor')} /> Poor</label></div>
                <div className="flex items-center gap-1.5"><span>Illumination:</span><label><input type="radio" name="semI" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarIllumination', 'Good')} /> Good</label><label><input type="radio" name="semI" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarIllumination', 'Fair')} /> Fair</label><label><input type="radio" name="semI" onChange={() => handleFieldUpdate(setSpaceForm, 'seminarIllumination', 'Poor')} /> Poor</label></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" onChange={(e) => handleFieldUpdate(setSpaceForm, 'seminarComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /><textarea placeholder="Recommendations" onChange={(e) => handleFieldUpdate(setSpaceForm, 'seminarRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /></div>
            </div>

            {/* Student Changing Room */}
            <div className="p-3 border border-gray-200 bg-slate-50/50 rounded-xl space-y-2">
              <span className="font-bold text-gray-700 block border-b border-gray-200 pb-1">Student Changing Room:</span>
              <div className="flex flex-wrap gap-4 font-semibold text-gray-700 bg-white p-2 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2"><span>Availability:</span><label><input type="radio" name="chAv" onChange={() => handleFieldUpdate(setSpaceForm, 'changingAvailability', 'Available')} /> Available</label><label><input type="radio" name="chAv" onChange={() => handleFieldUpdate(setSpaceForm, 'changingAvailability', 'Not Available')} /> Not Available</label></div>
                <div className="flex items-center gap-2"><span>Size:</span><label><input type="radio" name="chSz" onChange={() => handleFieldUpdate(setSpaceForm, 'changingSize', 'Large')} /> Large</label><label><input type="radio" name="chSz" onChange={() => handleFieldUpdate(setSpaceForm, 'changingSize', 'Small')} /> Small</label></div>
                <div className="flex items-center gap-2"><span>Layout:</span><label><input type="radio" name="chCn" onChange={() => handleFieldUpdate(setSpaceForm, 'changingCondition', 'Spacious')} /> Spacious</label><label><input type="radio" name="chCn" onChange={() => handleFieldUpdate(setSpaceForm, 'changingCondition', 'Overcrowded')} /> Overcrowded</label></div>
                <div className="flex items-center gap-2"><span>Furnishings:</span><label><input type="radio" name="chFur" onChange={() => handleFieldUpdate(setSpaceForm, 'changingFurnishings', 'Adequate')} /> Adequate</label><label><input type="radio" name="chFur" onChange={() => handleFieldUpdate(setSpaceForm, 'changingFurnishings', 'Inadequate')} /> Inadequate</label></div>
                <div className="flex items-center gap-2"><span>Ventilation:</span><label><input type="radio" name="chV" onChange={() => handleFieldUpdate(setSpaceForm, 'changingVentilation', 'Good')} /> Good</label><label><input type="radio" name="chV" onChange={() => handleFieldUpdate(setSpaceForm, 'changingVentilation', 'Fair')} /> Fair</label><label><input type="radio" name="chV" onChange={() => handleFieldUpdate(setSpaceForm, 'changingVentilation', 'Poor')} /> Poor</label></div>
                <div className="flex items-center gap-2"><span>Illumination:</span><label><input type="radio" name="chI" onChange={() => handleFieldUpdate(setSpaceForm, 'changingIllumination', 'Good')} /> Good</label><label><input type="radio" name="chI" onChange={() => handleFieldUpdate(setSpaceForm, 'changingIllumination', 'Fair')} /> Fair</label><label><input type="radio" name="chI" onChange={() => handleFieldUpdate(setSpaceForm, 'changingIllumination', 'Poor')} /> Poor</label></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><textarea placeholder="Comments" onChange={(e) => handleFieldUpdate(setSpaceForm, 'changingComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /><textarea placeholder="Recommendations" onChange={(e) => handleFieldUpdate(setSpaceForm, 'changingRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 bg-white resize-none outline-none" /></div>
            </div>

          </div>
        </div>
      </div>

      {/* 6. LIBRARY FACILITY */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <BookOpen size={14} /> LIBRARY FACILITY
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div><label className="font-bold text-gray-600 block mb-1">Available Status</label><select onChange={(e) => handleFieldUpdate(libraryChecklist, 'available', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white outline-none"><option value="">Select Option</option><option value="Available">Available</option><option value="Not Available">Not Available</option></select></div>
          <div><label className="font-bold text-gray-600 block mb-1">Seating capacity</label><input type="text" onChange={(e) => handleFieldUpdate(libraryChecklist, 'seatingCapacity', e.target.value)} className="w-full p-2 border border-gray-300 rounded outline-none font-bold" /></div>
          <div><label className="font-bold text-gray-600 block mb-1">Available network and bandwidth</label><input type="text" onChange={(e) => handleFieldUpdate(libraryChecklist, 'bandwidth', e.target.value)} className="w-full p-2 border border-gray-300 rounded outline-none" /></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><label className="font-bold text-gray-600 block mb-1">Number of Textbooks</label><input type="text" onChange={(e) => handleFieldUpdate(libraryChecklist, 'textbooks', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-center font-bold" /></div>
          <div><label className="font-bold text-gray-600 block mb-1">Number of Academic journals</label><input type="text" onChange={(e) => handleFieldUpdate(libraryChecklist, 'journals', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-center font-bold" /></div>
          <div><label className="font-bold text-gray-600 block mb-1">Number of Computers available</label><input type="text" onChange={(e) => handleFieldUpdate(libraryChecklist, 'computers', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-center font-bold" /></div>
          <div><label className="font-bold text-gray-600 block mb-1">Number of e-Books</label><input type="text" onChange={(e) => handleFieldUpdate(libraryChecklist, 'eBooks', e.target.value)} className="w-full p-2 border border-gray-300 rounded text-center font-bold" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-gray-100">
          <div><label className="font-bold text-gray-500 block">Library Comments</label><textarea onChange={(e) => handleFieldUpdate(libraryChecklist, 'comments', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
          <div><label className="font-bold text-gray-500 block">Library Recommendations</label><textarea onChange={(e) => handleFieldUpdate(libraryChecklist, 'recommendations', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
        </div>
      </div>

      {/* 7. VISITS TO WARDS */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Building2 size={14} /> Visits to Wards
        </h3>
        <textarea placeholder="List of Available Wards/number of beds..." onChange={(e) => handleFieldUpdate(wardsChecklist, 'list', e.target.value)} className="w-full p-2 border border-gray-300 rounded h-14 resize-none outline-none" />
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-semibold text-gray-700">
          <div>
            <label className="font-bold text-gray-600 block mb-1">Ward Entrance</label>
            <select onChange={(e) => handleFieldUpdate(wardsChecklist, 'entranceSetting', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-xs outline-none"><option value="">Select</option><option value="Small">Small</option><option value="Wide">Wide</option><option value="Disability Compliant">Disability Compliant</option></select>
          </div>
          <div>
            <label className="font-bold text-gray-600 block mb-1">Ventilation</label>
            <div className="flex gap-2 items-center p-1.5 bg-slate-50 border border-gray-200 rounded h-[34px] justify-center">
              <label><input type="radio" name="wV" onChange={() => handleFieldUpdate(wardsChecklist, 'ventilation', 'Good')} /> G</label>
              <label><input type="radio" name="wV" onChange={() => handleFieldUpdate(wardsChecklist, 'ventilation', 'Fair')} /> F</label>
              <label><input type="radio" name="wV" onChange={() => handleFieldUpdate(wardsChecklist, 'ventilation', 'Poor')} /> P</label>
            </div>
          </div>
          <div>
            <label className="font-bold text-gray-600 block mb-1">Illumination</label>
            <div className="flex gap-2 items-center p-1.5 bg-slate-50 border border-gray-200 rounded h-[34px] justify-center">
              <label><input type="radio" name="wI" onChange={() => handleFieldUpdate(wardsChecklist, 'illumination', 'Good')} /> G</label>
              <label><input type="radio" name="wI" onChange={() => handleFieldUpdate(wardsChecklist, 'illumination', 'Fair')} /> F</label>
              <label><input type="radio" name="wI" onChange={() => handleFieldUpdate(wardsChecklist, 'illumination', 'Poor')} /> P</label>
            </div>
          </div>
          <div>
            <label className="font-bold text-gray-600 block mb-1">Equipment Status</label>
            <select onChange={(e) => handleFieldUpdate(wardsChecklist, 'equipment', e.target.value)} className="w-full p-2 border border-gray-300 rounded bg-white text-xs outline-none"><option value="">Select</option><option value="Well equipped">Well equipped</option><option value="Under equipped">Under equipped</option><option value="Not equipped">Not equipped</option></select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-gray-100">
          <div><label className="font-bold text-gray-500 block">Ward Comments</label><textarea onChange={(e) => handleFieldUpdate(wardsChecklist, 'comments', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
          <div><label className="font-bold text-gray-500 block">Ward Recommendations</label><textarea onChange={(e) => handleFieldUpdate(wardsChecklist, 'recommendations', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
        </div>
      </div>

      {/* 8. EQUIPMENT EVALUATION / VERIFICATION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Wrench size={14} /> Equipment Evaluation/Verification
        </h3>
        
        <div>
          <span className="font-bold text-gray-700 block mb-2">Sufficiency by Unit (Universal List of Equipment):</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Therapy Materials %", key: "therapyMaterials" },
              { label: "Diagnostics %", key: "diagnostics" },
              { label: "Infectious Control %", key: "infectiousControl" },
              { label: "Safety Measures %", key: "safetyMeasures" },
              { label: "Consumables %", key: "consumables" }
            ].map(item => (
              <div key={item.key}>
                <label className="font-bold text-gray-600 block mb-1">{item.label}</label>
                <input type="text" placeholder="Enter Figure" value={equipEval[item.key as keyof typeof equipEval]} onChange={(e) => handleFieldUpdate(setEquipEval, item.key, e.target.value)} className="w-full p-2 border border-gray-300 rounded text-center font-bold outline-none bg-white" />
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <span className="font-bold text-gray-700 block mb-2">List by Specialty:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "I. Orofacial Myology %", key: "orofacialMyology" },
              { label: "ii. Language Disorders %", key: "languageDisorders" },
              { label: "iii. Fluency Disorders %", key: "fluencyDisorders" },
              { label: "iv. Voice and Resonance Disorders %", key: "voiceResonance" },
              { label: "v. Literacy Unit %", key: "literacyUnit" },
              { label: "vi. Cognitive Communication Disorders %", key: "cognitiveCommunication" },
              { label: "vii. Swallowing and Feeding Disorders %", key: "swallowingFeeding" },
              { label: "viii. Augmentative and Alternative Communication %", key: "aac" },
              { label: "ix. Social communication Disorders %", key: "socialCommunication" },
              { label: "x. Gender-Affirming voice %", key: "genderAffirmingVoice" }
            ].map(spec => (
              <div key={spec.key} className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-700 font-bold pr-2">{spec.label}</span>
                <input type="text" placeholder="Figure" value={equipEval[spec.key as keyof typeof equipEval]} onChange={(e) => handleFieldUpdate(setEquipEval, spec.key, e.target.value)} className="w-20 p-1 border border-gray-300 rounded text-center font-bold bg-white outline-none" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div><label className="font-bold text-gray-500 block">Comments on Quality and Functionality</label><textarea value={equipEval.comments} onChange={(e) => handleFieldUpdate(setEquipEval, 'comments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
          <div><label className="font-bold text-gray-500 block">Recommendation</label><textarea value={equipEval.recommendation} onChange={(e) => handleFieldUpdate(setEquipEval, 'recommendation', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
        </div>
      </div>

      {/* 9. MANPOWER DEVELOPMENT ATTRIBUTES */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Users size={14} /> Manpower Development Attributes of Institution
        </h3>
        <textarea placeholder="Enter details..." value={manpowerAndSummary.manpowerDetails} onChange={(e) => handleFieldUpdate(setManpowerAndSummary, 'manpowerDetails', e.target.value)} className="w-full p-2 border border-gray-300 rounded h-16 resize-none outline-none" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={manpowerAndSummary.manpowerComments} onChange={(e) => handleFieldUpdate(setManpowerAndSummary, 'manpowerComments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
          <div><label className="font-bold text-gray-500 block">Recommendation</label><textarea value={manpowerAndSummary.manpowerRecs} onChange={(e) => handleFieldUpdate(setManpowerAndSummary, 'manpowerRecs', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
        </div>
      </div>

      {/* 10. OVERALL SUMMARY, RECOMMENDATIONS & CONCLUSION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <ClipboardCheck size={14} /> Overall Summary, Recommendations & Conclusion
        </h3>
        <div className="space-y-3">
          <div>
            <textarea value={manpowerAndSummary.overallSummary} onChange={(e) => handleFieldUpdate(setManpowerAndSummary, 'overallSummary', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-20 outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="font-bold text-gray-700 block">Accreditation Report Recommendation</label>
              <input type="text" placeholder="Enter findings..." value={manpowerAndSummary.finalRecommendation} onChange={(e) => handleFieldUpdate(setManpowerAndSummary, 'finalRecommendation', e.target.value)} className="w-full mt-1 p-1.5 border border-gray-300 rounded outline-none font-semibold" />
            </div>
            <div className="max-w-xs">
              <label className="font-bold text-gray-700 block">Specify Duration (Years)</label>
              <input type="number" min="0" placeholder="Years" value={manpowerAndSummary.finalDuration} onChange={(e) => handleFieldUpdate(setManpowerAndSummary, 'finalDuration', e.target.value)} className="w-20 mt-1 p-1.5 border border-gray-300 rounded text-center font-bold outline-none" />
            </div>
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