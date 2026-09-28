import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { UnitTable } from "@/components/units/UnitTable";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      units: {
        orderBy: { unitNumber: "asc" },
        include: { project: { select: { id: true, name: true } } },
      },
    },
  });

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title={project.name}
        description={project.location ?? undefined}
        action={
          <Link
            href={`/units/new?projectId=${project.id}`}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + 区画/棟を追加
          </Link>
        }
      />
      {project.description && (
        <p className="mb-6 text-sm text-slate-600">{project.description}</p>
      )}
      <UnitTable units={project.units} showProject={false} />
    </div>
  );
}
