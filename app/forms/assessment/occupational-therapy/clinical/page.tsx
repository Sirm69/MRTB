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
// OCCUPATIONAL THERAPY CLINICAL DATA LISTS
// ==========================================
const clinicalSpacesList = [
  "Offices", "Assessment/Treatment Cubicles", "ADL Room (Adult)", "ADL Room/Kitchen Unit (Paediatric)", 
  "Sensory/Perceptual Room", "Fabrication/Splinting Workshop", "Changing Rooms", "Patients Waiting Area", 
  "Hospital Wards/Treatment Side Ward", "Health Record Office", "Consulting Rooms", 
  "Seminar Room", "Departmental Library", "Hospital Library", "Staff Toilets", 
  "Patients' Toilet", "Departmental Store"
];

const positioningList = ["Relaxation Chair", "Floor Sitter", "Stand-in Frame", "Stand-in Table", "Transfer Equipment", "Wedges (triangular, high and low, split)", "Pillows", "Foam Rolls (cylindrical, half-cylindrical)", "Convalescent Recliners"];
const evaluationList = ["Steadiness Tester (Hole Type)", "Pencil Maze Test Board", "Tremor Quantifier", "Hand Dynamometer", "Strength Evaluation System", "Goniometer", "Finger Dexterity Test Board", "Key Hole Test Board", "Counting and Colour Sorting Beads Set", "Tape Measure", "Sensory Pins, Tuning Fork, Reflex Hammer", "Sphygmomanometer", "Peak Flow Meters", "Stop Watch/Alarm Clock/Metronome", "Pain Rating Scale", "Weighing Scale", "Cognitive Assessment Tools (e.g. MoCA, MMSE)", "Sensory Processing Assessment Equipment", "Skin Fold Calipers", "Pen Light"];
const generalTreatmentList = ["Treatment Tables/Plinths", "Tilt Tables", "Standing Frames", "Mat Platforms", "Parallel Bars/Stairs", "Stools, Carts, Screens and Mirrors", "Work Hardening Equipment", "Trays and Accessories", "Ramps", "Wheel Chairs", "Wax Warmer (Paraffin Bath)", "Cryotherapy Machine", "TheraBand/Resistance Bands (various grades)", "Exercise Mats", "Walkers and Mobility Aids", "Giant Standing Mirrors"];
const safetyEquipmentList = ["Alarm", "Fire Extinguishers", "Blankets", "Intercom", "Fire Assembly Points", "Sand Buckets", "Clearly Marked Direction to Muster Points", "First Aid Box"];
const infectionControlList = ["Face Masks", "Disposable Gloves", "Hand Sanitizers", "Antiseptic Solutions (Eusol, Savlon, Hibitane)", "Sterilizing Unit", "Autoclave", "Washing Machine", "Drying Machine"];
const consumablesList = ["Towels", "Mackintosh", "Bedsheets", "Thermoplastic Splinting Material (45×61 sheets)", "Velcro, Cotton Tape, Rivets, D-rings (splinting)", "Lint, Felt, Foam Padding", "Crepe Bandage and Gauze", "Topical Agents (analgesic, emollient creams)"];
const paediatricList = ["Paediatric Treatment Tables", "Vestibular Swing System", "Trampoline (Paediatric)", "Pacer Gait Trainer", "Standers and Corner Seats", "Paediatric Treadmill", "Therapy Ball Pool", "Pea Ball and Bolster", "Prone Liner", "Handy Vibrator", "Exercise Wall Mirror", "Therapy Mats (Paediatric)", "Precision/Dexterity Training Cones", "Adapted Eating and Drinking Aids", "Everyday Objects for ADL Practice", "Television Set (for visual feedback)", "Partial Body Weight Support System with Harness", "Resistance Bands (Paediatric)", "Building Blocks Set", "Puzzles (various levels)"];
const neurologyList = ["Reacher", "Dressing Aids", "Home Accessories and Helpers", "Mobility Aids and Leisure Activity Items", "Scissors, Book Holder and Writing Aids", "Door Latch Frame Set", "Kitchen Frame Set/Simulated Kitchen Equipment", "Dressing Frame Set", "Eating Aids with Utensil Sets", "ADL Kit Sets", "ADL Board", "Transfer Boards", "Slide Sheets", "Upper Limb Work Station", "Arm Activity Kit (CIMT, Bimanual)", "Upper Limb Support", "Resistive Exercise Putty (dough)", "Rollators", "Balance Board/Cushion"];
const orthopaedicList = ["Splinting Kit (static and dynamic)", "Thermoplastic Splinting Materials", "Gait Belts", "Hand Exerciser", "Orthoses Kit (upper and lower limb)", "Upper Limb Work Station", "Stabilization/Mobilization Belts", "Hot and Cold Packs", "Foam Wedges (triangular, high and low, split)", "Wrist/Elbow/Shoulder Supports and Slings", "Sanding Unit (reciprocal, semi-circular, vertical, overhead)", "Flexion/Extension/Pronation/Supination Apparatus", "Multi-Purpose Wheel", "Range of Motion Arc", "Cervical/Thoracic/Pelvic Braces"];
const mentalHealthList = ["Sewing Machine", "Metal Work Equipment", "Wood Work Equipment", "Art and Craft Supplies (paints, clay, canvas)", "Music Therapy Equipment (instruments, speaker)", "Leisure and Recreational Activity Items", "Cognitive Remediation Therapy Materials", "Social Skills Activity Cards and Boards", "Video Recording Devices", "Relaxation Chair", "Target Game", "Balance Board/Cushion", "Resistance Bands (various grades)", "Utensils for Activities of Daily Living"];
const geriatricList = ["Adapted Eating and Drinking Aids", "Assistive Products for Dressing", "Assistive Products for Grooming/Hygiene", "Assistive Products for Toileting/Bathing", "Reacher and Grab Aids", "Ergonomic Chair/Adjustable Furniture", "Standing Frames", "Balance Board/Cushion", "Gait Belts", "Wheel Chairs", "Cognitive Assessment Materials", "Dementia Activity Kits (reminiscence boxes, puzzles)", "Hot and Cold Packs", "Compression Products/Stockings", "Bed Positioning and Safety Products"];
const communityList = ["Portable ADL Kit", "Portable Assessment Tools (goniometer, dynamometer)", "Assistive Devices (canes, crutches, frames, rollators)", "Wheelchair (manual)", "Ramps (portable)", "Splinting Kit (portable)", "Resistance Bands (various grades)", "Home Modification Assessment Checklist", "Therapeutic Toys", "Vocational Activity Materials", "Community Re-integration Activity Kits"];
const assistiveTechList = ["Thermoplastic Splinting Materials (45×61 sheets)", "Orfit Cutter, Heat Gun, Heat Pan", "Cotton Tape, Velcro, Rivets, D-rings, Canvas", "Shoulder Supports and Slings", "Elbow Supports", "Wrist Supports, Cock-up Splints, Resting Splints", "Cervical Collars", "Clavicular/Thoracic/Pelvis Braces", "Ankle, Foot and Heel Supports", "Knee Supports", "Back Supports", "Scar Management and Gel Products", "Ergonomic Products (adjusters for chairs, tables, toilets)", "Compression Products and Stockings", "Edema Management Products", "Taping Materials", "Communication/AAC Devices (augmentative)"];
const vocationalList = ["Work Simulation Equipment (filing, sorting, packing tools)", "Sewing Machine", "Metal Work Equipment", "Wood Work Equipment", "Computer with Assistive Software (screen readers, voice control)", "Ergonomic Workstation Setup Equipment", "Functional Capacity Evaluation (FCE) Tools", "Sand and Water Table", "Strength Training Equipment (sand bags, weights)"];
const palliativeCareList = ["Adapted Eating and Drinking Aids", "Assistive Products for Dressing", "Assistive Products for Toileting", "Reacher and Grab Aids", "Hot and Cold Packs", "Foam Wedges and Rolls", "Balance Board/Cushion", "Resistance Bands (light grade)", "Leisure and Recreational Activity Items", "Relaxation and Mindfulness Aids", "Compression Products and Stockings", "Positioning Products (pillows, bolsters)"];
const sensoryPerceptualList = ["Tactile and Visual Stimulators (feathers, peg boards)", "Target Game", "Basic Balance Beam", "Balances, Dartboard and Ball Pool", "Puzzles (various levels)", "Multi-Activity Work Station", "Mushroom Boards", "Pinch Tree Board", "Size Perception Square Board Set", "Television Set", "Foot Placement Ladder", "Equilibrium Board", "Building Blocks Set", "Visual Cues and Illustration Materials Set", "Play Dough", "Cone Board"];
const adlKitchenList = ["Equipment for Bathing", "Equipment for Toileting", "Equipment for Grooming", "Bed (Simulated)", "Plates and Bowls", "Cups and Drinking Aids", "Self-Feeders and Arm Supports", "Overbed Tables", "Dycem Products (Non-slip surfaces)", "Dining Accessories", "Plate Rack", "Oven", "Oven Mitts", "Gas Cooker", "Mixer", "Span Board (Cutting Surfaces)", "Blender"];

