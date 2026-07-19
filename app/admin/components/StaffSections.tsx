import React from 'react';
import { User, Stethoscope, FileText, XCircle } from 'lucide-react';
import { FormRow, safeParseArray } from './FormSharedComponents';

export const PrimaryPractitionersSection = ({ staff }: { staff: any[] }) => {
  const primary = staff?.filter((s) => s.type !== 'support_staff') || [];
  const isAcademic = primary.some(p => p.type === 'lecturer');

  return (
    <section>
      <h3 className="text-[13px] text-[#066936] font-medium mb-4 uppercase tracking-wider flex items-center gap-1.5">
        <Stethoscope size={16} /> {isAcademic ? `Lecturers (${primary.length})` : `Primary Practitioners (${primary.length})`}
      </h3>
      <div className="flex flex-col gap-6">
        {primary.map((p, i) => {
          const quals = safeParseArray(p.qualifications);
          const cpds = safeParseArray(p.cpds);
          const journals = safeParseArray(p.journals);
          const papers = safeParseArray(p.papers);
          const pgCerts = safeParseArray(p.pgCerts);

          const qualsString = quals.length > 0 ? quals.map((q: any) => `${q.title} ${q.date ? `(${q.date})` : ''}`).join(', ') : '-';
          const cpdsString = cpds.length > 0 ? cpds.map((c: any) => c.title).join(', ') : '-';
          const journalsString = journals.length > 0 ? journals.map((j: any) => j.title).join(', ') : '-';
          const papersString = papers.length > 0 ? papers.map((pa: any) => pa.title).join(', ') : '-';
          const pgCertsString = pgCerts.length > 0 ? pgCerts.map((pg: any) => `${pg.title} ${pg.date ? `(${pg.date})` : ''}`).join(', ') : '-';
          
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
                  <FormRow label="Designation" value={p.designation} />
                  <FormRow label="License No." value={p.license} />
                  <FormRow label="Appt. Date" value={p.dateAppt} />
                  <FormRow label="Appt. Nature" value={p.natureAppt} />
                  <FormRow label="Specialization" value={p.specialization || '-'} />
                  <FormRow label="Qualifications" value={qualsString} />
                  
                  {isAcademic ? (
                    <>
                      <div className="col-span-1 md:col-span-2">
                        <FormRow label="Post-graduate Certs" value={pgCertsString} />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <FormRow label="Papers Presented" value={papersString} />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <FormRow label="Journals Attended" value={journalsString} />
                      </div>
                    </>
                  ) : (
                    <div className="col-span-1 md:col-span-2">
                      <FormRow label="CPD Programmes" value={cpdsString} />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Proof of License / Cert</span>
                  {p.trainingFileName ? (
                    <button className="flex items-center gap-1.5 bg-[#EEF6DF] text-[#066936] px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-[#dcedc1] transition-colors border border-[#CDE1B4]/50">
                      <FileText size={14} /> View Document
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 bg-gray-50 text-gray-400 border border-gray-100 px-4 py-2 rounded-lg text-[12px] font-medium">
                      <XCircle size={14} /> Not Uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {primary.length === 0 && <p className="text-sm text-gray-400 italic font-medium">{isAcademic ? 'No lecturers listed.' : 'No practitioners listed.'}</p>}
      </div>
    </section>
  );
};

export const SupportStaffSection = ({ staff }: { staff: any[] }) => {
  const support = staff?.filter((s) => s.type === 'support_staff') || [];
  return (
    <section>
      <h3 className="text-[13px] text-[#066936] font-medium mb-4 uppercase tracking-wider flex items-center gap-1.5">
        <User size={16} /> Support Staff ({support.length})
      </h3>
      <div className="flex flex-col gap-6">
        {support.map((s, i) => {
          const quals = safeParseArray(s.qualifications);
          const qualsString = quals.length > 0 ? quals.map((q: any) => q.title).join(', ') : '-';

          return (
            <div key={i} className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="bg-[#F0F7FF] border-b border-blue-200/50 px-5 py-3">
                <span className="text-blue-800 font-bold text-[11px] uppercase tracking-wider">Support Staff #{i + 1}</span>
              </div>
              <div className="p-5 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 mb-4">
                  <FormRow label="Full Name" value={s.name} />
                  <FormRow label="Gender" value={s.gender} />
                  <FormRow label="Rank" value={s.rank} />
                  <FormRow label="Qualifications" value={qualsString} />
                </div>
                <div className="mt-2 mb-4">
                  <span className="text-gray-500 font-medium text-[12px] block mb-2">Job Description:</span>
                  <div className="text-gray-900 font-medium text-[13px] bg-slate-50 p-4 rounded-xl border border-gray-100 italic w-full">
                    {s.jobDescription || 'No description provided.'}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Certificate</span>
                  {s.trainingFileName ? (
                    <button className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-blue-100 transition-colors border border-blue-200">
                      <FileText size={14} /> View Certificate
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