"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo"; 
import StepThree from "./StepThree"; 

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
// SPEECH THERAPY CLINICAL DATA LISTS
// ==========================================
const speechClinicalSpacesList = [
  "Offices", "Treatment Cubicles", "Changing Rooms", "Patients Waiting Area", "Hospital Wards/ Treatment Side Ward", 
  "Health Record Office", "Consulting Rooms", "Seminar Room", "Departmental Library", "Hospital Library", 
  "Staff Toilets", "Patients’ Toilet", "Departmental Store"
];

const diagnosticList = [
  "Digital Audio Recorder", "Video Recorder /HD Camera", "Laptop with Speech Analysis Software", "Desktop Computer", "High Quality Microphone", "Noise Induced Headset", "Portable Speaker", "Stopwatch/Timer", "Tablet for AAC and Testing Apps", "Printer /Scanner for Test Protocols", "Penlight", "Tongue Depressors (Pack)", "Oral Examination Mirror", "Gloves (Pack)", "Reflex Hammer", "IOPI Tongue Pressure Device", "Respiratory Pressure Meter", "Decibel Meter/SPL Meter", "DDK Digital Counter", "Acoustic Voice Analysis Software", "Computerised Speech Lab(CSL)", "Microphone Calibration System", "Sound Level Meter", "Electroglottograph(EGG)", "Videostroboscopy", "Laryngeal Endoscopy Tower", "Nasometer", "Nasopharyngoscope", "Aerodynamic Airflow-Pressure System", "Videofloroscopy Support Access", "Tongue Pressure Device", "Food Viscosity Testing Kit", "VFSS/Modified Barium Swallow System", "FEES Recording Software", "Endoscope", "Light Source", "Monitor", "Image Capture System", "Speech Generating Device", "Touch Screen Board", "Symbol Communication Software", "Paediatric Feeding Chair", "Texture Testing Spoons", "Syringes", "Nipple Flow Testing Set", "Bottle Teat Assessment Kit", "Weighing Scale", "Sensory Feeding Tools", "Play Based Assessment Kits", "Cognitive Communication Software", "Language Sample Software", "Standardized Test Kit Cabinet", "Seminar Projector", "Video Teaching Archive System", "Students Practical Kit"
];

const safetyEquipmentList = [
  "Alarm", "Fire Extinguisher", "Blanket", "Intercom", "Fire Assembly Point", "Sand Bucket", "Clearly marked direction to muster point"
];

const infectionControlList = [
  "Face Masks (Pack)", "Disposable Gloves (Pack)", "Sputum Containers", "Sterilizing Unit", "Autoclave", "Antiseptic Solution (Carton/Pack)", "Washing Machine", "Drying Machine"
];

const consumablesList = [
  "Tongue Depressors (Pack)", "Disposable Gloves (Pack)", "Oral Swabs (Pack)", "Disposable Spoons (Pack)", "Disposable Cups (Pack)", "Drinking Straws (Pack)", "Feeding Syringes (Pack)", "Food Thickener Sachets (Pack)", "Bibs/ Napkins", "Tissues (Pack)", "Suction Catheters (dysphagia clinic)", "A4 Paper (Pack)", "Pencils", "Masking Tape", "Cardboard Sheets", "Coloured Paper", "Therapy Worksheet Printout"
];

const languageDisordersList = [
  "Aphasia Batteries (WAB/BDAE type)", "Language Test Batteries (adult and paediatric)", "Bedside Screening Kits", "Literacy/Phonological Awareness Kits", "Reading Comprehension Tools", "Writing Task Boards", "Story Sequencing Cards (Set)", "Tablets/Laptops for Language Apps", "Naming Therapy Software", "Workbooks", "Category Cards (Set)", "Sentence Strips (Pack)", "Whiteboards"
];

