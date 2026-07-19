"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo"; 
import StepThree from "./StepThree"; 
import StepFour from "./StepFour";

// ==========================================
// HELPER TO GENERATE S/N & HEADERS
// ==========================================
const buildItemList = (list: string[]) => {
  let mainCounter = 0;
  return list.map(itemStr => {
    const isSub = itemStr.startsWith("- ");
    const isHeader = itemStr.endsWith(":");
    if (!isSub) mainCounter++;
    
    return {
      item: isSub ? itemStr.substring(2) : itemStr, 
      isSubItem: isSub,
      isHeader: isHeader,
      sn: isSub ? "•" : mainCounter, 
      isAvailable: '',
      availableQuantity: '',
      floorStructure: '' 
    };
  });
};

// ==========================================
// AUDIOLOGY ACADEMIC DATA LISTS
// ==========================================
const academicSpacesList = [
  "Offices", "Departmental Board Room/ Seminar Room", 
  "Lecture Halls/ Lecture Theatre/ Classrooms and Student Conveniences:", 
  "- Lecture Halls/ Lecture Theatre/ Classrooms", "- Student Conveniences", 
  "Hostel Accommodation with Conveniences", 
  "Basic Medical Laboratories:", 
  "- Gross Anatomy and Embryology", "- Histology", "- Museum", "- Biochemistry", "- Physiology", 
  "Audiology Demonstration Laboratories:", 
  "- Simulation", 
  "Library:", 
  "- College/ Departmental", "- Instituitional", "- e- library", 
  "Transportation", "Alternative Power Source", "Running Water Supply", "Safety Equipment across Facility"
];

const academicClinicalList = [
  "Hospital Bed Space", 
  "Compliment of Specialist Services:", 
  "- Clinical Audiology", "- Paediatric Audiology", "- Geriatric Audiology Unit", "- Rehabilitation Audiology", "- Educational Audiology", "- Vestibular Audiology", "- Cochlear implant and implantable Devices", "- Occupational Audiology", "- Tinnitus and Hyperacusis Management", "- Public Health. Research and Academic.", 
  "Audiology Department:", 
  "- Purpose built", "- number of Audiologists", 
  "Areas of specialization in Audiology:", 
  "- Clinical Audiology", "- Paediatric Audiology", "- Geriatric Audiology Unit", "- Rehabilitation Audiology", "- Educational Audiology", "- Vestibular Audiology", "- Cochlear implant and implantable Devices", "- Occupational Audiology", "- Tinnitus and Hyperacusis Management", "- Public Health. Research and Academic.", 
  "Academic Audiology Department:", 
  "- Purpose built", "- Within Hospital Premises", 
  "Clinical Students Hostel:", 
  "- Within Hospital Premises", 
  "Funding Source:", 
  "- Clearly stated", "- Ambiguous"
];

