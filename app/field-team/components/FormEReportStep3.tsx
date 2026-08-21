import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ShieldAlert, Award, FileText, Calendar, UserPlus, Trash, ChevronLeft, Lock } from 'lucide-react';

interface SectionData {
  title: string;
  comment: string;
  recommendation: string;
}

interface Step3Props {
  assessmentType: string;
  step2Data: any;
  onComplete: (formEData: any) => void;
  onBack: () => void;
  inspectionReport?: any;
  isReadOnly?: boolean;
  adminRole?: string;
  prefilledPanelMembers?: string[];
}

const ACADEMIC_SECTIONS = [
  { id: 'philosophy', title: 'Philosophy and Objectives of the Programme' },
  { id: 'curriculum', title: 'The Curriculum' },
  { id: 'admission', title: 'Admission Requirements' },
  { id: 'regulation', title: 'Academic Regulation' },
  { id: 'course_eval', title: 'Course Evaluation' },
  { id: 'student_eval', title: 'Students’ Course Evaluation' },
  { id: 'external_examiner', title: 'External Examiner’ System' },
  { id: 'clinical_training', title: 'Clinical Training/Postings' },
  { id: 'staffing', title: 'Staffing (Teaching, Non-Teaching & Clinical)' },
  { id: 'facilities', title: 'Physical Facilities' },
  { id: 'equipment', title: 'Academic Department Equipment' },
  { id: 'library', title: 'Library & ICT Facility' },
  { id: 'funding', title: 'Departmental Funding' },
  { id: 'other_facilities', title: 'Other Required Facility (Power, Transportation)' }
];

const CLINICAL_SECTIONS = [
  { id: 'clinical_staff', title: 'Staffing (HOD, Clinical Staff, Interns)' },
  { id: 'clinical_specialties', title: 'Areas of Specialization & Specialists' },
  { id: 'clinical_cpd', title: 'Continuing Professional Development (CPD)' },
  { id: 'clinical_support_staff', title: 'Support Staff (Admin, cleaners, security)' },
  { id: 'clinical_space', title: 'Space Evaluation (Cubicles, gymnasium, hydrotherapy)' },
  { id: 'clinical_offices', title: 'Offices (HOD, clinical staff, support)' },
  { id: 'clinical_other', title: 'Other Required Facilities (Seminar/Call duty/Common rooms)' },
  { id: 'clinical_library', title: 'Library Facilities' },
  { id: 'clinical_equipment', title: 'Equipment (Universal, specialty, hydrotherapy)' }
];

