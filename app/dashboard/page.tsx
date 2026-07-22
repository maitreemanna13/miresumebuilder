import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { isAdminEmail } from "@/lib/auth/isAdminEmail";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  if (!isAdminEmail(session.user.email)) {
    redirect("/build");
  }

  const users = await prisma.user.findMany({
    orderBy: { visitCount: "desc" },
    select: { id: true, name: true, email: true, visitCount: true, downloadCount: true },
  });

  const totalUsers = users.length;
  const totalVisits = users.reduce((sum, u) => sum + u.visitCount, 0);
  const totalDownloads = users.reduce((sum, u) => sum + u.downloadCount, 0);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500">Visit and download activity, per user.</p>
        </div>
        <Link href="/build" className="text-sm text-indigo-600 hover:text-indigo-700">
          Back to builder
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total users" value={totalUsers} />
        <StatCard label="Total visits" value={totalVisits} />
        <StatCard label="Total downloads" value={totalDownloads} />
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Visits</th>
              <th className="px-4 py-2">Downloads</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">
                  <div className="font-medium text-zinc-900">{user.name ?? "—"}</div>
                  <div className="text-xs text-zinc-500">{user.email}</div>
                </td>
                <td className="px-4 py-2 text-zinc-700">{user.visitCount}</td>
                <td className="px-4 py-2 text-zinc-700">{user.downloadCount}</td>
              </tr>
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-zinc-400">
                  No users yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <div className="text-2xl font-semibold text-zinc-900">{value}</div>
      <div className="text-sm text-zinc-500">{label}</div>
    </div>
  );
}