const anatomyList = [
  "Embalmed bodies", "Anatomage", "Equipment Trolleys", "Electric Embalming Machine", "Bone Cutting Equipment - Electric Saw/Drill", "Articulated and Unarticulated Skeletons", "X-ray Viewing Boxes", "Air-Conditions for the Dissecting Rooms and Air Extractors.", "Models", "Slide for Sections", "Slide Projectors", 
  "Toilet Facilities:", "- Male", "- Female", 
  "Changing Room", "Shower Room etc."
];
const histologyList = ["Microtome", "Rotary/Sledge Microtome Knives", "Light Microscopes Microtome", "Vacuum Pump Dissecting Microtome", "Cryostat with Microtome", "Teaching Microscope", "Electron Microscope", "Slides"];
const biochemistryList = ["Centrifuge", "Ultracentrifuge", "Electronic Balances", "Heating Block", "Vacuum Pumps", "Spectrophotometer", "PH. Metres", "Thermostatic Water Bath", "Bunner", "Test Tube varying size", "Distiller"];
const physiologyList = ["Spirometer", "Vitalograph", "Polygraph", "Peak Flow Metre", "Gas Metre", "Ecg Machine", "Spectrophotometers", "Physiograph Recorder Transducers", "Oscilloscopes", "Centrifuges", "Blood Gas Callipers", "Audiometer", "Water Baths", "Electronic Weighing Balance Scale", "Flame Photometer", "Microcentrifuge", "Water Distiller", "Bicycle Ergometer", "Stethoscope/ Sphygmomanometre", "Electron Microscope", "Teaching Microscope", "Slides", "Snelle's Chart"];
const diagnosticList = ["Diagnostic Audiometer", "Screening Audiometer", "Portable Audiometer", "Sound Treated Booth", "Supra-Aural Headphones", "Bone Vibrator", "Patient Response Button", "Speech Microphone/Talk Forward Mic", "Sound Field Speakers", "Otoscope", "Tunning Forks (Sets)", "Cerumen Management Kit (Sets)", "Diagnostic Tympanometer", "Immitance Meter", "Eustachian Tube Function Module", "Probe Tips And Ear Couplers", "OAE Machine(TEOAE,DPOAE)", "ABR Machine", "AABR Newborn Screener", "ASSR Machine", "Electrodes (Sets)", "Sin Prep Gel (Set)", "Disposable Ear Tips (Sets)", "Speech Perception Software", "Speech Audiometry Test Materials (Set)", "Auditory Processing Test Materials (Sets)", "Tinnitus Matching Modules"];
const infectionControlList = ["Face Masks (Packs)", "Disposable Gloves (Packs)", "Sputum Containers (Packs)", "Sterilizing Unit", "Autoclave", "Antiseptic Solution (Packs)", "Washing Machine", "Drying Machine"];
const clinicalAudiologyList = ["Clinical/Diagnostic Audiometer", "Portable Screening Audiometer", "Sound-Treated Room", "Insert Earphones (Sets)", "Supra-Aural Headphones", "Bone Vibrator", "Speech Microphone", "Patient Response Button", "Otoscope/Videoscope", "Tympanometer/Immitance Meter", "Acoustic Reflex Analyzer", "OAE Machine", "ABR/ASSR System", "Tunning Fork (Sets)", "Laptop And Audiology Software", "Printer / Recording System", "Calibration Tools (Set)", "Cerumen Management Kit (Set)"];
const paediatricAudiologyList = ["Oae", "AABR /New-born Hearing Screening", "Diagnostic ABR/ASSR", "VRA Setup(lights, animated toys , video reinforcement) (Set)", "Conditioned Play Audiometry Toys (Set)", "Sound Filled Speakers", "Paediatric Insert Earphones", "Distraction Toys (Set)", "Reinforment Box", "Visual Reward Display", "Paediatric Hearing And Verification Tools", "Developmental Screening Materials (Set)"];
const geriatricAudiologyList = ["Clinical/Diagnostic Audiometer", "Portable Screening Audiometer", "Sound-Treated Room", "Insert Earphones (Sets)", "Supra-Aural Headphones", "Bone Vibrator", "Speech Microphone", "Patient Response Button", "Otoscope/ Videoscope", "Tympanometer/Immitance Meter", "Acoustic Reflex Analyzer", "OAE Machine", "ABR/ASSR System", "Tunning Fork (Sets)", "Lptop And Audilogy Software", "Printer / Recording System", "Calibration Tools (Set)", "Cerumen Management Kit (Set)"];
const rehabAudiologyList = ["Hearing Aids (BTE,RIC,ITE,CIC) (Set)", "Hearing Aid Programing Software", "Hearing Aid Programmer", "Real Ear Measurement(REM)System", "Hearing Aid Analyser/Test Box", "Earmold Impression Syringe (Set)", "Ear Tips And Domes (Set)", "Hearing Aid Batteries/Charges (Set)", "FM Systems /Remote Microphone Systems", "Loop System", "Auditory Training Software", "Speech Perception Test Materials (Set)", "Counselling Materials (Set)", "Communication Strategy Hand-outs", "Assistive Listening Device"];
const vestibularList = ["ENG/VNG System", "Infrared Video Goggles", "Frenzel Goggles", "Caloric Irrigator", "Rotary Chair", "VEMP Machine", "Computer and Balance Software", "Posturography System", "Foam Balance Pad", "Gait Assessment Walkway", "Dix-Hall pike Couch/Examination", "Safety Harness", "Vestibular Rehab Exercise Tools (Set)"];
const cochlearImplantList = ["Cochlear Implant Programing Software", "Mapping", "Speech Processor", "Transmitting Coil", "Telemetry/ECAP System", "Speech Perception Test Materials (Set)", "CI Troubleshooting Kit (Set)", "Battery and Charger System:", "- Battery System", "- Charger System", "Bone-Anchored Hearing Device Programming Kit", "Laptop Workstation", "Intaoperative Monitoring Interface(Advance Centres)", "Rehabilitation Listening Materials (Set)"];
const occupationalList = ["Portable Audiometer", "Mobile Audiometric Booth", "Noise Dosimeter", "Sound Level Meter", "Octave Band Analyzer", "Hearing Protection Fit-Testing System", "Earplugs And Ear Earmuffs", "Hearing Conservation Software", "Record Management Software", "Worker Counselling Materials (Set)", "Potable Otoscope", "Industrial Noise Survey Kit (Set)"];
const tinnitusPublicHealthList = ["Clinical Audiometer", "High-Frequency Audiometer", "Tinnitus Matching Modules", "Loudness Discomfort Level (LDL) Tools", "Tinnitus Questionnaires (THI,TFI)", "Sound Therapy Generators", "Tinnitus Maskers", "Combination Hearing Aids (Set)", "White Noise Generators", "Counselling Software/CBT Materials", "Relaxation Audio Library", "Public Health Screening Audiometer", "OAE Screener", "Noise Awareness Education Kits (Set)", "Community Outreach IEC Materials (Set)", "Ear Protection Demonstration Kits (Set)"];
const safetyMeasuresList = ["Alarm", "Fire Extinguisher", "Blanket", "Intercom", "Fire Assembly Point", "Sand Bucket", "Clearly marked direction to Muster Point"];

