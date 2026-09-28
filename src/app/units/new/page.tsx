import { prisma } from "@/lib/prisma";
import { createUnit } from "@/app/units/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { UnitForm } from "@/components/units/UnitForm";

export default async function NewUnitPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; error?: string }>;
}) {
  const { projectId, error } = await searchParams;

  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PageHeader title="新規物件" />
      <UnitForm
        action={createUnit}
        projects={projects}
        defaultValues={projectId ? { projectId } : undefined}
        error={error}
        submitLabel="作成"
      />
    </div>
  );
}