const CLINICAL_CATEGORIES = [
  { key: 'positioning', title: 'i. Positioning Equipment' },
  { key: 'evaluation', title: 'ii. Assessment/Evaluation Equipment' },
  { key: 'generalTreatment', title: 'iii. General Treatment Equipment' },
  { key: 'safetyEquipment', title: 'iv. Safety Equipment' },
  { key: 'infectionControl', title: 'v. Infection Control Equipment' },
  { key: 'consumables', title: 'vi. Consumables' },
  { key: 'paediatric', title: 'vii. Paediatric Occupational Therapy' },
  { key: 'neurology', title: 'viii. Neurology/Neurosurgery Occupational Therapy' },
  { key: 'orthopaedic', title: 'ix. Orthopaedic/Rheumatology Occupational Therapy' },
  { key: 'mentalHealth', title: 'x. Mental Health Occupational Therapy' },
  { key: 'geriatric', title: 'xi. Geriatric Occupational Therapy' },
  { key: 'community', title: 'xii. Community Rehabilitation Occupational Therapy' },
  { key: 'assistiveTech', title: 'xiii. Assistive Technology/Splinting Occupational Therapy' },
  { key: 'vocational', title: 'xiv. Vocational Rehabilitation Occupational Therapy' },
  { key: 'palliativeCare', title: 'xv. Palliative Care Occupational Therapy' },
  { key: 'sensoryPerceptual', title: 'xvi. Sensory/Perceptual Equipment (Cross-specialty Universal)' },
  { key: 'adlKitchen', title: 'xvii. ADL Room / Kitchen Simulation Equipment' }
];

