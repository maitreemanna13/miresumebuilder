import { pdf } from "@react-pdf/renderer";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { ReactElement } from "react";

// Module-level, not per-call — GlobalWorkerOptions is a shared singleton
// across every pdf.js caller on the page (live preview, template
// thumbnails), so only needs setting once.
let workerConfigured = false;
function ensureWorker() {
  if (workerConfigured) return;
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  workerConfigured = true;
}

// Renders a react-pdf <Document> element to real <canvas> elements appended
// into `container`, via pdf.js — not <PDFViewer>'s <iframe> (which relies
// on the browser's own embedded PDF viewer plugin, unsupported on most
// mobile browsers). Pure canvas rendering works identically everywhere.
export async function renderPdfToCanvases(
  element: ReactElement,
  container: HTMLElement,
  options: { maxPages?: number; scale?: number; canvasClassName?: string } = {}
): Promise<void> {
  ensureWorker();
  // react-pdf's `pdf()` is typed against its own `DocumentProps`, even
  // though any of our templates' <Document> trees satisfy it at runtime —
  // cast at this boundary, same as the export API routes do.
  const blob = await pdf(element as Parameters<typeof pdf>[0]).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  const pdfDoc = await getDocument({ data: arrayBuffer }).promise;

  container.replaceChildren();
  const pageCount = options.maxPages
    ? Math.min(options.maxPages, pdfDoc.numPages)
    : pdfDoc.numPages;

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: options.scale ?? 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.className = options.canvasClassName ?? "block";
    const context = canvas.getContext("2d");
    if (!context) continue;
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    container.appendChild(canvas);
  }
}
