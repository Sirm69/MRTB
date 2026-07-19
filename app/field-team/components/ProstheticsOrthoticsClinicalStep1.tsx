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

export function ProstheticsOrthoticsClinicalStep1({ visitationDate, fieldTeamMembers, onComplete, inspectionReport, isReviewMode, isReadOnly, onBack}: Step1Props) {
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
    hodName: "", // Clinical Director
    prosthetistsOrthotists: "", 
    interns: "", 
    nysc: "", 
    technicians: "",
    comments: "", 
    recommendations: ""
  });

  // Non-Clinical Staff
  const [nonClinicalStaff, setNonClinicalStaff] = useState({
    adminStaff: "", 
    secretary: "", 
    porters: "", 
    cleaners: "", 
    securityPersonnel: "",
    comments: "", 
    recommendations: ""
  });

  // Space Evaluation
  const [spaceEval, setSpaceForm] = useState({
    signPost: "", signPostVisibility: "", signPostOthers: "", signPostComments: "", signPostRecs: "",
    entranceSize: "", entranceDisability: "", entranceOthers: "", exitDoors: "", exitDoorDisability: "", entranceComments: "", entranceRecs: "",
    outlookCondition: "", outlookOthers: "", outlookComments: "", outlookRecs: "",
    waitingSize: "", waitingCondition: "", waitingVentilation: "", waitingIllumination: "",
    recordsOffice: "", recordsSize: "", recordsCondition: "", recordsCabinets: "", recordsSecurity: "", recordsEmr: "", recordsLinked: "", recordsVentilation: "", recordsIllumination: "", recordsComments: "", recordsRecs: "",
    
    // P&O specific spaces
    assessmentRoomsCount: "", assessmentRoomsScreens: "", assessmentRoomsSize: "", assessmentRoomsVentilation: "", assessmentRoomsIllumination: "", assessmentRoomsComments: "", assessmentRoomsRecs: "",
    fabLabSize: "", fabLabEquipment: "", fabLabVentilation: "", fabLabIllumination: "", fabLabComments: "", fabLabRecs: "",
    productionRoomsCount: "", productionRoomsScreens: "", productionRoomsSize: "", productionRoomsVentilation: "", productionRoomsIllumination: "", productionRoomsComments: "", productionRoomsRecs: "",
    gaitRoomSize: "", gaitRoomEquipment: "", gaitRoomVentilation: "", gaitRoomIllumination: "", gaitRoomComments: "", gaitRoomRecs: "",
    storeSize: "", storeVentilation: "", storeIllumination: "", storeComments: "", storeRecs: "",
    libraryAvailable: "", libraryComments: "", libraryRecs: "",

    // Clinical Director's Office
    hodSize: "", hodCondition: "", hodOthers: "", hodFurnishings: "", hodVentilation: "", hodIllumination: "", hodSecretarial: "", hodConvenience: "", hodComments: "", hodRecs: "",
    
    // Other Offices Section
    otherOfficesOfficers: "", otherOfficesInterns: "", otherOfficesCorpers: "", otherOfficesNonClinicalTotal: "",
    otherOfficesSufficiency: "", otherOfficesFurnishing: "", otherOfficesSize: "", otherOfficesCondition: "", 
    otherOfficesVentilation: "", otherOfficesIllumination: "", otherOfficesComments: "", otherOfficesRecs: "",
    
    // Conveniences
    conveniencesStaffCount: "", conveniencesStaffSufficiency: "", conveniencesStaffClean: "", 
    conveniencesPatientCount: "", conveniencesPatientSufficiency: "", conveniencesPatientClean: "", 
    conveniencesLabels: "", conveniencesComments: "", conveniencesRecs: ""
  });

  // Quality & Performance Systems
  const [qualitySystems, setQualitySystems] = useState({ rating: "", comments: "", recommendations: "" });
  const [performanceMeasures, setPerformanceMeasures] = useState({ rating: "", comments: "", recommendations: "" });

  // Equipment Evaluation
  const [equipEval, setEquipEval] = useState({
    availability: "", quantity: "", quality: "", functionality: "",
    comments: "", recommendation: ""
  });

  // Overall Summary & Decision
  const [overallSummary, setOverallSummary] = useState({
    comments: "", recommendations: "", decision: "", duration: ""
  });

  const handleFieldUpdate = (setter: any, field: string, val: any) => {
    setter((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ travelInfo,
      clinicalStaff,
      nonClinicalStaff,
      spaceEval,
      qualitySystems,
      performanceMeasures,
      equipEval,
      overallSummary
    , _action: (window as any)._actionType || 'save' });
  };
  
  React.useEffect(() => {
    if (inspectionReport?.step2) {
      const s = inspectionReport.step2;
      if (s.travelInfo !== undefined) setTravelInfo(s.travelInfo);
      if (s.clinicalStaff !== undefined) setClinicalStaff(s.clinicalStaff);
      if (s.nonClinicalStaff !== undefined) setNonClinicalStaff(s.nonClinicalStaff);
      if (s.spaceEval !== undefined) setSpaceForm(s.spaceEval);
      if (s.equipEval !== undefined) setEquipEval(s.equipEval);
      if (s.overallSummary !== undefined) setOverallSummary(s.overallSummary);
      if (s.qualitySystems !== undefined) setQualitySystems(s.qualitySystems);
      if (s.performanceMeasures !== undefined) setPerformanceMeasures(s.performanceMeasures);
      setInitialDataString(getSerialized(s));
    }
  }, [inspectionReport]);
  
  React.useEffect(() => {
    if (!inspectionReport?.step2) {
      setInitialDataString(getSerialized({ travelInfo, clinicalStaff, nonClinicalStaff, spaceEval, qualitySystems, performanceMeasures, equipEval, overallSummary }));
    }
  }, []);

  
  const currentDataString = getSerialized({ travelInfo, clinicalStaff, nonClinicalStaff, spaceEval, qualitySystems, performanceMeasures, equipEval, overallSummary });
  const isDirty = initialDataString !== "" && currentDataString !== initialDataString;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full text-xs text-gray-800 antialiased font-semibold animate-in fade-in duration-200">
      <fieldset disabled={isReadOnly} className="space-y-6 w-full pb-20 contents">
      
      {/* 1. TRAVEL INFORMATION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Truck size={14} /> Travel Information & Reception
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-gray-600 block">Mode of Travel</label>
            <input type="text" value={travelInfo.modeOfTravel} onChange={(e) => handleFieldUpdate(setTravelInfo, 'modeOfTravel', e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded outline-none" />
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
            <label className="font-bold text-gray-600 block">Representatives of Clinical Institution</label>
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
            <label className="font-bold text-gray-600 block">Name of Clinical Director</label>
            <input type="text" value={clinicalStaff.hodName} onChange={(e) => handleFieldUpdate(setClinicalStaff, 'hodName', e.target.value)} className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 pt-1">
            {[
              { label: "Total no (s) Prosthetists and Orthotists", f: "prosthetistsOrthotists" },
              { label: "Total no (s) of Prosthetics and Orthotics Interns", f: "interns" },
              { label: "Total no (s) of Prosthetics and Orthotics Corp Members", f: "nysc" },
              { label: "Total no (s) of Prosthetics and Orthotics Technicians", f: "technicians" }
            ].map(item => (
              <div key={item.f} className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-700 font-semibold">{item.label}</span>
                <input type="number" min="0" value={clinicalStaff[item.f as keyof typeof clinicalStaff] || ""} onChange={(e) => handleFieldUpdate(setClinicalStaff, item.f, e.target.value)} className="w-16 p-1 border border-gray-300 rounded text-center font-bold outline-none" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={clinicalStaff.comments} onChange={(e) => handleFieldUpdate(setClinicalStaff, 'comments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
          <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={clinicalStaff.recommendations} onChange={(e) => handleFieldUpdate(setClinicalStaff, 'recommendations', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none outline-none" /></div>
        </div>
      </div>

      {/* 3. NON-CLINICAL STAFF */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Users size={14} /> Non-clinical staff
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
          {[
            { label: "Total no (s) of Administrative support staff", f: "adminStaff" },
            { label: "Total no (s) of Departmental Secretary", f: "secretary" },
            { label: "Total no (s) of Porters", f: "porters" },
            { label: "Total no (s) of Cleaners", f: "cleaners" },
            { label: "Total no (s) of security personnel", f: "securityPersonnel" }
          ].map(item => (
            <div key={item.f} className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="text-gray-700 font-semibold">{item.label}</span>
              <input type="number" min="0" value={nonClinicalStaff[item.f as keyof typeof nonClinicalStaff] || ""} onChange={(e) => handleFieldUpdate(setNonClinicalStaff, item.f, e.target.value)} className="w-14 p-0.5 border border-gray-300 rounded text-center font-bold outline-none" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={nonClinicalStaff.comments} onChange={(e) => handleFieldUpdate(setNonClinicalStaff, 'comments', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none" /></div>
          <div><label className="font-bold text-gray-500 block">Recommendations</label><textarea value={nonClinicalStaff.recommendations} onChange={(e) => handleFieldUpdate(setNonClinicalStaff, 'recommendations', e.target.value)} className="w-full mt-1 p-1 border border-gray-300 rounded h-12 resize-none" /></div>
        </div>
      </div>

      {/* 4. SPACE EVALUATION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Building2 size={14} /> Space Evaluation
        </h3>
        
        <div className="space-y-4 divide-y divide-gray-100">
          {/* Sign Post */}
          <div className="pt-1 space-y-2">
            <span className="font-bold text-gray-700 block">Departmental sign post:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Status:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="sign" checked={spaceEval.signPost === 'Absent'} onChange={() => {
                    handleFieldUpdate(setSpaceForm, 'signPost', 'Absent');
                    handleFieldUpdate(setSpaceForm, 'signPostVisibility', '');
                  }} /> Absent</label>
                  <label><input type="radio" name="sign" checked={spaceEval.signPost === 'Present'} onChange={() => handleFieldUpdate(setSpaceForm, 'signPost', 'Present')} /> Present</label>
                </div>
              </div>
              <div className={`flex items-center justify-between p-1.5 bg-slate-50 rounded transition-all duration-200 ${spaceEval.signPost !== 'Present' ? 'opacity-40 pointer-events-none' : ''}`}>
                <span>Visibility:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="signVis" disabled={spaceEval.signPost !== 'Present'} checked={spaceEval.signPostVisibility === 'Inconspicuous'} onChange={() => handleFieldUpdate(setSpaceForm, 'signPostVisibility', 'Inconspicuous')} /> Inconspicuous</label>
                  <label><input type="radio" name="signVis" disabled={spaceEval.signPost !== 'Present'} checked={spaceEval.signPostVisibility === 'Conspicuous'} onChange={() => handleFieldUpdate(setSpaceForm, 'signPostVisibility', 'Conspicuous')} /> Conspicuous</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea placeholder="Comments" value={spaceEval.signPostComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'signPostComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
              <textarea placeholder="Recommendations" value={spaceEval.signPostRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'signPostRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            </div>
          </div>

          {/* Entrance */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Doors/Entrance:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Size:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="entSz" checked={spaceEval.entranceSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'entranceSize', 'Small')} /> Small</label>
                  <label><input type="radio" name="entSz" checked={spaceEval.entranceSize === 'Okay'} onChange={() => handleFieldUpdate(setSpaceForm, 'entranceSize', 'Okay')} /> Okay</label>
                  <label><input type="radio" name="entSz" checked={spaceEval.entranceSize === 'Large'} onChange={() => handleFieldUpdate(setSpaceForm, 'entranceSize', 'Large')} /> Large</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Wheelchair Access:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="entDis" checked={spaceEval.entranceDisability === 'Wheelchair compliant'} onChange={() => handleFieldUpdate(setSpaceForm, 'entranceDisability', 'Wheelchair compliant')} /> Compliant</label>
                  <label><input type="radio" name="entDis" checked={spaceEval.entranceDisability === 'Dangerous'} onChange={() => handleFieldUpdate(setSpaceForm, 'entranceDisability', 'Dangerous')} /> Dangerous</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea placeholder="Comments" value={spaceEval.entranceComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'entranceComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
              <textarea placeholder="Recommendations" value={spaceEval.entranceRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'entranceRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            </div>
          </div>

          {/* Department Outlook */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">General outlook of the Centre:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Condition:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="outC" checked={spaceEval.outlookCondition === 'Unclean and untidy'} onChange={() => handleFieldUpdate(setSpaceForm, 'outlookCondition', 'Unclean and untidy')} /> Unclean/Untidy</label>
                  <label><input type="radio" name="outC" checked={spaceEval.outlookCondition === 'clean and tidy'} onChange={() => handleFieldUpdate(setSpaceForm, 'outlookCondition', 'clean and tidy')} /> Clean/Tidy</label>
                  <label><input type="radio" name="outC" checked={spaceEval.outlookCondition === 'beautiful'} onChange={() => handleFieldUpdate(setSpaceForm, 'outlookCondition', 'beautiful')} /> Beautiful</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea placeholder="Comments" value={spaceEval.outlookComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'outlookComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
              <textarea placeholder="Recommendations" value={spaceEval.outlookRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'outlookRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            </div>
          </div>

          {/* Patients Waiting Area */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Patients Waiting Area:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Size:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="waitSz" checked={spaceEval.waitingSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingSize', 'Small')} /> Small</label>
                  <label><input type="radio" name="waitSz" checked={spaceEval.waitingSize === 'large'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingSize', 'large')} /> Large</label>
                  <label><input type="radio" name="waitSz" checked={spaceEval.waitingSize === 'spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'waitingSize', 'spacious')} /> Spacious</label>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Rooms */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Assessment Rooms:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Rooms Count:</span>
                <input type="text" value={spaceEval.assessmentRoomsCount} onChange={(e) => handleFieldUpdate(setSpaceForm, 'assessmentRoomsCount', e.target.value)} className="w-16 p-0.5 border border-gray-300 rounded text-center outline-none bg-white font-bold" />
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Screens Available:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="arScr" checked={spaceEval.assessmentRoomsScreens === 'Available'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsScreens', 'Available')} /> Yes</label>
                  <label><input type="radio" name="arScr" checked={spaceEval.assessmentRoomsScreens === 'Not available'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsScreens', 'Not available')} /> No</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Size:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="arSz" checked={spaceEval.assessmentRoomsSize === 'small'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsSize', 'small')} /> Small</label>
                  <label><input type="radio" name="arSz" checked={spaceEval.assessmentRoomsSize === 'large'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsSize', 'large')} /> Large</label>
                  <label><input type="radio" name="arSz" checked={spaceEval.assessmentRoomsSize === 'spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsSize', 'spacious')} /> Spacious</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Ventilation:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="arVent" checked={spaceEval.assessmentRoomsVentilation === 'Poorly ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsVentilation', 'Poorly ventilated')} /> P</label>
                  <label><input type="radio" name="arVent" checked={spaceEval.assessmentRoomsVentilation === 'moderately ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsVentilation', 'moderately ventilated')} /> M</label>
                  <label><input type="radio" name="arVent" checked={spaceEval.assessmentRoomsVentilation === 'well-ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsVentilation', 'well-ventilated')} /> W</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Illumination:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="arIllum" checked={spaceEval.assessmentRoomsIllumination === 'Poorly illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsIllumination', 'Poorly illuminated')} /> P</label>
                  <label><input type="radio" name="arIllum" checked={spaceEval.assessmentRoomsIllumination === 'moderately illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsIllumination', 'moderately illuminated')} /> M</label>
                  <label><input type="radio" name="arIllum" checked={spaceEval.assessmentRoomsIllumination === 'well illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'assessmentRoomsIllumination', 'well illuminated')} /> W</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea placeholder="Assessment Rooms Comments" value={spaceEval.assessmentRoomsComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'assessmentRoomsComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
              <textarea placeholder="Assessment Rooms Recommendations" value={spaceEval.assessmentRoomsRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'assessmentRoomsRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            </div>
          </div>

          {/* Fabrication Laboratory */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Fabrication Laboratory:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Size:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="flSz" checked={spaceEval.fabLabSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabSize', 'Small')} /> Small</label>
                  <label><input type="radio" name="flSz" checked={spaceEval.fabLabSize === 'over crowd'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabSize', 'over crowd')} /> Overcrowd</label>
                  <label><input type="radio" name="flSz" checked={spaceEval.fabLabSize === 'large'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabSize', 'large')} /> Large</label>
                  <label><input type="radio" name="flSz" checked={spaceEval.fabLabSize === 'spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabSize', 'spacious')} /> Spacious</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Equipment:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="flEq" checked={spaceEval.fabLabEquipment === 'adequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabEquipment', 'adequate')} /> Adequate</label>
                  <label><input type="radio" name="flEq" checked={spaceEval.fabLabEquipment === 'Inadequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabEquipment', 'Inadequate')} /> Inadequate</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Ventilation:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="flVent" checked={spaceEval.fabLabVentilation === 'Poorly ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabVentilation', 'Poorly ventilated')} /> P</label>
                  <label><input type="radio" name="flVent" checked={spaceEval.fabLabVentilation === 'moderately ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabVentilation', 'moderately ventilated')} /> M</label>
                  <label><input type="radio" name="flVent" checked={spaceEval.fabLabVentilation === 'well-ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabVentilation', 'well-ventilated')} /> W</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Illumination:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="flIll" checked={spaceEval.fabLabIllumination === 'Poorly illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabIllumination', 'Poorly illuminated')} /> P</label>
                  <label><input type="radio" name="flIll" checked={spaceEval.fabLabIllumination === 'moderated illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabIllumination', 'moderated illuminated')} /> M</label>
                  <label><input type="radio" name="flIll" checked={spaceEval.fabLabIllumination === 'well-illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'fabLabIllumination', 'well-illuminated')} /> W</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea placeholder="Fab Lab Comments" value={spaceEval.fabLabComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'fabLabComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
              <textarea placeholder="Fab Lab Recommendations" value={spaceEval.fabLabRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'fabLabRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            </div>
          </div>

          {/* Production Rooms */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Production rooms (Casting area, lamination, repair):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Rooms Count:</span>
                <input type="text" value={spaceEval.productionRoomsCount} onChange={(e) => handleFieldUpdate(setSpaceForm, 'productionRoomsCount', e.target.value)} className="w-16 p-0.5 border border-gray-300 rounded text-center outline-none bg-white font-bold" />
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Screens Available:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="prScr" checked={spaceEval.productionRoomsScreens === 'available'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsScreens', 'available')} /> Yes</label>
                  <label><input type="radio" name="prScr" checked={spaceEval.productionRoomsScreens === 'Not available'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsScreens', 'Not available')} /> No</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Size:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="prSz" checked={spaceEval.productionRoomsSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsSize', 'Small')} /> Small</label>
                  <label><input type="radio" name="prSz" checked={spaceEval.productionRoomsSize === 'large'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsSize', 'large')} /> Large</label>
                  <label><input type="radio" name="prSz" checked={spaceEval.productionRoomsSize === 'spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsSize', 'spacious')} /> Spacious</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Ventilation:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="prVent" checked={spaceEval.productionRoomsVentilation === 'Poorly ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsVentilation', 'Poorly ventilated')} /> P</label>
                  <label><input type="radio" name="prVent" checked={spaceEval.productionRoomsVentilation === 'moderately ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsVentilation', 'moderately ventilated')} /> M</label>
                  <label><input type="radio" name="prVent" checked={spaceEval.productionRoomsVentilation === 'well ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsVentilation', 'well ventilated')} /> W</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Illumination:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="prIll" checked={spaceEval.productionRoomsIllumination === 'Poorly illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsIllumination', 'Poorly illuminated')} /> P</label>
                  <label><input type="radio" name="prIll" checked={spaceEval.productionRoomsIllumination === 'moderately illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsIllumination', 'moderately illuminated')} /> M</label>
                  <label><input type="radio" name="prIll" checked={spaceEval.productionRoomsIllumination === 'well illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'productionRoomsIllumination', 'well illuminated')} /> W</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea placeholder="Production Rooms Comments" value={spaceEval.productionRoomsComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'productionRoomsComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
              <textarea placeholder="Production Rooms Recommendations" value={spaceEval.productionRoomsRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'productionRoomsRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            </div>
          </div>

          {/* Gait Training Room */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Gait training room:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Size:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="gtSz" checked={spaceEval.gaitRoomSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomSize', 'Small')} /> Small</label>
                  <label><input type="radio" name="gtSz" checked={spaceEval.gaitRoomSize === 'over crowd'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomSize', 'over crowd')} /> Overcrowd</label>
                  <label><input type="radio" name="gtSz" checked={spaceEval.gaitRoomSize === 'large'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomSize', 'large')} /> Large</label>
                  <label><input type="radio" name="gtSz" checked={spaceEval.gaitRoomSize === 'spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomSize', 'spacious')} /> Spacious</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Equipment:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="gtEq" checked={spaceEval.gaitRoomEquipment === 'adequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomEquipment', 'adequate')} /> Adequate</label>
                  <label><input type="radio" name="gtEq" checked={spaceEval.gaitRoomEquipment === 'Inadequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomEquipment', 'Inadequate')} /> Inadeq</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Ventilation:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="gtVent" checked={spaceEval.gaitRoomVentilation === 'Poorly ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomVentilation', 'Poorly ventilated')} /> P</label>
                  <label><input type="radio" name="gtVent" checked={spaceEval.gaitRoomVentilation === 'moderately ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomVentilation', 'moderately ventilated')} /> M</label>
                  <label><input type="radio" name="gtVent" checked={spaceEval.gaitRoomVentilation === 'well-ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomVentilation', 'well-ventilated')} /> W</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Illumination:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="gtIllum" checked={spaceEval.gaitRoomIllumination === 'Poorly illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomIllumination', 'Poorly illuminated')} /> P</label>
                  <label><input type="radio" name="gtIllum" checked={spaceEval.gaitRoomIllumination === 'moderated illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomIllumination', 'moderated illuminated')} /> M</label>
                  <label><input type="radio" name="gtIllum" checked={spaceEval.gaitRoomIllumination === 'well-illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'gaitRoomIllumination', 'well-illuminated')} /> W</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea placeholder="Gait Room Comments" value={spaceEval.gaitRoomComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'gaitRoomComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
              <textarea placeholder="Gait Room Recommendations" value={spaceEval.gaitRoomRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'gaitRoomRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            </div>
          </div>

          {/* Store */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Store:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Size:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="stSz" checked={spaceEval.storeSize === 'small'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeSize', 'small')} /> Small</label>
                  <label><input type="radio" name="stSz" checked={spaceEval.storeSize === 'over crowd'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeSize', 'over crowd')} /> Overcrowd</label>
                  <label><input type="radio" name="stSz" checked={spaceEval.storeSize === 'large'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeSize', 'large')} /> Large</label>
                  <label><input type="radio" name="stSz" checked={spaceEval.storeSize === 'spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeSize', 'spacious')} /> Spacious</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Ventilation:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="stVent" checked={spaceEval.storeVentilation === 'Poorly ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeVentilation', 'Poorly ventilated')} /> P</label>
                  <label><input type="radio" name="stVent" checked={spaceEval.storeVentilation === 'moderately ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeVentilation', 'moderately ventilated')} /> M</label>
                  <label><input type="radio" name="stVent" checked={spaceEval.storeVentilation === 'well-ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeVentilation', 'well-ventilated')} /> W</label>
                </div>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Illumination:</span>
                <div className="flex gap-1.5">
                  <label><input type="radio" name="stIll" checked={spaceEval.storeIllumination === 'Poorly illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeIllumination', 'Poorly illuminated')} /> P</label>
                  <label><input type="radio" name="stIll" checked={spaceEval.storeIllumination === 'moderated illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeIllumination', 'moderated illuminated')} /> M</label>
                  <label><input type="radio" name="stIll" checked={spaceEval.storeIllumination === 'well-illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'storeIllumination', 'well-illuminated')} /> W</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea placeholder="Store Comments" value={spaceEval.storeComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'storeComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
              <textarea placeholder="Store Recommendations" value={spaceEval.storeRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'storeRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            </div>
          </div>

          {/* Library */}
          <div className="pt-3 space-y-2">
            <span className="font-bold text-gray-700 block">Departmental Library/E-Library:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-semibold text-gray-700">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                <span>Availability:</span>
                <div className="flex gap-2">
                  <label><input type="radio" name="libAv" checked={spaceEval.libraryAvailable === 'available'} onChange={() => handleFieldUpdate(setSpaceForm, 'libraryAvailable', 'available')} /> Available</label>
                  <label><input type="radio" name="libAv" checked={spaceEval.libraryAvailable === 'Unavailable'} onChange={() => handleFieldUpdate(setSpaceForm, 'libraryAvailable', 'Unavailable')} /> Unavailable</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea placeholder="Library Comments" value={spaceEval.libraryComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'libraryComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
              <textarea placeholder="Library Recommendations" value={spaceEval.libraryRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'libraryRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            </div>
          </div>

          {/* Offices Section */}
          <div className="pt-3 space-y-4">
            <span className="font-bold text-gray-950 uppercase tracking-wide block">Offices</span>
            
            {/* Clinical Director's Office Details */}
            <div className="p-3 border border-gray-200 bg-slate-50/50 rounded-lg space-y-2">
              <span className="font-bold text-gray-700 block">Clinical Director's Office:</span>
              <div className="flex flex-wrap gap-4 font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <span>Size:</span>
                  <label><input type="radio" name="hodSz" checked={spaceEval.hodSize === 'Small'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSize', 'Small')} /> Small</label>
                  <label><input type="radio" name="hodSz" checked={spaceEval.hodSize === 'over crowded'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSize', 'over crowded')} /> Overcrowded</label>
                  <label><input type="radio" name="hodSz" checked={spaceEval.hodSize === 'spacious'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSize', 'spacious')} /> Spacious</label>
                  <label><input type="radio" name="hodSz" checked={spaceEval.hodSize === 'large'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSize', 'large')} /> Large</label>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Ventilation:</span>
                  <label><input type="radio" name="hodV" checked={spaceEval.hodVentilation === 'Poorly ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodVentilation', 'Poorly ventilated')} /> P</label>
                  <label><input type="radio" name="hodV" checked={spaceEval.hodVentilation === 'moderately ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodVentilation', 'moderately ventilated')} /> M</label>
                  <label><input type="radio" name="hodV" checked={spaceEval.hodVentilation === 'well-ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodVentilation', 'well-ventilated')} /> W</label>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Illumination:</span>
                  <label><input type="radio" name="hodI" checked={spaceEval.hodIllumination === 'Poorly illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodIllumination', 'Poorly illuminated')} /> P</label>
                  <label><input type="radio" name="hodI" checked={spaceEval.hodIllumination === 'moderately-illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodIllumination', 'moderately-illuminated')} /> M</label>
                  <label><input type="radio" name="hodI" checked={spaceEval.hodIllumination === 'well-illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodIllumination', 'well-illuminated')} /> W</label>
                </div>
                <div className="flex items-center gap-2">
                  <span>Secretarial Unit:</span>
                  <label><input type="radio" name="hodSec" checked={spaceEval.hodSecretarial === 'attached to Clinical Director’s office'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSecretarial', 'attached to Clinical Director’s office')} /> Attached</label>
                  <label><input type="radio" name="hodSec" checked={spaceEval.hodSecretarial === 'Not attached to Clinical Director’s office'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodSecretarial', 'Not attached to Clinical Director’s office')} /> Not Attached</label>
                </div>
                <div className="flex items-center gap-2">
                  <span>Convenience:</span>
                  <label><input type="radio" name="hodConv" checked={spaceEval.hodConvenience === 'present in Clinical Director’s office'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodConvenience', 'present in Clinical Director’s office')} /> Present</label>
                  <label><input type="radio" name="hodConv" checked={spaceEval.hodConvenience === 'absent in Clinical Director’s office'} onChange={() => handleFieldUpdate(setSpaceForm, 'hodConvenience', 'absent in Clinical Director’s office')} /> Absent</label>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
                <textarea placeholder="Clinical Director Office Comments" value={spaceEval.hodComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'hodComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none bg-white outline-none" />
                <textarea placeholder="Clinical Director Office Recommendations" value={spaceEval.hodRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'hodRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none bg-white outline-none" />
              </div>
            </div>

            {/* Other Offices */}
            <div className="p-3 border border-gray-200 bg-slate-50/50 rounded-lg space-y-3">
              <span className="font-bold text-gray-700 block">Other Offices details:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { label: "P&O Officers Offices", f: "otherOfficesOfficers" },
                  { label: "P&O Interns Offices", f: "otherOfficesInterns" },
                  { label: "P&O Corpers Offices", f: "otherOfficesCorpers" },
                  { label: "Non-clinical Staff Offices", f: "otherOfficesNonClinicalTotal" }
                ].map(item => (
                  <div key={item.f} className="p-1.5 bg-white border rounded">
                    <label className="font-bold text-gray-500 block text-[10px]">{item.label}</label>
                    <input type="number" min="0" value={spaceEval[item.f as keyof typeof spaceEval] || ""} onChange={(e) => handleFieldUpdate(setSpaceForm, item.f, e.target.value)} className="w-12 p-0.5 border rounded mt-1 text-center font-bold" />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 font-semibold text-gray-700 pt-1">
                <div className="flex items-center gap-1.5">
                  <span>Ventilation:</span>
                  <label><input type="radio" name="ooVent" checked={spaceEval.otherOfficesVentilation === 'Poorly ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesVentilation', 'Poorly ventilated')} /> P</label>
                  <label><input type="radio" name="ooVent" checked={spaceEval.otherOfficesVentilation === 'moderately ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesVentilation', 'moderately ventilated')} /> M</label>
                  <label><input type="radio" name="ooVent" checked={spaceEval.otherOfficesVentilation === 'well ventilated'} onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesVentilation', 'well ventilated')} /> W</label>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Illumination:</span>
                  <label><input type="radio" name="ooIll" checked={spaceEval.otherOfficesIllumination === 'Poorly illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesIllumination', 'Poorly illuminated')} /> P</label>
                  <label><input type="radio" name="ooIll" checked={spaceEval.otherOfficesIllumination === 'moderately illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesIllumination', 'moderately illuminated')} /> M</label>
                  <label><input type="radio" name="ooIll" checked={spaceEval.otherOfficesIllumination === 'well illuminated'} onChange={() => handleFieldUpdate(setSpaceForm, 'otherOfficesIllumination', 'well illuminated')} /> W</label>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <textarea placeholder="Other Offices Comments" value={spaceEval.otherOfficesComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'otherOfficesComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none bg-white outline-none" />
                <textarea placeholder="Other Offices Recommendations" value={spaceEval.otherOfficesRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'otherOfficesRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none bg-white outline-none" />
              </div>
            </div>
          </div>

          {/* Rest Rooms / Conveniences */}
          <div className="pt-3 space-y-3">
            <span className="font-bold text-gray-950 uppercase tracking-wide block">Rest Rooms / Conveniences</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold text-gray-700">
              {/* Staff Toilets */}
              <div className="bg-slate-50/50 p-3 border rounded-lg space-y-2">
                <span className="font-bold text-gray-900 block border-b border-gray-200 pb-0.5">Staff conveniences:</span>
                <div className="flex items-center justify-between">
                  <span>Toilets count:</span>
                  <input type="text" value={spaceEval.conveniencesStaffCount} onChange={(e) => handleFieldUpdate(setSpaceForm, 'conveniencesStaffCount', e.target.value)} className="w-12 p-0.5 border rounded text-center bg-white" />
                </div>
                <div className="flex gap-4">
                  <label><input type="radio" name="stC" checked={spaceEval.conveniencesStaffSufficiency === 'adequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesStaffSufficiency', 'adequate')} /> Adequate</label>
                  <label><input type="radio" name="stC" checked={spaceEval.conveniencesStaffSufficiency === 'inadequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesStaffSufficiency', 'inadequate')} /> Inadequate</label>
                </div>
                <div className="flex gap-4">
                  <label><input type="radio" name="stCl" checked={spaceEval.conveniencesStaffClean === 'clean'} onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesStaffClean', 'clean')} /> Clean</label>
                  <label><input type="radio" name="stCl" checked={spaceEval.conveniencesStaffClean === 'unclean'} onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesStaffClean', 'unclean')} /> Unclean</label>
                </div>
              </div>

              {/* Patients Toilets */}
              <div className="bg-slate-50/50 p-3 border rounded-lg space-y-2">
                <span className="font-bold text-gray-900 block border-b border-gray-200 pb-0.5">Patients conveniences:</span>
                <div className="flex items-center justify-between">
                  <span>Toilets count:</span>
                  <input type="text" value={spaceEval.conveniencesPatientCount} onChange={(e) => handleFieldUpdate(setSpaceForm, 'conveniencesPatientCount', e.target.value)} className="w-12 p-0.5 border rounded text-center bg-white" />
                </div>
                <div className="flex gap-4">
                  <label><input type="radio" name="ptC" checked={spaceEval.conveniencesPatientSufficiency === 'adequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesPatientSufficiency', 'adequate')} /> Adequate</label>
                  <label><input type="radio" name="ptC" checked={spaceEval.conveniencesPatientSufficiency === 'inadequate'} onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesPatientSufficiency', 'inadequate')} /> Inadequate</label>
                </div>
                <div className="flex gap-4">
                  <label><input type="radio" name="ptCl" checked={spaceEval.conveniencesPatientClean === 'clean'} onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesPatientClean', 'clean')} /> Clean</label>
                  <label><input type="radio" name="ptCl" checked={spaceEval.conveniencesPatientClean === 'unclean'} onChange={() => handleFieldUpdate(setSpaceForm, 'conveniencesPatientClean', 'unclean')} /> Unclean</label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5">
              <textarea placeholder="Conveniences Comments" value={spaceEval.conveniencesComments} onChange={(e) => handleFieldUpdate(setSpaceForm, 'conveniencesComments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none bg-white outline-none" />
              <textarea placeholder="Conveniences Recommendations" value={spaceEval.conveniencesRecs} onChange={(e) => handleFieldUpdate(setSpaceForm, 'conveniencesRecs', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none bg-white outline-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. QUALITY SYSTEMS & PERFORMANCE OUTCOMES */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <ClipboardCheck size={14} /> Quality Systems & Clinical Performance
        </h3>
        
        {/* Quality Systems & Outcomes */}
        <div className="p-3 border border-gray-200 rounded-lg space-y-2">
          <span className="font-bold text-gray-700 block">Quality Systems & Outcomes:</span>
          <div className="flex gap-4 font-semibold text-gray-700">
            {['Absent', 'fair', 'good', 'excellent'].map(r => (
              <label key={r} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name="qsRating" checked={qualitySystems.rating === r} onChange={() => handleFieldUpdate(setQualitySystems, 'rating', r)} /> {r}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <textarea placeholder="Quality Systems Comments" value={qualitySystems.comments} onChange={(e) => handleFieldUpdate(setQualitySystems, 'comments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            <textarea placeholder="Quality Systems Recommendations" value={qualitySystems.recommendations} onChange={(e) => handleFieldUpdate(setQualitySystems, 'recommendations', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
          </div>
        </div>

        {/* Clinical Performance & Outcome Measures */}
        <div className="p-3 border border-gray-200 rounded-lg space-y-2">
          <span className="font-bold text-gray-700 block">Clinical Performance & Outcome Measures:</span>
          <div className="flex gap-4 font-semibold text-gray-700">
            {['Absent', 'fair', 'good', 'excellent'].map(r => (
              <label key={r} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name="cpRating" checked={performanceMeasures.rating === r} onChange={() => handleFieldUpdate(setPerformanceMeasures, 'rating', r)} /> {r}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <textarea placeholder="Clinical Performance Comments" value={performanceMeasures.comments} onChange={(e) => handleFieldUpdate(setPerformanceMeasures, 'comments', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
            <textarea placeholder="Clinical Performance Recommendations" value={performanceMeasures.recommendations} onChange={(e) => handleFieldUpdate(setPerformanceMeasures, 'recommendations', e.target.value)} className="p-1.5 border border-gray-300 rounded h-12 resize-none outline-none" />
          </div>
        </div>
      </div>

      {/* 6. EQUIPMENT EVALUATION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <Wrench size={14} /> Equipment Evaluation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-semibold text-gray-700">
          <div className="bg-slate-50 p-2 rounded border">
            <span className="block mb-1 font-bold text-gray-600">Equipment Availability</span>
            <div className="flex gap-2">
              <label><input type="radio" name="eqAv" checked={equipEval.availability === 'Adequate'} onChange={() => handleFieldUpdate(setEquipEval, 'availability', 'Adequate')} /> Adequate</label>
              <label><input type="radio" name="eqAv" checked={equipEval.availability === 'inadequate'} onChange={() => handleFieldUpdate(setEquipEval, 'availability', 'inadequate')} /> Inadeq</label>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded border">
            <span className="block mb-1 font-bold text-gray-600">Quantity</span>
            <select value={equipEval.quantity} onChange={(e) => handleFieldUpdate(setEquipEval, 'quantity', e.target.value)} className="w-full p-1 border rounded bg-white text-xs outline-none">
              <option value="">Select</option>
              <option value="Insufficient">Insufficient</option>
              <option value="moderately sufficient">Moderately sufficient</option>
              <option value="sufficient">Sufficient</option>
            </select>
          </div>
          <div className="bg-slate-50 p-2 rounded border">
            <span className="block mb-1 font-bold text-gray-600">Quality</span>
            <div className="flex gap-1.5 flex-wrap">
              {['Poor', 'fair', 'good', 'excellent'].map(q => (
                <label key={q} className="text-[10px]"><input type="radio" name="eqQual" checked={equipEval.quality === q} onChange={() => handleFieldUpdate(setEquipEval, 'quality', q)} /> {q}</label>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded border">
            <span className="block mb-1 font-bold text-gray-600">Functionality</span>
            <div className="flex gap-1.5 flex-wrap">
              {['Poor', 'fair', 'good', 'excellent'].map(f => (
                <label key={f} className="text-[10px]"><input type="radio" name="eqFunc" checked={equipEval.functionality === f} onChange={() => handleFieldUpdate(setEquipEval, 'functionality', f)} /> {f}</label>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div><label className="font-bold text-gray-500 block">Comments</label><textarea value={equipEval.comments} onChange={(e) => handleFieldUpdate(setEquipEval, 'comments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none" /></div>
          <div><label className="font-bold text-gray-500 block">Recommendation</label><textarea value={equipEval.recommendation} onChange={(e) => handleFieldUpdate(setEquipEval, 'recommendation', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-14 resize-none" /></div>
        </div>
      </div>

      {/* 7. OVERALL SUMMARY, RECOMMENDATIONS & CONCLUSION */}
      <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
          <ClipboardCheck size={14} /> Overall Summary, Recommendations & Conclusion
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-gray-500 block">Overall Summary & Comments</label>
            <textarea value={overallSummary.comments} onChange={(e) => handleFieldUpdate(setOverallSummary, 'comments', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-20 resize-none outline-none" />
          </div>
          <div>
            <label className="font-bold text-gray-500 block">Overall Recommendations</label>
            <textarea value={overallSummary.recommendations} onChange={(e) => handleFieldUpdate(setOverallSummary, 'recommendations', e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded h-20 resize-none outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className="font-bold text-gray-600 block">Accreditation Recommendation</label>
            <div className="flex gap-4 mt-2 font-semibold">
              {['Denial', 'Partial', 'Full'].map(d => (
                <label key={d} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="decision" checked={overallSummary.decision === d} onChange={() => handleFieldUpdate(setOverallSummary, 'decision', d)} className="w-3.5 h-3.5 text-gray-900 focus:ring-0" /> {d}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-bold text-gray-600 block">Specify Duration (years)</label>
            <input type="text" value={overallSummary.duration} onChange={(e) => handleFieldUpdate(setOverallSummary, 'duration', e.target.value)} className="w-full max-w-[120px] mt-1 p-1.5 border border-gray-300 rounded font-bold" placeholder="e.g. 2 years" />
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