export default function OccupationalClinicalAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const [formData, setFormData] = useState({
    stepOne: {
      therapists: [{ id: 'phy_1', name: '', gender: '', dateAppt: '', designation: '', license: '', specialization: '', qualifications: [{ id: 'q_1', title: '', date: '' }], cpds: [{ id: 'c_1', title: '' }] }],
      supportStaff: [{ id: 'sup_1', name: '', gender: '', rank: '', trainingFileName: '', jobDescription: '', qualifications: [{ id: 'sq_1', title: '', date: '' }] }]
    },
    stepTwo: { spaces: buildItemList(clinicalSpacesList) },
    stepThree: {
      positioning: buildItemList(positioningList),
      evaluation: buildItemList(evaluationList),
      generalTreatment: buildItemList(generalTreatmentList),
      safetyEquipment: buildItemList(safetyEquipmentList),
      infectionControl: buildItemList(infectionControlList),
      consumables: buildItemList(consumablesList),
      paediatric: buildItemList(paediatricList),
      neurology: buildItemList(neurologyList),
      orthopaedic: buildItemList(orthopaedicList),
      mentalHealth: buildItemList(mentalHealthList),
      geriatric: buildItemList(geriatricList),
      community: buildItemList(communityList),
      assistiveTech: buildItemList(assistiveTechList),
      vocational: buildItemList(vocationalList),
      palliativeCare: buildItemList(palliativeCareList),
      sensoryPerceptual: buildItemList(sensoryPerceptualList),
      adlKitchen: buildItemList(adlKitchenList)
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
        occupationalTherapists: formData.stepOne.therapists, 
        supportStaff: formData.stepOne.supportStaff,
        spaces: formatList(formData.stepTwo.spaces), 
        equipment: formatList(allEquipmentRaw),
        assessment_type: "occupational_therapy_clinical" 
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
            <p className="text-[10px] text-[#5D9C0E] font-bold mt-0.5 uppercase tracking-wider">Occupational Therapy - Clinical</p>
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