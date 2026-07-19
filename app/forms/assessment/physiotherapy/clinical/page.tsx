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
// CLINICAL DATA LISTS 
// ==========================================
const clinicalSpacesList = [
  "Offices", "Treatment Cubicles", "Adult Gymnasium", "Paediatric Gymnasium", "Changing Rooms", 
  "Patients Waiting Area", "Hospital Wards/ Treatment Side Ward", "Health Record Office", 
  "Consulting Rooms", "Seminar Room", "Departmental Library", "Hospital Library", 
  "Staff Toilets", "Patients' Toilet", "Departmental Store"
];

const adultGymList = [
  "Treadmill", "Traction units Cervical/Lumbar", "Partial Body weight support system", "Reciprocal Pulley", "Tilt Bed/Supine Standers", "Hand Exerciser", 
  "Foam Wedges:", "- Triangular (High)", "- Triangular (Low)", "- Split Wedge",
  "Foam Rolls:", "- Big Cylindrical", "- Half Cylindrical",
  "Bicycle Ergometer (arm/legs)", "Parallel Bar", "Wall Bar", "Finger Ladder", "Shoulder Ladder", "Shoulder Wheel", "Wooden Staircase (firm/shake able)", "Multi Gym", "Exercise Mats", "Exercise Plinths", "Steppers", "Recumbent Bicycle", "Medicine/Exercise Balls", 
  "Dumbbells:", "- 1kg", "- 2kg", "- 3kg", "- 4kg", "- 5kg", 
  "TheraBands:", "- Yellow", "- Green", "- Blue", "- Red", 
  "Sand Bags:", "- 1kg", "- 2kg", "- 3kg", "- 4kg", "- 5kg", 
  "Giant Standing Mirrors", "Quadriceps Drill/Bench", "Wobble Boards", "Precision Box", "Wheel Chairs", "Crutches (Elbow and Auxillary)", "Walking Frames", "Walking Sticks, Quadrupod & Tripod"
];

const electrotherapyList = [
  "Standing Infra-red Lamp (Luminous)", "Electrical Muscle Stimulator", "Therapeutic Ultrasound Machine", "Transcutaneous Electrical Nerve Stimulator (TENS)", "Shortwave Diathermy", "Paraffin Wax Bath", "Laser Therapy Machine", "Portable Ultrasonic Therapy", "Ice making Machine", "Interferential Current Machine", "Ultraviolet Radiation Machine", "Micro wave therapy Machine", "Infra-red Lamp (non - Luminous)", "Hydrocollator Machine", "Pneumatic Machine"
];

const diagnosticList = [
  "Sphygmomanometer", "Stethoscope", "Goniometers", "Spirometers", "Peak Flow Meters", "Hand Grip Dynamometer", "Pain Rating Scale", "One Stop Watch", "Weighing Scale", "Stadiometer", "X-ray Viewing Box", "Pedometer", "Skin Fold Calipers", "Heart Rate Monitor", "Measuring Tape", "Sensory processing Test Equipment", "Cognitive Test Equipment", "Pulse Oximeter", "Body Mass Index Calculator", "Periniometer", "Reflex Hammer", 
  "Tongue Depressor (Pack)", "Tuning Fork (128Hz)", "Two Test Tubes", "Familiar Objects (e.g. paper clip, coin, marble)", "Thermometer", "Cotton Ball or Cotton tipped Swab (Pack)", "Pen light", "Cognitive Test Equipment (Parkinsons & Dementia)", "Flashlight", "Diagnostic Spirometer"
];

const safetyEquipmentList = [
  "Alarm", "Fire Extinguishers", "Blankets", "Intercom", "Fire Assembly Points", "Sand Buckets", "Clearly marked direction to Muster Points"
];

const infectionControlList = [
  "Face Masks (Pack)", "Disposable Gloves (Pack)", "Sputum Containers (Pack)", "Sterilizing Unit", "Autoclave", "Antiseptic Solution (Pack)", "Washing Machine", "Drying Machine"
];

const consumablesList = [
  "Towels", "Mackintosh", "Bedsheets", "Splinting Kit (static & Dynamic)", "Casting Kit – dynacast, POP, Soft bandage", "Topical Analgesic / ointments- cold and hot", "Creepe Bandage and gauze", "Contact medium - powder, lanolin oil"
];