export function FormEReportStep3({ assessmentType, step2Data, onComplete, onBack, inspectionReport, isReadOnly = false, adminRole = "", prefilledPanelMembers = [] }: Step3Props) {
  const isAcademic = assessmentType.includes('academic');
  const sections = isAcademic ? ACADEMIC_SECTIONS : CLINICAL_SECTIONS;

  const [panelFindings, setPanelFindings] = useState<Record<string, SectionData>>({});
  const [decision, setDecision] = useState('Full Accreditation');
  const [duration, setDuration] = useState('5');
  const [panelMembers, setPanelMembers] = useState<string[]>(() => {
    if (prefilledPanelMembers && prefilledPanelMembers.length > 0) {
      const initialMembers = [...prefilledPanelMembers];
      while (initialMembers.length < 3) {
        initialMembers.push('');
      }
      return initialMembers;
    }
    return ['', '', ''];
  });
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  // Dynamic mapping function to extract comments and recs from Form C (Step 2)
  const getPrefilledValues = (s2: any, sectionKey: string) => {
    if (!s2) return { comment: '', rec: '' };
    
    switch (sectionKey) {
      case 'philosophy':
        return {
          comment: s2.preamble?.comments || s2.academic?.comments || '',
          rec: s2.preamble?.recommendations || s2.academic?.recommendations || ''
        };
      case 'curriculum':
      case 'admission':
      case 'regulation':
      case 'course_eval':
      case 'student_eval':
      case 'external_examiner':
        // These share the single section 1 comments in academic, we only default philosophy to it.
        // The others remain blank unless filled.
        return { comment: '', rec: '' };
      case 'clinical_training':
        return {
          comment: s2.clinical?.hospitalComments || s2.clinical?.comments || '',
          rec: s2.clinical?.hospitalRecommendations || s2.clinical?.recommendations || ''
        };
      case 'staffing':
        return {
          comment: s2.staffing?.comments || '',
          rec: s2.staffing?.recommendations || ''
        };
      case 'facilities':
        return {
          comment: s2.facilities?.comments || '',
          rec: s2.facilities?.recs || s2.facilities?.recommendations || ''
        };
      case 'equipment':
        return {
          comment: s2.clinical?.deptComments || s2.clinical?.comments || '',
          rec: s2.clinical?.deptRecommendations || s2.clinical?.recommendations || ''
        };
      case 'library':
        return {
          comment: s2.facilities?.libComments || s2.facilities?.libraryComments || '',
          rec: s2.facilities?.libRecs || s2.facilities?.libraryRecommendations || ''
        };
      case 'funding':
        return {
          comment: s2.facilities?.fundingComments || '',
          rec: s2.facilities?.fundingRecs || ''
        };
      case 'other_facilities':
        return {
          comment: s2.facilities?.otherComments || '',
          rec: s2.facilities?.otherRecs || ''
        };

      // Clinical mappings:
      case 'clinical_staff':
        return {
          comment: s2.clinicalStaff?.comments || '',
          rec: s2.clinicalStaff?.recommendations || ''
        };
      case 'clinical_specialties':
        return {
          comment: s2.specialtiesMeta?.comments || '',
          rec: s2.specialtiesMeta?.recommendations || ''
        };
      case 'clinical_cpd':
        return {
          comment: s2.manpowerAndSummary?.manpowerComments || s2.manpowerAndSummary?.comments || '',
          rec: s2.manpowerAndSummary?.manpowerRecs || s2.manpowerAndSummary?.recommendations || ''
        };
      case 'clinical_support_staff':
        return {
          comment: s2.nonClinicalStaff?.comments || '',
          rec: s2.nonClinicalStaff?.recommendations || ''
        };
      case 'clinical_space':
        return {
          comment: s2.spaceEval?.signPostComments || s2.spaceEval?.comments || '',
          rec: s2.spaceEval?.signPostRecs || s2.spaceEval?.recommendations || ''
        };
      case 'clinical_offices':
        return {
          comment: s2.spaceEval?.hodComments || '',
          rec: s2.spaceEval?.hodRecs || ''
        };
      case 'clinical_other':
        return {
          comment: s2.spaceEval?.seminarComments || '',
          rec: s2.spaceEval?.seminarRecs || ''
        };
      case 'clinical_library':
        return {
          comment: s2.libraryChecklist?.comments || s2.libraryChecklist?.libraryComments || '',
          rec: s2.libraryChecklist?.recommendations || s2.libraryChecklist?.libraryRecs || ''
        };
      case 'clinical_equipment':
        return {
          comment: s2.equipEval?.comments || '',
          rec: s2.equipEval?.recommendation || s2.equipEval?.recommendations || ''
        };
      default:
        return { comment: '', rec: '' };
    }
  };

  // Initialize form states
  useEffect(() => {
    const initialFindings: Record<string, SectionData> = {};
    
    sections.forEach(sec => {
      if (inspectionReport?.step3?.panelFindings?.[sec.id]) {
        initialFindings[sec.id] = inspectionReport.step3.panelFindings[sec.id];
      } else {
        const prefilled = getPrefilledValues(step2Data, sec.id);
        initialFindings[sec.id] = {
          title: sec.title,
          comment: prefilled.comment,
          recommendation: prefilled.rec
        };
      }
    });
    
    setPanelFindings(initialFindings);

    if (inspectionReport?.step3) {
      if (inspectionReport.step3.decision) setDecision(inspectionReport.step3.decision);
      if (inspectionReport.step3.duration) setDuration(inspectionReport.step3.duration);
      if (inspectionReport.step3.panelMembers) setPanelMembers(inspectionReport.step3.panelMembers);
      if (inspectionReport.step3.reportDate) setReportDate(inspectionReport.step3.reportDate);
    } else if (prefilledPanelMembers && prefilledPanelMembers.length > 0) {
      const initialMembers = [...prefilledPanelMembers];
      while (initialMembers.length < 3) {
        initialMembers.push('');
      }
      setPanelMembers(initialMembers);
    }
  }, [step2Data, inspectionReport, assessmentType, prefilledPanelMembers]);

  const handleFieldChange = (sectionId: string, field: 'comment' | 'recommendation', value: string) => {
    if (isReadOnly) return;
    setPanelFindings(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }));
  };

  const handleAddMember = () => {
    if (isReadOnly) return;
    setPanelMembers(prev => [...prev, '']);
  };

  const handleRemoveMember = (idx: number) => {
    if (isReadOnly) return;
    setPanelMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, val: string) => {
    if (isReadOnly) return;
    const updated = [...panelMembers];
    updated[idx] = val;
    setPanelMembers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      panelFindings,
      decision,
      duration,
      panelMembers,
      reportDate,
      _forwardToRegistrar: true
    });
  };

  const handleSaveProgress = (e: React.MouseEvent) => {
    e.preventDefault();
    onComplete({
      panelFindings,
      decision,
      duration,
      panelMembers,
      reportDate,
      _forwardToRegistrar: false
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-5xl mx-auto text-xs text-gray-800 antialiased font-normal pb-24">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-gray-150 p-5 md:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF6DF] text-[#066936] flex items-center justify-center shrink-0">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">
              Accreditation Panel Summary Report (Form E)
            </h2>
            <p className="text-xs text-gray-400 capitalize">
              {assessmentType.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-[#066936] bg-[#EEF6DF] border border-[#CDE1B4]/50 px-3 py-1 rounded-full w-max">
          Final Audit Synthesis
        </span>
      </div>

      {isReadOnly && (
        <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-xl flex items-center gap-3 text-amber-800 shadow-xs">
          <Lock size={18} className="text-amber-600 shrink-0" />
          <div>
            <p className="font-semibold text-xs uppercase tracking-wide">Report Locked (Read-Only Mode)</p>
            <p className="text-[11px] text-amber-700 mt-0.5">This report has been finalized and submitted. Contents are locked for audit preservation.</p>
          </div>
        </div>
      )}

      {/* SECTIONS LIST */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <FileText size={15} className="text-[#5D9C0E]" />
          <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wider">Summary of Panel Findings</h3>
        </div>
        
        {sections.map((sec) => {
          const secData = panelFindings[sec.id] || { title: sec.title, comment: '', recommendation: '' };
          return (
            <div key={sec.id} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4 hover:border-gray-200 transition-colors">
              <h4 className="font-semibold text-gray-900 text-xs tracking-wide border-b border-gray-100 pb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-[#5D9C0E] rounded-full" />
                {sec.title}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-medium text-gray-500 block text-[11px]">Observations & Comments</label>
                  <textarea
                    id={`comments-${sec.id}`}
                    value={secData.comment}
                    disabled={isReadOnly}
                    onChange={(e) => handleFieldChange(sec.id, 'comment', e.target.value)}
                    placeholder="Enter overall observations..."
                    className="w-full p-3 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-xl h-24 resize-none outline-none transition-all bg-gray-50/30 text-gray-800 font-normal disabled:bg-gray-50 disabled:text-gray-400 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-medium text-gray-500 block text-[11px]">Deficiencies / Recommendations / Remedies</label>
                  <textarea
                    id={`recs-${sec.id}`}
                    value={secData.recommendation}
                    disabled={isReadOnly}
                    onChange={(e) => handleFieldChange(sec.id, 'recommendation', e.target.value)}
                    placeholder="Enter recommended remedies..."
                    className="w-full p-3 border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-xl h-24 resize-none outline-none transition-all bg-gray-50/30 text-gray-800 font-normal disabled:bg-gray-50 disabled:text-gray-400 text-xs"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FINAL DECISION MODULE */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-150 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-tight">Final Accreditation Recommendation</h3>
            <p className="text-xs text-gray-400 font-normal">Panel determination and recommendation duration.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          <div className="space-y-4">
            <div>
              <label className="font-medium text-gray-700 block mb-1 text-xs">Accreditation Decision</label>
              <select
                id="accreditation-decision"
                value={decision}
                disabled={isReadOnly}
                onChange={(e) => setDecision(e.target.value)}
                className="w-full py-2 px-3 bg-white border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-xl outline-none text-gray-900 font-medium tracking-wide transition-colors disabled:opacity-75 text-xs"
              >
                <option value="Full Accreditation">Full Accreditation</option>
                <option value="Partial Accreditation">Partial Accreditation</option>
                <option value="Denial">Denial (No Accreditation)</option>
              </select>
            </div>
            
            {decision !== 'Denial' && (
              <div>
                <label className="font-medium text-gray-700 block mb-1 text-xs">Duration of Accreditation</label>
                <select
                  id="accreditation-duration"
                  value={duration}
                  disabled={isReadOnly}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-xl outline-none text-gray-900 font-medium transition-colors disabled:opacity-75 text-xs"
                >
                  <option value="5">5 Years (Standard Full)</option>
                  <option value="4">4 Years</option>
                  <option value="3">3 Years (Standard Partial)</option>
                  <option value="2">2 Years</option>
                  <option value="1">1 Year</option>
                  <option value="6 months">Six(6) Months (Partial)</option>
                </select>
              </div>
            )}
          </div>

          {/* PANEL MEMBERS & REPORT DATE */}
          <div className="space-y-4">
            <div>
              <label className="font-medium text-gray-700 block mb-1 text-xs flex items-center justify-between">
                <span>Accreditation Panel Members</span>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="text-[10.5px] bg-[#EEF6DF] text-[#066936] hover:bg-[#EEF6DF]/80 px-2.5 py-1 rounded-lg font-medium inline-flex items-center gap-1 transition-colors border border-[#CDE1B4]/50 cursor-pointer"
                  >
                    <UserPlus size={12} /> Add Member
                  </button>
                )}
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {panelMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Panel Member Name ${idx + 1}`}
                      value={member}
                      disabled={isReadOnly}
                      onChange={(e) => handleMemberChange(idx, e.target.value)}
                      className="flex-1 py-1.5 px-3 bg-white border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg outline-none text-gray-900 text-xs font-medium placeholder-gray-400 disabled:opacity-75 transition-colors"
                    />
                    {!isReadOnly && panelMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="font-medium text-gray-700 block mb-1 text-xs">Date of Summary Report</label>
              <div className="relative">
                <input
                  type="date"
                  value={reportDate}
                  disabled={isReadOnly}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full py-1.5 px-3 bg-white border border-gray-200 focus:border-[#5D9C0E] focus:ring-1 focus:ring-[#5D9C0E]/20 rounded-lg outline-none text-gray-900 text-xs font-medium disabled:opacity-75 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BOTTOM NAVIGATOR */}
      <div className="bg-white border border-gray-150 shadow-xs p-3.5 sm:p-4 flex flex-row justify-between items-center gap-2 max-w-5xl mx-auto rounded-2xl z-10 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer"
        >
          <ChevronLeft size={14} /> Back
        </button>
        
        {!isReadOnly && (
          <div className="flex gap-2">
            {adminRole === 'admin_registrar' ? (
              <button
                type="button"
                onClick={handleSaveProgress}
                className="px-5 py-2.5 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs text-xs cursor-pointer"
              >
                Save Report Changes
              </button>
            ) : (
              <>
                {adminRole === 'admin_reviewer' && (
                  <button
                    type="button"
                    onClick={handleSaveProgress}
                    className="px-5 py-2.5 border border-[#5D9C0E] text-[#5D9C0E] hover:bg-[#EEF6DF] font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs text-xs cursor-pointer"
                  >
                    Save Progress
                  </button>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-medium rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md text-xs cursor-pointer"
                >
                  <ShieldAlert size={14} /> {adminRole === 'admin_reviewer' ? 'Forward to Registrar' : 'Final Submit'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

    </form>
  );
}
