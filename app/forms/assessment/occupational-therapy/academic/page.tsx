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
// OCCUPATIONAL THERAPY ACADEMIC DATA LISTS
// ==========================================
const academicSpacesList = [
  "Offices", "Departmental Board Room / Seminar Room", 
  "Lecture Halls / Lecture Theatres / Classrooms and Student Conveniences:", 
  "- Lecture Halls / Lecture Theatres / Classrooms", "- Student Conveniences", 
  "Hostel Accommodation with Conveniences", 
  "Basic Medical Laboratories:", 
  "- Gross Anatomy and Embryology", "- Histology Museum", "- Biochemistry", "- Physiology", 
  "Occupational Therapy demonstration laboratories:", 
  "- Activities of Daily Living (ADL) Lab", "- Kitchen Simulation Room", "- Personal Hygiene Simulation Room", "- Multisensory/Sensory Integration Room", "- Vocational Rehabilitation Lab", "- Paediatric OT Lab", "- Exercise/Therapy Room", "- Splint Fabrication Workshop", "- Simulation Lab",
  "Library:", 
  "- College/Departmental", "- Institutional", "- E-Library", 
  "Transportation", "Alternative Power Source (Solar, Generator)", "Running Water Supply", "Safety Equipment across Facility"
];

const academicClinicalList = [
  "Hospital Bed Space", 
  "Complement of Specialist Services:", 
  "- Paediatrics", "- Obstetrics and Gynaecology", "- Neurology", "- Cardiology", "- Endocrinology", "- General Surgery", "- Orthopaedics", "- ICU/Anaesthesia", "- Trauma", "- Oncology", "- Mental Health",
  "Occupational Therapy Department:", 
  "- Purpose Built", "- Number of Occupational Therapists", 
  "Areas of Specialization in Occupational Therapy:", 
  "- Paediatrics", "- Neurology", "- Physical Dysfunction (Musculoskeletal/Hand Therapy)", "- Mental Health", "- Geriatrics", "- Community-based OT", "- Vocational Rehabilitation", "- Sensory Integration", "- Assistive Technology and Orthotics", "- ADL Training",
  "Academic Occupational Therapy Department:", 
  "- Purpose Built", "- Within Hospital Premises", 
  "Clinical Students Hostel:", 
  "- Within Hospital Premises", "- Well Furnished/Poorly Furnished", "- Water Supply", "- Convenience", "- Gender Sensitivity", "- Disability Friendly",
  "Funding Source Clearly Stated"
];

