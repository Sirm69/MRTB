"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo"; 
import StepThree from "./StepThree"; 
import StepFour from "./StepFour";

const buildItemList = (list: any[]) => {
  let mainCounter = 0;
  return list.map(itemData => {
    const itemStr = typeof itemData === 'string' ? itemData : itemData.name;
    const reqQty = typeof itemData === 'string' ? '-' : (itemData.reqQty || '-');
    
    const isSub = itemStr.startsWith("- ");
    const isHeader = itemStr.endsWith(":");
    if (!isSub) mainCounter++;
    
    return {
      item: isSub ? itemStr.substring(2) : itemStr, 
      isSubItem: isSub,
      isHeader: isHeader,
      sn: isSub ? "•" : mainCounter, 
      requiredQuantity: reqQty, 
      isAvailable: '',
      availableQuantity: '',
      floorStructure: '' 
    };
  });
};

const CATEGORY_TITLES: Record<string, string> = {
  anatomy: 'i. Anatomy and Embryology',
  histology: 'ii. Histology',
  biochemistry: 'iii. Biochemistry',
  physiology: 'iv. Physiology',
  exerciseTherapy: 'v. Exercise Therapy / Gymnasium',
  electrotherapy: 'vi. Electrotherapy Demonstration Room',
  hydrotherapy: 'vii. Hydrotherapy Room',
  simulationLab: 'viii. Simulation Laboratory',
  diagnostic: 'ix. Diagnostic Equipment',
  infectionControl: 'x. Infection Control',
  paediatric: 'xi. Paediatric Physiotherapy Unit',
  neurology: 'xii. Neurology Physiotherapy Unit',
  orthopaedics: 'xiii. Orthopaedics and Musculoskeletal Physiotherapy Unit',
  pelvicHealth: 'xiv. Pelvic and Women\'s Health Physiotherapy Unit',
  cardioPulmonary: 'xv. Cardio-Pulmonary Physiotherapy Unit',
  geriatric: 'xvi. Geriatric Physiotherapy Unit',
  communityBased: 'xvii. Community-Based Physiotherapy Unit',
  palliativeCare: 'xviii. Palliative Care Physiotherapy Unit',
  mentalHealth: 'xix. Mental Health Physiotherapy Unit',
  ergonomics: 'xx. Ergonomics and Occupational Health Physiotherapy Unit',
  sports: 'xxi. Sports and Recreational Physiotherapy Unit',
  safetyMeasures: 'xxii. Safety Measures'
};

const expandedSpacesList = [
  "Offices", "Departmental Board Room / Seminar Room", "Lecture Halls / Lecture Theatre / Classrooms and Student Conveniences:", "- Lecture Halls / Lecture Theatre / Classrooms", "- Student Conveniences", "Hostel Accommodation with Conveniences", "Basic Medical Laboratories:", "- Gross Anatomy and Embryology", "- Histology", "- Museum", "- Biochemistry", "- Physiology", "Physiotherapy demonstration laboratories:", "- Exercise Therapy / Gymnasium", "- Electrotherapy", "- Hydrotherapy", "- Simulation", "- Human Movement Laboratory", "Library:", "- College / Departmental", "- Institutional", "- E-library", "Transportation", "Alternative power source (Solar, Generator)", "Running water supply", "Safety Equipment across facility"
];

const expandedClinicalList = [
  {name: "Hospital Bed Space", reqQty: "250 minimum"}, {name: "Specialist Services:", reqQty: ""}, {name: "- Paediatrics", reqQty: ""}, {name: "- Obstetrics and Gynaecology", reqQty: ""}, {name: "- Neurology", reqQty: ""}, {name: "- Cardiology", reqQty: ""}, {name: "- Endocrinology", reqQty: ""}, {name: "- General Surgery", reqQty: ""}, {name: "- Orthopaedics", reqQty: ""}, {name: "- ICU/ Anaesthesia", reqQty: ""}, {name: "- Trauma", reqQty: ""}, {name: "- Oncology", reqQty: ""}, {name: "- Mental Health etc.", reqQty: ""}, {name: "Physiotherapy Department:", reqQty: ""}, {name: "- Purpose Built", reqQty: ""}, {name: "- Number of Physiotherapists", reqQty: ""}, {name: "Areas of specialization:", reqQty: ""}, {name: "- Paediatrics", reqQty: ""}, {name: "- Neurology", reqQty: ""}, {name: "- Orthopaedics", reqQty: ""}, {name: "- Pelvic, Obstetrics and Gynaecology", reqQty: ""}, {name: "- Cardiopulmonary", reqQty: ""}, {name: "- Geriatrics", reqQty: ""}, {name: "- Community & Palliative care", reqQty: ""}, {name: "- Mental Health", reqQty: ""}, {name: "- Ergonomics/Occupational Health", reqQty: ""}, {name: "- Sports and Recreational", reqQty: ""}, {name: "Academic Physiotherapy Department:", reqQty: ""}, {name: "- Purpose Built", reqQty: ""}, {name: "- Within Hospital Premises", reqQty: ""}, {name: "Clinical Students Hostel:", reqQty: ""}, {name: "- Within Hospital Premises", reqQty: ""}, {name: "- Well Furnished/Poorly Furnished", reqQty: ""}, {name: "- Water Supply", reqQty: ""}, {name: "- Convenience", reqQty: ""}, {name: "- Gender Sensitivity", reqQty: ""}, {name: "- Disability Friendly", reqQty: ""}, {name: "Funding Source - Clearly Stated", reqQty: ""}
];