const fluencyDisordersList = [
  "SSI-type Fluency Tools", "Stopwatch Timer", "Audio-Video Recorder", "Speech Rate Counter Apps/Devices", "Delayed Auditory Feedback Devices", "Breathing Trainer", "Fluency Shaping Manuals", "Counseling Materials (Set)"
];

const voiceResonanceList = [
  "Laryngeal Mirror Sets", "Acoustic Voice Analysis Software", "Microphones (high quality)", "SPL Meter", "Nasometer", "Pitch Analyser", "Voice Range Profile Software", "FEES System Access", "Flexible Laryngoscope Access", "Stroboscopy Access", "Resonance Tubes/Straw Phonation Kits", "Breathing Trainer", "Biofeedback Monitor"
];

const swallowingFeedingList = [
  "Dysphagia Bedside Kits", "Purse Oximeters", "Cervical Auscultation Stethoscope", "Food Texture Kits", "Thickener Stock", "Syringes/Spoons/Cups", "Oral Motor Exam Kits", "FEES Access", "VFSS Devices", "EMST Devices", "NMES Swallowing Devices", "Adaptive Bottles", "Specialty Nipples", "High Chairs", "Feeding Spoons"
];

const cognitiveCommunicationList = [
  "Cognitive-linguistic Batteries", "Memory Screening Tools", "Executive Function Task Kits", "Attention Testing Software", "Problem Solving Cards (Set)", "Sequency Boards", "Memory Books", "Orientation Boards", "Tablet Cognitive Apps"
];

const socialCommunicationList = [
  "Pragmatic Profile Tools", "Autism Communication Screeners", "Social Story Kits", "Emotion Cards (Set)", "Video Modelling Software", "Turn Taking Games", "Board Games", "Role-play Kits", "Group Therapy Chairs/Table"
];

const aacList = [
  "Communication Boards", "Picture Exchange Sets", "Symbols Cards", "Alphabet Boards", "Speech Generating Devices", "Tablets with AAC Apps", "Eye Gaze System"
];

const orofacialMyologyList = [
  "Myofunctional Mirrors", "Lip Resistance Tools", "Tongue Trainers", "Straw Hierarchy Kits", "Chewy Tubes", "Jaw Grading Bite Blocks", "Nasal Breathing Strips"
];

const literacyList = [
  "Reading Passages", "Phonics Cards", "Letter Tiles (Box)", "Writing Boards", "Dyslexia Screening Tools", "Reading Software"
];

const genderAffirmingVoiceList = [
  "Acoustics Analysis Software", "Pitch Tracker Apps", "Resonance Feedback Software", "High Quality Microphones", "Video Modelling Resources", "Counselling Room Setup"
];

const CLINICAL_CATEGORIES = [
  { key: 'diagnostic', title: 'i. Diagnostic Equipment' },
  { key: 'safetyEquipment', title: 'ii. Safety Equipment' },
  { key: 'infectionControl', title: 'iii. Infection Control' },
  { key: 'consumables', title: 'iv. Consumables' },
  { key: 'languageDisorders', title: 'v. Language Disorders Unit' },
  { key: 'fluencyDisorders', title: 'vi. Fluency Disorders Unit' },
  { key: 'voiceResonance', title: 'vii. Voice and Resonance Unit' },
  { key: 'swallowingFeeding', title: 'viii. Swallowing and Feeding Unit' },
  { key: 'cognitiveCommunication', title: 'ix. Cognitive-Communication Unit' },
  { key: 'socialCommunication', title: 'x. Social Communication/Pragmatics Unit' },
  { key: 'aac', title: 'xi. Augmentative and Alternative Communication Unit' },
  { key: 'orofacialMyology', title: 'xii. Orofacial Myology Unit' },
  { key: 'literacy', title: 'xiii. Literacy Unit' },
  { key: 'genderAffirmingVoice', title: 'xiv. Gender-Affirming Voice Unit' }
];

