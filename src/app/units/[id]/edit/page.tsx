import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateUnit } from "@/app/units/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { UnitForm } from "@/components/units/UnitForm";

export default async function EditUnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const [unit, projects] = await Promise.all([
    prisma.unit.findUnique({ where: { id } }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!unit) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PageHeader title={`${unit.unitNumber} を編集`} />
      <UnitForm
        action={updateUnit.bind(null, unit.id)}
        projects={projects}
        defaultValues={unit}
        error={error}
        submitLabel="更新"
      />
    </div>
  );
}
