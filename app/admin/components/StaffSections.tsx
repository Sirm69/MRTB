import React from 'react';
import { User, Stethoscope, FileText, XCircle } from 'lucide-react';
import { FormRow, safeParseArray } from './FormSharedComponents';

export const PrimaryPractitionersSection = ({ staff, assessmentType }: { staff: any[]; assessmentType?: string }) => {
  const primary = staff?.filter((s) => s.type !== 'support_staff') || [];
  const isAcademic = assessmentType?.includes('academic') || primary.some(p => p.type === 'lecturer');

  return (
    <section>
      <h3 className="text-[13px] text-[#066936] font-medium mb-4 uppercase tracking-wider flex items-center gap-1.5">
        <Stethoscope size={16} /> {isAcademic ? `Lecturers (${primary.length})` : `Primary Practitioners (${primary.length})`}
      </h3>
      <div className="flex flex-col gap-6">
        {primary.map((p, i) => {
          const quals = safeParseArray(p.qualifications);
          const qualsString = quals.length > 0 
            ? quals.map((q: any) => `${q.title || q}${q.date ? ` (${q.date})` : ''}`).filter(Boolean).join(', ') 
            : (p.qualification || '-');

          const cpds = safeParseArray(p.cpds);
          const cpdsString = cpds.length > 0 
            ? cpds.map((c: any) => c.title || c).filter(Boolean).join(', ') 
            : (typeof p.cpds === 'string' ? p.cpds : '');

          const pgCerts = safeParseArray(p.pgCerts);
          const pgCertsString = pgCerts.length > 0 
            ? pgCerts.map((pg: any) => `${pg.title || pg}${pg.date ? ` (${pg.date})` : ''}`).filter(Boolean).join(', ') 
            : (typeof p.pgCerts === 'string' ? p.pgCerts : '');

          const papers = safeParseArray(p.papers);
          const papersString = papers.length > 0 
            ? papers.map((pa: any) => pa.title || pa).filter(Boolean).join(', ') 
            : (typeof p.papers === 'string' ? p.papers : '');

          const journals = safeParseArray(p.journals);
          const journalsString = journals.length > 0 
            ? journals.map((j: any) => j.title || j).filter(Boolean).join(', ') 
            : (typeof p.journals === 'string' ? p.journals : '');
          
          return (
            <div key={i} className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="bg-[#F8FCF5] border-b border-[#CDE1B4]/50 px-5 py-3">
                <span className="text-[#066936] font-bold text-[11px] uppercase tracking-wider">
                  {isAcademic ? `Lecturer #${i + 1}` : `Practitioner #${i + 1}`}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 mb-2">
                  <FormRow label="Full Name" value={p.name} />
                  <FormRow label="Gender" value={p.gender} />
                  {p.designation && <FormRow label="Designation" value={p.designation} />}
                  {p.license && <FormRow label="MRTB License No." value={p.license} />}
                  {p.dateAppt && <FormRow label="Date of First Appt." value={p.dateAppt} />}
                  {p.natureAppt && <FormRow label="Nature of Appt." value={p.natureAppt} />}
                  {p.specialization && <FormRow label="Areas of Specialization" value={p.specialization} />}
                  <FormRow label="Qualifications" value={qualsString} />
                  
                  {cpdsString ? (
                    <div className="col-span-1 md:col-span-2">
                      <FormRow label={isAcademic ? "Paper Presented / CPD Attended" : "CPD Programmes"} value={cpdsString} />
                    </div>
                  ) : null}

                  {pgCertsString ? (
                    <div className="col-span-1 md:col-span-2">
                      <FormRow label="Post-graduate Certs" value={pgCertsString} />
                    </div>
                  ) : null}

                  {papersString ? (
                    <div className="col-span-1 md:col-span-2">
                      <FormRow label="Papers Presented" value={papersString} />
                    </div>
                  ) : null}

                  {journalsString ? (
                    <div className="col-span-1 md:col-span-2">
                      <FormRow label="Journals Attended" value={journalsString} />
                    </div>
                  ) : null}
                </div>

                {p.trainingFileName ? (
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Proof of License / Document</span>
                    <button className="flex items-center gap-1.5 bg-[#EEF6DF] text-[#066936] px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-[#dcedc1] transition-colors border border-[#CDE1B4]/50">
                      <FileText size={14} /> View Document ({p.trainingFileName})
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        {primary.length === 0 && <p className="text-sm text-gray-400 italic font-medium">{isAcademic ? 'No lecturers listed.' : 'No practitioners listed.'}</p>}
      </div>
    </section>
  );
};

export const SupportStaffSection = ({ staff, assessmentType }: { staff: any[]; assessmentType?: string }) => {
  const support = staff?.filter((s) => s.type === 'support_staff') || [];
  return (
    <section>
      <h3 className="text-[13px] text-[#066936] font-medium mb-4 uppercase tracking-wider flex items-center gap-1.5">
        <User size={16} /> Support Staff ({support.length})
      </h3>
      <div className="flex flex-col gap-6">
        {support.map((s, i) => {
          const quals = safeParseArray(s.qualifications);
          const qualsString = quals.length > 0 
            ? quals.map((q: any) => `${q.title || q}${q.date ? ` (${q.date})` : ''}`).filter(Boolean).join(', ') 
            : (s.qualification || '-');

          return (
            <div key={i} className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="bg-[#F0F7FF] border-b border-blue-200/50 px-5 py-3">
                <span className="text-blue-800 font-bold text-[11px] uppercase tracking-wider">Support Staff #{i + 1}</span>
              </div>
              <div className="p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 mb-4">
                  <FormRow label="Full Name" value={s.name} />
                  <FormRow label="Gender" value={s.gender} />
                  {s.rank && <FormRow label="Present Rank/Cadre" value={s.rank} />}
                  {s.designation && <FormRow label="Designation" value={s.designation} />}
                  <FormRow label="Qualifications" value={qualsString} />
                </div>
                {s.jobDescription && (
                  <div className="mt-2 mb-4">
                    <span className="text-gray-500 font-medium text-[12px] block mb-2">Job Description:</span>
                    <div className="text-gray-900 font-medium text-[13px] bg-slate-50 p-4 rounded-xl border border-gray-100 italic w-full">
                      {s.jobDescription}
                    </div>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Evidence of Continuous Training</span>
                  {s.trainingFileName ? (
                    <button className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-blue-100 transition-colors border border-blue-200">
                      <FileText size={14} /> View Document ({s.trainingFileName})
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 bg-gray-50 text-gray-400 border border-gray-100 px-4 py-2 rounded-lg text-[12px] font-medium">
                      <XCircle size={14} /> No File Attached
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {support.length === 0 && <p className="text-sm text-gray-400 italic font-medium">No support staff listed.</p>}
      </div>
    </section>
  );
};