const ACADEMIC_CATEGORIES = [
  { key: 'anatomy', title: 'i. Anatomy and Embryology' },
  { key: 'histology', title: 'ii. Histology' },
  { key: 'biochemistry', title: 'iii. Biochemistry' },
  { key: 'physiology', title: 'iv. Physiology' },
  { key: 'diagnostic', title: 'v. Diagnostic Equipment' },
  { key: 'infectionControl', title: 'vi. Infection Control' },
  { key: 'clinicalAudiology', title: 'vii. Clinical Audiology Unit' },
  { key: 'paediatricAudiology', title: 'viii. Paediatric Audiology Unit' },
  { key: 'geriatricAudiology', title: 'ix. Geriatric Audiology Unit' },
  { key: 'rehabAudiology', title: 'x. Rehabilitation Audiology Unit' },
  { key: 'vestibular', title: 'xi. Vestibular Audiology Unit' },
  { key: 'cochlearImplant', title: 'xii. Cochlear Implant and Implantable Devices Unit' },
  { key: 'occupational', title: 'xiii. Occupational Audiology Unit' },
  { key: 'tinnitusPublicHealth', title: 'xiv. Tinnitus Hyperacusis Management and Public Health Audiology Unit' },
  { key: 'safetyMeasures', title: 'xv. Safety Measures' }
];

