import React from 'react';

export const FormRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex items-baseline w-full mb-3">
    <span className="text-gray-500 font-medium text-[12px] whitespace-nowrap">{label}</span>
    <div className="flex-1 border-b-2 border-dotted border-gray-300 mx-2 border-opacity-70 min-w-[20px]"></div>
    <span className="text-gray-900 font-bold text-[13px] text-right break-words max-w-[65%]">{value || '-'}</span>
  </div>
);

export const safeParseArray = (jsonString: any) => {
  if (!jsonString) return [];
  if (Array.isArray(jsonString)) return jsonString;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return [];
  }
};