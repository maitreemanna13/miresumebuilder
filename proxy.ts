import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Next.js 16 renamed middleware.ts -> proxy.ts (same mechanism, new name).
export const proxy = auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
});

// Explicit allow-list of protected paths, not a blanket "protect everything
// except X" — so "/" and "/login" can never be accidentally gated. The
// builder itself (/build, /upload, /choose-template) is open to anyone;
// only the admin dashboard needs a session at the page level. Downloading
// a resume is gated separately, at the export API routes, since that's
// the point sign-in actually matters.
export const config = {
  matcher: ["/dashboard/:path*"],
};