// EQUIPMENT LISTS (22 Categories)
const anatomyList = ["Embalmed Bodies", "Anatomage Table", "Equipment Trolleys", "Electric Embalming Machine", "Bone Cutting Equipment - Electric Saw/Drill", "Articulated and Unarticulated Skeletons", "X-ray Viewing Boxes", "Air-conditioners for the Dissecting Rooms and Air Extractors", "Models", "Slide for Sections", "Slide Projectors", "Toilet Facilities:", "- Male", "- Female", "Changing Room", "Shower Room"];
const histologyList = ["Microtome", "Rotary/Sledge Microtome Knives", "Light Microscopes", "Vacuum Pump Dissecting Microtome", "Cryostat with Microtome", "Teaching Microscope", "Electron Microscope", "Slides"];
const biochemistryList = ["Centrifuge", "Ultracentrifuge", "Electronic Balances", "Heating Block", "Vacuum Pumps", "Spectrophotometer", "pH Metres", "Thermostatic Water Bath", "Burner", "Test Tubes (varying sizes)", "Distiller"];
const physiologyList = ["Spirometer", "Vitalograph", "Polygraph", "Peak Flow Metre", "Gas Metre", "ECG Machine", "Spectrophotometers", "Physiograph Recorder Transducers", "Oscilloscopes", "Centrifuges", "Audiometer", "Water Baths", "Electronic Weighing Balance Scale", "Flame Photometer", "Microcentrifuge", "Water Distiller", "Stethoscopes/Sphygmomanometers", "Electron Microscope", "Teaching Microscope", "Slides", "Snellen's Chart"];
const positioningList = ["Relaxation Chair", "Floor Sitter", "Stand-in Frame", "Stand-in Table", "Corner Seat", "Standing Frames", "Mat Platforms", "Treatment Tables", "Tilt Tables", "Stools", "Carts", "Screens", "Mirrors (full length)", "Parallel Bars", "Stairs (training)", "Work Hardening Station", "Trays and Accessories", "Ramps", "Therapeutic Gloves", "Weighing Scales", "Convalescent Recliners"];
const evaluationList = ["Steadiness Tester (hole type)", "Pencil Maze Test Board", "Tremor Quantifier", "Hand Dynamometer", "Pinch Gauge / Pinch Meter", "Strength Evaluation System", "Goniometer", "Finger Dexterity Test Board", "Key Hole Test Board", "Counting and Colour Sorting Beads Set", "Tape Measure", "Sensory Pins", "Tuning Fork", "Reflex Hammer", "Standardized Outcome Measure Forms/Kits", "Stopwatch", "Cognitive Assessment Kit (e.g. MMSE, MoCA, LOTCA)", "Sensory Profile Assessment Kit", "Visual Perception Test Kit"];
const adlList = ["Reachers", "Dressing Aids (button hooks, sock aids, dressing sticks)", "Mobility Aids (Walker, Quad cane, Standard cane)", "Adaptive Scissors", "Book Holder", "Writing Aids (built-up grips, weighted pens)", "Door Latch Practice Frame Set", "Electro-equipment Practice Frame Set", "Dressing Practice Frame Set", "Eating Aids with Adapted Utensils (Set)", "ADL Kits", "Span Board", "ADL Practice Board", "Resistive Bars", "Electric Iron", "Adapted Clothing for Training (Sets)", "Long-handled Sponge", "Bath Bench / Shower Chair", "Raised Toilet Seat", "Commode Chair", "Grab Bars (training)", "Non-slip Mat"];
const personalHygieneList = ["Simulated Bathing Station", "Simulated Toileting Station", "Grooming Station (mirror, sink, supplies)", "Nail Care Set", "Oral Care Practice Set", "Hair Care Tools (Set)"];
const kitchenList = ["Plates and Bowls (Set)", "Cups and Drinking Aids (Set)", "Adapted Utensils (Set)", "Gas Cooker", "Self-feeders and Arm Supports", "Over-bed Tables", "Dycem (Non-slip) Products (Set)", "Dining Accessories (Set)", "Plate Rack", "Mixer", "Blender", "Adapted Cutting Board (one-handed)", "Adapted Jar Opener", "Reach Extender", "Kitchen Apron (adaptive)"];
const sensoryList = ["Tactile Stimulators (textures, brushes, feathers)", "Visual Stimulators (light tubes, projector toys)", "Peg Boards", "Target Game", "Basic Balance Beam", "Balance Boards", "Dart Board", "Ball Pool", "Puzzles", "Multi-activity Work Station", "Mushroom Boards", "Pegs and Shapes Set", "Pinch Tree Board", "Size Perception Square Board Set", "Geometric Shape Form Board Set", "Foot Placement Ladder", "Equilibrium Board", "Trampoline", "Building Blocks", "Visual Cues and Illustration Materials", "Puzzle Game Board Set", "Play Dough", "Cone Board", "Weighted Vest / Blanket", "Therapy Swing (vestibular)", "Resonance Board", "Fibre Optic Lights (Set)", "Bubble Tube"];
const vocationalList = ["Virtual Reality System with Screen", "Driving Simulator Setup with Screen", "Computer Set", "Work Hardening System", "Work Conditioning Equipment", "Ergonomic Workstation (adjustable)", "Job Simulation Kits", "Lifting Boxes (varied weights) (Set)", "Pegboard Assembly Task Kits", "Fine Motor Work Tasks (sorting, assembly)"];
const upperLimbList = ["Shoulder Supports and Slings", "Elbow Supports", "Upper Extremity Support Products (Set)", "Wrist Supports", "Cervical Collars (soft and rigid)", "Clavicle Brace", "Thoracic Brace", "Cock-up Splints", "Resting Hand Splints", "Thumb Spica Splints", "Dynamic Hand Splints", "Splint-fabrication Materials (low-temperature thermoplastics) (Set)", "Heat Gun / Splint Pan", "Splint Strapping Materials (Set)"];
const lowerLimbList = ["Ankle, Foot and Heel Supports", "Knee Supports", "Back Supports / Lumbosacral Belts", "Bed Positioning and Safety Products (pillows, wedges) (Set)", "Compression Stockings (Pairs)", "Edema-management Products (pumps, sleeves)", "Canes (standard, quad)", "Crutches (axillary, elbow) (Pairs)", "Scar Management Products / Gel Sheets (Set)", "Ergonomic Adjusters (chairs, tables, toilets) (Set)", "Therapeutic Taping (rigid, elastic) (Set)", "Pelvic Belts"];
const therapeuticExerciseList = ["Sanding Unit (reciprocal/semi-circular/vertical/overhead)", "Sand and Water Table", "Multi-purpose Wheel (shoulder)", "Flexion/Extension/Pronation/Supination Apparatus", "Inclined Tapered Balance Beam", "Slanted Walking Board", "Strength Training Equipment (sand bags 1-5 kg) (Set)", "Prone Crawling Board", "Vestibular Board", "Vestibular Swing System", "Exercise Mats", "Positioning Bolsters", "Exercise Bands (resistive: light/medium/heavy)", "Exercise Balls (varying sizes)", "Weights (Dumbbells: 1-5 kg) (Pairs)", "Balance Boards / Wobble Boards", "Therapy Putty (varied resistances)", "Hand Strengthener Devices", "Pulleys / Wall System", "Bungee Cords (therapy) (Set)", "Rebounder", "Trampoline", "Soft Ball", "Skating Board", "Range of Motion Arc", "Spiral Arc", "Peg Board", "Standing Frame", "Crawling Board", "Abductor Ladder", "Wheelchair", "Finger Ladder", "Shoulder Wheel"];
const paediatricList = ["Paediatric Treatment Tables", "Paediatric Seating & Mobility Aids", "Toileting and Bathing Aids (paediatric)", "Therapy Pool (optional)", "Bolsters", "Peanut/Pea Balls", "Standers", "Gait Trainers", "Paediatric Walkers", "Paediatric Mobility Aids", "Paediatric Outcome Measure Tools", "Adaptive Feeding/Eating Equipment (paediatric)", "Sensory Toys / Manipulatives", "Therapy Wedges (paediatric)", "Paediatric Splints (resting, functional)", "Adaptive Seating Cushions"];
const mentalHealthList = ["Relaxation Chairs/Recliners", "Group Activity Tables", "Art and Craft Supplies (paints, brushes, canvas, paper) (Set)", "Music/Audio Equipment", "Cognitive Stimulation Materials (board games, card games, puzzles)", "Stress Balls / Fidget Items", "Mindfulness/Meditation Cushions", "Journals and Writing Supplies (Set)", "Anger Management Materials (Set)", "Social Skills Training Resources (Set)", "Video Recording Devices (for feedback)", "Mirror (full length)", "Yoga Mats"];
const geriatricList = ["Walking Aids (walker, quad cane, tetrapod)", "Wheelchair (standard)", "Wheelchair (reclining)", "Bath Chair / Shower Chair", "Commode Chair", "Adaptive Eating Utensils (Sets)", "Memory Aids and Cognitive Games", "Large-print Reading Materials (Set)", "Magnifiers", "Hearing Aid Demonstration Devices", "Pressure-relief Cushions", "Lumbar/Cervical Pillows", "Stairs (low-rise practice)", "Standing Mirror", "Gait Belts", "Bedside Commode"];
const communityList = ["Portable ADL Kits", "Portable Assessment Kits (cognitive, functional)", "Mobile/Portable Splinting Materials (Set)", "Mobile Sensory Stimulation Kit", "Educational/Information Materials (handouts, posters) (Set)", "Demonstration/Teaching Models", "Adaptive Equipment Samples for Home Adaptation (Set)", "Walking Aids (assorted)", "Wheelchair (portable)", "Home-modification Demonstration Materials (Set)"];
const simulationList = ["High-impedance Mannequin", "Manual Mannequins", "Simulation Beds (cubicle layout)", "Audiovisual Recording Setup", "Vital Signs Simulator"];
const diagnosticList = ["Goniometers", "Sphygmomanometer / Stethoscope", "Spirometers", "Peak Flow Meters", "Skin Fold Callipers", "Stopwatches", "Hand Grip Dynamometer (digital)", "Pinch Gauge", "Weighing Scale (wheelchair accessible)", "Pain Rating Scale Materials", "Sensory Processing Test Equipment", "Heart Rate Monitor", "Measuring Tape", "Cognitive Test Equipment", "Stadiometer", "Body Mass Index Calculator", "Pulse Oximeter", "Reflex Hammer", "Tongue Depressor (Packs)", "Tuning Fork (128 Hz)", "Familiar Objects (paper clip, coin, marble) - stereognosis (Sets)", "Pen Light", "Thermometer", "Cotton Balls / Cotton-tipped Swabs (Packs)", "Two-point Discriminator", "Monofilament Test Kit"];
const infectionControlList = ["Face Masks (Packs)", "Disposable Gloves (Packs)", "Hand Sanitizer Dispensers", "Sputum Containers (Packs)", "Sterilizing Unit", "Autoclave", "Antiseptic Solution (Packs)", "Washing Machine", "Drying Machine", "Sharps Disposal Bins", "Biohazard Waste Bins"];
const safetyMeasuresList = ["Alarm", "Fire Extinguisher", "Fire Blanket", "Intercom", "Fire Assembly Point Signage", "Sand Bucket", "Clearly Marked Direction to Muster Point", "First Aid Kits", "Emergency Exit Lights"];