const anatomyList = [{name: "Embalmed Bodies", reqQty: "1 cadaver per set of 6 students"}, {name: "Anatomage Table", reqQty: "1"}, {name: "Equipment Trolleys", reqQty: "3"}, {name: "Electric Embalming Machine", reqQty: "1"}, {name: "Bone Cutting Equipment - Electric Saw/Drill", reqQty: "2"}, {name: "Articulated and Unarticulated Skeletons", reqQty: "5"}, {name: "X-ray Viewing Boxes", reqQty: "3"}, {name: "Air-conditioners and Air Extractors", reqQty: "4"}, {name: "Models", reqQty: "5"}, {name: "Slide for Sections", reqQty: "Many"}, {name: "Slide Projectors", reqQty: "3"}, {name: "Toilet Facilities:", reqQty: "Gender sensitive"}, {name: "- Male", reqQty: ""}, {name: "- Female", reqQty: ""}, {name: "Changing Room", reqQty: "2"}, {name: "Shower Room", reqQty: "1"}];
const histologyList = [{name: "Microtome", reqQty: "2"}, {name: "Rotary/Sledge Microtome Knives", reqQty: "3"}, {name: "Light Microscopes Microtome", reqQty: "1 per 2 students"}, {name: "Vacuum Pump Dissecting Microtome", reqQty: "3"}, {name: "Cryostat with Microtome", reqQty: "3"}, {name: "Teaching Microscope", reqQty: "3"}, {name: "Electron Microscope", reqQty: "1 per 2 students"}, {name: "Slides", reqQty: "Many"}];
const biochemistryList = [{name: "Centrifuge", reqQty: "6"}, {name: "Ultracentrifuge", reqQty: "2"}, {name: "Electronic Balances", reqQty: "2"}, {name: "Heating Block", reqQty: "8"}, {name: "Vacuum Pumps", reqQty: "2"}, {name: "Spectrophotometer", reqQty: "1 per 10 students"}, {name: "PH. Metres", reqQty: "1 per 5 students"}, {name: "Thermostatic Water Bath", reqQty: "1"}, {name: "Burner", reqQty: "3 per bench"}, {name: "Test Tube (varying sizes)", reqQty: "Many"}, {name: "Distiller", reqQty: "3"}];
const physiologyList = [{name: "Spirometer", reqQty: "1 per 5 students"}, {name: "Vitalograph", reqQty: "1 per 5 students"}, {name: "Polygraph", reqQty: "1"}, {name: "Peak Flow Metre", reqQty: "1 per 5 students"}, {name: "Gas Metre", reqQty: "2"}, {name: "ECG Machine", reqQty: "4"}, {name: "Spectrophotometers", reqQty: "1 per 5 students"}, {name: "Physiograph Recorder Transducers", reqQty: "1 per 5 students"}, {name: "Oscilloscopes", reqQty: "4"}, {name: "Centrifuges", reqQty: "6"}, {name: "Blood Gas Callipers", reqQty: "2"}, {name: "Audiometer", reqQty: "2"}, {name: "Water Baths", reqQty: "2"}, {name: "Electronic Weighing Balance Scale", reqQty: "2"}, {name: "Flame Photometer", reqQty: "4"}, {name: "Microcentrifuge", reqQty: "2"}, {name: "Water Distiller", reqQty: "5"}, {name: "Bicycle Ergometer", reqQty: "3"}, {name: "Stethoscopes/Sphygmomanometres", reqQty: "12"}, {name: "Electron Microscope", reqQty: "1 per 2 students"}, {name: "Teaching Microscope", reqQty: "3"}, {name: "Slides", reqQty: "Many"}, {name: "Snelle's Chart", reqQty: "5"}];
const exerciseTherapyList = [{name: "Multi Gym", reqQty: "2 minimum"}, {name: "Treadmill", reqQty: "5"}, {name: "Bicycle Ergometer", reqQty: "5"}, {name: "Elliptical Bicycle Ergometer", reqQty: "2"}, {name: "Recumbent Bicycle Ergometer", reqQty: "2"}, {name: "Hand Exerciser", reqQty: "5"}, {name: "Shoulder Wheel", reqQty: "2"}, {name: "Shoulder Ladder", reqQty: "2"}, {name: "Quadriceps Drill/Bench", reqQty: "1"}, {name: "Traction Units (cervical/lumbar)", reqQty: "1 each"}, {name: "Medicine Ball (5 varying weights)", reqQty: "1 each"}, {name: "Exercise Ball", reqQty: "5"}, {name: "Reciprocal Pulley", reqQty: "2"}, {name: "Steppers", reqQty: "2"}, {name: "Wooden Staircase (firm/shakeable)", reqQty: "2"}, {name: "Wobble Board", reqQty: "5"}, {name: "Parallel Bar", reqQty: "1"}, {name: "Standing Mirror", reqQty: "3"}, {name: "Exercise Mat", reqQty: "5"}, {name: "Sitting Box", reqQty: "5"}, {name: "Standing Box", reqQty: "4"}, {name: "TheraBands:", reqQty: "10 each of different colours"}, {name: "- Yellow", reqQty: ""}, {name: "- Green", reqQty: ""}, {name: "- Blue", reqQty: ""}, {name: "- Red", reqQty: ""}, {name: "Handgrip Exerciser", reqQty: "5"}, {name: "Dumbbells (1, 2, 3, 4, 5kgs)", reqQty: "5 each"}, {name: "Sand Bags (1, 2, 3, 4, 5kgs)", reqQty: "5 each"}, {name: "Walking Frames", reqQty: "10"}, {name: "Suspension Therapy Unit", reqQty: "1"}, {name: "Crutches (Elbow and Axillary)", reqQty: "10"}, {name: "Wheel Chairs", reqQty: "5"}, {name: "Weighing Scale", reqQty: "5"}, {name: "Stadiometer", reqQty: "5"}, {name: "Pulse Oximeter", reqQty: "5"}, {name: "Tape Measure", reqQty: "10"}, {name: "Sphygmomanometer", reqQty: "10"}, {name: "Stethoscope", reqQty: "10"}, {name: "Walking Sticks, Quadruped & Tripod", reqQty: "10"}, {name: "Precision Box", reqQty: "3"}, {name: "X-ray Viewing Box", reqQty: "4"}, {name: "Exercise Couch", reqQty: "5"}, {name: "Makintosh", reqQty: "-"}, {name: "Pillows", reqQty: "-"}, {name: "Bedsheet", reqQty: "-"}, {name: "Finger Ladder", reqQty: "2"}];
const electrotherapyList = [{name: "TENS Machine", reqQty: "4"}, {name: "EMS Machine", reqQty: "3"}, {name: "IRR Luminous", reqQty: "4"}, {name: "IRR Non-luminous", reqQty: "2"}, {name: "Shortwave Diathermy", reqQty: "2"}, {name: "Wax Bath", reqQty: "4"}, {name: "UVR", reqQty: "5"}, {name: "IF Therapy", reqQty: "3"}, {name: "Shock Wave", reqQty: "2"}, {name: "Micro Wave", reqQty: "2"}, {name: "Ice Making Machine", reqQty: "3"}, {name: "Therapeutic Ultrasound", reqQty: "3"}, {name: "Laser or Light Therapy", reqQty: "3"}, {name: "Hydrocollator Unit", reqQty: "2"}, {name: "Pneumatic Machine", reqQty: "2"}];
const hydrotherapyList = [{name: "Standard Hydrotherapy Pool", reqQty: "1"}, {name: "Aquatic Ergometer", reqQty: "1"}, {name: "Aquatic Treadmill", reqQty: "1"}, {name: "Life Jacket", reqQty: "4"}];
const simulationLabList = [{name: "High Impedance Mannequin", reqQty: "One high impedance mannequin"}, {name: "Mannequins and Beds in the Laboratory:", reqQty: ""}, {name: "- Manual Mannequins", reqQty: "10 manual mannequins and 10 beds, constructed like cubicles"}, {name: "- Beds", reqQty: ""}];
const diagnosticList = [{name: "Goniometers", reqQty: "4"}, {name: "Sphygmomanometer / Stethoscope", reqQty: "4"}, {name: "Spirometers", reqQty: "4"}, {name: "Peak Flow Meters", reqQty: "4"}, {name: "Skin Fold Callipers", reqQty: "4"}, {name: "One Stop Watch", reqQty: "4"}, {name: "Hand Grip Dynamometer /Digital Dynamo", reqQty: "5"}, {name: "Scale Weight (wheelchair accessible)", reqQty: "3"}, {name: "Pain Rating Scale", reqQty: "4"}, {name: "X-ray Viewing Box", reqQty: "4"}, {name: "Sensory Processing Test Equipment", reqQty: "2"}, {name: "Heart Rate Monitor", reqQty: "5"}, {name: "Measuring Tape", reqQty: "10"}, {name: "Cognitive Test Equipment", reqQty: "5"}, {name: "Stadiometer", reqQty: "1"}, {name: "EMG", reqQty: "1"}, {name: "Body Mass Index Calculator", reqQty: "5"}, {name: "Pulse Oximeter", reqQty: "5"}, {name: "Reflex Hammer", reqQty: "5"}, {name: "Tongue Depressor (Pack)", reqQty: "Packs"}, {name: "Tuning Fork (128Hz)", reqQty: "5"}, {name: "Two Test Tubes", reqQty: "5"}, {name: "Familiar Objects (e.g. paper clip, coin, marble)", reqQty: "4"}, {name: "Pen Light", reqQty: "5"}, {name: "Thermometer", reqQty: "5"}, {name: "Cotton Ball or Cotton Tipped Swab (Pack)", reqQty: "Packs"}, {name: "Periniometer", reqQty: "4"}];
const infectionControlList = [{name: "Face Masks (Pack)", reqQty: "Packs"}, {name: "Disposable Gloves (Pack)", reqQty: "Packs"}, {name: "Sputum Containers (Pack)", reqQty: "Packs"}, {name: "Sterilizing Unit", reqQty: "1"}, {name: "Autoclave", reqQty: "1"}, {name: "Antiseptic Solution (Pack)", reqQty: "Packs"}, {name: "Washing Machine", reqQty: "1"}, {name: "Drying Machine", reqQty: "1"}];
const paediatricList = [{name: "Gait Trainers", reqQty: "3"}, {name: "Precision Boxes", reqQty: "3"}, {name: "Precision Toys", reqQty: "10"}, {name: "Giant Mirrors", reqQty: "Wall to wall"}, {name: "Prone Standers", reqQty: "4"}, {name: "Standing Frames", reqQty: "5"}, {name: "treatment Plinths", reqQty: "4"}, {name: "Therapy Balls/Medicine Balls", reqQty: "5"}, {name: "Posterior Walkers", reqQty: "4"}, {name: "Wedges and Rolls", reqQty: "5 each"}, {name: "Frenkel Mats", reqQty: "5"}, {name: "Paediatric Treadmill", reqQty: "3"}, {name: "Resistance Bands", reqQty: "10 (different colors)"}, {name: "Paediatric Crutches", reqQty: "5"}, {name: "Paediatric Tilt Bed", reqQty: "2"}, {name: "Supportive Garment", reqQty: "3"}, {name: "Stabilization Belts", reqQty: "3"}, {name: "Everyday Objects for ADL", reqQty: "10"}, {name: "Exercise Mats", reqQty: "5"}, {name: "Adapted Eating and Drinking Products", reqQty: "5"}];
const neurologyList = [{name: "Suctioning Machine", reqQty: "2"}, {name: "Tilt Bed", reqQty: "2"}, {name: "TheraBand - Resistance Band (Yellow, Green, Blue, Red)", reqQty: "10 each"}, {name: "Neuro-com Balance Master", reqQty: "3"}, {name: "Wheelchair - Motorised", reqQty: "2"}, {name: "Walking Sticks", reqQty: "3"}, {name: "3 by 4 Wheeled Walker", reqQty: "3"}, {name: "Precision Box", reqQty: "3"}, {name: "Gait Belts", reqQty: "3"}, {name: "Pulse Oximeter", reqQty: "3"}, {name: "Wall Bar", reqQty: "2"}, {name: "Standing Infra-red Lamp (luminous/non-luminous)", reqQty: "3"}, {name: "Metronome", reqQty: "5"}, {name: "Spit Basin", reqQty: "8"}, {name: "Flashlight", reqQty: "10"}, {name: "Cognitive Test Equipment (PD & dementia)", reqQty: "10"}, {name: "Transfer Boards/Slide Sheet", reqQty: "8"}, {name: "Pillows", reqQty: "10"}, {name: "Foam Rollers/Wedges", reqQty: "10 each"}, {name: "Splinting Kit (static/dynamic)", reqQty: "5 each"}, {name: "Orthoses Kit", reqQty: "5"}, {name: "Casting Kit", reqQty: "5"}, {name: "Rollator", reqQty: "5"}, {name: "Equipment for Sport and Recreational Activities", reqQty: "10"}, {name: "Upper Limb Supports", reqQty: "5"}, {name: "Upper Limb Workstation", reqQty: "5"}, {name: "Arm Activity Kit", reqQty: "5"}, {name: "Cycle Ergometer (arm or leg)", reqQty: "4"}, {name: "Stools/Small Benches of varying Height", reqQty: "5 each"}, {name: "Ramps (temporary/mobile)", reqQty: "5 each"}, {name: "Training Stairs", reqQty: "2"}, {name: "Parallel Bar", reqQty: "2"}, {name: "Steps (stackable)", reqQty: "2"}, {name: "Balance Board/Cushion", reqQty: "3"}, {name: "Resistive Exercise Putty", reqQty: "5"}, {name: "Exercise or Gym Balls", reqQty: "5"}, {name: "TENS Supply Kit", reqQty: "4"}, {name: "Treatment Tables", reqQty: "5"}, {name: "(Functional) Electrical Stimulation Kit", reqQty: "2"}, {name: "Assistant Support Belt", reqQty: "3"}, {name: "Transfer Boards/Slide Sheet", reqQty: "4"}, {name: "Weighing Scale & Measuring Tape", reqQty: "2"}, {name: "Heart Rate Monitor", reqQty: "4"}, {name: "Cycle Ergometer (Arm & Leg)", reqQty: "2"}, {name: "Exercise Mats", reqQty: "5"}, {name: "Timer", reqQty: "5"}, {name: "Body Mass Index Calculator", reqQty: "5"}, {name: "Frenkel Mat", reqQty: "2"}, {name: "Paediatric Treadmill", reqQty: "2"}, {name: "Shoulder Wheel", reqQty: "2"}, {name: "Finger Ladder", reqQty: "2"}, {name: "Reciprocal Pulley", reqQty: "5"}];
const orthopaedicsList = [{name: "Lumber & Cervical Traction Bed", reqQty: "1"}, {name: "Bicycle Ergometer", reqQty: "4"}, {name: "Treadmill Machine", reqQty: "3"}, {name: "Tilt Bed", reqQty: "2"}, {name: "Parallel Bar", reqQty: "2"}, {name: "Precision Board", reqQty: "4"}, {name: "Dumbbells:", reqQty: "One pair each (12)"}, {name: "- 1kg", reqQty: ""}, {name: "- 2kg", reqQty: ""}, {name: "- 3kg", reqQty: ""}, {name: "- 4kg", reqQty: ""}, {name: "- 5kg", reqQty: ""}, {name: "- 10kg", reqQty: ""}, {name: "Gait Belt", reqQty: "2"}, {name: "Tera Bands", reqQty: "10"}, {name: "Hand Exerciser Balls", reqQty: "4"}, {name: "Wall Bar", reqQty: "2"}, {name: "Shoulder Wheel", reqQty: "2"}, {name: "Wooden Staircase", reqQty: "1"}, {name: "Pulse Oximeter", reqQty: "3"}, {name: "Wax Bath Machine", reqQty: "2"}, {name: "Short Wave Diathermy Machine", reqQty: "1"}, {name: "Interferential Current Machine", reqQty: "2"}, {name: "Transcutaneous Electrical Muscle Stimulator", reqQty: "3"}, {name: "Electrical Muscle Stimulator", reqQty: "3"}, {name: "Standing Infrared Machine (luminous/nonluminous)", reqQty: "3 each"}, {name: "Ice Making Machine", reqQty: "1"}, {name: "Ultraviolent Machine", reqQty: "1"}, {name: "Multi Gym", reqQty: "1"}, {name: "Wobble Board", reqQty: "4"}, {name: "Exercise Mats", reqQty: "10"}, {name: "X-ray Viewing Machine", reqQty: "2"}, {name: "Steppers", reqQty: "4"}, {name: "Reciprocal Pulley", reqQty: "3"}, {name: "Therapeutic Ultra Sound Machine", reqQty: "3"}, {name: "Orthoses Kit", reqQty: "2"}, {name: "Splinting Kit (static/dynamic)", reqQty: "2"}, {name: "Balance Board/Cushion", reqQty: "4"}, {name: "Training Stairs", reqQty: "3"}, {name: "Transfer Boards/Slide Sheet", reqQty: "4"}, {name: "Steps (stackable)", reqQty: "3"}, {name: "Ramps (temporary/mobile)", reqQty: "4"}, {name: "Upper Limb Workstation", reqQty: "2"}, {name: "Resistive Exercise Putty", reqQty: "3"}, {name: "Stabilization/Mobilization Belts", reqQty: "4"}, {name: "Casting Kit", reqQty: "3"}, {name: "Walking Frames/W", reqQty: "5"}, {name: "Rollators", reqQty: "5"}, {name: "Crutches, Axillary/Elbow", reqQty: "5"}, {name: "Canes/Sticks/Tetrapod", reqQty: "5"}, {name: "Hot and Cold Packs", reqQty: "5"}];
const pelvicHealthList = [{name: "Vaginal Cones (diff sizes)", reqQty: "5 each"}, {name: "Exercise Mats", reqQty: "5"}, {name: "Small and Large Exercise Balls", reqQty: "5 each"}, {name: "Dumbbells of different sizes", reqQty: "5"}, {name: "Bicycle Ergometer", reqQty: "2"}, {name: "Treadmill", reqQty: "2"}, {name: "Screen", reqQty: "5"}, {name: "Electrical Muscle Stimulator", reqQty: "4"}, {name: "Portable TENS", reqQty: "4"}, {name: "Pedometer", reqQty: "4"}, {name: "Weighing Scale", reqQty: "4"}, {name: "Stethoscope", reqQty: "4"}, {name: "Sphygmomanometer", reqQty: "4"}, {name: "Tape Measure", reqQty: "12"}, {name: "Stadiometer", reqQty: "2"}, {name: "Ultrasound Imaging", reqQty: "2"}, {name: "Vaginal and anal Sensors", reqQty: "5 Packs"}, {name: "Vaginal Weight", reqQty: "3 each"}, {name: "Pulse Oximeter", reqQty: "4"}, {name: "Pelvic Models (male and female)", reqQty: "3 each"}, {name: "Tubi Grip", reqQty: "3"}, {name: "Pelvic Belts / SPD belts", reqQty: "4"}, {name: "Educational booklets on treatment/ HEP (handouts to patients)", reqQty: "-"}, {name: "Irrigation Therapy Devices:", reqQty: ""}, {name: "- Peristeen Irrigation system", reqQty: "2 each"}, {name: "- Aquaflush compact system", reqQty: "2 each"}, {name: "- Qufora irrigation", reqQty: "2 each"}, {name: "- Navina Irrigation system", reqQty: "2 each"}, {name: "Pessaries - require trained therapist for fitting", reqQty: "2"}, {name: "Intravaginal Devices for Stress Urinary Incontinence:", reqQty: ""}, {name: "- Contiform", reqQty: "2 each"}, {name: "- Contrelke", reqQty: "2 each"}, {name: "- Efemia", reqQty: "2 each"}, {name: "- Revive", reqQty: "2 each"}, {name: "Cryotherapy in the form of ice fingers (made using examination gloves)", reqQty: "4"}, {name: "Foam Wedge", reqQty: "5"}, {name: "Biofeedback Machine", reqQty: "2"}, {name: "Vibrators (Patient acquired-personalized)", reqQty: "2"}, {name: "Pelvic Wand", reqQty: "4"}, {name: "Kegel Balls", reqQty: "5"}, {name: "Dilators (Patient acquired-personalized)", reqQty: "-"}, {name: "Surface Electrodes", reqQty: "10"}, {name: "Lubricating Gel", reqQty: "5 packs"}, {name: "Vaginal balls for Kegel exercises", reqQty: "6"}];
const cardioPulmonaryList = [{name: "Modern Mechanical Vibrators", reqQty: "2"}, {name: "ECG Cycle Ergometers", reqQty: "2"}, {name: "ECG Treadmills", reqQty: "2"}, {name: "ECG Device", reqQty: "3"}, {name: "Dynamometers", reqQty: "2"}, {name: "High Frequency Chest Wall Oscillation (HFCWO) Device", reqQty: "2"}, {name: "High Frequency Chest Compression Machine", reqQty: "2"}, {name: "Nimbus Series Bed at least 1", reqQty: "1"}, {name: "Positive Expiratory Pressure (PEP) Mask with Manometer", reqQty: "2"}, {name: "Electro Flo 5000 Airway Clearance Device", reqQty: "2"}, {name: "Chest Vibrator", reqQty: "2"}, {name: "Children CompAir Lightweight Compressor Respiratory Nebulizer Inhale", reqQty: "2"}, {name: "Lumbar Vibratory Massage Pillow", reqQty: "4"}, {name: "Apex Exercise Pulley Set", reqQty: "4"}, {name: "Handycare Rollator", reqQty: "5"}, {name: "Mini Electric Exercise Bike", reqQty: "2"}, {name: "Mobile Frame Gait Walker", reqQty: "3"}, {name: "Fourier Intelligence Robot", reqQty: "2"}, {name: "Exercise Stair & Steps", reqQty: "2 each"}, {name: "Electronic Nebulizers", reqQty: "2"}, {name: "Peak Flow Meter", reqQty: "4"}, {name: "Respiratory Exerciser", reqQty: "4"}, {name: "Pulse Oximeter", reqQty: "4"}, {name: "Ambu Bag", reqQty: "4"}, {name: "Suctioning Machine", reqQty: "2"}, {name: "Heart Monitor", reqQty: "4"}, {name: "ECG Machine", reqQty: "2"}, {name: "Non-invasive Ventilators", reqQty: "2"}, {name: "Spirometers", reqQty: "5"}, {name: "In-sufflators Device", reqQty: "2"}, {name: "Ex-sufflators Device", reqQty: "2"}];
const geriatricList = [{name: "Electrical Muscle Stimulators", reqQty: "2"}, {name: "Stethoscope", reqQty: "5"}, {name: "Sphygmomanometer", reqQty: "5"}, {name: "Exercise Mats", reqQty: "5"}, {name: "Reciprocal Pulley", reqQty: "4"}, {name: "TheraBand (yellow, red, blue, black)", reqQty: "2 each"}, {name: "Therapeutic Ultrasound Machine", reqQty: "4"}, {name: "Sand Bag 3kg, 2kg, 1kg", reqQty: "2 each"}, {name: "Transcutaneous Electrical Nerve Stimulator", reqQty: "5"}, {name: "Plinths", reqQty: "5"}, {name: "Bicycle Ergometer", reqQty: "4"}, {name: "Shortwave Diathermy", reqQty: "2"}, {name: "Wall Bars", reqQty: "4"}, {name: "Finger Ladder", reqQty: "4"}, {name: "Shoulder Wheel", reqQty: "4"}, {name: "Standing Mirror", reqQty: "4"}, {name: "Hand Function Board", reqQty: "4"}, {name: "Hand Balls/Hand Exercisers", reqQty: "5"}, {name: "Wooden Stair Case", reqQty: "4"}, {name: "Wobble Board", reqQty: "5"}, {name: "Gait Belts", reqQty: "4"}, {name: "Steppers", reqQty: "10"}, {name: "Parallel Bars", reqQty: "2"}, {name: "Standing Infrared Machine", reqQty: "each"}];
const communityBasedList = [{name: "Portable Ultrasonic Therapy Machine", reqQty: "2"}, {name: "TENS/EMS", reqQty: "2 each"}, {name: "Infra-Red Lamps", reqQty: "3"}, {name: "Freezer (small size) for Ice making", reqQty: "1"}, {name: "Parallel Bar", reqQty: "1"}, {name: "Walking Aids (axillary crutches, elbow crutches, walking frame, tetrapod stick, tripod stick)", reqQty: "5 each"}, {name: "Exercise Mats", reqQty: "5"}, {name: "Weights/Sand bags", reqQty: "5 each"}, {name: "Lumbar and Cervical Traction Kits", reqQty: "1 each"}, {name: "Wooden Staircase", reqQty: "1"}, {name: "Hand Exercisers", reqQty: "4"}, {name: "Wobble Boards", reqQty: "4"}, {name: "Wall Bar", reqQty: "1"}, {name: "Pulse Oximeter", reqQty: "4"}, {name: "Stethoscope", reqQty: "2"}, {name: "Sphygmomanometer", reqQty: "2"}, {name: "Shoulder Wheel", reqQty: "2"}, {name: "Bandages", reqQty: "10"}, {name: "Gait Belts", reqQty: "2"}, {name: "Frenkel Mats", reqQty: "2"}, {name: "Plinths", reqQty: "2"}, {name: "Giant Standing Mirrors", reqQty: "1"}];
const palliativeCareList = [{name: "TENS", reqQty: "5"}, {name: "Hot and Cold Packs", reqQty: "3 each"}, {name: "Foam Wedges", reqQty: "5"}, {name: "Foam Rollers", reqQty: "5"}, {name: "Utensils for Activities of Daily Living", reqQty: "Many"}, {name: "Balance Board/Cushion", reqQty: "2"}, {name: "Resistance Bands", reqQty: "5 each"}, {name: "Weights", reqQty: "3 each"}, {name: "Exercise Ball", reqQty: "5"}, {name: "Assistive Products for Dressing", reqQty: "3"}, {name: "Assistive Products for Toileting", reqQty: "3"}, {name: "Adapted Eating and Drinking Products", reqQty: "3"}, {name: "Equipment for Sport and Recreational Activities", reqQty: "-"}, {name: "Steppers", reqQty: "3"}];
const mentalHealthList = [{name: "Balance Board/Cushion", reqQty: "3"}, {name: "Cycle Ergometer (arm or leg)", reqQty: "2"}, {name: "Resistance Bands", reqQty: "3 each"}, {name: "Utensils for Activities of Daily Living", reqQty: "3"}, {name: "Video Recording Devices", reqQty: "-"}, {name: "Dumbbells of Varying Sizes", reqQty: "3 each"}, {name: "Giant Mirror", reqQty: "2"}];
const ergonomicsList = [{name: "Portable Ultrasonic Therapy Machine", reqQty: "2"}, {name: "TENS/EMS", reqQty: "2 each"}, {name: "Standing Infra-Red Lamps", reqQty: "3"}, {name: "Freezer (small size) for Ice making", reqQty: "1"}, {name: "Parallel Bar", reqQty: "1"}, {name: "Walking Aids (crutches)", reqQty: "5 each"}, {name: "Exercise Mats", reqQty: "5"}, {name: "Weights/Sand Bags", reqQty: "3 each"}, {name: "Cervical Traction Machine", reqQty: "1 each"}, {name: "Wooden Staircase", reqQty: "1"}, {name: "Hand Exercisers", reqQty: "4"}, {name: "Wobble Boards", reqQty: "4"}, {name: "Wall Bar", reqQty: "1"}, {name: "Pulse Oximeter", reqQty: "4"}, {name: "Stethoscope", reqQty: "2"}, {name: "Sphygmomanometer", reqQty: "2"}, {name: "Shoulder Wheel", reqQty: "2"}, {name: "Bandages", reqQty: "10"}, {name: "Gait Belts", reqQty: "2"}];
const sportsList = [{name: "Goniometer", reqQty: "-"}, {name: "Measuring Tape", reqQty: "-"}, {name: "Hand Dynamometer", reqQty: "-"}, {name: "Reflex Hammer/Patella Hammer", reqQty: "-"}, {name: "Resistance Bands", reqQty: "-"}, {name: "Dumbbells", reqQty: "-"}, {name: "TENS", reqQty: "-"}, {name: "Therapeutic Ultrasound", reqQty: "-"}, {name: "Ice Packs/Cryotherapy Cuffs", reqQty: "-"}, {name: "Treadmill", reqQty: "-"}, {name: "Braces/Splints", reqQty: "-"}, {name: "Kinesiotapes", reqQty: "-"}];
const safetyMeasuresList = [{name: "Alarm", reqQty: "Should be Placed in strategic locations"}, {name: "Fire Extinguisher", reqQty: "Should be Placed in strategic locations"}, {name: "Blanket", reqQty: "Should be Placed in strategic locations"}, {name: "Intercom", reqQty: "Should be Placed in strategic locations"}, {name: "Fire Assembly Point", reqQty: "Should be Placed in strategic locations"}, {name: "Sand Bucket", reqQty: "Should be Placed in strategic locations"}, {name: "Clearly marked direction to muster point", reqQty: "-"}];

