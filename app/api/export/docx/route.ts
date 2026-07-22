import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ResumeSchema } from "@/lib/schema/resume";
import { buildResumeDocx } from "@/lib/docx/buildDocx";
import { resumeFileName } from "@/lib/export/fileName";
import { trackDownload } from "@/lib/db/trackDownload";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // The builder itself is open to anyone — sign-in is only required at the
  // point of actually downloading a file, not to use the editor.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required to download your resume." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { resume: resumeInput } = (body as { resume?: unknown } | null) ?? {};

  const parsed = ResumeSchema.safeParse(resumeInput);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid resume data" }, { status: 400 });
  }

  let buffer: Buffer;
  try {
    buffer = await buildResumeDocx(parsed.data);
  } catch {
    return NextResponse.json({ error: "Failed to build DOCX" }, { status: 500 });
  }

  await trackDownload();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${resumeFileName(parsed.data.contact.fullName, "docx")}"`,
    },
  });
}
