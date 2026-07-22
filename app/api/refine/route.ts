import { NextRequest, NextResponse } from "next/server";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, REFINE_MODEL } from "@/lib/ai/client";
import { ResumeSchema } from "@/lib/schema/resume";
import {
  RefineResponseSchema,
  REFINE_SYSTEM_PROMPT,
  buildRefineUserMessage,
} from "@/lib/ai/refine";

export const runtime = "nodejs";

const MAX_INSTRUCTION_LENGTH = 500;
// Generous headroom over a typical job posting's length, bounded to keep
// cost/abuse in check.
const MAX_JOB_DESCRIPTION_LENGTH = 8000;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { resume: resumeInput, instruction, jobDescription } =
    (body as { resume?: unknown; instruction?: unknown; jobDescription?: unknown } | null) ?? {};

  const parsedResume = ResumeSchema.safeParse(resumeInput);
  if (!parsedResume.success) {
    return NextResponse.json({ error: "Invalid resume data" }, { status: 400 });
  }

  if (typeof instruction !== "string" || !instruction.trim()) {
    return NextResponse.json({ error: "Instruction is required" }, { status: 400 });
  }
  if (instruction.length > MAX_INSTRUCTION_LENGTH) {
    return NextResponse.json({ error: "Instruction is too long" }, { status: 400 });
  }

  let jobDescriptionText: string | undefined;
  if (jobDescription !== undefined) {
    if (typeof jobDescription !== "string" || !jobDescription.trim()) {
      return NextResponse.json({ error: "Job description is empty" }, { status: 400 });
    }
    if (jobDescription.length > MAX_JOB_DESCRIPTION_LENGTH) {
      return NextResponse.json({ error: "Job description is too long" }, { status: 400 });
    }
    jobDescriptionText = jobDescription;
  }

  try {
    const response = await anthropic.messages.parse({
      model: REFINE_MODEL,
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: REFINE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildRefineUserMessage(parsedResume.data, instruction, jobDescriptionText),
        },
      ],
      output_config: {
        format: zodOutputFormat(RefineResponseSchema),
      },
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "The assistant declined to process this request." },
        { status: 422 }
      );
    }

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "The assistant's response was malformed. Try rephrasing your instruction." },
        { status: 502 }
      );
    }

    return NextResponse.json(response.parsed_output);
  } catch (err) {
    console.error("Refine request failed:", err);
    // The model's structured output failed our own Zod validation (e.g. a
    // field came back longer than its cap) — distinct from a genuine API
    // failure, and worth telling the user something actionable.
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("Failed to parse structured output")) {
      return NextResponse.json(
        {
          error:
            "The assistant's response didn't fit the expected format. Try a shorter or more specific instruction.",
        },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: "AI refinement failed. Please try again." }, { status: 500 });
  }
}
