"use client";

import React from "react";
import Image from "next/image";

export interface CertificateData {
  id?: string | number;
  templateType?: "academic" | "internship" | "safe_practice" | "auto";
  organizationName: string;
  location?: string; // e.g. "SATELLITE TOWN, LAGOS" or "AROCHUKWU, ABIA"
  programmeName?: string;
  discipline?: string; // e.g. "Physiotherapy", "Prosthetics and Orthotics", "Speech Therapy", "Occupational Therapy"
  duration?: string; // e.g. "Six(6) months Partial", "Two (2) Years Full", "Three (3) Years Full"
  decisionType?: string; // e.g. "Partial", "Full", "Full Accreditation"
  accreditationDate?: string; // e.g. "19th November 2025"
  issueDay?: string; // e.g. "31st"
  issueMonthYear?: string; // e.g. "December 2025"
  registrationNumber?: string; // e.g. "MRTB/SPP/PT/0022"
}

interface CertificateViewProps {
  data: CertificateData;
  scale?: number;
  className?: string;
  isPrintMode?: boolean;
}

export const getDisciplineCode = (discipline?: string): string => {
  if (!discipline) return "PT";
  const lower = discipline.toLowerCase();
  if (lower.includes("prosthetic") || lower.includes("orthotic")) return "PO";
  if (lower.includes("physio")) return "PT";
  if (lower.includes("speech") || lower.includes("audiolog")) return "ST";
  if (lower.includes("occupational")) return "OT";
  if (lower.includes("chiropractic")) return "CP";
  if (lower.includes("osteopath")) return "OP";
  return "PT";
};

export const getDisciplineTitle = (discipline?: string): string => {
  if (!discipline) return "Physiotherapy";
  const lower = discipline.toLowerCase();
  if (lower.includes("prosthetic") || lower.includes("orthotic")) return "Prosthetics and Orthotics";
  if (lower.includes("physio")) return "Physiotherapy";
  if (lower.includes("speech")) return "Speech Therapy";
  if (lower.includes("audiolog")) return "Audiology";
  if (lower.includes("occupational")) return "Occupational Therapy";
  return discipline;
};

export const getDisciplineProfessionals = (discipline?: string): string => {
  if (!discipline) return "Physiotherapists";
  const lower = discipline.toLowerCase();
  if (lower.includes("prosthetic") || lower.includes("orthotic")) return "Prosthetists and Orthotists";
  if (lower.includes("physio")) return "Physiotherapists";
  if (lower.includes("speech")) return "Speech Therapists";
  if (lower.includes("audiolog")) return "Audiologists";
  if (lower.includes("occupational")) return "Occupational Therapists";
  return "Physiotherapists";
};

export const detectTemplateType = (data: Partial<CertificateData>): "academic" | "internship" | "safe_practice" => {
  if (data.templateType && data.templateType !== "auto") {
    return data.templateType;
  }
  const reg = (data.registrationNumber || "").toUpperCase();
  const prog = (data.programmeName || "").toLowerCase();
  const org = (data.organizationName || "").toLowerCase();

  if (reg.includes("/ACB/") || prog.includes("bachelor") || prog.includes("training programme") || org.includes("university") || org.includes("college") || org.includes("faculty")) {
    return "academic";
  }
  if (reg.includes("/ITP/") || prog.includes("internship")) {
    return "internship";
  }
  return "safe_practice";
};

