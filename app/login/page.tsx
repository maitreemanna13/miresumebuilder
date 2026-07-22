"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.28a12 12 0 0 0 0 10.73l3.99-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.63l3.99 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function LoginPageInner() {
  const callbackUrl = useSearchParams().get("callbackUrl") || "/build";
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  async function handleSignIn(provider: "google" | "github") {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl });
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-6">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
              R
            </span>
            <span className="text-lg font-semibold text-zinc-900">Resume Builder</span>
          </Link>
          <h1 className="text-xl font-semibold text-zinc-900">Sign in to continue</h1>
          <p className="mt-1 text-sm text-zinc-500">
            An account keeps your session going and lets us keep the builder free to use.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleSignIn("google")}
            disabled={loadingProvider !== null}
            className="flex items-center justify-center gap-3 rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-indigo-400 hover:text-indigo-700 disabled:opacity-50"
          >
            <GoogleIcon />
            {loadingProvider === "google" ? "Redirecting…" : "Continue with Google"}
          </button>
          <button
            type="button"
            onClick={() => handleSignIn("github")}
            disabled={loadingProvider !== null}
            className="flex items-center justify-center gap-3 rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:border-indigo-400 hover:text-indigo-700 disabled:opacity-50"
          >
            <GitHubIcon />
            {loadingProvider === "github" ? "Redirecting…" : "Continue with GitHub"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Loading…</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