const paediatricGymList = [
  "Gait Trainers", "Precision Boxes", "Precision Toys", "Giant Mirrors", "Prone Standers", "Standing Frames", "Treatment Plinths", "Therapy Balls/Medicine Balls", "Posterior Walkers", 
  "Foam Wedges:", "- Triangular (High)", "- Triangular (Low)", "- Split Wedge", 
  "Foam Rolls:", "- Small Cylindrical", "- Big Cylindrical", "- Half Cylindrical", 
  "Frenkel Mats", "Paediatric Treadmill", 
  "Resistance Bands:", "- Red", "- Blue", "- Green", "- Yellow", 
  "Paediatric Crutches", "Paediatric Tilt Bed", "Supportive Garment", "Stabilization Belts", "Everyday Objects for ADL", "Exercise Mats", "Adapted eating and drinking products", "Stools/small benches of varying heights", "Resistive Exercise Putty", "Television Set", "Partial Body Weight Support system with Harness", "Paediatric (dexterity training) cones"
];

const neurologyList = [
  "Gait Belts", 
  "Foam Wedges:", "- Triangular (High)", "- Triangular (Low)", "- Split Wedge", 
  "Foam Rolls:", "- Big Cylindrical", "- Half Cylindrical", 
  "3 by 4 feet wheeled Walker", "Precision Box", "Frenkel Mats", "Hand Exerciser", "Neuro Com Balance Master", "Transfer Boards", "Slide Sheets", "Pillows", "Arm Activity Kit", "Upper limb Work Station", "Upper limb Support", "Small Benches of varying heights", "Rollators", "Balance Board/Cushion", "Resistive Exercise Putty (dough)", "Exercise Therapy Plinths", "Stools"
];

const orthopaedicList = [
  "Lumbar Traction Bed", "Precision Boards", "Gait Belts", "Hand Exerciser", "Cervical Traction Kit", "Orthoses Kit", "Upper limb Work Station", "Stabilization/Mobilization Belts", "Hot & cold Packs", 
  "Foam Wedges:", "- Triangular (High)", "- Triangular (Low)", "- Split Wedge", 
  "Foam Rolls:", "- Small Cylindrical", "- Big Cylindrical", "- Half Cylindrical"
];

const pelvicHealthList = [
  "Vaginal Cones (diff. sizes)", "Screen", "Portable TENS", "Vaginal & Anal Sensors", "Vaginal Weights",
  "Irrigation therapy devices:", "- Peristeen irrigation system", "- Aquaflush compact system", "- Qufora irrigation", "- Navina irrigation system",
  "Pessaries- (trained therapist for fitting)",
  "Intravaginal devices for stress urinary incontinence:", "- Contiform", "- Contrelke", "- Efemia", "- Revive",
  "Ice fingers for cryotherapy (glove form)",
  "Foam Wedges:", "- Triangular (High)", "- Triangular (Low)", "- Split Wedge",
  "Foam Rolls:", "- Small Cylindrical", "- Big Cylindrical", "- Half Cylindrical",
  "Vibrators", "Pelvic band", "Kegel balls", "Dilators (individualized)", "Biofeedback Machine"
];

const cardiopulmonaryList = [
  "Suction Machine", "High frequency chest wall Oscillation Device (HFCWO)", "High frequency Chest Compression Machine", "Nimbus Series Bed", "Positive Expiratory Pressure (PEP) Mask with Manometer", "Positive Expiratory Pressure Therapy (PEP)", "Electro Flo 5000 Airway Clearance Device", "Compressor Nebulizer", "Lumbar Vibratory Massage Pillow", "Mobile frame Gait Walker", "Electronic Nebulizer", "Pulse Oximeter", "Ambu Bag", "Noninvasive Ventilators", "In sufflator Machine", "Ex sufflator Machine", "Elliptic Ergometer", "Treadmill with ECG", "Accapella Device", "Flutter Device", "Postural Drainage Bed", "Trampoline", "Automated External Defibrillator (AED)", "Oxygen Tank", "Probes (Nasal probes)", "Venturi Face Masks", "MobiGO ICU patient Ambulation and Mobility", "MOVAO for ICU Mobilization", "Hover Matt Air Transfer Mattress", "Ceiling Lift System", "Sara Combillizer- ARJO (ICU sit - stand aid)", "Continuous Passive Movement Machine", "Ambulatory Continuous Positive Air Pressure (CPAP) device"
];

