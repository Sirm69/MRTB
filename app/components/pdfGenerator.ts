import { jsPDF } from "jspdf";

export const generateAccreditationReportPDF = (profile: any, report: any, fullAssessment: any) => {
  const doc = new jsPDF();
  doc.setFont("helvetica");
  
  const pageHeight = 297;
  let y = 20;
  
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  };
  
  const addSectionHeader = (title: string) => {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(6, 105, 54);
    doc.text(title, 14, y);
    y += 5;
    doc.setDrawColor(220, 220, 220);
    doc.line(14, y, 196, y);
    y += 6;
  };

  const addWrappedText = (text: string, x: number, maxWidth: number, lineHeight: number = 5): void => {
    const lines = doc.splitTextToSize(text || "", maxWidth);
    lines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, x, y);
      y += lineHeight;
    });
  };

  const drawTable = (
    headers: string[],
    colWidths: number[],
    rows: string[][],
    startY: number
  ): number => {
    let currentY = startY;
    const padding = 3.5;
    
    // Draw Header Row
    checkPageBreak(15);
    currentY = y;
    
    doc.setFillColor(44, 62, 32); // Dark slate olive
    doc.rect(14, currentY, 182, 9, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    
    let xOffset = 14;
    headers.forEach((header, idx) => {
      doc.text(header, xOffset + 2, currentY + 6);
      xOffset += colWidths[idx];
    });
    
    currentY += 9;
    y = currentY;

    // Draw Data Rows
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    
    rows.forEach((row: string[]) => {
      // Calculate wrapped lines count per column
      let maxLines = 1;
      const colLines = row.map((cellText: string, idx: number) => {
        const lines = doc.splitTextToSize(cellText || "", colWidths[idx] - 4);
        if (lines.length > maxLines) maxLines = lines.length;
        return lines;
      });
      
      const rowHeight = maxLines * 4.5 + padding * 2;
      
      // Page break check
      checkPageBreak(rowHeight);
      currentY = y;
      
      // Draw grid borders & print content
      let currX = 14;
      colLines.forEach((lines: string[], idx: number) => {
        // Cell boundary
        doc.setDrawColor(210, 210, 210);
        doc.rect(currX, currentY, colWidths[idx], rowHeight);
        
        // Print cell lines
        let textY = currentY + padding + 3;
        lines.forEach((line: string) => {
          doc.text(line, currX + 2, textY);
          textY += 4.5;
        });
        
        currX += colWidths[idx];
      });
      
      currentY += rowHeight;
      y = currentY;
    });
    
    return currentY;
  };

  const s1 = report?.step1;
  const s2 = report?.step2;

  const getAcademicCoords = (items: any[], targetIndex: number) => {
    let groupIdx = 0;
    let idx = 0;
    let currentGroupItemsCount = 0;
    
    for (let i = 0; i <= targetIndex; i++) {
      const item = items[i];
      if (!item) continue;
      const isCategoryRow = item.availableQuantity === 'Category' || 
                            item.isAvailable === 'Category' || 
                            item.status === 'Category' ||
                            item.isCategoryHeader || 
                            (item.item && /^[ixv0-9]+\.\s/i.test(item.item)) || 
                            (item.item && /^section\s[a-g]/i.test(item.item));
      if (isCategoryRow) {
        if (currentGroupItemsCount > 0) {
          groupIdx++;
        }
        idx = 0;
        currentGroupItemsCount = 0;
      } else {
        if (i === targetIndex) {
          return { groupIdx, idx };
        }
        idx++;
        currentGroupItemsCount++;
      }
    }
    return { groupIdx, idx };
  };

  const resolveGridVal = (
    inputObj: any, 
    prefix: string, 
    item: any, 
    itemsList: any[],
    index: number
  ) => {
    if (!inputObj) return {};
    
    // 1. Try Academic Format (space-groupIdx-idx-sn)
    const { groupIdx, idx } = getAcademicCoords(itemsList, index);
    const academicKey = `${prefix}-${groupIdx}-${idx}-${item.sn}`;
    if (inputObj[academicKey]) return inputObj[academicKey];
    
    // 2. Try Clinical Format (space-sn-index)
    const clinicalKey = `${prefix}-${item.sn}-${index}`;
    if (inputObj[clinicalKey]) return inputObj[clinicalKey];
    
    return {};
  };

  const decisionText = report?.step3?.decision || (profile?.status === "approved" || profile?.assessment_status === "approved" ? "Full Accreditation" : "Accreditation Denied");
  const isAccredited = decisionText.toLowerCase().includes("accept") || decisionText.toLowerCase().includes("full") || profile?.status === "approved" || profile?.assessment_status === "approved";
  const panelMembers = report?.step3?.panelMembers || [];
  const validMembers = panelMembers.filter((m: string) => m && m.trim() !== "");
  const findings = report?.step3?.panelFindings;

  // ==========================================================
  // PAGE 1: HEADER BRANDING & PREAMBLE / VISIT INFORMATION
  // ==========================================================
  
  // Header Branding
  doc.setFillColor(93, 156, 14);
  doc.rect(0, 0, 210, 32, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("MEDICAL REHABILITATION THERAPISTS BOARD OF NIGERIA", 14, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.text("COMPLETE PHYSICAL EVALUATION & ACCREDITATION REPORT", 14, 21);
  
  y = 42;
  
  // Profile Info Box
  doc.setFillColor(250, 252, 248);
  doc.setDrawColor(205, 225, 180);
  doc.roundedRect(14, y, 182, 45, 4, 4, "FD");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(44, 62, 32);
  doc.text("FACILITY PROFILE", 20, y + 8);
  
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text("Facility Name:", 20, y + 16);
  doc.text("Profession:", 20, y + 23);
  doc.text("Category:", 20, y + 30);
  doc.text("Evaluation Date:", 20, y + 37);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  doc.text(profile?.name || "-", 55, y + 16);
  doc.text(profile?.profession || "-", 55, y + 23);
  doc.text(`${profile?.category || "-"} (${profile?.sub_category || "-"})`, 55, y + 30);
  
  const visitDateStr = report?.step3?.reportDate 
    ? new Date(report.step3.reportDate).toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : (profile?.visit_date ? new Date(profile.visit_date).toLocaleDateString("en-GB", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : "Pending");
  doc.text(visitDateStr, 55, y + 37);
  
  y += 55;

  // Representatives & Preamble
  if (s2) {
    addSectionHeader("I. PREAMBLE & VISITATION REPRESENTATIVES");
    
    if (s2.preamble) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("Preamble & Travel Details:", 14, y);
      y += 5.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text(`• Mode of Travel: ${s2.preamble.modeOfTravel || "-"}`, 18, y);
      y += 5;
      doc.text(`• Arrival Date/Time: ${s2.preamble.arrivalDate || "-"} at ${s2.preamble.arrivalTime || "-"}`, 18, y);
      y += 5;
      doc.text(`• Program to Accredit: ${s2.preamble.programToAccredit || "-"}`, 18, y);
      y += 7;
    }

    if (s2.representatives && s2.representatives.length > 0) {
      checkPageBreak(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("Facility Representatives Present during Visitation:", 14, y);
      y += 5.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      s2.representatives.forEach((rep: string, idx: number) => {
        if (rep && rep.trim() !== "") {
          checkPageBreak(6);
          doc.text(`${idx + 1}. ${rep}`, 18, y);
          y += 5;
        }
      });
      y += 5;
    }
  }

  // ==========================================
  // PAGE 2: ACADEMIC MATTERS EVALUATION
  // ==========================================
  const curriculumRows = Array.isArray(s1) ? s1 : (s1?.curriculumGrid || []);
  if (curriculumRows && curriculumRows.length > 0) {
    doc.addPage();
    y = 20;
    addSectionHeader("II. ACADEMIC MATTERS & PROGRAM QUESTIONS");
    
    // Checklist Grid
    const headers = ["S/N", "Item Description", "Adequacy Assessment"];
    const colWidths = [15, 122, 45];
    const rows = curriculumRows.map((row: any) => [
      String(row.sn),
      row.item.replace(/\n/g, " "),
      row.adequacy || "Not Evaluated"
    ]);
    
    drawTable(headers, colWidths, rows, y);
    y += 5;
  }

  if (s2?.academic) {
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    doc.text("Academic Program Conformance Details:", 14, y);
    y += 5.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    
    const questions = [
      `Curriculum conforms to Board guidelines: ${s2.academic.aYes ? "Yes" : s2.academic.aNo ? "No" : "Not Specified"}`,
      `Admission requirements conform: ${s2.academic.bYes ? "Yes" : s2.academic.bNo ? "No" : "Not Specified"}`,
      `Student Handbook complies: ${s2.academic.c1Yes ? "Yes" : s2.academic.c1No ? "No" : "Not Specified"}`,
      `Lecture Schedule adequacy: ${s2.academic.c2Yes ? "Yes" : s2.academic.c2No ? "No" : "Not Specified"}`,
      `Timetable & Lecture Notes compliance: ${s2.academic.c3Yes ? "Yes" : s2.academic.c3No ? "No" : "Not Specified"}`,
      `Practical Evaluation schedule: ${s2.academic.c4Yes ? "Yes" : s2.academic.c4No ? "No" : "Not Specified"}`,
      `Student Dress Code complies: ${s2.academic.fDressingModest ? "Modest" : s2.academic.fDressingNotModest ? "Not Modest" : "Not Specified"}`
    ];
    
    questions.forEach((item) => {
      checkPageBreak(6);
      doc.text(`• ${item}`, 18, y);
      y += 5;
    });
    
    if (s2.academic.comments) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.text("Academic Observations & Comments:", 18, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      addWrappedText(s2.academic.comments, 20, 175);
    }
    y += 5;
  }

  // ==========================================
  // PAGE 3: STAFFING STRENGTH & QUALIFICATIONS
  // ==========================================
  if (s2?.staffing) {
    doc.addPage();
    y = 20;
    addSectionHeader("III. ACADEMIC & CLINICAL STAFF STRENGTH");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    doc.text("Staffing Records & Head of Department Details:", 14, y);
    y += 5.5;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`• HOD Name & Title: ${s2.staffing.hodName || "-"}`, 18, y);
    y += 5;
    doc.text(`• Total Academic Staff Count: ${s2.staffing.totalAcademic || "-"}`, 18, y);
    y += 5;
    doc.text(`  - Permanent Academic Staff: ${s2.staffing.totalPermanentAcademic || "-"}`, 18, y);
    y += 5;
    doc.text(`  - Part-time Academic Staff: ${s2.staffing.totalPartTime || "-"}`, 18, y);
    y += 5;
    doc.text(`• Registered / Licensed Therapists: ${s2.staffing.totalLicensed || "-"}`, 18, y);
    y += 5;
    doc.text(`• Unregistered / Unlicensed Staff: ${s2.staffing.totalUnlicensed || "-"}`, 18, y);
    y += 5;
    doc.text(`• Support & Non-Academic Staff count: ${s2.staffing.totalNonAcademic || "-"}`, 18, y);
    y += 7;
    
    if (s2.staffing.comments) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.text("Staffing Observations & Comments:", 18, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      addWrappedText(s2.staffing.comments, 20, 175);
    }
    y += 5;
  }

  // ==========================================
  // PAGE 4: PHYSICAL INFRASTRUCTURE & SPACES
  // ==========================================
  if (fullAssessment?.spaces && fullAssessment.spaces.length > 0) {
    doc.addPage();
    y = 20;
    addSectionHeader("IV. PHYSICAL INFRASTRUCTURE & SPACE EVALUATION");
    
    const headers = ["Space Item Description", "Condition Status", "Inspector Observations / Comments"];
    const colWidths = [70, 42, 70];
    const rows = fullAssessment.spaces.map((space: any, index: number) => {
      const gridVal = resolveGridVal(s1?.spacesInput || s2?.spacesInput, 'space', space, fullAssessment.spaces, index);
      return [
        space.item,
        gridVal.condition || "Not Evaluated",
        gridVal.comment || "No comments recorded"
      ];
    });
    
    drawTable(headers, colWidths, rows, y);
    y += 5;
  }

  if (s2?.facilities) {
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    doc.text("Teaching Laboratories, Offices & Library Facilities:", 14, y);
    y += 5.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    
    doc.text(`• Classroom Count: ${s2.facilities.classroomCount || "-"}`, 18, y);
    y += 5;
    doc.text(`• Signage visibility: ${s2.facilities.signPresent ? "Present (Conspicuous)" : s2.facilities.signAbsent ? "Absent" : "Not Specified"}`, 18, y);
    y += 5;
    doc.text(`• Building Cleanliness: ${s2.facilities.outlookClean ? "Clean & Orderly" : s2.facilities.outlookUnclean ? "Unclean / Cluttered" : "Not Specified"}`, 18, y);
    y += 5;
    doc.text(`• Library Sitting Capacity: ${s2.facilities.libSittingCapacity || "-"}`, 18, y);
    y += 5;
    doc.text(`• Textbooks collection size: ${s2.facilities.libTextbooks || "-"}   |   Journals collection: ${s2.facilities.libJournals || "-"}`, 18, y);
    y += 7;
    
    if (s2.facilities.signComments) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.text("Physical Facilities Observations & Comments:", 18, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      addWrappedText(s2.facilities.signComments, 20, 175);
    }
    y += 5;
  }

  // ==========================================
  // PAGE 5: CLINICAL TRAINING & ENVIRONMENT
  // ==========================================
  if (fullAssessment?.clinicalTraining && fullAssessment.clinicalTraining.length > 0) {
    doc.addPage();
    y = 20;
    addSectionHeader("V. CLINICAL TRAINING FACILITIES CHECKLIST");
    
    const headers = ["Clinical Training Item", "Observed Status", "Inspector Observations / Comments"];
    const colWidths = [70, 42, 70];
    const rows = fullAssessment.clinicalTraining.map((clin: any, index: number) => {
      const gridVal = resolveGridVal(s1?.clinicalInput || s2?.clinicalInput, 'clinical', clin, fullAssessment.clinicalTraining, index);
      return [
        clin.item || clin.description,
        gridVal.observed || "Not Evaluated",
        gridVal.comment || "No comments recorded"
      ];
    });
    
    drawTable(headers, colWidths, rows, y);
    y += 5;
  }

  if (s2?.clinical) {
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    doc.text("Clinical Department & Environment Questions:", 14, y);
    y += 5.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    
    const structure = s2.clinical.deptStructurePurposedBuilt ? "Purpose-built" : s2.clinical.deptStructureGeneralPurpose ? "General Purpose" : s2.clinical.deptStructureSharedSpace ? "Shared Space" : "Not Specified";
    doc.text(`• Clinical Structure: ${structure}`, 18, y);
    y += 5;
    doc.text(`• Hospital Bed Space capacity: ${s2.clinical.hospitalBedSpace || "-"}`, 18, y);
    y += 5;
    doc.text(`• Clinical Therapists Strength: ${s2.clinical.deptTherapistsAdequate ? "Adequate" : s2.clinical.deptTherapistsInadequate ? "Inadequate" : "Not Specified"}`, 18, y);
    y += 5;
    doc.text(`• Patient Waiting Area: ${s2.clinical.deptWaitingAvailable ? "Available" : "Not Available"}`, 18, y);
    y += 5;
    doc.text(`• Convenient Toilets: ${s2.clinical.deptConveniencesAvailable ? "Available" : "Not Available"}`, 18, y);
    y += 7;
    
    if (s2.clinical.deptComments) {
      checkPageBreak(12);
      doc.setFont("helvetica", "bold");
      doc.text("Clinical Observations & Comments:", 18, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      addWrappedText(s2.clinical.deptComments, 20, 175);
    }
    y += 5;
  }

  // ==========================================
  // PAGE 6: EQUIPMENT & INSTRUMENTS INVENTORIES
  // ==========================================
  if (fullAssessment?.equipment && fullAssessment.equipment.length > 0) {
    doc.addPage();
    y = 20;
    addSectionHeader("VI. EQUIPMENT & INSTRUMENTS INVENTORIES CHECKLIST");
    
    const headers = ["Equipment Item Description", "Req. Qty", "Observed Qty", "Functionality Status"];
    const colWidths = [82, 30, 30, 40];
    const rows = fullAssessment.equipment.map((equip: any, index: number) => {
      const gridVal = resolveGridVal(s1?.equipmentInput || s2?.equipmentInput, 'equip', equip, fullAssessment.equipment, index);
      return [
        equip.item,
        String(equip.requiredQuantity || "-"),
        String(gridVal.observed || "-"),
        gridVal.functionality || "Not Evaluated"
      ];
    });
    
    drawTable(headers, colWidths, rows, y);
    y += 5;
  }

  // ==========================================
  // PAGE 7: ACCREDITATION COMMISSION DECISION (Form E)
  // ==========================================
  doc.addPage();
  y = 20;
  
  addSectionHeader("VII. ACCREDITATION PANEL DECISION & REASONINGS (FORM E)");
  
  const durationText = report?.step3?.duration || "-";
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Status Result Awarded:", 14, y);
  doc.setFont("helvetica", "normal");
  doc.text(decisionText, 58, y);
  y += 7;
  
  if (isAccredited && durationText !== "-") {
    doc.setFont("helvetica", "bold");
    doc.text("Accreditation Duration:", 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${durationText} Years`, 58, y);
    y += 7;
  }
  
  y += 5;

  // Panel Members
  if (validMembers.length > 0) {
    checkPageBreak(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Accreditation Evaluation Panel:", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    validMembers.forEach((member: string) => {
      checkPageBreak(8);
      doc.text(`•  ${member}`, 18, y);
      y += 6;
    });
    y += 5;
  }

  // Panel observations breakdown
  if (findings) {
    checkPageBreak(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(6, 105, 54);
    doc.text("Detailed Panel Recommendations & Observation Summary:", 14, y);
    y += 6;
    
    Object.entries(findings).forEach(([key, section]: [string, any]) => {
      if (!section.comment && !section.recommendation) return;
      
      checkPageBreak(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      doc.text(section.title || key, 14, y);
      y += 5;
      
      doc.setFontSize(9);
      if (section.comment) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text("Observations:", 16, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        y += 5;
        addWrappedText(section.comment, 20, 175);
      }
      
      if (section.recommendation) {
        checkPageBreak(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(200, 50, 50);
        doc.text("Recommendations:", 16, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        y += 5;
        addWrappedText(section.recommendation, 20, 175);
      }
      y += 4;
    });
  }

  const filename = `${profile.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_complete_evaluation_report.pdf`;
  doc.save(filename);
};
