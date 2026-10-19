import { NextRequest, NextResponse } from "next/server";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, REFINE_MODEL } from "@/lib/ai/client";
import { extractPdfText } from "@/lib/parsing/pdfText";
import { extractDocxText } from "@/lib/parsing/docxText";
import { buildResumeFromExtraction } from "@/lib/parsing/buildResumeFromExtraction";
import { ExtractionResultSchema, EXTRACT_SYSTEM_PROMPT } from "@/lib/ai/extract";
import { ResumeSchema } from "@/lib/schema/resume";

export const runtime = "nodejs";
// A long resume with many projects can take well over a minute to extract;
// without this, the platform's default function timeout can cut it off.
export const maxDuration = 300;

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MIN_EXTRACTED_TEXT_LENGTH = 200;
const MAX_TEXT_SENT_TO_MODEL = 60000;

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File is too large (max 8MB)" }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
  const isDocx =
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx");

  if (!isPdf && !isDocx) {
    return NextResponse.json({ error: "Only PDF and DOCX files are supported" }, { status: 400 });
  }

  let rawText: string;
  try {
    const arrayBuffer = await file.arrayBuffer();
    rawText = isPdf
      ? await extractPdfText(arrayBuffer)
      : await extractDocxText(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error("Text extraction failed:", err);
    return NextResponse.json(
      { error: "Couldn't read that file. It may be corrupted or password-protected." },
      { status: 422 }
    );
  }

  const normalized = rawText.replace(/\s+/g, " ").trim();
  if (normalized.length < MIN_EXTRACTED_TEXT_LENGTH) {
    return NextResponse.json(
      {
        error:
          "This looks like a scanned image or an empty document — no readable text was found. Try manual entry instead.",
      },
      { status: 422 }
    );
  }

  try {
    const response = await anthropic.messages.parse({
      model: REFINE_MODEL,
      max_tokens: 16000,
      system: EXTRACT_SYSTEM_PROMPT,
      messages: [{ role: "user", content: rawText.slice(0, MAX_TEXT_SENT_TO_MODEL) }],
      output_config: {
        format: zodOutputFormat(ExtractionResultSchema),
      },
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "The assistant declined to process this file." },
        { status: 422 }
      );
    }

    if (!response.parsed_output) {
      console.error("Extraction returned no parsed output; stop_reason:", response.stop_reason);
      return NextResponse.json(
        { error: "Couldn't understand that resume's structure. Try manual entry instead." },
        { status: 502 }
      );
    }

    const resume = buildResumeFromExtraction(response.parsed_output);
    const validated = ResumeSchema.safeParse(resume);
    if (!validated.success) {
      console.error("Extraction produced an invalid resume:", validated.error);
      return NextResponse.json(
        { error: "Couldn't understand that resume's structure. Try manual entry instead." },
        { status: 502 }
      );
    }

    return NextResponse.json({ resume: validated.data });
  } catch (err) {
    console.error("Resume extraction failed:", err);
    return NextResponse.json({ error: "AI extraction failed. Please try again." }, { status: 500 });
  }
}
