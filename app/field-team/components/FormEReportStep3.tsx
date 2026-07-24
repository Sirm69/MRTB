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
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-5xl mx-auto text-xs text-gray-800 antialiased font-medium pb-24">
      {/* HEADER */}
      <div className="bg-[#5D9C0E] text-white p-6 rounded-2xl shadow-lg text-center border border-[#4a7c0b]">
        <h2 className="text-base font-extrabold uppercase tracking-widest relative z-10">
          ACCREDITATION PANEL SUMMARY REPORT
        </h2>
        <p className="text-[10px] text-green-200 mt-1 uppercase tracking-wider relative z-10 font-bold">
          {assessmentType.replace(/_/g, ' ')}
        </p>
      </div>

      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 shadow-sm">
          <Lock size={18} className="text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-xs uppercase tracking-wide">Report Locked (Read-Only Mode)</p>
            <p className="text-[11px] text-amber-700 mt-0.5">This report has been finalized and submitted to the board. The contents can no longer be edited.</p>
          </div>
        </div>
      )}

      {/* SECTIONS LIST */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 px-1">
          <FileText size={14} className="text-green-600" /> Summary of Panel Findings
        </h3>
        
        {sections.map((sec) => {
          const secData = panelFindings[sec.id] || { title: sec.title, comment: '', recommendation: '' };
          return (
            <div key={sec.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-[0px_4px_16px_rgba(0,0,0,0.02)] space-y-4 hover:border-green-100 transition-colors">
              <h4 className="font-bold text-gray-950 text-[13px] tracking-wide border-b border-gray-100 pb-2 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-green-600 rounded-full" />
                {sec.title}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 block uppercase tracking-wider text-[9px]">Observations & Comments</label>
                  <textarea
                    id={`comments-${sec.id}`}
                    value={secData.comment}
                    disabled={isReadOnly}
                    onChange={(e) => handleFieldChange(sec.id, 'comment', e.target.value)}
                    placeholder="Enter overall observations..."
                    className="w-full p-3 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-400 rounded-xl h-24 resize-none outline-none transition-all bg-gray-50/30 text-gray-800 font-semibold disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-500 block uppercase tracking-wider text-[9px]">Deficiencies / Recommendations / Remedies</label>
                  <textarea
                    id={`recs-${sec.id}`}
                    value={secData.recommendation}
                    disabled={isReadOnly}
                    onChange={(e) => handleFieldChange(sec.id, 'recommendation', e.target.value)}
                    placeholder="Enter recommended remedies..."
                    className="w-full p-3 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-400 rounded-xl h-24 resize-none outline-none transition-all bg-gray-50/30 text-gray-800 font-semibold disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FINAL DECISION MODULE */}
      <div className="bg-[#5D9C0E] text-white p-5 rounded-2xl border border-[#4a7c0b] shadow-md space-y-4">
        <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-green-800/40 pb-2 text-[12px]">
          <Award size={15} className="text-yellow-400" /> Final Accreditation Recommendation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="font-bold text-green-100 block mb-1">Accreditation Decision</label>
              <select
                id="accreditation-decision"
                value={decision}
                disabled={isReadOnly}
                onChange={(e) => setDecision(e.target.value)}
                className="w-full p-2.5 bg-white border border-green-700 rounded-xl outline-none text-gray-900 font-bold tracking-wide focus:border-green-600 focus:ring-1 focus:ring-green-500 transition-colors disabled:opacity-75"
              >
                <option value="Full Accreditation" className="text-gray-900 font-bold">Full Accreditation</option>
                <option value="Partial Accreditation" className="text-gray-900 font-bold">Partial Accreditation</option>
                <option value="Denial" className="text-gray-900 font-bold">Denial (No Accreditation)</option>
              </select>
            </div>
            
            {decision !== 'Denial' && (
              <div>
                <label className="font-bold text-green-100 block mb-1">Duration of Accreditation</label>
                <select
                  id="accreditation-duration"
                  value={duration}
                  disabled={isReadOnly}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-2.5 bg-white border border-green-700 rounded-xl outline-none text-gray-900 font-bold focus:border-green-600 focus:ring-1 focus:ring-green-500 transition-colors disabled:opacity-75"
                >
                  <option value="5" className="text-gray-900 font-bold">5 Years (Standard Full)</option>
                  <option value="4" className="text-gray-900 font-bold">4 Years</option>
                  <option value="3" className="text-gray-900 font-bold">3 Years (Standard Partial)</option>
                  <option value="2" className="text-gray-900 font-bold">2 Years</option>
                  <option value="1" className="text-gray-900 font-bold">1 Year</option>
                </select>
              </div>
            )}
          </div>

          {/* PANEL MEMBERS & REPORT DATE */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-green-100 block mb-1 flex items-center justify-between">
                <span>Accreditation Panel Members</span>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="text-[10px] bg-green-600 hover:bg-green-750 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1 transition-colors border border-green-500/30"
                  >
                    <UserPlus size={10} /> Add Member
                  </button>
                )}
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {panelMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Panel Member Name ${idx + 1}`}
                      value={member}
                      disabled={isReadOnly}
                      onChange={(e) => handleMemberChange(idx, e.target.value)}
                      className="flex-1 p-2 bg-white border border-green-700 rounded-lg outline-none text-gray-900 font-semibold placeholder-gray-400 disabled:opacity-75"
                    />
                    {!isReadOnly && panelMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-red-100 hover:text-red-200 hover:bg-green-800 p-1.5 rounded-lg transition-colors border border-green-800"
                      >
                        <Trash size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-green-100 block mb-1">Date of Summary Report</label>
              <div className="relative">
                <input
                  type="date"
                  value={reportDate}
                  disabled={isReadOnly}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full p-2 bg-white border border-green-700 rounded-lg outline-none text-gray-900 font-bold disabled:opacity-75"
                />
                <Calendar size={14} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      
      
      
      {/* FLOATING ACTION BOTTOM NAVIGATOR */}
      <div className="bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-3 sm:p-4 flex flex-row justify-between items-center gap-2 max-w-5xl mx-auto rounded-2xl z-10 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-2.5 py-2 sm:px-5 sm:py-2.5 border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
        >
          <ChevronLeft size={14} /> Back
        </button>
        
        {!isReadOnly && (
          <div className="flex gap-2">
            {adminRole === 'admin_registrar' ? (
              <button
                type="button"
                onClick={handleSaveProgress}
                className="px-3 py-2 sm:px-6 sm:py-2.5 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
              >
                Save Report Changes
              </button>
            ) : (
              <>
                {adminRole === 'admin_reviewer' && (
                  <button
                    type="button"
                    onClick={handleSaveProgress}
                    className="px-3 py-2 sm:px-6 sm:py-2.5 border border-[#5D9C0E] text-[#5D9C0E] hover:bg-[#EEF6DF] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm text-xs sm:text-sm whitespace-nowrap"
                  >
                    Save Progress
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-2 sm:px-6 sm:py-2.5 bg-[#5D9C0E] hover:bg-[#4a7c0b] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap"
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
