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
// SPEECH THERAPY ACADEMIC DATA LISTS
// ==========================================
const academicSpacesList = [
  "Offices", "Departmental Board Room/ Seminar Room", "Lecture Halls/ Lecture Theatre/ Classrooms and Student Conveniences:", "- Lecture Halls/ Lecture Theatre/ Classrooms", "- Student Conveniences", "Hostel Accommodation with Conveniences", "Basic Medical Laboratories:", "- Gross Anatomy and Embryology", "- Histology", "- Museum", "- Biochemistry", "- Physiology", "Speech Therapy Demonstration Laboratories:", "- Simulation", "Library:", "- College/ Departmental", "- Institutional", "- E- Library", "Transportation", "Alternative Power Source", "Running Water Supply", "Safety Equipment Across Facility"
];

const academicClinicalList = [
  "Hospital Bed Space", "Compliment of Specialist Services:", "- Speech Sound Disorder", "- Language Disorders", "- Fluency Disorders", "- Voice and Resonance", "- Swallowing and Feeding", "- Cognitive-Communication Disorders", "- Social Communication (Pragmatics)", "- Augmentative and Alternative Communication", "- Oro facial Myology", "- Literacy", "- Gender Affirming Voice Training", "Speech Therapy Department:", "- Purpose built", "- Number of Speech Therapy", "Areas Of Specialization In Speech Therapy:", "- Speech Sound Disorder", "- Language Disorders", "- Fluency Disorders", "- Voice and Resonance", "- Swallowing and Feeding", "- Cognitive-Communication Disorders", "- Social Communication (Pragmatics)", "- Augmentative And Alternative Communication", "- Oro-facial Myology", "- Literacy", "- Gender Affirming Voice Training", "Academic Speech Therapy Department:", "- Purpose built", "- Within Hospital Premises", "Clinical Students Hostel:", "- Within Hospital Premises", "Funding Source:", "- clearly stated", "- ambiguous"
];