export default function AudiologyAcademicAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const [formData, setFormData] = useState({
    stepOne: {
      lecturers: [{ id: 'lec_1', name: '', gender: '', dateAppt: '', natureAppt: '', designation: '', license: '', specialization: '', qualifications: [{ id: 'q_1', title: '', date: '' }], cpds: [{ id: 'c_1', title: '' }], papers: [{ id: 'p_1', title: '' }] }],
      supportStaff: [{ id: 'sup_1', name: '', gender: '', rank: '', trainingFileName: '', jobDescription: '', qualifications: [{ id: 'sq_1', title: '', date: '' }] }]
    },
    stepTwo: { spaces: buildItemList(academicSpacesList) },
    stepThree: { clinicalTraining: buildItemList(academicClinicalList) },
    stepFour: {
      anatomy: buildItemList(anatomyList),
      histology: buildItemList(histologyList),
      biochemistry: buildItemList(biochemistryList),
      physiology: buildItemList(physiologyList),
      diagnostic: buildItemList(diagnosticList),
      infectionControl: buildItemList(infectionControlList),
      clinicalAudiology: buildItemList(clinicalAudiologyList),
      paediatricAudiology: buildItemList(paediatricAudiologyList),
      geriatricAudiology: buildItemList(geriatricAudiologyList),
      rehabAudiology: buildItemList(rehabAudiologyList),
      vestibular: buildItemList(vestibularList),
      cochlearImplant: buildItemList(cochlearImplantList),
      occupational: buildItemList(occupationalList),
      tinnitusPublicHealth: buildItemList(tinnitusPublicHealthList),
      safetyMeasures: buildItemList(safetyMeasuresList)
    }
  });

  const handleNext = () => { if (currentStep < totalSteps) { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const handlePrev = () => { if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const updateEquipmentCategory = (categoryKey: string, index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedCategory = [...(prev.stepFour as any)[categoryKey]];
      updatedCategory[index] = { ...updatedCategory[index], [field]: value };
      return {
        ...prev,
        stepFour: { ...prev.stepFour, [categoryKey]: updatedCategory }
      };
    });
  };

  const checkIncompleteFields = () => {
    const allEq = Object.values(formData.stepFour).flat();
    const allItems = [...formData.stepTwo.spaces, ...formData.stepThree.clinicalTraining, ...allEq];
    return allItems.some((item: any) => !item.isHeader && (item.isAvailable === '' || (item.isAvailable === 'Yes' && item.availableQuantity === '')));
  };

  const handleInitialSubmit = () => {
    if (checkIncompleteFields()) setShowIncompleteWarning(true);
    else executeSubmit();
  };

  const executeSubmit = async () => {
    setShowIncompleteWarning(false);
    setIsSubmitting(true);
    
    const formatList = (list: any[]) => list.map(item => ({
      ...item,
      isAvailable: item.isCategoryHeader ? 'Category' : (item.isHeader ? 'Header' : (item.isAvailable === '' ? '-' : item.isAvailable)),
      availableQuantity: item.isCategoryHeader ? 'Category' : (item.isHeader ? 'Header' : ((item.isAvailable === 'Yes' && item.availableQuantity === '') ? '-' : item.availableQuantity))
    }));

    // Inject structural categories right before API dispatch
    const allEquipmentRaw = Object.entries(formData.stepFour).flatMap(([key, items]) => {
      const cat = ACADEMIC_CATEGORIES.find(c => c.key === key);
      return [
        { isCategoryHeader: true, item: cat ? cat.title : key.toUpperCase() },
        ...(items as any[])
      ];
    });

    const payload = { 
        lecturers: formData.stepOne.lecturers, 
        supportStaff: formData.stepOne.supportStaff,
        spaces: formatList(formData.stepTwo.spaces), 
        clinicalTraining: formatList(formData.stepThree.clinicalTraining),
        equipment: formatList(allEquipmentRaw),
        assessment_type: "audiology_academic" 
    };

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(payload)
      });
      if (response.ok) setIsSuccessModalOpen(true);
      else alert("Submission failed. Please try again.");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Network error during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 pb-20 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-[0.03]" style={{ backgroundImage: "url('/logo.png')", backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '500px' }} />

      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <Loader2 size={48} className="animate-spin text-[#65A30D] mb-4" />
          <p className="text-gray-800 font-bold text-lg">Submitting Assessment...</p>
        </div>
      )}

      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm relative">
        <div className="flex-1">
          <button onClick={currentStep === 1 ? undefined : handlePrev} className="p-2 hover:bg-slate-50 rounded-full transition-colors inline-flex">
            {currentStep === 1 ? <Link href="/dashboard"><ArrowLeft size={20} className="text-[#066936]" /></Link> : <ArrowLeft size={20} className="text-[#066936]" />}
          </button>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="object-contain w-full h-full" />
        </div>
        <div className="flex-1 flex justify-end">
          <div className="bg-[#F8FCF5] px-4 py-2 rounded-md hidden md:block w-max border border-[#CDE1B4]/50 shadow-sm">
            <p className="text-[11px] text-gray-500 font-medium"><span className="text-[#066936] font-bold">Step {currentStep} of {totalSteps}</span></p>
            <p className="text-[10px] text-[#5D9C0E] font-bold mt-0.5 uppercase tracking-wider">Audiology - Academic</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pt-10 px-4 md:px-0 relative z-10">
        {currentStep === 1 && <StepOne data={formData.stepOne} updateData={(d: any) => setFormData({ ...formData, stepOne: d })} onNext={handleNext} />}
        {currentStep === 2 && <StepTwo data={formData.stepTwo} updateData={(d: any) => setFormData({ ...formData, stepTwo: d })} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 3 && <StepThree data={formData.stepThree} updateData={(d: any) => setFormData({ ...formData, stepThree: d })} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 4 && <StepFour data={formData.stepFour} categories={ACADEMIC_CATEGORIES} updateCategory={updateEquipmentCategory} onPrev={handlePrev} onSubmit={handleInitialSubmit} isSubmitting={isSubmitting} />}
      </main>

      {showIncompleteWarning && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-[1px] px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] shadow-2xl px-6 py-6 w-full max-w-[340px] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="bg-[#EEF6DF] p-3 rounded-full mb-3 shadow-sm border border-[#CDE1B4]/50">
                <AlertTriangle size={28} className="text-[#5D9C0E]" strokeWidth={2.5} />
            </div>
            <h2 className="text-[17px] font-bold text-gray-900 mb-2">Incomplete Form</h2>
            <p className="text-gray-500 font-medium text-[13px] mb-6 leading-relaxed">
              You have unanswered fields. Please note that submitting an incomplete assessment may negatively impact your accreditation approval.
            </p>
            <div className="flex flex-col w-full gap-2.5">
              <button onClick={() => setShowIncompleteWarning(false)} className="w-full bg-[#066936] hover:bg-[#044c27] text-white font-bold py-2.5 rounded-full transition-all shadow-md text-[13px]">
                Review & Complete
              </button>
              <button onClick={executeSubmit} className="w-full border border-gray-200 text-gray-500 font-bold py-2.5 rounded-full hover:bg-gray-50 transition-all text-[13px]">
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[1px] px-4">
          <div className="bg-white rounded-[20px] shadow-2xl px-6 py-6 w-full max-w-[340px] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="bg-[#38A169] p-2 rounded-xl rotate-45 mb-3">
              <div className="-rotate-45"><CheckCircle2 size={24} className="text-white" strokeWidth={3} /></div>
            </div>
            <p className="text-[#38A169] font-medium text-[13px] mb-5">Assessment form submitted successfully!</p>
            <button onClick={() => router.push('/dashboard')} className="border border-[#38A169] text-[#38A169] w-full py-2.5 rounded-full font-medium text-[13px] hover:bg-[#F4F9F2] transition-colors">
              Back to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}