export default function SpeechClinicalAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  // GLOBAL FORM STATE
  const [formData, setFormData] = useState({
    stepOne: {
      therapists: [{ id: 'phy_1', name: '', gender: '', dateAppt: '', designation: '', license: '', specialization: '', qualifications: [{ id: 'q_1', title: '', date: '' }], cpds: [{ id: 'c_1', title: '' }] }],
      supportStaff: [{ id: 'sup_1', name: '', gender: '', rank: '', trainingFileName: '', jobDescription: '', qualifications: [{ id: 'sq_1', title: '', date: '' }] }]
    },
    stepTwo: { spaces: buildItemList(speechClinicalSpacesList) },
    stepThree: {
      diagnostic: buildItemList(diagnosticList),
      safetyEquipment: buildItemList(safetyEquipmentList),
      infectionControl: buildItemList(infectionControlList),
      consumables: buildItemList(consumablesList),
      languageDisorders: buildItemList(languageDisordersList),
      fluencyDisorders: buildItemList(fluencyDisordersList),
      voiceResonance: buildItemList(voiceResonanceList),
      swallowingFeeding: buildItemList(swallowingFeedingList),
      cognitiveCommunication: buildItemList(cognitiveCommunicationList),
      socialCommunication: buildItemList(socialCommunicationList),
      aac: buildItemList(aacList),
      orofacialMyology: buildItemList(orofacialMyologyList),
      literacy: buildItemList(literacyList),
      genderAffirmingVoice: buildItemList(genderAffirmingVoiceList)
    }
  });

  const handleNext = () => { if (currentStep < totalSteps) { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const handlePrev = () => { if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const updateEquipmentCategory = (categoryKey: string, index: number, field: string, value: any) => {
    setFormData(prev => {
      const updatedCategory = [...(prev.stepThree as any)[categoryKey]];
      updatedCategory[index] = { ...updatedCategory[index], [field]: value };
      return {
        ...prev,
        stepThree: { ...prev.stepThree, [categoryKey]: updatedCategory }
      };
    });
  };

  const checkIncompleteFields = () => {
    const allEq = Object.values(formData.stepThree).flat();
    const allItems = [...formData.stepTwo.spaces, ...allEq];
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
      isAvailable: item.isHeader ? 'Header' : (item.isAvailable === '' ? '-' : item.isAvailable),
      availableQuantity: item.isHeader ? 'Header' : ((item.isAvailable === 'Yes' && item.availableQuantity === '') ? '-' : item.availableQuantity)
    }));

    // Frontend Structural Injection right before API payload dispatch
    const allEquipmentRaw = Object.entries(formData.stepThree).flatMap(([key, items]) => {
      const cat = CLINICAL_CATEGORIES.find(c => c.key === key);
      return [
        { isCategoryHeader: true, item: cat ? cat.title : key.toUpperCase() },
        ...(items as any[])
      ];
    });

    const payload = { 
        speechTherapists: formData.stepOne.therapists, 
        supportStaff: formData.stepOne.supportStaff,
        spaces: formatList(formData.stepTwo.spaces), 
        equipment: formatList(allEquipmentRaw),
        assessment_type: "speech_therapy_clinical" 
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
            <p className="text-[10px] text-[#5D9C0E] font-bold mt-0.5 uppercase tracking-wider">Speech Therapy - Clinical</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pt-10 px-4 md:px-0 relative z-10">
        {currentStep === 1 && <StepOne data={formData.stepOne} updateData={(d: any) => setFormData({ ...formData, stepOne: d })} onNext={handleNext} />}
        {currentStep === 2 && <StepTwo data={formData.stepTwo} updateData={(d: any) => setFormData({ ...formData, stepTwo: d })} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 3 && <StepThree data={formData.stepThree} categories={CLINICAL_CATEGORIES} updateCategory={updateEquipmentCategory} onPrev={handlePrev} onSubmit={handleInitialSubmit} isSubmitting={isSubmitting} />}
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