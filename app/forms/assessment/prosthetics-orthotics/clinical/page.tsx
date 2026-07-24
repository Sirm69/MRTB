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
// PROSTHETICS & ORTHOTICS CLINICAL LISTS
// ==========================================
const clinicalSpacesList = [
  "Offices", "Patient waiting area", "Assessment room", "Fitting and Mirror", 
  "Casting area", "Lamination room", "Departmental Library", "Hospital Library", 
  "Machinist/repair section room", "Fabrication Lab", "Gait training room", 
  "Research Laboratory", "Seminar room", "Staff Toilets", "Patient’s Toilet", 
  "Changing Rooms", "Store"
];

// EQUIPMENT LISTS (Sections A-G + Others)
const assessmentAlignmentList = ["Goniometer", "Protractor", "Measuring tape", "Shoe measuring tape", "Ruler", "Spreading caliper (small & large)", "Vernier caliper (small & large)", "Precision spring compass", "Alignment fixture for prostheses", "Alignment fixture for orthotic joints", "Knee centre jig", "Mounting frame with a laser", "Gait mirror", "Parallel bars (Set)", "Pressure mat"];
const castingShapeList = ["Surfoam files (flat, half-round, round) (Sets)", "Plaster knives", "Plaster shears", "Plaster mixing bowls", "Spatulas", "Cast stool", "Sand bath", "Bench vise", "Floor vise", "Mandrel", "3D scanner"];
const fabricationList = ["Allen key set (Set)", "T-Handled hex wrench", "Wrench", "Combination spanner set (Set)", "Torque wrench", "Torque screwdriver", "Screwdriver set (Set)", "Set of pliers (Set)", "Wire cutter", "Hammer set (Set)", "Hand cabinet file (round, half-round, flat)", "Metal hacksaw frame", "Hacksaw blade", "Sheet metal shears", "Rivet set (Set)", "Hole punch set (Set)", "Slot punch", "Deburring knife", "Sharpening stone"];
const machinesList = ["Floor-mounted drilling machine", "Tabletop drilling machine", "Hand drills (manual & electric)", "Shoe patching machine", "Shoe stretcher, locking", "Silicon rolling mill", "Dust extraction system", "Compressor", "Vacuum pump", "Hot air oven", "Plastic welding machine", "Jig machine", "3D printer / CNC"];
const laminationList = ["Workbench for lamination", "Resin mixing station", "Sealing iron", "PVA measuring set (Set)", "Vacuum lines & manifolds", "PPE sets (Sets)"];
const qualitySafetyList = ["Torque tester", "Load test jig", "Digital weighing scale", "First aid station", "Fire extinguisher", "Emergency eye wash"];
const storageWorkspaceList = ["Tool cabinet/box", "Storage container", "Swivel chair", "Workbench for assembly", "Workbench with drawer unit"];

// Items 1-79 that are not explicitly duplicated in Sections A-G
const generalToolsList = ["Bending brace (Sets)", "Charger 100-240V AC 50-60Hz", "Complete toolbox", "Curved seaming pliers", "Cutting knife", "Double open-end spanner set (Set)", "Drill bit set for metal (Set)", "Drill bit set for wood (Set)", "Half round leather knife", "Set of hexagon bits (Set)", "Knives", "Last cutter", "Pipe reamer", "Pipe spanner set (Set)", "Precision saw", "Revolving eyelet punch", "Sanding drum set (Set)", "Scissors set (pinking shears, wave cut scissors, curved scissors, plaster scissors) (Set)", "Scriber", "Sole cutter", "Spring clamp", "Stapler", "Staple remover", "Tack remover", "Tap and die set, HSS (Set)", "Tracing wheel", "Tweezers", "Vice jaws", "Vise jaws protector", "Wire hand brush", "Workbench for lamination resin work", "Wench"];

// Clinical & Examination items extracted from "OTHERS"
const clinicalConsumablesList = ["Examination beds", "Towels", "Plinths", "Pillows", "Blankets", "Mats", "Mackintosh", "Ergonomically-designed chairs", "Stools", "White Clinical Coats", "Long overalls", "Sterilized Dressings (Packs)", "Face Masks (Packs)", "Disposable Gloves (Packs)", "Fire extinguisher", "Measuring devices & sensation"];

// Map the keys to the StepThree dynamic renderer (Clinical flows skip Step 4)
const CLINICAL_CATEGORIES = [
  { key: 'assessmentAlignment', title: 'Section A – Clinical Assessment & Alignment Tools' },
  { key: 'castingShape', title: 'Section B – Casting & Shape Capture' },
  { key: 'fabrication', title: 'Section C – Fabrication' },
  { key: 'machines', title: 'Section D – Machines' },
  { key: 'lamination', title: 'Section E – Lamination' },
  { key: 'qualitySafety', title: 'Section F – Quality & Safety' },
  { key: 'storageWorkspace', title: 'Section G – Storage & Workspace' },
  { key: 'generalTools', title: 'General Workshop Tools & Accessories' },
  { key: 'clinicalConsumables', title: 'Examination & Clinical Consumables' }
];

export default function ProstheticsClinicalAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  // GLOBAL FORM STATE
  const [formData, setFormData] = useState({
    stepOne: {
      prosthetists: [{ id: 'lec_1', name: '', gender: '', qualification: '', designation: '', license: '', cpds: [{ id: 'c_1', title: '' }], pgCerts: [{ id: 'p_1', title: '' }] }],
      supportStaff: [{ id: 'sup_1', name: '', gender: '', qualification: '', designation: '', jobDescription: '' }]
    },
    stepTwo: { spaces: buildItemList(clinicalSpacesList) },
    stepThree: {
      assessmentAlignment: buildItemList(assessmentAlignmentList),
      castingShape: buildItemList(castingShapeList),
      fabrication: buildItemList(fabricationList),
      machines: buildItemList(machinesList),
      lamination: buildItemList(laminationList),
      qualitySafety: buildItemList(qualitySafetyList),
      storageWorkspace: buildItemList(storageWorkspaceList),
      generalTools: buildItemList(generalToolsList),
      clinicalConsumables: buildItemList(clinicalConsumablesList)
    }
  });

  const handleNext = () => { if (currentStep < totalSteps) { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const handlePrev = () => { if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  // --- UPDATE EQUIPMENT HANDLER FOR STEP 3 ---
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
      isAvailable: item.isHeader ? 'Header' : (item.isAvailable === '' ? '-' : item.isAvailable),
      availableQuantity: item.isHeader ? 'Header' : ((item.isAvailable === 'Yes' && item.availableQuantity === '') ? '-' : item.availableQuantity)
    }));

    // Inject formatting category metadata markers directly prior to dispatch
    const allEquipmentRaw = Object.entries(formData.stepThree).flatMap(([key, items]) => {
      const cat = CLINICAL_CATEGORIES.find(c => c.key === key);
      return [
        { isCategoryHeader: true, item: cat ? cat.title : key.toUpperCase() },
        ...(items as any[])
      ];
    });

    const payload = { 
        practitioners: formData.stepOne.prosthetists, 
        supportStaff: formData.stepOne.supportStaff,
        spaces: formatList(formData.stepTwo.spaces), 
        equipment: formatList(allEquipmentRaw),
        assessment_type: "prosthetics_orthotics_clinical" 
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
            <p className="text-[10px] text-[#5D9C0E] font-bold mt-0.5 uppercase tracking-wider">P&O - Clinical</p>
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