export default function PhysioAcademicAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  const [formData, setFormData] = useState({
    stepOne: {
      lecturers: [{ id: 'lec_1', name: '', gender: '', dateAppt: '', natureAppt: '', designation: '', license: '', qualifications: [{ id: 'q_1', title: '', date: '' }], cpds: [{ id: 'c_1', title: '' }] }],
      supportStaff: [{ id: 'sup_1', name: '', gender: '', rank: '', trainingFileName: '', jobDescription: '', qualifications: [{ id: 'sq_1', title: '', date: '' }] }]
    },
    stepTwo: { spaces: buildItemList(expandedSpacesList) },
    stepThree: { clinicalTraining: buildItemList(expandedClinicalList) },
    stepFour: {
      anatomy: buildItemList(anatomyList),
      histology: buildItemList(histologyList),
      biochemistry: buildItemList(biochemistryList),
      physiology: buildItemList(physiologyList),
      exerciseTherapy: buildItemList(exerciseTherapyList),
      electrotherapy: buildItemList(electrotherapyList),
      hydrotherapy: buildItemList(hydrotherapyList),
      simulationLab: buildItemList(simulationLabList),
      diagnostic: buildItemList(diagnosticList),
      infectionControl: buildItemList(infectionControlList),
      paediatric: buildItemList(paediatricList),
      neurology: buildItemList(neurologyList),
      orthopaedics: buildItemList(orthopaedicsList),
      pelvicHealth: buildItemList(pelvicHealthList),
      cardioPulmonary: buildItemList(cardioPulmonaryList),
      geriatric: buildItemList(geriatricList),
      communityBased: buildItemList(communityBasedList),
      palliativeCare: buildItemList(palliativeCareList),
      mentalHealth: buildItemList(mentalHealthList),
      ergonomics: buildItemList(ergonomicsList),
      sports: buildItemList(sportsList),
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
    const validLecturers = formData.stepOne.lecturers.filter(s => s.name && s.name.trim() !== '');
    if (validLecturers.length === 0) return true; 

    const allEq = Object.values(formData.stepFour).flat();
    const allItems = [...formData.stepTwo.spaces, ...formData.stepThree.clinicalTraining, ...allEq];
    const hasEmptyItems = allItems.some((item: any) => !item.isHeader && (item.isAvailable === '' || (item.isAvailable === 'Yes' && item.availableQuantity === '')));

    return hasEmptyItems;
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

    const cleanStaff = (staffList: any[]) => staffList.filter(s => s.name && s.name.trim() !== '');
    
    const allEquipmentRaw = Object.entries(formData.stepFour).flatMap(([key, items]) => {
      return [
        { isCategoryHeader: true, item: CATEGORY_TITLES[key] || key.toUpperCase() },
        ...items
      ];
    });

    const payload = { 
        lecturers: cleanStaff(formData.stepOne.lecturers), 
        supportStaff: cleanStaff(formData.stepOne.supportStaff),
        spaces: formatList(formData.stepTwo.spaces), 
        clinicalTraining: formatList(formData.stepThree.clinicalTraining),
        equipment: formatList(allEquipmentRaw as any[]),
        assessment_type: "physiotherapy_academic" 
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
            <p className="text-[10px] text-[#5D9C0E] font-bold mt-0.5 uppercase tracking-wider">Physiotherapy - Academics</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pt-10 px-4 md:px-0 relative z-10">
        {currentStep === 1 && <StepOne data={formData.stepOne} updateData={(d: any) => setFormData({ ...formData, stepOne: d })} onNext={handleNext} />}
        {currentStep === 2 && <StepTwo data={formData.stepTwo} updateData={(d: any) => setFormData({ ...formData, stepTwo: d })} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 3 && <StepThree data={formData.stepThree} updateData={(d: any) => setFormData({ ...formData, stepThree: d })} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 4 && <StepFour data={formData.stepFour} updateCategory={updateEquipmentCategory} onPrev={handlePrev} onSubmit={handleInitialSubmit} isSubmitting={isSubmitting} />}
      </main>

      {showIncompleteWarning && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-[1px] px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] shadow-2xl px-6 py-6 w-full max-w-[340px] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="bg-[#EEF6DF] p-3 rounded-full mb-3 shadow-sm border border-[#CDE1B4]/50">
                <AlertTriangle size={28} className="text-[#5D9C0E]" strokeWidth={2.5} />
            </div>
            <h2 className="text-[17px] font-bold text-gray-900 mb-2">Incomplete Form</h2>
            <p className="text-gray-500 font-medium text-[13px] mb-6 leading-relaxed">
              You have unanswered fields or missing Staff information. Please note that submitting an incomplete assessment may negatively impact your accreditation approval.
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