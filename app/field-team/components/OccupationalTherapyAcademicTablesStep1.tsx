"use client";

import React, { useState, useEffect } from 'react';
import { Building2, BookOpen, Wrench, ArrowRight, ClipboardCheck } from 'lucide-react';
import { getActiveMap } from '@/app/admin/components/assessment-dictionaries';

interface Step1Props {
  spacesData: any[];
  clinicalData: any[];
  equipmentData: any[];
  assessmentType: string;
  onComplete: (step1Data: any) => void;
  inspectionReport?: any;
  isReadOnly?: boolean;
}

export function OccupationalTherapyAcademicTablesStep1({ spacesData, clinicalData, equipmentData, assessmentType, onComplete, inspectionReport, isReadOnly}: Step1Props) {
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
    onComplete({ curriculumGrid, spacesInput, clinicalInput, equipmentInput });
  };
  
  React.useEffect(() => {
    if (inspectionReport?.step1) {
      const s = inspectionReport.step1;
      if (s.curriculumGrid !== undefined) setCurriculumGrid(s.curriculumGrid);
      if (s.spacesInput !== undefined) setSpacesInput(s.spacesInput);
      if (s.clinicalInput !== undefined) setClinicalInput(s.clinicalInput);
      if (s.equipmentInput !== undefined) setEquipmentInput(s.equipmentInput);
    }
  }, [inspectionReport]);
  return (
    <div className="space-y-8 w-full text-xs text-gray-800 antialiased font-medium animate-in fade-in duration-200">
      <fieldset disabled={isReadOnly} className="contents">
      
      {/* =======================================================================
          A. CURRICULUM / STUDENTS HANDBOOK TABLE
          ======================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-300 shadow-sm space-y-3">
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5 pb-1 border-b border-gray-200">
            <BookOpen size={14} /> I. ACADEMIC MATTERS — CURRICULUM/STUDENTS HANDBOOK
          </h3>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="p-2.5 w-[50px] text-center">S/N</th>
                <th className="p-2.5 min-w-[350px]">ITEMS</th>
                <th className="p-2.5 w-[160px] text-center bg-purple-950 text-purple-100">ADEQUACY ASSESSMENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {curriculumGrid.map((row, idx) => (
                <tr key={row.sn} className="hover:bg-gray-50/50">
                  <td className="p-2.5 text-center font-bold text-gray-400 border-r border-gray-100">{row.sn}</td>
                  <td className="p-2.5 text-gray-800 whitespace-pre-line font-bold leading-relaxed border-r border-gray-100">{row.item}</td>
                  <td className="p-2 bg-purple-50/20 text-center">
                    <select 
                      value={row.adequacy || ""} 
                      onChange={(e) => handleCurriculumChange(idx, e.target.value)} 
                      className="w-full p-2 border border-purple-200 focus:border-purple-400 rounded bg-white text-xs font-bold text-purple-950 outline-none transition-colors"
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
      <div className="w-full space-y-6">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
          <Building2 size={14} /> Space Evaluation
        </h3>
        
        {spacesGroups.map((group, groupIdx) => {
          if (!group.items.length && !group.category) return null;
          return (
            <div key={groupIdx} className="w-full">
              {group.category && (
                <div className="mt-4 mb-3 flex justify-center w-full">
                  <h4 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-widest text-center">{group.category}</h4>
                </div>
              )}
              {group.items.length > 0 && (
                <div className="w-full bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-[#CDE1B4]/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b-2 border-[#BDE0A6]/50 bg-[#FAFAFA]">
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[50px] text-center border-r border-gray-100">S/N</th>
                          <th className="py-2 px-3 font-bold text-gray-700 text-[11px] uppercase tracking-wider min-w-[220px] border-r border-gray-100">Item / Description</th>
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[100px] text-center border-r border-gray-100">Status</th>
                          <th className="py-2 px-2 font-bold text-purple-950 text-[11px] uppercase tracking-wider w-[130px] text-center border-r border-gray-100 bg-purple-50">General Condition</th>
                          <th className="py-2 px-2 font-bold text-purple-950 text-[11px] uppercase tracking-wider min-w-[180px] text-center bg-purple-50">General Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((item: any, idx: number) => {
                          const uniqueKey = `space-${groupIdx}-${idx}-${item.sn}`;
                          const gridVal = spacesInput[uniqueKey] || { condition: "", comment: "" };

                          return (
                            <tr key={idx} className="hover:bg-[#F8FCF5] transition-colors group">
                              <td className={`py-1 px-2 font-bold text-[11px] text-center border-r border-gray-50 ${item.isSubItem ? 'text-[#5D9C0E] text-[16px]' : 'text-gray-400'}`}>{item.sn}</td>
                              <td className={`py-1 px-3 text-[12px] leading-tight border-r border-gray-50 ${item.isSubItem ? 'pl-8 text-gray-600' : 'font-bold text-gray-800'}`}>{item.item}</td>
                              
                              {item.isHeader ? (
                                <td colSpan={3} className="py-1 px-3 text-[10px] text-gray-400 italic bg-gray-50/50 text-right">Sub-items listed below</td>
                              ) : (
                                <>
                                  <td className="py-1 px-2 text-center border-r border-gray-50">
                                    {item.isAvailable === 'Yes' || item.isAvailable === 'Available' || item.status === 'Available' || item.status === 'Present' ? (
                                      <span className="px-2 py-1 bg-[#EEF6DF] text-[#066936] rounded text-[9px] font-bold uppercase tracking-wider">Yes</span>
                                    ) : item.isAvailable === 'No' || item.isAvailable === 'Not Available' || item.status === 'Not Available' || item.status === 'Absent' ? (
                                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase tracking-wider">No</span>
                                    ) : <span className="text-gray-400 font-medium">-</span>}
                                  </td>
                                  
                                  <td className="p-1 bg-purple-50/30 border-r border-gray-50">
                                    <select value={gridVal.condition || ""} onChange={(e) => handleSpaceChange(uniqueKey, 'condition', e.target.value)} className="w-full p-1 border border-purple-200 focus:border-purple-400 rounded bg-white text-xs font-bold text-purple-950 outline-none transition-colors">
                                      <option value="">Select</option>
                                      <option value="Good">Good</option>
                                      <option value="Fair">Fair</option>
                                      <option value="Poor">Poor</option>
                                    </select>
                                  </td>
                                  <td className="p-1 bg-purple-50/10">
                                    <input type="text" placeholder="Add comment..." value={gridVal.comment || ""} onChange={(e) => handleSpaceChange(uniqueKey, 'comment', e.target.value)} className="w-full px-2 py-1 border border-purple-200 focus:border-purple-400 rounded bg-white text-xs outline-none font-semibold text-purple-950" />
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
          C. CLINICAL TRAINING TABLES (REQ QTY RESTORED ACCURATELY)
          ======================================================================= */}
      <div className="w-full space-y-6">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
          <ClipboardCheck size={14} /> Clinical Training
        </h3>
        
        {clinicalGroups.map((group, groupIdx) => {
          if (!group.items.length && !group.category) return null;
          return (
            <div key={groupIdx} className="w-full">
              {group.category && (
                <div className="mt-4 mb-3 flex justify-center w-full">
                  <h4 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-widest text-center">{group.category}</h4>
                </div>
              )}
              {group.items.length > 0 && (
                <div className="w-full bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-[#CDE1B4]/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="border-b-2 border-[#BDE0A6]/50 bg-[#FAFAFA]">
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[50px] text-center border-r border-gray-100">S/N</th>
                          <th className="py-2 px-3 font-bold text-gray-700 text-[11px] uppercase tracking-wider min-w-[220px] border-r border-gray-100">Requirement Description</th>
                          {/* HEADERS MODIFICATION: Wired in Req. Qty column header */}
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[90px] text-center border-r border-gray-100">Req. Qty</th>
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[100px] text-center border-r border-gray-100">Status</th>
                          <th className="py-2 px-2 font-bold text-purple-950 text-[11px] uppercase tracking-wider w-[130px] text-center border-r border-gray-100 bg-purple-50">Observed Number</th>
                          <th className="py-2 px-2 font-bold text-purple-950 text-[11px] uppercase tracking-wider min-w-[180px] text-center bg-purple-50">Comment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((item: any, idx: number) => {
                          const uniqueKey = `clinical-${groupIdx}-${idx}-${item.sn}`;
                          const gridVal = clinicalInput[uniqueKey] || { observed: "", comment: "" };

                          return (
                            <tr key={idx} className="hover:bg-[#F8FCF5] transition-colors group">
                              <td className={`py-1 px-2 font-bold text-[11px] text-center border-r border-gray-50 ${item.isSubItem ? 'text-[#5D9C0E] text-[16px]' : 'text-gray-400'}`}>{item.sn}</td>
                              <td className={`py-1 px-3 text-[12px] leading-tight border-r border-gray-50 ${item.isSubItem ? 'pl-8 text-gray-600' : 'font-bold text-gray-800'}`}>{item.item || item.description}</td>
                              
                              {item.isHeader ? (
                                <td colSpan={4} className="py-1 px-3 text-[10px] text-gray-400 italic bg-gray-50/50 text-right">Sub-items listed below</td>
                              ) : (
                                <>
                                  {/* GRID ROW RESTORATION: Outputting item.requiredQuantity safely */}
                                  <td className="py-1 px-2 text-center border-r border-gray-50 text-[11px] font-bold text-gray-600">{item.requiredQuantity}</td>
                                  <td className="py-1 px-2 text-center border-r border-gray-50">
                                    {item.status === 'Yes' || item.status === 'Available' || item.isAvailable === 'Available' ? (
                                      <span className="px-2 py-1 bg-[#EEF6DF] text-[#066936] rounded text-[9px] font-bold uppercase tracking-wider">Available</span>
                                    ) : item.status === 'No' || item.status === 'Not Available' || item.isAvailable === 'Not Available' ? (
                                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase tracking-wider">N/A</span>
                                    ) : <span className="text-gray-400 font-medium">-</span>}
                                  </td>
                                  
                                  <td className="p-1 bg-purple-50/30 border-r border-gray-50">
                                    <input type="text" placeholder="Observed" value={gridVal.observed || ""} onChange={(e) => handleClinicalChange(uniqueKey, 'observed', e.target.value)} className="w-full px-2 py-1 border border-purple-200 focus:border-purple-400 rounded bg-white text-xs text-center font-bold text-purple-950 outline-none" />
                                  </td>
                                  <td className="p-1 bg-purple-50/10">
                                    <input type="text" placeholder="Write comment..." value={gridVal.comment || ""} onChange={(e) => handleClinicalChange(uniqueKey, 'comment', e.target.value)} className="w-full px-2 py-1 border border-purple-200 focus:border-purple-400 rounded bg-white text-xs outline-none font-semibold text-purple-950" />
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
      <div className="w-full space-y-6">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
          <Wrench size={14} /> Equipment Inventory
        </h3>
        
        {equipmentGroups.map((group, groupIdx) => {
          if (!group.items.length && !group.category) return null;
          return (
            <div key={groupIdx} className="w-full">
              {group.category && (
                <div className="mt-4 mb-3 flex justify-center w-full">
                  <h4 className="text-[14px] font-extrabold text-gray-900 uppercase tracking-widest text-center">{group.category}</h4>
                </div>
              )}
              {group.items.length > 0 && (
                <div className="w-full bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-[#CDE1B4]/50 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                      <thead>
                        <tr className="border-b-2 border-[#BDE0A6]/50 bg-[#FAFAFA]">
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[50px] text-center border-r border-gray-100">S/N</th>
                          <th className="py-2 px-3 font-bold text-gray-700 text-[11px] uppercase tracking-wider min-w-[250px] border-r border-gray-100">Item / Description</th>
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[110px] text-center border-r border-gray-100">Req. Qty</th>
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[100px] text-center border-r border-gray-100">Avail. Qty</th>
                          <th className="py-2 px-2 font-bold text-purple-950 text-[11px] uppercase tracking-wider w-[120px] text-center border-r border-gray-100 bg-purple-50">Observed Quantity</th>
                          <th className="py-2 px-2 font-bold text-purple-950 text-[11px] uppercase tracking-wider w-[140px] text-center bg-purple-50">Functionality</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((item: any, idx: number) => {
                          const uniqueKey = `equip-${groupIdx}-${idx}-${item.sn}`;
                          const gridVal = equipmentInput[uniqueKey] || { observed: "", functionality: "" };

                          return (
                            <tr key={idx} className="hover:bg-[#F8FCF5] transition-colors group">
                              <td className={`py-1 px-2 font-bold text-[11px] text-center border-r border-gray-50 ${item.isSubItem ? 'text-[#5D9C0E] text-[16px]' : 'text-gray-400'}`}>{item.sn}</td>
                              <td className={`py-1 px-3 text-[12px] leading-tight border-r border-gray-50 ${item.isSubItem ? 'pl-8 text-gray-600' : 'font-bold text-gray-800'}`}>{item.item}</td>
                              
                              {item.isHeader ? (
                                <td colSpan={4} className="py-1 px-3 text-[10px] text-gray-400 italic bg-gray-50/50 text-right">Sub-items listed below</td>
                              ) : (
                                <>
                                  <td className="py-1 px-2 text-center border-r border-gray-50 text-[11px] font-bold text-gray-600">{item.requiredQuantity}</td>
                                  <td className="py-1 px-2 text-center border-r border-gray-50 text-[12px] font-extrabold text-gray-500">
                                    {item.availableQuantity !== '-' && item.availableQuantity ? item.availableQuantity : <span className="text-gray-300">-</span>}
                                  </td>
                                  
                                  <td className="p-1 bg-purple-50/30 border-r border-gray-50">
                                    <input 
                                      type="number" 
                                      min="0" 
                                      placeholder="Count" 
                                      value={gridVal.observed || ""} 
                                      onChange={(e) => handleEquipmentChange(uniqueKey, 'observed', e.target.value)} 
                                      className="w-20 mx-auto block p-1 text-center border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-400 rounded bg-white font-extrabold text-purple-950 placeholder-purple-300 outline-none transition-all" 
                                    />
                                  </td>
                                  <td className="p-1 bg-purple-50/10">
                                    <select value={gridVal.functionality || ""} onChange={(e) => handleEquipmentChange(uniqueKey, 'functionality', e.target.value)} className="w-full p-1 border border-purple-200 focus:border-purple-400 rounded bg-white text-xs font-bold text-purple-950 outline-none">
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

      <div className="flex justify-end pt-2">
        <button onClick={handleSubmitProceed} className="w-full sm:w-auto px-10 py-2.5 bg-gray-900 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md">
          Proceed <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}