const anatomyList = ["Embalmed Bodies", "Anatomage", "Equipment Trolleys", "Electric Embalming Machine", "Bone Cutting Equipment - Electric Saw/Drill", "Articulated and Unarticulated Skeletons", "X-Ray Viewing Boxes", "Air-Conditions for the Dissecting Rooms and Air Extractors", "Models", "Slide for Sections", "Slide Projectors", "Toilet Facilities:", "- Male", "- Female", "Changing Room", "Shower Room etc."];
const histologyList = ["Microtome", "Rotary/Sledge Microtome Knives", "Light Microscopes Microtome", "Vacuum Pump Dissecting Microtome", "Cryostat with Microtome", "Teaching Microscope", "Electron Microscope", "Slides"];
const biochemistryList = ["Centrifuge", "Ultracentrifuge", "Electronic Balances", "Heating Block", "Vacuum Pumps", "Spectrophotometer", "PH. Metres", "Thermostatic Water Bath", "Bunner", "Test tube varying size", "Distiller"];
const physiologyList = ["Spirometer", "Vitalograph", "polygraph", "Peak Flow Metre", "Gas Metre", "ECG Machine", "Spectrophotometers", "Physiograph Recorder Transducers", "Oscilloscopes", "Centrifuges", "Blood Gas Callipers", "Audiometer", "Water Baths", "Electronic Weighing Balance Scale", "Flame Photometer", "Microcentrifuge", "Water Distiller", "Bicycle Ergometer", "Stethoscope/ Sphygmomanometre", "Electron Microscope", "Teaching Microscope", "Slides", "Snelle's Chart"];
const diagnosticList = ["Digital Audio Recorder", "Video Recorder /HD Camera", "Laptop with Speech Analysis Software", "Desktop Computer", "High Quality Microphone", "Noise Induced Headset", "Portable Speaker", "Stopwatch/Timer", "Tablet for AAC and Testing Apps", "Printer /Scanner for Test Protocols", "Penlight", "Tongue Depressors (Packs)", "Oral Examination Mirror", "Gloves (Boxes)", "Reflex Hammer", "IOPI Tongue Presssure Device", "Respiratory Pressure Meter", "Decibel Meter/SPL Meter", "DDK Digital Counter", "Acoustic Voice Analysis Software", "Computerised Speech Lab (CSL)", "Microphone Calibration System", "Sound Level Meter", "Electroglottograph(EGG)", "Videostroboscopy", "Laryngeal Endoscopy Tower", "Nasometer", "Nasopharyngoscope", "Aerodynamic Airflow-Pressure System", "Videofloroscopy Support Access", "Tongue Pressure Device", "Food Viscosity Testing Kit", "VFSS/Modified Barium Swallow System", "FEES Recording Software", "Endoscope", "Light Source", "Monitor", "Image Capture System", "Speech Generating Device", "Touch Screen Board", "Symbol Communication Software", "Pediatric Feeding Chair", "Testure Testing Spoons", "Syringes", "Nipple Flow Testing Set", "Bottle Teat Assessment Kit", "Weighing Scale", "Sensory Feeding Tools", "Play Based Assessment Kits", "Cognitive Communication Software", "Language Sample Software", "Standardizedtest Kit Cabinet", "Seminar Projector", "Video Teaching Archive System", "Students Practical Kit"];
const infectionControlList = ["Face Masks (Packs)", "Disposable Gloves (Packs)", "Sputum Containers (Packs)", "Sterilizing Unit", "Autoclave", "Antiseptic Solution (Packs)", "Drying Machine"];
const speechSoundList = ["Standard Articulation Test Kits", "Phonological Process Test Kit", "Oral Peripheral Examination Kits", "Mirror(Wall/Handheld)", "Audio Recorder", "Video Recorder/Camera", "Speech Analysis Software Workstation", "Picture Naming Cards (Sets)", "Minimal Pair Cards (Sets)", "Tongue Depressors (Boxes)", "Flashcards (Sets)", "Tactile Cue Tools", "PROMPT Cueing Kits", "Toys for Speech Elicitation (Sets)"];
const languageDisordersList = ["Aphasia Batteries (WAB/BDAE Type)", "Language Test Batteries ( Adult And Pediatric)", "Bedside Screening Kits", "Literacy/Phonological Awareness Kits", "Reading Comprehension Tools", "Writing Task Boards", "Story Sequencing Cards (Sets)", "Tablets/Laptops for Language Apps", "Naming Therapy Software", "Workbooks", "Category Cards (Sets)", "Sentence Strips (Packs)", "Whiteboards"];
const fluencyDisordersList = ["SSI-Type Fluency Tools", "Stopwatch Timer", "Audio-Video Recorder", "Speech Rate Counter Apps/Devices", "Delayed Auditory Feedback Devices", "Breathing Trainer", "Fluency Shaping Manuals", "Counseling Materials (Sets)"];
const voiceResonanceList = ["Laryngeal Mirror Sets", "Acoustic Voice Analysis Software", "Microphones (High Quality)", "SPL Meter", "Nasometer", "Pitch Analyser", "Voice Range Profile Software", "FEES System Access", "Flexible Laryngoscope Access", "Stroboscopy Access", "Resonance Tubes/Straw Phonation Kits", "Breathing Trainer", "Biofeedback Monitor"];
const swallowingFeedingList = ["Dysphagia Bedside Kits", "Purse Oximeters", "Cervical Auscultation Stethoscope", "Food Texture Kits", "Thickener Stock (Tins)", "Syringes/Spoons/Cups", "Oral Motor Exam Kits", "FEES Access", "VFSS Devices", "EMST Devices", "NMES Swallowing Devices", "Adaptive Bottles", "Specialty Nipples", "High Chairs", "Feeding Spoons"];
const cognitiveCommunicationList = ["Cognitive-Linguistic Batteries", "Memory Screening Tools", "Executive Function Task Kits", "Attention Testing Software", "Problem Solving Cards (Sets)", "Sequency Boards", "Memory Books", "Orientation Boards", "Tablet Cognitive Apps"];
const socialCommunicationList = ["Pragmatic Profile Tools", "Autism Communication Screeners", "Social Story Kits", "Emotion Cards (Sets)", "Video Modelling Software", "Turn Taking Games", "Board Games", "Role-Play Kits", "Group Therapy Chairs/Table (Set)"];
const aacList = ["Communication Boards", "Picture Exchange Sets", "Symbols Cards", "Alphabet Boards", "Speech Generating Devices", "Tablets with AAC Apps", "Eye Gaze System"];
const orofacialMyologyList = ["Myofunctional Mirrors", "Lip Resistance Tools", "Tongue Trainers", "Straw Hierachy Kits", "Chewy Tubes", "Jaw Grading Bite Blocks", "Nasal Breathing Strips"];
const literacyList = ["Reading Passages", "Phonics Cards", "Letter Tiles (Boxes)", "Writing Boards", "Dyslexia Screening Tools", "Reading Software"];
const genderAffirmingVoiceList = ["Acoustics Analysis Software", "Pitch Tracker Apps", "Resonance Feedback Software", "High Quality Microphones", "Video Modelling Resources", "Counselling Room Setup"];
const safetyMeasuresList = ["Alarm", "Fire Extinguisher", "Blanket", "Intercom", "Fire Assembly Point", "Sand Bucket", "Clearly marked direction to muster point"];

