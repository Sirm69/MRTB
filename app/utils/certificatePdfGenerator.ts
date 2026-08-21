import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

export interface DownloadCertificateOptions {
  elementId?: string;
  filename?: string;
  onProgress?: (status: string) => void;
}

/**
 * Generates and downloads a print-quality A4 PDF from the rendered certificate element
 * using the browser's native SVG ForeignObject vector layout engine.
 */
export async function downloadCertificatePDF(
  options: DownloadCertificateOptions = {}
): Promise<void> {
  const {
    elementId = "mrtb-certificate-container",
    filename = "MRTB_Accreditation_Certificate.pdf",
    onProgress,
  } = options;

  onProgress?.("Locating certificate element...");

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found in DOM.`);
  }

  onProgress?.("Rendering high-resolution vector snapshot (300 DPI)...");

  // Save current styles
  const prevTransform = element.style.transform;
  element.style.transform = "none";

  try {
    // Wait for all custom fonts (Unifraktur, Great Vibes, Cormorant Garamond, etc.) to be ready
    if (typeof document !== "undefined" && document.fonts) {
      await document.fonts.ready;
    }

    const imgData = await htmlToImage.toPng(element, {
      quality: 1.0,
      pixelRatio: 3, // Ultra-sharp 300+ DPI
      backgroundColor: "#ffffff",
      cacheBust: false,
    });

    onProgress?.("Composing official A4 PDF document...");

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

    onProgress?.("Saving PDF file...");
    pdf.save(filename);

    onProgress?.("Download complete!");
  } finally {
    // Restore transform style
    element.style.transform = prevTransform;
  }
}

