import { PDFDocument, degrees } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { readFileAsArrayBuffer, loadImage } from './fileUtils';

// Configure pdfjs worker safely
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.0.379'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF.js worker initialization notice:', e);
  }
}

export async function mergePdfFiles(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const donorPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function splitPdf(file: File, pageRangeString: string): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  // Parse page ranges (e.g. "1, 3-5, 7")
  const pagesToKeep = new Set<number>();
  const parts = pageRangeString.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
          pagesToKeep.add(i - 1);
        }
      }
    } else {
      const num = parseInt(part, 10);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        pagesToKeep.add(num - 1);
      }
    }
  }

  if (pagesToKeep.size === 0) {
    throw new Error('Please enter valid page numbers or page ranges (e.g. 1-3, 5).');
  }

  const newDoc = await PDFDocument.create();
  const sortedIndices = Array.from(pagesToKeep).sort((a, b) => a - b);
  const copiedPages = await newDoc.copyPages(srcDoc, sortedIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  const pdfBytes = await newDoc.save();
  return new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function rotatePdf(file: File, angleDegrees: number): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = doc.getPages();

  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angleDegrees) % 360));
  }

  const pdfBytes = await doc.save();
  return new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function deletePdfPages(file: File, pageNumbersToDelete: number[]): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = doc.getPageCount();

  if (pageNumbersToDelete.length >= totalPages) {
    throw new Error('You cannot delete all pages in the PDF.');
  }

  // Delete starting from highest index to prevent index shifting
  const sortedIndices = Array.from(new Set(pageNumbersToDelete))
    .filter((p) => p >= 1 && p <= totalPages)
    .map((p) => p - 1)
    .sort((a, b) => b - a);

  for (const idx of sortedIndices) {
    doc.removePage(idx);
  }

  const pdfBytes = await doc.save();
  return new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function reorderPdfPages(file: File, newPageOrder: number[]): Promise<Blob> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const zeroBasedIndices = newPageOrder.map((p) => p - 1);
  const copiedPages = await newDoc.copyPages(srcDoc, zeroBasedIndices);
  copiedPages.forEach((page) => newDoc.addPage(page));

  const pdfBytes = await newDoc.save();
  return new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function imagesToPdf(
  imageFiles: File[],
  options: { orientation?: 'portrait' | 'landscape'; margin?: number } = {}
): Promise<Blob> {
  const isLandscape = options.orientation === 'landscape';
  const margin = options.margin ?? 10;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = isLandscape ? 297 : 210;
  const pageHeight = isLandscape ? 210 : 297;
  const maxW = pageWidth - margin * 2;
  const maxH = pageHeight - margin * 2;

  for (let i = 0; i < imageFiles.length; i++) {
    if (i > 0) pdf.addPage();
    const file = imageFiles[i];
    const url = URL.createObjectURL(file);

    try {
      const img = await loadImage(url);
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let renderW = maxW;
      let renderH = maxW / imgAspect;

      if (renderH > maxH) {
        renderH = maxH;
        renderW = maxH * imgAspect;
      }

      const posX = margin + (maxW - renderW) / 2;
      const posY = margin + (maxH - renderH) / 2;

      // Draw onto canvas to ensure standard format
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(dataUrl, 'JPEG', posX, posY, renderW, renderH);
      }
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  return pdf.output('blob');
}

export async function textToPdf(text: string, title?: string): Promise<Blob> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 15;
  const pageWidth = 210;
  const pageHeight = 297;
  const maxLineWidth = pageWidth - margin * 2;
  let currentY = margin + 10;

  if (title) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(title, margin, currentY);
    currentY += 10;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
  }

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);

  const lines = pdf.splitTextToSize(text, maxLineWidth);
  const lineHeight = 6;

  for (const line of lines) {
    if (currentY + lineHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin + 10;
    }
    pdf.text(line, margin, currentY);
    currentY += lineHeight;
  }

  return pdf.output('blob');
}

export async function getPdfMetadata(file: File): Promise<{
  pageCount: number;
  title: string;
  author: string;
  producer: string;
  creationDate: string;
}> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return {
    pageCount: doc.getPageCount(),
    title: doc.getTitle() || 'Untitled',
    author: doc.getAuthor() || 'Unknown',
    producer: doc.getProducer() || 'Unknown',
    creationDate: doc.getCreationDate() ? doc.getCreationDate()!.toISOString() : 'Unknown',
  };
}

export async function renderPdfPagesToImages(
  file: File,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  scale = 1.5
): Promise<{ pageNumber: number; blob: Blob }[]> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const results: { pageNumber: number; blob: Blob }[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    if (format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Render using PDF.js
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    await (page.render(renderContext as any) as any).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to create page image'))),
        format,
        0.95
      );
    });

    results.push({ pageNumber: pageNum, blob });
  }

  return results;
}

export async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += `--- Page ${pageNum} ---\n` + pageStrings + '\n\n';
  }

  return fullText.trim();
}