const geriatricList = [
  "Electrical Muscle Stimulators", "Exercise Mats", "Cervical Traction Kit", "Lumbar Traction Kit", "Therapeutic Ultrasound Machine",
  "Sand Bags:", "- 3kg", "- 2kg", "- 1kg",
  "Transcutaneous Electrical Nerve Stimulator", "Plinths", "Bicycle Ergometer", "Shortwave Diathermy", "Wall Bars", "Finger Ladder", "Shoulder Wheel", "Standing Mirror", "Hand Function Board", "Hand Balls, Hand Exercises", "Wooden Stair Case", "Gait Belts", "Steppers", "Parallel Bars", "Standing Infrared Machine"
];

const palliativeCareList = [
  "TENS", "Hot and Cold Packs",
  "Foam Wedges:", "- Triangular (High)", "- Triangular (Low)", "- Split Wedge",
  "Foam Rolls:", "- Small Cylindrical", "- Large Cylindrical", "- Half Cylindrical",
  "Utensils for activities of daily living", "Balance Board/cushion", "Resistance Bands", "Weights", "Exercise Ball", "Assistive products for dressing", "Assistive products for toileting", "Adapted eating and drinking products", "Equipment for sport and recreational activities", "Steppers"
];

const communityList = [
  "Partial Body Weight Support System with Harness",
  "Sand Bags:", "- 3kg", "- 2kg", "- 1kg",
  "Dumb Bells:", "- 3kg", "- 2kg", "- 1kg",
  "Resistance Bands:", "- Red", "- Blue", "- Green", "- Yellow",
  "Resistive Exercise Putty (Dough)", "Casting Kit", "Splinting Kit", "Orthoses kit",
  "Foam Wedges:", "- Triangular (High)", "- Triangular (Low)", "- Split Wedge",
  "Foam Rolls:", "- Small Cylindrical", "- Large Cylindrical", "- Half Cylindrical",
  "Mobile Mirrors", "Assistant Support Belt", "Ramps", "Parallel Bars", "Stackable Steps", "Training Stairs", "Cycle Ergometer with and without arm", "Upper limb Work Station", "Arm activity Kit (CIMT, Bimanual activities)", "Utensils for activity of daily living", "Therapeutic Toys", "Walking Aids- crutches, walking sticks, frames rollators", "Wheelchairs"
];

const mentalHealthList = [
  "Balance Board/Cushion", "Cycle Ergometer (arm or leg)",
  "Resistance Bands:", "- Red", "- Blue", "- Green", "- Yellow",
  "Utensils for activities of daily living", "Video Recording Devices",
  "Weights:", "- 3kg", "- 2kg", "- 1kg", "Giant Mirror"
];

const ergonomicsList = [
  "Portable Ultrasonic Therapy Machine", "TENS/EMS", "Standing Infra-Red Lamps", "Freezer (small size) for Ice making", "Parallel Bar", "Walking Aids (crutches)", "Exercise Mats",
  "Weights/Sand Bags:", "- 3kg", "- 2kg", "- 1kg",
  "Cervical Traction Machine", "Wooden Staircase", "Hand Exercisers", "Wobble Boards", "Wall Bar", "Pulse Oximeter", "Stethoscope", "Sphygmomanometer", "Shoulder Wheel", "Bandages", "Gait Belts"
];

const hydrotherapyList = [
  "Standard Hydrotherapy Pool", "Aquatic Treadmill", "Aquatic Ergometer", "Life jackets", "Antiseptic solutions (Eusol, Savlon etc.)"
];


// --- MAP THE KEYS FOR DYNAMIC RENDERER ---
const CLINICAL_CATEGORIES = [
  { key: 'adultGym', title: 'i. Adult Gymnasium' },
  { key: 'electrotherapy', title: 'ii. Electrotherapy Equipment' },
  { key: 'diagnostic', title: 'iii. Diagnostic Equipment' },
  { key: 'safetyEquipment', title: 'iv. Safety equipment' },
  { key: 'infectionControl', title: 'v. Infection Control Tools / Equipment Tools' },
  { key: 'consumables', title: 'vi. Consumables' },
  { key: 'paediatricGym', title: 'vii. Paediatric Gymnasium' },
  { key: 'neurology', title: 'viii. Neurology Specialty' },
  { key: 'orthopaedic', title: 'ix. Orthopaedic and Musculoskeletal Specialty' },
  { key: 'pelvicHealth', title: 'x. Pelvic and Women\'s Health Specialty' },
  { key: 'cardiopulmonary', title: 'xi. Cardiopulmonary Specialty' },
  { key: 'geriatric', title: 'xii. Geriatric Specialty' },
  { key: 'palliativeCare', title: 'xiii. Palliative Care Specialty' },
  { key: 'community', title: 'xiv. Community Physiotherapy' },
  { key: 'mentalHealth', title: 'xv. Mental Health Specialty' },
  { key: 'ergonomics', title: 'xvi. Ergonomics and occupational Health' },
  { key: 'hydrotherapy', title: 'xvii. Hydrotherapy Equipment' }
];