const ACADEMIC_CATEGORIES = [
  { key: 'anatomy', title: '5.1 Anatomy and Embryology' },
  { key: 'histology', title: '5.2 Histology' },
  { key: 'biochemistry', title: '5.3 Biochemistry' },
  { key: 'physiology', title: '5.4 Physiology' },
  { key: 'positioning', title: '5.5 Positioning and Treatment Equipment' },
  { key: 'evaluation', title: '5.6 Evaluation / Assessment Equipment' },
  { key: 'adl', title: '5.7 Activities of Daily Living (ADL) Laboratory' },
  { key: 'personalHygiene', title: '5.8 Personal Hygiene Simulation Room' },
  { key: 'kitchen', title: '5.9 Kitchen Simulation Room' },
  { key: 'sensory', title: '5.10 Multisensory / Sensory Integration Room' },
  { key: 'vocational', title: '5.11 Vocational Rehabilitation Laboratory' },
  { key: 'upperLimb', title: '5.12 Assistive / Orthotic Devices — Upper Limb' },
  { key: 'lowerLimb', title: '5.13 Assistive / Orthotic Devices — Lower Limb' },
  { key: 'therapeuticExercise', title: '5.14 Therapeutic Exercise Equipment' },
  { key: 'paediatric', title: '5.15 Paediatric Occupational Therapy Unit' },
  { key: 'mentalHealth', title: '5.16 Mental Health Occupational Therapy Unit' },
  { key: 'geriatric', title: '5.17 Geriatric Occupational Therapy Unit' },
  { key: 'community', title: '5.18 Community-based Occupational Therapy Unit' },
  { key: 'simulation', title: '5.19 Simulation Laboratory' },
  { key: 'diagnostic', title: '5.20 Diagnostic Equipment' },
  { key: 'infectionControl', title: '5.21 Infection Control' },
  { key: 'safetyMeasures', title: '5.22 Safety Measures' }
];

