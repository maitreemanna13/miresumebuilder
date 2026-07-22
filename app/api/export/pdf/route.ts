import { NextRequest, NextResponse } from "next/server";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/auth";
import { ResumeSchema } from "@/lib/schema/resume";
import { getTemplate } from "@/templates/registry";
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

  const { resume: resumeInput, templateId, accentColor } =
    (body as { resume?: unknown; templateId?: unknown; accentColor?: unknown } | null) ?? {};

  const parsed = ResumeSchema.safeParse(resumeInput);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid resume data" }, { status: 400 });
  }

  const { Document } = getTemplate(typeof templateId === "string" ? templateId : "classic");
  // `Document` is typed against our own `{ resume: Resume }` prop contract
  // rather than react-pdf's own `DocumentProps`, even though it always
  // renders a real react-pdf <Document> internally — cast at the boundary.
  const element = createElement(Document, {
    resume: parsed.data,
    accentColor: typeof accentColor === "string" ? accentColor : undefined,
  }) as unknown as Parameters<typeof renderToBuffer>[0];

  let buffer: Buffer;
  try {
    buffer = await renderToBuffer(element);
  } catch {
    return NextResponse.json({ error: "Failed to render PDF" }, { status: 500 });
  }

  await trackDownload();

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resumeFileName(parsed.data.contact.fullName, "pdf")}"`,
    },
  });
}
