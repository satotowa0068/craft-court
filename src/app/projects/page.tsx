import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { UNIT_STATUS_LABELS, UNIT_STATUS_ORDER } from "@/lib/status";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: { units: { select: { status: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title="分譲プロジェクト"
        description="プロジェクトごとの区画/棟を管理します"
        action={
          <Link
            href="/projects/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + 新規プロジェクト
          </Link>
        }
      />

      {projects.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          プロジェクトがまだありません。「新規プロジェクト」から作成してください。
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const counts = UNIT_STATUS_ORDER.map((status) => ({
              status,
              count: project.units.filter((u) => u.status === status).length,
            })).filter((c) => c.count > 0);

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
              >
                <h2 className="font-semibold text-slate-900">
                  {project.name}
                </h2>
                {project.location && (
                  <p className="mt-1 text-sm text-slate-500">
                    {project.location}
                  </p>
                )}
                <p className="mt-3 text-sm text-slate-600">
                  総区画数: {project.units.length}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                  {counts.map((c) => (
                    <span key={c.status}>
                      {UNIT_STATUS_LABELS[c.status]}: {c.count}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
