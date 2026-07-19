import React from 'react';
import { getActiveMap } from './assessment-dictionaries';

interface AssessmentTableProps {
  items: any[];
  isSpace?: boolean;
  assessmentType: string;
}

export const AssessmentTable = ({ items, isSpace = false, assessmentType }: AssessmentTableProps) => {
  if (!items || items.length === 0) {
    return <p className="text-xs text-gray-400 italic font-medium p-3">No records provided.</p>;
  }

  const activeMap = getActiveMap(assessmentType);
  const groups: { category: string | null; items: any[] }[] = [];
  let currentGroup = { category: null as string | null, items: [] as any[] };
  let currentMotherQty = "Not specified";

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
      currentMotherQty = "Not specified";
    } else {
      let baseReqQty = activeMap[item.item] || item.requiredQuantity;
      if (!baseReqQty || baseReqQty === '-' || baseReqQty.trim() === '') {
        baseReqQty = "Not specified";
      }

      if (item.isHeader) currentMotherQty = baseReqQty;
      const finalReqQty = (item.isSubItem && baseReqQty === "Not specified") ? currentMotherQty : baseReqQty;

      currentGroup.items.push({ ...item, requiredQuantity: finalReqQty });
    }
  });
  
  if (currentGroup.items.length > 0 || currentGroup.category) {
    groups.push(currentGroup);
  }

  return (
    <div className="w-full flex flex-col gap-10 mb-6">
      {groups.map((group, groupIdx) => {
        if (!group.items.length && !group.category) return null;

        return (
          <div key={groupIdx} className="w-full">
            {group.category && (
              <div className="mt-4 mb-4 flex justify-center w-full">
                <h4 className="text-[14px] font-extrabold text-gray-900 uppercase tracking-widest text-center">
                  {group.category}
                </h4>
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
                        {!isSpace && (
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[110px] text-center border-r border-gray-100">Req. Qty</th>
                        )}
                        <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[100px] text-center border-r border-gray-100">Status</th>
                        {!isSpace && (
                          <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[100px] text-center border-r border-gray-100">Avail. Qty</th>
                        )}
                        {isSpace && <th className="py-2 px-2 font-bold text-gray-700 text-[11px] uppercase tracking-wider w-[160px] text-center">Floor Structure</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {group.items.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-[#F8FCF5] transition-colors group">
                          <td className={`py-1 px-2 font-bold text-[11px] text-center border-r border-gray-50 ${item.isSubItem ? 'text-[#5D9C0E] text-[16px]' : 'text-gray-400'}`}>
                            {item.sn}
                          </td>
                          <td className={`py-1 px-3 text-[12px] leading-tight border-r border-gray-50 ${item.isSubItem ? 'pl-8 text-gray-600' : 'font-bold text-gray-800'}`}>
                            {item.item}
                          </td>

                          {item.isHeader ? (
                            <td colSpan={isSpace ? 2 : 3} className="py-1 px-3 text-[10px] text-gray-400 italic bg-gray-50/50 text-right">
                              Sub-items listed below
                            </td>
                          ) : (
                            <>
                              {!isSpace && (
                                <td className={`py-1 px-2 text-center border-r border-gray-50 text-[11px] font-medium ${item.requiredQuantity === 'Not specified' ? 'text-gray-400 italic' : 'text-gray-600'}`}>
                                  {item.requiredQuantity}
                                </td>
                              )}
                              <td className="py-1 px-2 text-center border-r border-gray-50">
                                {item.isAvailable === 'Yes' || item.isAvailable === 'Available' ? (
                                  <span className="px-2 py-1 bg-[#EEF6DF] text-[#066936] rounded text-[9px] font-bold uppercase tracking-wider">Yes</span>
                                ) : item.isAvailable === 'No' || item.isAvailable === 'Not Available' ? (
                                  <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase tracking-wider">No</span>
                                ) : (
                                  <span className="text-gray-400 font-medium">-</span>
                                )}
                              </td>
                              {!isSpace && (
                                <td className="py-1 px-2 text-center border-r border-gray-50 text-[12px] font-bold text-gray-800">
                                  {item.availableQuantity !== '-' && item.availableQuantity ? item.availableQuantity : <span className="text-gray-300">-</span>}
                                </td>
                              )}
                              {isSpace && (
                                <td className="py-1 px-2 text-center text-[12px] text-gray-600 font-medium">
                                  {item.floorStructure !== '-' && item.floorStructure ? item.floorStructure : <span className="text-gray-300">-</span>}
                                </td>
                              )}
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};