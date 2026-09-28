import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { UnitFilterBar } from "@/components/units/UnitFilterBar";
import { UnitTable } from "@/components/units/UnitTable";
import { unitStatusValues } from "@/lib/validation";
import type { UnitStatus } from "@/generated/prisma/enums";

export default async function UnitsPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; status?: string; q?: string }>;
}) {
  const { projectId, status, q } = await searchParams;

  const isValidStatus = (
    value: string | undefined,
  ): value is UnitStatus =>
    !!value && (unitStatusValues as readonly string[]).includes(value);

  const [projects, units] = await Promise.all([
    prisma.project.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.unit.findMany({
      where: {
        projectId: projectId || undefined,
        status: isValidStatus(status) ? status : undefined,
        unitNumber: q ? { contains: q } : undefined,
      },
      orderBy: [{ projectId: "asc" }, { unitNumber: "asc" }],
      include: { project: { select: { id: true, name: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title="物件一覧"
        description="区画/棟ごとの販売ステータスを一覧管理します"
        action={
          <Link
            href="/units/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + 新規物件
          </Link>
        }
      />
      <UnitFilterBar projects={projects} />
      <UnitTable units={units} />
    </div>
  );
}