export default function OccupationalAcademicAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  // GLOBAL FORM STATE
  const [formData, setFormData] = useState({
    stepOne: {
      lecturers: [{ id: 'lec_1', name: '', gender: '', dateAppt: '', natureAppt: '', designation: '', license: '', specialization: '', qualifications: [{ id: 'q_1', title: '', date: '' }], journals: [{ id: 'c_1', title: '' }] }],
      supportStaff: [{ id: 'sup_1', name: '', gender: '', rank: '', trainingFileName: '', jobDescription: '', qualifications: [{ id: 'sq_1', title: '', date: '' }] }]
    },
    stepTwo: { spaces: buildItemList(academicSpacesList) },
    stepThree: { clinicalTraining: buildItemList(academicClinicalList) },
    stepFour: {
      anatomy: buildItemList(anatomyList),
      histology: buildItemList(histologyList),
      biochemistry: buildItemList(biochemistryList),
      physiology: buildItemList(physiologyList),
      positioning: buildItemList(positioningList),
      evaluation: buildItemList(evaluationList),
      adl: buildItemList(adlList),
      personalHygiene: buildItemList(personalHygieneList),
      kitchen: buildItemList(kitchenList),
      sensory: buildItemList(sensoryList),
      vocational: buildItemList(vocationalList),
      upperLimb: buildItemList(upperLimbList),
      lowerLimb: buildItemList(lowerLimbList),
      therapeuticExercise: buildItemList(therapeuticExerciseList),
      paediatric: buildItemList(paediatricList),
      mentalHealth: buildItemList(mentalHealthList),
      geriatric: buildItemList(geriatricList),
      community: buildItemList(communityList),
      simulation: buildItemList(simulationList),
      diagnostic: buildItemList(diagnosticList),
      infectionControl: buildItemList(infectionControlList),
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

    // Inject category headings context arrays right before API transmission
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
        assessment_type: "occupational_therapy_academic" 
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
            <p className="text-[10px] text-[#5D9C0E] font-bold mt-0.5 uppercase tracking-wider">Occupational Therapy - Academic</p>
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