export const formatAccreditationDuration = (
  rawDuration?: string | number,
  rawDecision?: string,
  templateType?: "academic" | "internship" | "safe_practice"
): string => {
  if (!rawDuration && !rawDecision) {
    if (templateType === "academic") return "Two (2) Years Partial";
    if (templateType === "internship") return "Three (3) Years Full";
    return "Six(6) month Partial";
  }

  const durationStr = String(rawDuration || "").trim();
  const decisionStr = String(rawDecision || "").trim();

  // Normalize decision: "Full Accreditation" -> "Full", "Partial Accreditation" -> "Partial"
  let decisionType = "";
  const lowerDec = decisionStr.toLowerCase();
  if (lowerDec.includes("partial")) {
    decisionType = "Partial";
  } else if (lowerDec.includes("full")) {
    decisionType = "Full";
  } else if (lowerDec.includes("interim")) {
    decisionType = "Interim";
  } else if (lowerDec.includes("provisional")) {
    decisionType = "Provisional";
  }

  // If durationStr already contains the full comprehensive string like "Six(6) month Partial" or "Two (2) Years Full"
  const lowerDur = durationStr.toLowerCase();
  if (
    (lowerDur.includes("year") || lowerDur.includes("month")) &&
    (lowerDur.includes("full") || lowerDur.includes("partial") || lowerDur.includes("provisional"))
  ) {
    return durationStr;
  }

  // Format duration
  let formattedDuration = "";
  if (durationStr === "5" || lowerDur === "5 years" || lowerDur.includes("5 years")) {
    formattedDuration = "Five (5) Years";
  } else if (durationStr === "4" || lowerDur === "4 years" || lowerDur.includes("4 years")) {
    formattedDuration = "Four (4) Years";
  } else if (durationStr === "3" || lowerDur === "3 years" || lowerDur.includes("3 years")) {
    formattedDuration = "Three (3) Years";
  } else if (durationStr === "2" || lowerDur === "2 years" || lowerDur.includes("2 years")) {
    formattedDuration = "Two (2) Years";
  } else if (durationStr === "1" || lowerDur === "1 year" || lowerDur.includes("1 year")) {
    formattedDuration = "One (1) Year";
  } else if (durationStr === "6" || lowerDur.includes("6 month") || lowerDur.includes("six(6) month") || lowerDur.includes("six (6) month")) {
    formattedDuration = "Six(6) month";
  } else if (lowerDur.includes("12 month")) {
    formattedDuration = "Twelve (12) Months";
  } else if (lowerDur.includes("18 month")) {
    formattedDuration = "Eighteen (18) Months";
  } else if (durationStr) {
    const num = parseInt(durationStr, 10);
    if (!isNaN(num)) {
      if (num === 1) formattedDuration = "One (1) Year";
      else if (num === 2) formattedDuration = "Two (2) Years";
      else if (num === 3) formattedDuration = "Three (3) Years";
      else if (num === 4) formattedDuration = "Four (4) Years";
      else if (num === 5) formattedDuration = "Five (5) Years";
      else if (num === 6) formattedDuration = "Six(6) month";
      else formattedDuration = `${num} Years`;
    } else {
      formattedDuration = durationStr;
    }
  } else {
    if (templateType === "academic") formattedDuration = "Two (2) Years";
    else if (templateType === "internship") formattedDuration = "Three (3) Years";
    else formattedDuration = "Six(6) month";
  }

  // Combine duration with decision type
  if (decisionType && !formattedDuration.toLowerCase().includes(decisionType.toLowerCase())) {
    return `${formattedDuration} ${decisionType}`;
  }

  // If no decision type was provided and duration didn't have one, infer default
  if (!decisionType && !formattedDuration.toLowerCase().includes("full") && !formattedDuration.toLowerCase().includes("partial")) {
    if (formattedDuration.includes("Six(6)") || formattedDuration.includes("6 month") || formattedDuration.includes("One (1)")) {
      return `${formattedDuration} Partial`;
    } else {
      return `${formattedDuration} Full`;
    }
  }

  return formattedDuration;
};

