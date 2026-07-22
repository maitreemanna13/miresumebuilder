"use client";

import { useSession, signOut } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-2 border-l border-zinc-200 pl-3">
      <span className="max-w-[10rem] truncate text-sm text-zinc-500">
        {session.user.name ?? session.user.email}
      </span>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-zinc-500 hover:text-indigo-700"
      >
        Sign out
      </button>
    </div>
  );
}
