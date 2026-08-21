"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Building2, Wrench, ArrowRight } from 'lucide-react';
import { getActiveMap } from '@/app/admin/components/assessment-dictionaries';

interface Step2Props {
  spacesData: any[];
  equipmentData: any[];
  assessmentType: string;
  onComplete: (step2Data: any) => void;
  inspectionReport?: any;
  isReadOnly?: boolean;
}

export function SpeechTherapyClinicalStep2({ spacesData, equipmentData, assessmentType, onComplete, inspectionReport, isReadOnly}: Step2Props) {
  // 1. CONCEPTS AND APPROACHES GRID (FIRST SECTION SEEN ON THE NEW PAGE 1)
  const [conceptsGrid, setConceptsGrid] = useState([
    { sn: 1, specialty: "Language Disorders", concepts: "", approaches: "", remarks: "" },
    { sn: 2, specialty: "Fluency Disorders", concepts: "", approaches: "", remarks: "" },
    { sn: 3, specialty: "Voice Resonance", concepts: "", approaches: "", remarks: "" },
    { sn: 4, specialty: "Voice Resonance", concepts: "", approaches: "", remarks: "" },
    { sn: 5, specialty: "Swallowing and Feeding", concepts: "", approaches: "", remarks: "" },
    { sn: 6, specialty: "Cognitive Communication", concepts: "", approaches: "", remarks: "" },
    { sn: 7, specialty: "Social Communication /Pragmatic", concepts: "", approaches: "", remarks: "" },
    { sn: 8, specialty: "Augmentative and Alternative Communication", concepts: "", approaches: "", remarks: "" },
    { sn: 9, specialty: "Orofacial Myology", concepts: "", approaches: "", remarks: "" },
    { sn: 10, specialty: "Literacy", concepts: "", approaches: "", remarks: "" },
    { sn: 11, specialty: "Gender-Affirming Voice", concepts: "", approaches: "", remarks: "" }
  ]);

  // 2. ADDITIONAL FIELDS CAPTURE STATE
  const [spacesInput, setSpacesInput] = useState<Record<string, { condition: string }>>({});
  const [equipmentInput, setEquipmentInput] = useState<Record<string, string>>({});

  const handleConceptChange = (idx: number, col: string, value: string) => {
    const updated = [...conceptsGrid];
    updated[idx] = { ...updated[idx], [col]: value };
    setConceptsGrid(updated);
  };

  const handleSpaceChange = (key: string, value: string) => {
    setSpacesInput(prev => ({ 
      ...prev, 
      [key]: { condition: value } 
    }));
  };

  // Grouping and processing logic for required quantities
  const compileOriginalGroups = (items: any[]) => {
    if (!items || items.length === 0) return [];
    
    const activeMap = typeof getActiveMap === 'function' ? getActiveMap(assessmentType) : {};
    const groups: { category: string | null; items: any[] }[] = [];
    let currentGroup = { category: null as string | null, items: [] as any[] };
    let currentMotherQty = "-";

    items.forEach(item => {
      const isCategoryRow = item.availableQuantity === 'Category' || 
                            item.isAvailable === 'Category' || 
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
        let baseReqQty = item.requiredQuantity || item.required_quantity || activeMap[item.item];
        
        if (!baseReqQty || baseReqQty === '-' || String(baseReqQty).trim() === '') {
          baseReqQty = "-";
        }

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
  const equipmentGroups = compileOriginalGroups(equipmentData);

  const handleSubmitProceed = () => {
    onComplete({ conceptsGrid, spacesInput, equipmentInput });
  };
  
  React.useEffect(() => {
    if (inspectionReport?.step1) {
      const s = inspectionReport.step1;
      if (s.conceptsGrid !== undefined) setConceptsGrid(s.conceptsGrid);
      if (s.spacesInput !== undefined) setSpacesInput(s.spacesInput);
      if (s.equipmentInput !== undefined) setEquipmentInput(s.equipmentInput);
    }
  }, [inspectionReport]);
  return (
    <div className="space-y-6 w-full text-xs text-gray-800 antialiased font-medium animate-in fade-in duration-200">
      <fieldset disabled={isReadOnly} className="space-y-6 w-full block border-0 p-0 m-0 min-w-0">
      
      {/* =======================================================================
          A. EVALUATION OF CONCEPTS AND APPROACHES (TOP OF PAGE)
          ======================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-300 shadow-sm space-y-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 pb-1.5 border-b border-gray-200">
            <ClipboardCheck size={16} /> Evaluation of Concepts and Approaches Across Specialties
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-medium">Please provide the various concepts and approaches used for assessment, evaluation and treatment in the various specialty areas available.</p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="p-2 w-[40px] text-center">S/N</th>
                <th className="p-2 min-w-[180px]">Areas of Specialization</th>
                <th className="p-2 min-w-[180px]">Concepts</th>
                <th className="p-2 min-w-[180px]">Approaches</th>
                <th className="p-2 min-w-[140px]">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {conceptsGrid.map((row, idx) => (
                <tr key={row.sn} className="hover:bg-gray-50/50 font-medium">
                  <td className="p-2 text-center font-bold text-gray-400">{row.sn}</td>
                  <td className="p-2 font-bold text-gray-800 bg-slate-50/40">{row.specialty}</td>
                  
                  {/* TEXTAREAS INTERJECTIONS: Native multiline break handling with Enter key enabled */}
                  <td className="p-1">
                    <textarea 
                      rows={1}
                      placeholder="Enter concepts..." 
                      value={row.concepts} 
                      onChange={(e) => handleConceptChange(idx, 'concepts', e.target.value)} 
                      className="w-full p-1.5 border border-gray-300 rounded outline-none font-medium resize-y min-h-[30px]" 
                    />
                  </td>
                  <td className="p-1">
                    <textarea 
                      rows={1}
                      placeholder="Enter approaches..." 
                      value={row.approaches} 
                      onChange={(e) => handleConceptChange(idx, 'approaches', e.target.value)} 
                      className="w-full p-1.5 border border-gray-300 rounded outline-none font-medium resize-y min-h-[30px]" 
                    />
                  </td>
                  <td className="p-1">
                    <textarea 
                      rows={1}
                      placeholder="Enter remarks..." 
                      value={row.remarks} 
                      onChange={(e) => handleConceptChange(idx, 'remarks', e.target.value)} 
                      className="w-full p-1.5 border border-gray-300 rounded outline-none font-medium resize-y min-h-[30px]" 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =======================================================================
          B. SPACE EVALUATION TABLES (OVERALL COMMENT REMOVED)
          ======================================================================= */}
      <div className="w-full space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-2">
          <Building2 size={16} /> Space Evaluation
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
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b-2 border-[#BDE0A6]/50 bg-[#FAFAFA]">
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[50px] text-center border-r border-gray-100">S/N</th>
                          <th className="py-2 px-3 font-bold text-gray-700 text-[11px] uppercase tracking-wider min-w-[250px] border-r border-gray-100">Item / Description</th>
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[100px] text-center border-r border-gray-100">Status</th>
                          <th className="py-2 px-2 font-bold text-purple-950 text-[11px] uppercase tracking-wider w-[140px] text-center bg-purple-50">General Condition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((item: any, idx: number) => {
                          const itemKey = `space-${groupIdx}-${idx}-${item.sn}`;
                          const gridVal = spacesInput[itemKey] || { condition: "" };

                          return (
                            <tr key={idx} className="hover:bg-[#F8FCF5] transition-colors group">
                              <td className={`py-1 px-2 font-bold text-[11px] text-center border-r border-gray-50 ${item.isSubItem ? 'text-[#5D9C0E] text-[16px]' : 'text-gray-400'}`}>{item.sn}</td>
                              <td className={`py-1 px-3 text-[12px] leading-tight border-r border-gray-50 ${item.isSubItem ? 'pl-8 text-gray-600' : 'font-bold text-gray-800'}`}>{item.item}</td>
                              
                              {item.isHeader ? (
                                <td colSpan={2} className="py-1 px-3 text-[10px] text-gray-400 italic bg-gray-50/50 text-right">Sub-items listed below</td>
                              ) : (
                                <>
                                  <td className="py-1 px-2 text-center border-r border-gray-50">
                                    {item.isAvailable === 'Yes' || item.isAvailable === 'Available' ? (
                                      <span className="px-2 py-1 bg-[#EEF6DF] text-[#066936] rounded text-[9px] font-bold uppercase tracking-wider">Yes</span>
                                    ) : item.isAvailable === 'No' || item.isAvailable === 'Not Available' ? (
                                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase tracking-wider">No</span>
                                    ) : <span className="text-gray-400 font-medium">-</span>}
                                  </td>
                                  
                                  <td className="p-1 bg-purple-50/30">
                                    <select value={gridVal.condition || ""} onChange={(e) => handleSpaceChange(itemKey, e.target.value)} className="w-full p-1 border border-purple-200 focus:border-purple-400 rounded bg-white text-xs font-bold text-purple-950 outline-none transition-colors">
                                      <option value="">Select</option>
                                      <option value="Good">Good</option>
                                      <option value="Fair">Fair</option>
                                      <option value="Poor">Poor</option>
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

      {/* =======================================================================
          C. EQUIPMENT INVENTORY TABLES WITH DISTINCT QUANTITY EXAMINED FIELD
          ======================================================================= */}
      <div className="w-full space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-2">
          <Wrench size={16} /> Equipment Inventory
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
                          <th className="py-2 px-2 font-bold text-purple-950 text-[11px] uppercase tracking-wider w-[120px] text-center bg-purple-50">Quantity Examined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((item: any, idx: number) => {
                          const itemKey = `equip-${groupIdx}-${idx}-${item.sn}`;
                          const examinedCount = equipmentInput[itemKey] || "";

                          return (
                            <tr key={idx} className="hover:bg-[#F8FCF5] transition-colors group">
                              <td className={`py-1 px-2 font-bold text-[11px] text-center border-r border-gray-50 ${item.isSubItem ? 'text-[#5D9C0E] text-[16px]' : 'text-gray-400'}`}>{item.sn}</td>
                              <td className={`py-1 px-3 text-[12px] leading-tight border-r border-gray-50 ${item.isSubItem ? 'pl-8 text-gray-600' : 'font-bold text-gray-800'}`}>{item.item}</td>
                              
                              {item.isHeader ? (
                                <td colSpan={3} className="py-1 px-3 text-[10px] text-gray-400 italic bg-gray-50/50 text-right">Sub-items listed below</td>
                              ) : (
                                <>
                                  <td className="py-1 px-2 text-center border-r border-gray-50 text-[11px] font-bold text-gray-600">{item.requiredQuantity}</td>
                                  <td className="py-1 px-2 text-center border-r border-gray-50 text-[12px] font-extrabold text-gray-500">
                                    {item.availableQuantity !== '-' && item.availableQuantity ? item.availableQuantity : <span className="text-gray-300">-</span>}
                                  </td>
                                  
                                  <td className="p-1 bg-purple-50/20">
                                    <input 
                                      type="number" 
                                      min="0" 
                                      placeholder="Count" 
                                      value={examinedCount} 
                                      onChange={(e) => setEquipmentInput(prev => ({ ...prev, [itemKey]: e.target.value }))} 
                                      className="w-20 mx-auto block p-1 text-center border border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-400 rounded bg-white font-extrabold text-purple-950 placeholder-purple-300 outline-none transition-all" 
                                    />
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