const ACADEMIC_CATEGORIES = [
  { key: 'anatomy', title: 'i. Anatomy and Embryology' },
  { key: 'histology', title: 'ii. Histology' },
  { key: 'biochemistry', title: 'iii. Biochemistry' },
  { key: 'physiology', title: 'iv. Physiology' },
  { key: 'diagnostic', title: 'v. Diagnostic Equipment' },
  { key: 'infectionControl', title: 'vi. Infection Control' },
  { key: 'speechSound', title: 'vii. Speech Sound Disorders Unit' },
  { key: 'languageDisorders', title: 'viii. Language Disorders Unit' },
  { key: 'fluencyDisorders', title: 'ix. Fluency Disorders Unit' },
  { key: 'voiceResonance', title: 'x. Voice and Resonance Unit' },
  { key: 'swallowingFeeding', title: 'xi. Swallowing and Feeding Unit' },
  { key: 'cognitiveCommunication', title: 'xii. Cognitive-Communication Unit' },
  { key: 'socialCommunication', title: 'xiii. Social Communication/Pragmatics Unit' },
  { key: 'aac', title: 'xiv. Augmentative and Alternative Communication Unit' },
  { key: 'orofacialMyology', title: 'xv. Orofacial Myology Unit' },
  { key: 'literacy', title: 'xvi. Literacy Unit' },
  { key: 'genderAffirmingVoice', title: 'xvii. Gender-Affirming Voice Unit' },
  { key: 'safetyMeasures', title: 'xviii. Safety Measures' }
];

export default function SpeechAcademicAssessment() {
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
      speechSound: buildItemList(speechSoundList),
      languageDisorders: buildItemList(languageDisordersList),
      fluencyDisorders: buildItemList(fluencyDisordersList),
      voiceResonance: buildItemList(voiceResonanceList),
      swallowingFeeding: buildItemList(swallowingFeedingList),
      cognitiveCommunication: buildItemList(cognitiveCommunicationList),
      socialCommunication: buildItemList(socialCommunicationList),
      aac: buildItemList(aacList),
      orofacialMyology: buildItemList(orofacialMyologyList),
      literacy: buildItemList(literacyList),
      genderAffirmingVoice: buildItemList(genderAffirmingVoiceList),
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
      isAvailable: item.isHeader ? 'Header' : (item.isAvailable === '' ? '-' : item.isAvailable),
      availableQuantity: item.isHeader ? 'Header' : ((item.isAvailable === 'Yes' && item.availableQuantity === '') ? '-' : item.availableQuantity)
    }));

    // Inject unique category heading segments right before payload dispatch
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
        assessment_type: "speech_therapy_academic" 
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
            <p className="text-[10px] text-[#5D9C0E] font-bold mt-0.5 uppercase tracking-wider">Speech Therapy - Academic</p>
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