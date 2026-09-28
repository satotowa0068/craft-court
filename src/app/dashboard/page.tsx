import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { StatusPieChart } from "@/components/dashboard/StatusPieChart";
import { ProjectProgressBar } from "@/components/dashboard/ProjectProgressBar";
import type { UnitStatus } from "@/generated/prisma/enums";

export default async function DashboardPage() {
  const [statusGroups, projects] = await Promise.all([
    prisma.unit.groupBy({ by: ["status"], _count: true }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      include: { units: { select: { status: true } } },
    }),
  ]);

  const statusData = statusGroups.map((g) => ({
    status: g.status,
    count: g._count,
  }));

  const total = statusData.reduce((sum, d) => sum + d.count, 0);
  const countFor = (status: UnitStatus) =>
    statusData.find((d) => d.status === status)?.count ?? 0;

  const contracted = countFor("CONTRACTED") + countFor("DELIVERED");
  const inProgress = countFor("NEGOTIATING") + countFor("APPLIED");
  const available = countFor("AVAILABLE");
  const contractRate = total > 0 ? ((contracted / total) * 100).toFixed(0) : "0";

  const projectProgress = projects.map((p) => {
    const counts: Partial<Record<UnitStatus, number>> = {};
    for (const u of p.units) {
      counts[u.status] = (counts[u.status] ?? 0) + 1;
    }
    return { id: p.id, name: p.name, counts };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title="販売状況ダッシュボード"
        description="全プロジェクトの区画/棟の販売進捗を確認できます"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="総区画数" value={`${total}件`} />
        <KpiCard
          label="成約率"
          value={`${contractRate}%`}
          sub={`契約済+引渡済 ${contracted}件`}
        />
        <KpiCard label="商談中・申込" value={`${inProgress}件`} />
        <KpiCard label="販売中(未成約)" value={`${available}件`} />
      </div>

      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          全体のステータス内訳
        </h2>
        <StatusPieChart data={statusData} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-slate-900">
          プロジェクト別進捗
        </h2>
        {projectProgress.length === 0 ? (
          <p className="text-sm text-slate-500">
            プロジェクトがまだありません。
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {projectProgress.map((p) => (
              <ProjectProgressBar key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
