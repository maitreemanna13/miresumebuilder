import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google, GitHub],
  callbacks: {
    authorized: async ({ auth }) => !!auth,
    // With the Prisma adapter, sessions are database-backed rather than
    // JWTs — session.user only carries the adapter's default fields
    // (id/name/email/image) unless explicitly forwarded here.
    session: async ({ session, user }) => {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  events: {
    // Fires on every successful sign-in (first-time and returning) — a
    // cleaner "visited" signal than counting every page load.
    signIn: async ({ user }) => {
      if (!user.id) return;
      await prisma.user.update({
        where: { id: user.id },
        data: { visitCount: { increment: 1 } },
      });
    },
  },
});