export default function CertificateView({
  data,
  scale = 1,
  className = "",
  isPrintMode = false,
}: CertificateViewProps) {
  const template = detectTemplateType(data);

  // Polished clean border with transparent interior
  const borderBg = "/certificates/border_cert1.png";

  const disciplineTitle = getDisciplineTitle(data.discipline);
  const disciplinePros = getDisciplineProfessionals(data.discipline);

  // Dynamic fallback defaults
  const today = new Date();
  const dayNum = today.getDate();
  const daySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };

  const formatOrdinalDay = (input?: string, fallbackDay?: number): string => {
    if (!input) return daySuffix(fallbackDay || new Date().getDate());
    const num = parseInt(input, 10);
    if (!isNaN(num)) {
      return daySuffix(num);
    }
    return input;
  };

  const orgName = (data.organizationName || "ACCREDITED FACILITY").toUpperCase();
  const location = data.location ? data.location.toUpperCase() : "";
  const regNo = data.registrationNumber || (
    template === "academic"
      ? `MRTB/ACB/${getDisciplineCode(data.discipline)}/0001`
      : template === "internship"
      ? `MRTB/ITP/${getDisciplineCode(data.discipline)}/0001`
      : `MRTB/SPP/${getDisciplineCode(data.discipline)}/0001`
  );

  const accDate = data.accreditationDate || today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const issueDay = formatOrdinalDay(data.issueDay, dayNum);
  const issueMonthYear = data.issueMonthYear || today.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Comprehensive duration and decision text (e.g. "Six(6) month Partial", "Five (5) Years Full", "Two (2) Years Partial")
  const durationText = formatAccreditationDuration(data.duration, data.decisionType, template);

  return (
    <div
      id="mrtb-certificate-container"
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        width: "794px", // standard A4 96DPI width (210mm)
        height: "1123px", // standard A4 96DPI height (297mm)
        backgroundColor: "#ffffff",
        color: "#000000",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top center",
        boxSizing: "border-box",
        fontFamily: "'Arial', 'Helvetica', sans-serif",
      }}
    >
      {/* 1. Precision Horizontal Repeating SVG Watermark Pattern (Larger, Staggered) */}
      <svg 
        className="absolute inset-0 pointer-events-none z-0" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="mrtb-wm-pattern" 
            width="920" 
            height="70" 
            patternUnits="userSpaceOnUse"
          >
            {/* Staggered Row 1 */}
            <text 
              x="0" 
              y="26" 
              fill="#008751" 
              fontSize="23" 
              fontFamily="'Arial', sans-serif" 
              fontStyle="italic"
              fontWeight="bold" 
              opacity="0.04"
            >
              The Medical Rehabilitation Therapists Registration Board of Nigeria
            </text>
            {/* Staggered Row 2 */}
            <text 
              x="-460" 
              y="61" 
              fill="#008751" 
              fontSize="23" 
              fontFamily="'Arial', sans-serif" 
              fontStyle="italic"
              fontWeight="bold" 
              opacity="0.04"
            >
              The Medical Rehabilitation Therapists Registration Board of Nigeria
            </text>
            <text 
              x="460" 
              y="61" 
              fill="#008751" 
              fontSize="23" 
              fontFamily="'Arial', sans-serif" 
              fontStyle="italic"
              fontWeight="bold" 
              opacity="0.04"
            >
              The Medical Rehabilitation Therapists Registration Board of Nigeria
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mrtb-wm-pattern)" />
      </svg>

      {/* 2. Official Cert 01 Classic Ornate Green Scalloped Border Frame (100% Clean Interior) */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ 
          backgroundImage: `url('${borderBg}')`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Certificate Content Container */}
      <div 
        className="relative z-10 w-full h-full flex flex-col justify-between text-center"
        style={{ padding: "52px 64px 44px 64px", boxSizing: "border-box" }}
      >
        
        {/* ========================================================================= */}
        {/* TOP SECTION: Green Title + Subtitle + Big MRTB Logo + Red Title */}
        {/* ========================================================================= */}
        <div>
          {/* Header Lines in Vibrant Emerald Green */}
          <h1 
            style={{ 
              fontFamily: "'Arial Rounded MT Bold', 'Arial Black', Arial, sans-serif",
              fontWeight: 900, 
              letterSpacing: "0.03em", 
              fontSize: "23.5px", 
              lineHeight: 1.2, 
              color: "#008751",
              textTransform: "uppercase",
              margin: "0 0 2px 0",
            }}
          >
            THE MEDICAL REHABILITATION THERAPISTS
          </h1>
          <h2 
            style={{ 
              fontFamily: "'Arial Rounded MT Bold', 'Arial Black', Arial, sans-serif",
              fontWeight: 900, 
              letterSpacing: "0.03em", 
              fontSize: "22px", 
              lineHeight: 1.2, 
              color: "#008751",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            (REGISTRATION) BOARD OF NIGERIA
          </h2>

          {/* Established by Decree 38 line */}
          <p 
            style={{ 
              fontFamily: "Arial, sans-serif",
              fontWeight: 700, 
              fontSize: "14px", 
              color: "#000000", 
              letterSpacing: "0.02em", 
              margin: "3px 0 0 0",
            }}
          >
            (Established by Decree 38, 1988/Act M9 LFN 2004)
          </p>

          {/* Big MRTB Nigeria Crest Logo */}
          <div className="flex justify-center" style={{ marginTop: "10px", marginBottom: "8px" }}>
            <div className="relative" style={{ width: "86px", height: "86px", mixBlendMode: "multiply", backgroundColor: "transparent" }}>
              <Image 
                src="/certificates/mrtb_crest.png" 
                alt="MRTB Crest" 
                fill 
                sizes="86px"
                className="object-contain" 
                style={{ mixBlendMode: "multiply", backgroundColor: "transparent" }}
                priority
              />
            </div>
          </div>

          {/* Certificate of Accreditation in RED Old English with Red Underline Bar */}
          <div style={{ marginTop: "2px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span 
              className="font-old-english block"
              style={{ 
                fontSize: "41px", 
                lineHeight: 1.1, 
                color: "#D32F2F", 
                letterSpacing: "0.02em",
              }}
            >
              Certificate of Accreditation
            </span>
            <div style={{ width: "420px", height: "3px", backgroundColor: "#D32F2F", marginTop: "2px" }} />
          </div>

          {/* This is to certify that in Vibrant Green Script (Refined Boldness) */}
          <div style={{ marginTop: "8px" }}>
            <p 
              className="font-cert-script"
              style={{ 
                fontWeight: 600,
                fontSize: "48px", 
                lineHeight: 1, 
                color: "#008751",
                margin: 0,
              }}
            >
              This is to certify that
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MIDDLE SECTION: Underlined Institution Name & Location + Full Body Text */}
        {/* ========================================================================= */}
        <div style={{ margin: "auto 0", padding: "0 10px" }}>
          
          {/* Facility / Institution Name with wide solid underline bar */}
          <div className="flex justify-center" style={{ marginBottom: "8px" }}>
            <div 
              style={{ 
                borderBottom: "1.5px solid #000000", 
                display: "inline-block", 
                width: "100%", 
                maxWidth: "620px",
                paddingBottom: "3px",
              }}
            >
              <h3 
                className="font-cert-calligraphy uppercase"
                style={{ 
                  fontWeight: 800, 
                  fontSize: orgName.length > 35 ? "30px" : orgName.length > 25 ? "34px" : "38px", 
                  letterSpacing: "0.04em", 
                  color: "#000000", 
                  lineHeight: 1.15,
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                {orgName}
              </h3>
            </div>
          </div>

          {/* Location with wide solid underline bar */}
          {location && (
            <div className="flex justify-center" style={{ marginBottom: "18px" }}>
              <div 
                style={{ 
                  borderBottom: "1.5px solid #000000", 
                  display: "inline-block", 
                  width: "100%", 
                  maxWidth: "500px",
                  paddingBottom: "2px",
                }}
              >
                <p 
                  className="font-cert-calligraphy uppercase"
                  style={{ 
                    fontWeight: 700, 
                    fontSize: "25px", 
                    color: "#000000", 
                    letterSpacing: "0.05em", 
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  {location}
                </p>
              </div>
            </div>
          )}

          {/* Full body text - Single continuous paragraph with green highlights (regular weight) */}
          {template === "academic" ? (
            <div style={{ color: "#000000", textAlign: "left", padding: "0 6px" }}>
              <p className="font-cert-script" style={{ fontSize: "34px", lineHeight: 1.45, margin: 0 }}>
                having fulfilled the recommended guidelines for academic accreditation of the{" "}
                <span style={{ color: "#008751" }}>
                  {data.programmeName || `Bachelor of ${disciplineTitle} (${getDisciplineCode(data.discipline)}) Training Programme`}
                </span>{" "}
                in Nigeria, is hereby awarded{" "}
                <span style={{ color: "#008751" }}>
                  {durationText} Academic Accreditation
                </span>{" "}
                by the Medical Rehabilitation Therapists (Reg.) Board of Nigeria.
              </p>
            </div>
          ) : template === "internship" ? (
            <div style={{ color: "#000000", textAlign: "left", padding: "0 6px" }}>
              <p className="font-cert-script" style={{ fontSize: "33px", lineHeight: 1.45, margin: 0 }}>
                having fulfilled the recommended guidelines for accreditation of Hospitals for{" "}
                <span style={{ color: "#008751" }}>
                  {disciplineTitle}
                </span>{" "}
                internship training in Nigeria, is hereby awarded{" "}
                <span style={{ color: "#008751" }}>
                  {durationText} clinical accreditation for {disciplineTitle} internship training in Nigeria
                </span>{" "}
                by the Medical Rehabilitation Therapists (Reg.) Board of Nigeria and is entitled to employ{" "}
                <span style={{ color: "#008751" }}>
                  {disciplineTitle} Interns
                </span>{" "}
                for the internship training programme.
              </p>
            </div>
          ) : (
            /* Safe Practice - EXACT 100% MATCHING CERT 3 as Single Flowing Paragraph */
            <div style={{ color: "#000000", textAlign: "left", padding: "0 6px" }}>
              <p className="font-cert-script" style={{ fontSize: "34px", lineHeight: 1.45, margin: 0 }}>
                having fulfilled the recommended guidelines for accreditation of hospitals, is hereby awarded{" "}
                <span style={{ color: "#008751" }}>
                  {durationText}
                </span>{" "}
                clinical accreditation for{" "}
                <span style={{ color: "#008751" }}>
                  {disciplineTitle}
                </span>{" "}
                safe practice in Nigeria by the Medical Rehabilitation Therapists (Reg.) Board of Nigeria and is entitled to employ{" "}
                <span style={{ color: "#008751" }}>
                  {disciplinePros}
                </span>{" "}
                from any qualified Training Institution in Nigeria/Abroad.
              </p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM SECTION: Full Width Underlines, Signature & Transparent Seal */}
        {/* ========================================================================= */}
        <div style={{ paddingTop: "6px", paddingBottom: "8px" }}>
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1.3fr 0.7fr", 
              gap: "12px", 
              textAlign: "left", 
              paddingLeft: "6px", 
              paddingRight: "6px", 
              alignItems: "flex-end" 
            }}
          >
            {/* Left Column: Full-width underlined metadata & signature */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              
              {/* Date of Accreditation */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
                <span className="font-cert-script shrink-0" style={{ fontSize: "29px", color: "#000000", lineHeight: 1 }}>
                  Date of Accreditation:
                </span>
                <div 
                  style={{ 
                    borderBottom: "1.5px solid #000000", 
                    flex: 1, 
                    textAlign: "center",
                    paddingBottom: "1px",
                    lineHeight: 1,
                  }}
                >
                  <span 
                    className="font-cert-calligraphy" 
                    style={{ 
                      fontWeight: 700, 
                      fontSize: "20px", 
                      color: "#000000", 
                      fontStyle: "italic",
                      display: "inline-block",
                      lineHeight: 1,
                    }}
                  >
                    {accDate}
                  </span>
                </div>
              </div>

              {/* Registration Number */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
                <span className="font-cert-script shrink-0" style={{ fontSize: "29px", color: "#000000", lineHeight: 1 }}>
                  Registration Number:
                </span>
                <div 
                  style={{ 
                    borderBottom: "1.5px solid #000000", 
                    flex: 1, 
                    textAlign: "center",
                    paddingBottom: "1px",
                    lineHeight: 1,
                  }}
                >
                  <span 
                    className="font-cert-calligraphy" 
                    style={{ 
                      fontWeight: 700, 
                      fontSize: "20px", 
                      color: "#000000", 
                      letterSpacing: "0.04em",
                      fontStyle: "italic",
                      display: "inline-block",
                      lineHeight: 1,
                    }}
                  >
                    {regNo}
                  </span>
                </div>
              </div>

              {/* Dated this ... day of ... */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
                <span className="font-cert-script shrink-0" style={{ fontSize: "29px", color: "#000000", lineHeight: 1 }}>
                  Dated this
                </span>
                <div 
                  style={{ 
                    borderBottom: "1.5px solid #000000", 
                    minWidth: "65px", 
                    textAlign: "center",
                    paddingBottom: "1px",
                    lineHeight: 1,
                  }}
                >
                  <span 
                    className="font-cert-calligraphy" 
                    style={{ 
                      fontWeight: 700, 
                      fontSize: "19px", 
                      color: "#000000", 
                      fontStyle: "italic",
                      display: "inline-block",
                      lineHeight: 1,
                    }}
                  >
                    {issueDay}
                  </span>
                </div>
                <span className="font-cert-script shrink-0" style={{ fontSize: "29px", color: "#000000", lineHeight: 1 }}>
                  day of
                </span>
                <div 
                  style={{ 
                    borderBottom: "1.5px solid #000000", 
                    flex: 1, 
                    textAlign: "center",
                    paddingBottom: "1px",
                    lineHeight: 1,
                  }}
                >
                  <span 
                    className="font-cert-calligraphy" 
                    style={{ 
                      fontWeight: 700, 
                      fontSize: "19px", 
                      color: "#000000", 
                      fontStyle: "italic",
                      display: "inline-block",
                      lineHeight: 1,
                    }}
                  >
                    {issueMonthYear}
                  </span>
                </div>
              </div>

              {/* Signature Line & Registrar/CEO Title */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "330px", margin: "10px auto 0 auto" }}>
                <div className="relative" style={{ width: "160px", height: "46px", mixBlendMode: "multiply", backgroundColor: "transparent" }}>
                  <Image 
                    src="/certificates/signature_registrar.png" 
                    alt="Registrar Signature" 
                    fill 
                    sizes="160px"
                    className="object-contain" 
                    style={{ mixBlendMode: "multiply", backgroundColor: "transparent" }}
                    priority
                  />
                </div>
                <div style={{ width: "100%", height: "1.5px", backgroundColor: "#000000", marginTop: "2px", marginBottom: "4px" }} />
                <p className="font-cert-script" style={{ fontSize: "28px", color: "#000000", lineHeight: 1, margin: 0, fontStyle: "italic" }}>
                  Registrar / CEO
                </p>
              </div>

            </div>

            {/* Right Column: Transparent Red Starburst Ribbon Seal */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingRight: "4px" }}>
              <div className="relative" style={{ width: "155px", height: "155px", mixBlendMode: "multiply", backgroundColor: "transparent" }}>
                <Image 
                  src="/certificates/seal_red.png" 
                  alt="Official MRTB Red Seal" 
                  fill 
                  sizes="155px"
                  className="object-contain" 
                  style={{ mixBlendMode: "multiply", backgroundColor: "transparent" }}
                  priority
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
