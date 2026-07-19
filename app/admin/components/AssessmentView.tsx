"use client";

import React from 'react';
import { ArrowLeft, Building2, Wrench, FileCheck2 } from 'lucide-react';
import { PrimaryPractitionersSection, SupportStaffSection } from './StaffSections';
import { AssessmentTable } from './AssessmentTable';

interface FullAssessmentViewProps {
  drawerData: any;
  onBack: () => void;
}

export default function FullAssessmentView({ drawerData, onBack }: FullAssessmentViewProps) {
  const data = drawerData?.full_assessment;

  if (!data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white p-6">
        <p className="text-gray-500 font-medium">No assessment data available.</p>
        <button onClick={onBack} className="mt-4 text-[#5D9C0E] hover:underline text-sm font-medium">Go Back</button>
      </div>
    );
  }

  const formatDocTitle = (typeStr: string) => {
    if (!typeStr) return "Universal Assessment Document";
    const words = typeStr.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1));
    const category = words.pop(); 
    return `${words.join(' ')} - ${category}`;
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[#FAFAFA] px-4 py-5 md:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#5D9C0E] hover:text-[#4a7c0b] text-[12px] font-medium mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to Drawer
          </button>
          <h2 className="text-xl font-medium text-gray-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="text-[#5D9C0E]" /> 
            {formatDocTitle(data.assessment_type)}
          </h2>
        </div>
        <div className="bg-[#EEF6DF] text-[#066936] px-4 py-1.5 rounded-full text-[11px] font-medium border border-[#CDE1B4]/50 shadow-sm hidden sm:block">
          Phase 2 Complete
        </div>
      </div>
      
      <div className="space-y-8 max-w-5xl mx-auto pb-10">
        {/* Practitioner Sub-section Component Split */}
        <PrimaryPractitionersSection staff={data.staff} />

        {/* Support Staff Sub-section Component Split */}
        <SupportStaffSection staff={data.staff} />

        {/* Space Evaluator Table Component Split */}
        <section>
          <h3 className="text-[13px] text-[#066936] font-medium mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 size={16} /> Space Evaluation
          </h3>
          <AssessmentTable items={data.spaces} isSpace={true} assessmentType={data.assessment_type} />
        </section>

        {/* Institutional Table Component Split */}
        {data.clinicalTraining && data.clinicalTraining.length > 0 && (
          <section>
            <h3 className="text-[13px] text-[#066936] font-medium mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 size={16} /> Clinical / Institutional Requirements
            </h3>
            <AssessmentTable items={data.clinicalTraining} isSpace={false} assessmentType={data.assessment_type} />
          </section>
        )}

        {/* Inventory Table Component Split */}
        <section>
          <h3 className="text-[13px] text-[#066936] font-medium mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Wrench size={16} /> Equipment Inventory
          </h3>
          <AssessmentTable items={data.equipment} isSpace={false} assessmentType={data.assessment_type} />
        </section>
      </div>
    </div>
  );
}