export default function PhysioClinicalAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  // GLOBAL FORM STATE
  const [formData, setFormData] = useState({
    stepOne: {
      physios: [{ id: 'phy_1', name: '', gender: '', dateAppt: '', designation: '', license: '', specialization: '', qualifications: [{ id: 'q_1', title: '', date: '' }], cpds: [{ id: 'c_1', title: '' }] }],
      supportStaff: [{ id: 'sup_1', name: '', gender: '', rank: '', trainingFileName: '', jobDescription: '', qualifications: [{ id: 'sq_1', title: '', date: '' }] }]
    },
    stepTwo: { spaces: buildItemList(clinicalSpacesList) },
    stepThree: {
      adultGym: buildItemList(adultGymList),
      electrotherapy: buildItemList(electrotherapyList),
      diagnostic: buildItemList(diagnosticList),
      safetyEquipment: buildItemList(safetyEquipmentList),
      infectionControl: buildItemList(infectionControlList),
      consumables: buildItemList(consumablesList),
      paediatricGym: buildItemList(paediatricGymList),
      neurology: buildItemList(neurologyList),
      orthopaedic: buildItemList(orthopaedicList),
      pelvicHealth: buildItemList(pelvicHealthList),
      cardiopulmonary: buildItemList(cardiopulmonaryList),
      geriatric: buildItemList(geriatricList),
      palliativeCare: buildItemList(palliativeCareList),
      community: buildItemList(communityList),
      mentalHealth: buildItemList(mentalHealthList),
      ergonomics: buildItemList(ergonomicsList),
      hydrotherapy: buildItemList(hydrotherapyList)
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

  // --- VALIDATION ENGINE ---
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
    
    // SMART FORMATTER: Replaces blank/skipped inputs with "-"
    const formatList = (list: any[]) => list.map(item => ({
      ...item,
      isAvailable: item.isCategoryHeader ? 'Category' : (item.isHeader ? 'Header' : (item.isAvailable === '' ? '-' : item.isAvailable)),
      availableQuantity: item.isCategoryHeader ? 'Category' : (item.isHeader ? 'Header' : ((item.isAvailable === 'Yes' && item.availableQuantity === '') ? '-' : item.availableQuantity))
    }));

    // Inject Category Headers before sending to backend!
    const allEquipmentRaw = Object.entries(formData.stepThree).flatMap(([key, items]) => {
      const cat = CLINICAL_CATEGORIES.find(c => c.key === key);
      return [
        { isCategoryHeader: true, item: cat ? cat.title : key.toUpperCase() },
        ...(items as any[])
      ];
    });

    const payload = { 
        physiotherapists: formData.stepOne.physios, 
        supportStaff: formData.stepOne.supportStaff,
        spaces: formatList(formData.stepTwo.spaces), 
        equipment: formatList(allEquipmentRaw),
        assessment_type: "physiotherapy_clinical" 
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
            <p className="text-[10px] text-[#5D9C0E] font-bold mt-0.5 uppercase tracking-wider">Physiotherapy - Clinical</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pt-10 px-4 md:px-0 relative z-10">
        {currentStep === 1 && <StepOne data={formData.stepOne} updateData={(d: any) => setFormData({ ...formData, stepOne: d })} onNext={handleNext} />}
        {currentStep === 2 && <StepTwo data={formData.stepTwo} updateData={(d: any) => setFormData({ ...formData, stepTwo: d })} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 3 && <StepThree data={formData.stepThree} categories={CLINICAL_CATEGORIES} updateCategory={updateEquipmentCategory} onPrev={handlePrev} onSubmit={handleInitialSubmit} isSubmitting={isSubmitting} />}
      </main>

      {/* SMARTER WARNING MODAL */}
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

      {/* SUCCESS MODAL */}
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