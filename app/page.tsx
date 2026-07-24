import Link from "next/link";
import { auth } from "@/auth";
import { HeroSlideshow } from "@/components/landing/HeroSlideshow";
import { HeroBackgroundIcons } from "@/components/landing/HeroBackgroundIcons";
import { TEMPLATES } from "@/templates/registry";
import { ACCENT_COLORS } from "@/templates/shared/colorPalette";

// Derived from the actual registry/palette (not hardcoded) so this copy
// can't silently go stale the next time a template or color is added.
const TEMPLATE_COUNT = TEMPLATES.length;
const COLOR_COUNT = ACCENT_COLORS.length;

const STEPS = [
  {
    title: "Choose a template or upload",
    description:
      `Start from one of ${TEMPLATE_COUNT} professional designs, or upload your existing PDF/Word resume and we'll fill in the details for you.`,
    illustration: (
      <svg viewBox="0 0 64 64" className="h-16 w-16">
        <rect x="14" y="6" width="30" height="40" rx="3" fill="#ffffff" stroke="#a5b4fc" strokeWidth="2" />
        <rect x="20" y="13" width="14" height="4" rx="2" fill="#818cf8" />
        <rect x="20" y="21" width="18" height="2.5" rx="1.25" fill="#e0e7ff" />
        <rect x="20" y="27" width="15" height="2.5" rx="1.25" fill="#e0e7ff" />
        <rect x="20" y="33" width="17" height="2.5" rx="1.25" fill="#e0e7ff" />
        <circle cx="46" cy="42" r="10" fill="#4f46e5" />
        <path d="M46 37v10M41 42h10" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Edit with a live preview",
    description:
      "Add your experience, education, and skills through simple forms — the preview updates as you type.",
    illustration: (
      <svg viewBox="0 0 64 64" className="h-16 w-16">
        <rect x="6" y="10" width="24" height="34" rx="3" fill="#ffffff" stroke="#a5b4fc" strokeWidth="2" />
        <rect x="11" y="16" width="14" height="3" rx="1.5" fill="#e0e7ff" />
        <rect x="11" y="23" width="10" height="3" rx="1.5" fill="#c7d2fe" />
        <rect x="11" y="30" width="14" height="3" rx="1.5" fill="#e0e7ff" />
        <rect x="34" y="10" width="24" height="34" rx="3" fill="#eef2ff" stroke="#818cf8" strokeWidth="2" />
        <rect x="39" y="16" width="16" height="4" rx="1" fill="#4f46e5" />
        <rect x="39" y="24" width="14" height="2.5" rx="1.25" fill="#a5b4fc" />
        <rect x="39" y="29" width="12" height="2.5" rx="1.25" fill="#a5b4fc" />
        <path
          d="M28 27h6m0 0-2.5-2.5M34 27l-2.5 2.5"
          stroke="#4f46e5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Refine with AI",
    description:
      "Ask for specific changes — a punchier summary, stronger bullets, a role-specific tweak — and approve each one before it's applied.",
    illustration: (
      <svg viewBox="0 0 64 64" className="h-16 w-16">
        <rect x="12" y="10" width="30" height="38" rx="3" fill="#ffffff" stroke="#a5b4fc" strokeWidth="2" />
        <rect x="18" y="17" width="18" height="3" rx="1.5" fill="#e0e7ff" />
        <rect x="18" y="24" width="14" height="2.5" rx="1.25" fill="#c7d2fe" />
        <rect x="18" y="30" width="16" height="2.5" rx="1.25" fill="#4f46e5" />
        <rect x="18" y="36" width="12" height="2.5" rx="1.25" fill="#c7d2fe" />
        <path
          d="M46 12l1.8 4.2L52 18l-4.2 1.8L46 24l-1.8-4.2L40 18l4.2-1.8L46 12Z"
          fill="#4f46e5"
        />
      </svg>
    ),
  },
  {
    title: "Export and apply",
    description: "Download a polished PDF or Word file whenever you're ready to send it.",
    illustration: (
      <svg viewBox="0 0 64 64" className="h-16 w-16">
        <rect x="17" y="6" width="30" height="34" rx="3" fill="#ffffff" stroke="#a5b4fc" strokeWidth="2" />
        <rect x="23" y="13" width="16" height="3" rx="1.5" fill="#e0e7ff" />
        <rect x="23" y="20" width="18" height="2.5" rx="1.25" fill="#c7d2fe" />
        <rect x="23" y="26" width="13" height="2.5" rx="1.25" fill="#c7d2fe" />
        <path
          d="M32 34v14m0 0-5-5m5 5 5-5"
          stroke="#4f46e5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="17" y="52" width="30" height="6" rx="2" fill="#4f46e5" opacity="0.15" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: `${TEMPLATE_COUNT} professional templates`,
    description:
      `Classic, modern, executive, and more — each with real typography and layout, not just a font swap, plus ${COLOR_COUNT} accent color options to match your style. Switch anytime without losing your content.`,
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 4.5h9a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H7.5A1.5 1.5 0 0 1 6 19V7.5L9 4.5Z M9 4.5V7.5a1.5 1.5 0 0 1-1.5 1.5H4.5"
      />
    ),
  },
  {
    title: "AI-powered refinement",
    description:
      "Tell the assistant what to change — “make this punchier,” “tailor it for a backend role” — and review every suggestion side-by-side before it touches your resume.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
      />
    ),
  },
  {
    title: "Import an existing resume",
    description:
      "Upload a PDF or Word document and we'll extract your experience automatically — so you edit and improve instead of starting from a blank page.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    ),
  },
  {
    title: "Export to PDF or Word",
    description:
      "Download a polished, ready-to-send file in either format whenever you're ready — the export matches exactly what you see in the live preview.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 7.5 12 3m0 0 4.5 4.5M12 3v13.5"
      />
    ),
  },
];

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Resume Builder",
  description:
    "Build a free, ATS-friendly resume in minutes. Pick from professional templates, edit with a live preview, and refine your wording with AI.",
  url: "https://www.miresumebuilder.com",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="flex flex-1 flex-col bg-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- static, hardcoded JSON — not user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <header className="flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
            R
          </span>
          <span className="text-lg font-semibold text-zinc-900">Resume Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/build"
            className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            Build Resume
          </Link>
          {session?.user ? (
            <span className="text-sm text-zinc-600">
              Hi {session.user.name?.split(" ")[0] ?? session.user.email?.split("@")[0] ?? "there"}
            </span>
          ) : (
            <Link
              href="/login?callbackUrl=/"
              className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:border-indigo-400 hover:text-indigo-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
          <HeroBackgroundIcons />
        </div>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 sm:py-28 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Build a resume that gets you the interview
            </h1>
            <p className="mt-5 text-lg text-zinc-600">
              Pick a professional template, fill in your experience, and let an AI assistant sharpen
              every word — with every suggestion shown to you before it changes anything. Your resume
              content stays in your browser; sign in only takes a moment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/build"
                className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Start from scratch
              </Link>
              <Link
                href="/upload"
                className="rounded-md border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-indigo-400 hover:text-indigo-700"
              >
                Upload your resume
              </Link>
            </div>
          </div>
          <HeroSlideshow />
        </div>
      </section>

      <section className="bg-gradient-to-b from-indigo-50 via-violet-50 to-white py-16 sm:py-20">
        <div className="mx-auto w-full max-w-5xl px-6">
          <h2 className="text-center text-2xl font-semibold text-zinc-900">How it works</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-indigo-100"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-indigo-50">
                  {step.illustration}
                </div>
                <span className="mt-4 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-zinc-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  {feature.icon}
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900">{feature.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-6 py-8 text-center text-xs text-zinc-400">
        Your resume content lives in your browser, not on our servers — signing in only stores
        your account info, and the only resume content sent elsewhere is what you explicitly ask
        the AI assistant to help with.
      </footer>
    </div>
  );
}
