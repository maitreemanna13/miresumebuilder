import "server-only";
// Must be imported before "pdf-parse" — pdfjs-dist otherwise can't locate
// its worker script inside the Next.js server bundle ("Setting up fake
// worker failed"). See pdf-parse's troubleshooting guide, "Error: Setting
// up fake worker failed".
import { getPath } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

PDFParse.setWorker(getPath());

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}
