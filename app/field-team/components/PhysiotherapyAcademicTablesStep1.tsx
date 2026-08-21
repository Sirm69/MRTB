"use client";

import React, { useState, useEffect } from 'react';
import { Building2, BookOpen, Wrench, ArrowRight, ClipboardCheck, Truck, Plus, Trash2 } from 'lucide-react';
import { getActiveMap } from '@/app/admin/components/assessment-dictionaries';

interface Step1Props {
  visitationDate?: string;
  fieldTeamMembers?: string;
  institutionName?: string;
  spacesData: any[];
  clinicalData: any[];
  equipmentData: any[];
  assessmentType: string;
  onComplete: (step1Data: any) => void;
  inspectionReport?: any;
  isReadOnly?: boolean;
}

export function PhysiotherapyAcademicTablesStep1({ visitationDate, fieldTeamMembers, institutionName, spacesData, clinicalData, equipmentData, assessmentType, onComplete, inspectionReport, isReadOnly}: Step1Props) {
  const [representatives, setRepresentatives] = useState<string[]>(["", "", ""]);

  const [preamble, setPreamble] = useState({
    modeOfTravel: "", arrivalDate: "", arrivalTime: "", placeOfReception: "",
    typeWarm: false, typeCordial: false, typeHostile: false, typeOthersChecked: false, typeOthersText: "",
    programToAccredit: ""
  });

  const handleFieldUpdate = (setter: any, field: string, value: any) => {
    setter((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateRepValue = (index: number, val: string) => {
    const updated = [...representatives];
    updated[index] = val;
    setRepresentatives(updated);
  };

  // 1. CURRICULUM/STUDENTS HANDBOOK GRID (SOURCE 6 VERBATIM)
  const [curriculumGrid, setCurriculumGrid] = useState([
    { sn: 1, item: "Programme Philosophy and Objectives", adequacy: "" },
    { sn: 2, item: "Admission Requirements", adequacy: "" },
    { sn: 3, item: "Courses of the programme\nentry point requirement\nstudent lecture ratio compliance (1:10)", adequacy: "" },
    { sn: 4, item: "Academic Regulations\nProgression from one level to the next\nCourse evaluation\nPractical’s\nResearch project\nExternal examination system\nExternal Examiner’s Reports\nDuration of training (minimum and maximum)\nGraduation requirements\nBoard Professional examination\nThe Passmarks", adequacy: "" },
    { sn: 5, item: "Students’ mode of dressing", adequacy: "" }
  ]);

  // 2. ADDITIONAL TRACKING DATA CAPTURE STATE WITH TINT COLOR THEMES
  const [spacesInput, setSpacesInput] = useState<Record<string, { condition: string; comment: string }>>({});
  const [clinicalInput, setClinicalInput] = useState<Record<string, { observed: string; comment: string }>>({});
  const [equipmentInput, setEquipmentInput] = useState<Record<string, { observed: string; functionality: string }>>({});

  const handleCurriculumChange = (idx: number, val: string) => {
    const updated = [...curriculumGrid];
    updated[idx].adequacy = val;
    setCurriculumGrid(updated);
  };

  const handleSpaceChange = (key: string, col: 'condition' | 'comment', value: string) => {
    setSpacesInput(prev => ({ ...prev, [key]: { ...prev[key], [col]: value } }));
  };

  const handleClinicalChange = (key: string, col: 'observed' | 'comment', value: string) => {
    setClinicalInput(prev => ({ ...prev, [key]: { ...prev[key], [col]: value } }));
  };

  const handleEquipmentChange = (key: string, col: 'observed' | 'functionality', value: string) => {
    setEquipmentInput(prev => ({ ...prev, [key]: { ...prev[key], [col]: value } }));
  };

  // NATIVE COMPILATION LOOP: Grouping and processing logic for required quantities across arrays
  const compileOriginalGroups = (items: any[]) => {
    if (!items || items.length === 0) return [];
    
    const activeMap = typeof getActiveMap === 'function' ? getActiveMap(assessmentType) : {};
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
        let baseReqQty = item.requiredQuantity || item.required_quantity || activeMap[item.item] || "-";
        
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

  const spacesGroups = compileOriginalGroups(spacesData);
  const clinicalGroups = compileOriginalGroups(clinicalData);
  const equipmentGroups = compileOriginalGroups(equipmentData);

  const handleSubmitProceed = () => {
    onComplete({ representatives, preamble, curriculumGrid, spacesInput, clinicalInput, equipmentInput });
  };
  
  React.useEffect(() => {
    if (inspectionReport) {
      const s1 = inspectionReport.step1;
      const s2 = inspectionReport.step2;
      if (s1) {
        if (s1.curriculumGrid !== undefined) setCurriculumGrid(s1.curriculumGrid);
        if (s1.spacesInput !== undefined) setSpacesInput(s1.spacesInput);
        if (s1.clinicalInput !== undefined) setClinicalInput(s1.clinicalInput);
        if (s1.equipmentInput !== undefined) setEquipmentInput(s1.equipmentInput);
        if (s1.preamble !== undefined) setPreamble(s1.preamble);
        if (s1.representatives !== undefined) setRepresentatives(s1.representatives);
      }
      if (s2) {
        if (s2.preamble !== undefined && (!s1 || !s1.preamble)) setPreamble(s2.preamble);
        if (s2.representatives !== undefined && (!s1 || !s1.representatives)) setRepresentatives(s2.representatives);
      }
    }
  }, [inspectionReport]);
  return (
    <div className="space-y-6 w-full text-xs text-gray-800 antialiased font-normal animate-in fade-in duration-200">
      <fieldset disabled={isReadOnly} className="space-y-6 w-full block border-0 p-0 m-0 min-w-0">

      {/* =======================================================================
          0. PREAMBLE & VERIFICATION CONTEXT (PAGE 1)
          ======================================================================= */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <Truck size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Preamble & Verification Context</h3>
            <p className="text-xs text-gray-500 font-normal">Accreditation reception, travel information, and institution details.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="font-medium text-gray-600 block mb-1 text-[11px]">Inspection Date</label>
            <input type="text" value={visitationDate || "Not Scheduled"} readOnly className="w-full py-1.5 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-medium cursor-not-allowed text-xs" />
          </div>
          <div className="sm:col-span-2">
            <label className="font-medium text-gray-600 block mb-1 text-[11px]">Accreditation Team Members</label>
            <input type="text" value={fieldTeamMembers || ""} readOnly className="w-full py-1.5 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-medium cursor-not-allowed text-xs" />
          </div>
          <div>
            <label className="font-medium text-gray-600 block mb-1 text-[11px]">Mode of Travel</label>
            <input type="text" value={preamble.modeOfTravel} onChange={(e) => handleFieldUpdate(setPreamble, 'modeOfTravel', e.target.value)} className="w-full py-1.5 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs outline-none transition-colors" placeholder="e.g. Flight / Road" />
          </div>
          <div>
            <label className="font-medium text-gray-600 block mb-1 text-[11px]">Arrival Date</label>
            <input type="date" value={preamble.arrivalDate} onChange={(e) => handleFieldUpdate(setPreamble, 'arrivalDate', e.target.value)} className="w-full py-1.5 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs outline-none transition-colors" />
          </div>
          <div>
            <label className="font-medium text-gray-600 block mb-1 text-[11px]">Arrival Time</label>
            <input type="time" value={preamble.arrivalTime} onChange={(e) => handleFieldUpdate(setPreamble, 'arrivalTime', e.target.value)} className="w-full py-1.5 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs outline-none transition-colors" />
          </div>
          <div className="sm:col-span-3">
            <label className="font-medium text-gray-600 block mb-1 text-[11px]">Place of Reception</label>
            <input type="text" value={preamble.placeOfReception} onChange={(e) => handleFieldUpdate(setPreamble, 'placeOfReception', e.target.value)} className="w-full py-1.5 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs outline-none transition-colors" placeholder="Reception venue..." />
          </div>
          
          <div className="sm:col-span-3 pt-1">
            <label className="font-medium text-gray-700 block mb-1.5 text-[11px]">Type of Reception:</label>
            <div className="flex gap-4 items-center flex-wrap text-xs text-gray-700 font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={preamble.typeWarm} onChange={(e) => setPreamble(p => ({ ...p, typeWarm: e.target.checked, typeCordial: false, typeHostile: false, typeOthersChecked: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Warm</label>
              <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={preamble.typeCordial} onChange={(e) => setPreamble(p => ({ ...p, typeCordial: e.target.checked, typeWarm: false, typeHostile: false, typeOthersChecked: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Cordial</label>
              <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={preamble.typeHostile} onChange={(e) => setPreamble(p => ({ ...p, typeHostile: e.target.checked, typeWarm: false, typeCordial: false, typeOthersChecked: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Hostile</label>
              <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={preamble.typeOthersChecked} onChange={(e) => setPreamble(p => ({ ...p, typeOthersChecked: e.target.checked, typeWarm: false, typeCordial: false, typeHostile: false }))} className="rounded accent-[#5D9C0E] w-3.5 h-3.5" /> Others, please specify</label>
            </div>
            {preamble.typeOthersChecked && (
              <div className="mt-2">
                <input type="text" value={preamble.typeOthersText} onChange={(e) => handleFieldUpdate(setPreamble, 'typeOthersText', e.target.value)} className="w-full py-1.5 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs outline-none transition-colors" placeholder="Specify reception particulars..." />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2.5">
          <span className="font-bold text-gray-800 block text-xs uppercase tracking-wider">Institution Particulars</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-gray-600 block mb-1 text-[11px]">Name of Institution</label>
              <input type="text" value={institutionName || ""} readOnly className="w-full py-1.5 px-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 font-medium cursor-not-allowed text-xs" />
            </div>
            <div>
              <label className="font-medium text-gray-600 block mb-1 text-[11px]">Program to be Accredited</label>
              <input type="text" value={preamble.programToAccredit} onChange={(e) => handleFieldUpdate(setPreamble, 'programToAccredit', e.target.value)} className="w-full py-1.5 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs outline-none transition-colors" placeholder="e.g. B.Sc Physiotherapy" />
            </div>
            
            <div className="sm:col-span-2 space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <label className="font-medium text-gray-700 block text-[11px]">Representatives of Institution:</label>
                <button type="button" onClick={() => setRepresentatives(p => [...p, ""])} className="px-2 py-0.5 bg-[#EEF6DF] hover:bg-[#EEF6DF]/80 border border-[#CDE1B4]/60 text-[#066936] font-medium text-[10.5px] rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer"><Plus size={11} /> Add Line</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {representatives.map((rep, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-400 w-4 text-right text-[11px]">{idx + 1}.</span>
                    <input type="text" value={rep} onChange={(e) => updateRepValue(idx, e.target.value)} className="flex-1 py-1 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg outline-none text-xs bg-white transition-colors" placeholder="Representative name..." />
                    {representatives.length > 3 && (
                      <button type="button" onClick={() => setRepresentatives(p => p.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"><Trash2 size={13} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* =======================================================================
          A. CURRICULUM / STUDENTS HANDBOOK TABLE
          ======================================================================= */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <BookOpen size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-tight">I. Academic Matters — Curriculum & Students Handbook</h3>
            <p className="text-xs text-gray-400 font-normal">Evaluate curriculum adequacy and academic progression policies.</p>
          </div>
        </div>

        <div className="overflow-x-auto w-full rounded-xl border border-gray-150">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/80 text-gray-700 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-2.5 px-3 w-[60px] text-center border-r border-gray-200/80">S/N</th>
                <th className="py-2.5 px-4 min-w-[350px] border-r border-gray-200/80">Items & Guidelines</th>
                <th className="py-2.5 px-4 w-[200px] text-center bg-[#F4F9EE] text-[#066936]">Adequacy Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {curriculumGrid.map((row, idx) => (
                <tr key={row.sn} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 text-center font-medium text-gray-400 border-r border-gray-100">{row.sn}</td>
                  <td className="py-3 px-4 text-gray-800 whitespace-pre-line font-medium leading-relaxed border-r border-gray-100">{row.item}</td>
                  <td className="p-2.5 bg-[#FAFCF8] text-center">
                    <select 
                      value={row.adequacy || ""} 
                      onChange={(e) => handleCurriculumChange(idx, e.target.value)} 
                      className="w-full py-1.5 px-2.5 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs font-medium text-gray-800 outline-none transition-colors"
                    >
                      <option value="">Select Status</option>
                      <option value="Adequate">Adequate</option>
                      <option value="Not Adequate">Not Adequate</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =======================================================================
          B. SPACE EVALUATION TABLES
          ======================================================================= */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <Building2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-tight">II. Space Evaluation & Physical Facilities</h3>
            <p className="text-xs text-gray-400 font-normal">Audit availability, physical state, and general condition of teaching spaces.</p>
          </div>
        </div>
        
        {spacesGroups.map((group, groupIdx) => {
          if (!group.items.length && !group.category) return null;
          return (
            <div key={groupIdx} className="w-full space-y-2.5 pt-2">
              {group.category && (
                <div className="flex items-center gap-2 bg-[#F8FCF5] border border-[#CDE1B4]/40 px-3.5 py-1.5 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-[#5D9C0E]"></span>
                  <h4 className="text-xs font-semibold text-[#066936] uppercase tracking-wider">{group.category}</h4>
                </div>
              )}
              {group.items.length > 0 && (
                <div className="w-full bg-white rounded-xl border border-gray-150 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-gray-50/80 text-gray-700 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-200">
                          <th className="py-2.5 px-3 w-[50px] text-center border-r border-gray-200/80">S/N</th>
                          <th className="py-2.5 px-3 min-w-[220px] border-r border-gray-200/80">Item / Description</th>
                          <th className="py-2.5 px-2.5 w-[90px] text-center border-r border-gray-200/80">Declared</th>
                          <th className="py-2.5 px-2.5 w-[140px] text-center border-r border-gray-200/80 bg-[#F4F9EE] text-[#066936]">Condition</th>
                          <th className="py-2.5 px-3 min-w-[180px] text-center bg-[#F4F9EE] text-[#066936]">Field Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((item: any, idx: number) => {
                          const uniqueKey = `space-${groupIdx}-${idx}-${item.sn}`;
                          const gridVal = spacesInput[uniqueKey] || { condition: "", comment: "" };

                          return (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                              <td className={`py-2 px-3 text-[11px] text-center border-r border-gray-100 ${item.isSubItem ? 'text-[#5D9C0E] font-medium' : 'text-gray-400 font-medium'}`}>{item.sn}</td>
                              <td className={`py-2 px-3 text-xs leading-normal border-r border-gray-100 ${item.isSubItem ? 'pl-8 text-gray-600 font-normal' : 'font-medium text-gray-900'}`}>{item.item}</td>
                              
                              {item.isHeader ? (
                                <td colSpan={3} className="py-2 px-3 text-[10px] text-gray-400 italic bg-gray-50/50 text-right">Sub-items listed below</td>
                              ) : (
                                <>
                                  <td className="py-2 px-2 text-center border-r border-gray-100">
                                    {item.isAvailable === 'Yes' || item.isAvailable === 'Available' || item.status === 'Available' || item.status === 'Present' ? (
                                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-medium">Available</span>
                                    ) : item.isAvailable === 'No' || item.isAvailable === 'Not Available' || item.status === 'Not Available' || item.status === 'Absent' ? (
                                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-[10px] font-medium">N/A</span>
                                    ) : <span className="text-gray-400 font-medium">-</span>}
                                  </td>
                                  
                                  <td className="p-1.5 bg-[#FAFCF8] border-r border-gray-100">
                                    <select value={gridVal.condition || ""} onChange={(e) => handleSpaceChange(uniqueKey, 'condition', e.target.value)} className="w-full py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs font-medium text-gray-800 outline-none transition-colors">
                                      <option value="">Select</option>
                                      <option value="Good">Good</option>
                                      <option value="Fair">Fair</option>
                                      <option value="Poor">Poor</option>
                                    </select>
                                  </td>
                                  <td className="p-1.5 bg-[#FAFCF8]">
                                    <input type="text" placeholder="Add comment..." value={gridVal.comment || ""} onChange={(e) => handleSpaceChange(uniqueKey, 'comment', e.target.value)} className="w-full px-2.5 py-1 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs text-gray-800 outline-none transition-colors" />
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =======================================================================
          C. CLINICAL TRAINING TABLES
          ======================================================================= */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <ClipboardCheck size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-tight">III. Clinical Training Facilities</h3>
            <p className="text-xs text-gray-400 font-normal">Audit training labs, patient cubicles, and clinical postings infrastructure.</p>
          </div>
        </div>
        
        {clinicalGroups.map((group, groupIdx) => {
          if (!group.items.length && !group.category) return null;
          return (
            <div key={groupIdx} className="w-full space-y-2.5 pt-2">
              {group.category && (
                <div className="flex items-center gap-2 bg-[#F8FCF5] border border-[#CDE1B4]/40 px-3.5 py-1.5 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-[#5D9C0E]"></span>
                  <h4 className="text-xs font-semibold text-[#066936] uppercase tracking-wider">{group.category}</h4>
                </div>
              )}
              {group.items.length > 0 && (
                <div className="w-full bg-white rounded-xl border border-gray-150 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-gray-50/80 text-gray-700 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-200">
                          <th className="py-2.5 px-3 w-[50px] text-center border-r border-gray-200/80">S/N</th>
                          <th className="py-2.5 px-3 min-w-[220px] border-r border-gray-200/80">Requirement Description</th>
                          <th className="py-2.5 px-2.5 w-[80px] text-center border-r border-gray-200/80">Req. Qty</th>
                          <th className="py-2.5 px-2.5 w-[85px] text-center border-r border-gray-200/80">Status</th>
                          <th className="py-2.5 px-2.5 w-[110px] text-center border-r border-gray-200/80 bg-[#F4F9EE] text-[#066936]">Observed</th>
                          <th className="py-2.5 px-3 min-w-[180px] text-center bg-[#F4F9EE] text-[#066936]">Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((item: any, idx: number) => {
                          const uniqueKey = `clinical-${groupIdx}-${idx}-${item.sn}`;
                          const gridVal = clinicalInput[uniqueKey] || { observed: "", comment: "" };

                          return (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                              <td className={`py-2 px-3 text-[11px] text-center border-r border-gray-100 ${item.isSubItem ? 'text-[#5D9C0E] font-medium' : 'text-gray-400 font-medium'}`}>{item.sn}</td>
                              <td className={`py-2 px-3 text-xs leading-normal border-r border-gray-100 ${item.isSubItem ? 'pl-8 text-gray-600 font-normal' : 'font-medium text-gray-900'}`}>{item.item || item.description}</td>
                              
                              {item.isHeader ? (
                                <td colSpan={4} className="py-2 px-3 text-[10px] text-gray-400 italic bg-gray-50/50 text-right">Sub-items listed below</td>
                              ) : (
                                <>
                                  <td className="py-2 px-2 text-center border-r border-gray-100 text-xs font-semibold text-gray-700">{item.requiredQuantity}</td>
                                  <td className="py-2 px-2 text-center border-r border-gray-100">
                                    {item.status === 'Yes' || item.status === 'Available' || item.isAvailable === 'Available' ? (
                                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-medium">Available</span>
                                    ) : item.status === 'No' || item.status === 'Not Available' || item.isAvailable === 'Not Available' ? (
                                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-[10px] font-medium">N/A</span>
                                    ) : <span className="text-gray-400 font-medium">-</span>}
                                  </td>
                                  
                                  <td className="p-1.5 bg-[#FAFCF8] border-r border-gray-100">
                                    <input type="text" placeholder="Count" value={gridVal.observed || ""} onChange={(e) => handleClinicalChange(uniqueKey, 'observed', e.target.value)} className="w-full px-2 py-1 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs text-center font-medium text-gray-800 outline-none transition-colors" />
                                  </td>
                                  <td className="p-1.5 bg-[#FAFCF8]">
                                    <input type="text" placeholder="Write comment..." value={gridVal.comment || ""} onChange={(e) => handleClinicalChange(uniqueKey, 'comment', e.target.value)} className="w-full px-2.5 py-1 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs text-gray-800 outline-none transition-colors" />
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =======================================================================
          D. EQUIPMENT INVENTORY TABLES
          ======================================================================= */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <Wrench size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-tight">IV. Equipment Inventory & Functionality</h3>
            <p className="text-xs text-gray-400 font-normal">Cross-check declared equipment against physical counts and operational status.</p>
          </div>
        </div>
        
        {equipmentGroups.map((group, groupIdx) => {
          if (!group.items.length && !group.category) return null;
          return (
            <div key={groupIdx} className="w-full space-y-2.5 pt-2">
              {group.category && (
                <div className="flex items-center gap-2 bg-[#F8FCF5] border border-[#CDE1B4]/40 px-3.5 py-1.5 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-[#5D9C0E]"></span>
                  <h4 className="text-xs font-semibold text-[#066936] uppercase tracking-wider">{group.category}</h4>
                </div>
              )}
              {group.items.length > 0 && (
                <div className="w-full bg-white rounded-xl border border-gray-150 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                      <thead>
                        <tr className="bg-gray-50/80 text-gray-700 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-200">
                          <th className="py-2.5 px-3 w-[50px] text-center border-r border-gray-200/80">S/N</th>
                          <th className="py-2.5 px-3 min-w-[250px] border-r border-gray-200/80">Item / Description</th>
                          <th className="py-2.5 px-2 w-[90px] text-center border-r border-gray-200/80">Req. Qty</th>
                          <th className="py-2.5 px-2 w-[90px] text-center border-r border-gray-200/80">Declared</th>
                          <th className="py-2.5 px-2 w-[110px] text-center border-r border-gray-200/80 bg-[#F4F9EE] text-[#066936]">Observed</th>
                          <th className="py-2.5 px-3 w-[150px] text-center bg-[#F4F9EE] text-[#066936]">Functionality</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((item: any, idx: number) => {
                          const uniqueKey = `equip-${groupIdx}-${idx}-${item.sn}`;
                          const gridVal = equipmentInput[uniqueKey] || { observed: "", functionality: "" };

                          return (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                              <td className={`py-2 px-3 text-[11px] text-center border-r border-gray-100 ${item.isSubItem ? 'text-[#5D9C0E] font-medium' : 'text-gray-400 font-medium'}`}>{item.sn}</td>
                              <td className={`py-2 px-3 text-xs leading-normal border-r border-gray-100 ${item.isSubItem ? 'pl-8 text-gray-600 font-normal' : 'font-medium text-gray-900'}`}>{item.item}</td>
                              
                              {item.isHeader ? (
                                <td colSpan={4} className="py-2 px-3 text-[10px] text-gray-400 italic bg-gray-50/50 text-right">Sub-items listed below</td>
                              ) : (
                                <>
                                  <td className="py-2 px-2 text-center border-r border-gray-100 text-xs font-semibold text-gray-700">{item.requiredQuantity}</td>
                                  <td className="py-2 px-2 text-center border-r border-gray-100 text-xs font-medium text-gray-600">
                                    {item.availableQuantity !== '-' && item.availableQuantity ? item.availableQuantity : <span className="text-gray-300">-</span>}
                                  </td>
                                  
                                  <td className="p-1.5 bg-[#FAFCF8] border-r border-gray-100">
                                    <input 
                                      type="number" 
                                      min="0" 
                                      placeholder="0" 
                                      value={gridVal.observed || ""} 
                                      onChange={(e) => handleEquipmentChange(uniqueKey, 'observed', e.target.value)} 
                                      className="w-16 mx-auto block py-1 px-2 text-center border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white font-semibold text-gray-900 outline-none transition-colors" 
                                    />
                                  </td>
                                  <td className="p-1.5 bg-[#FAFCF8]">
                                    <select value={gridVal.functionality || ""} onChange={(e) => handleEquipmentChange(uniqueKey, 'functionality', e.target.value)} className="w-full py-1 px-2 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg bg-white text-xs font-medium text-gray-800 outline-none transition-colors">
                                      <option value="">Select</option>
                                      <option value="Fully Functional">Fully Functional</option>
                                      <option value="Partially Functional">Partially Functional</option>
                                      <option value="Non-Functional">Non-Functional</option>
                                    </select>
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      </fieldset>

      <div className="flex items-center justify-end pt-4">
        <button 
          onClick={handleSubmitProceed} 
          className="w-full sm:w-auto px-8 py-3 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer text-xs"
        >
          <span>Save & Proceed to Step 2</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}