import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

// Best-effort — a tracking failure should never break the actual download.
export async function trackDownload(): Promise<void> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return;
    await prisma.user.update({
      where: { id: userId },
      data: { downloadCount: { increment: 1 } },
    });
  } catch (err) {
    console.error("Failed to record download count:", err);
  }
}
