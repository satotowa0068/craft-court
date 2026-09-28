import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InteractionTimeline } from "@/components/customers/InteractionTimeline";
import { InteractionLogForm } from "@/components/customers/InteractionLogForm";
import { FormError } from "@/components/ui/FormError";
import { formatArea, formatPrice } from "@/lib/status";

export default async function UnitDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const [unit, customers] = await Promise.all([
    prisma.unit.findUnique({
      where: { id },
      include: {
        project: true,
        interactions: {
          orderBy: { occurredAt: "desc" },
          include: {
            customer: { select: { id: true, name: true } },
            staff: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.customer.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!unit) notFound();

  const fields: { label: string; value: string }[] = [
    { label: "プロジェクト", value: unit.project.name },
    { label: "価格", value: formatPrice(unit.price) },
    { label: "土地面積", value: formatArea(unit.landAreaSqm) },
    { label: "延床面積", value: formatArea(unit.floorAreaSqm) },
    { label: "間取り", value: unit.layout ?? "-" },
    { label: "構造", value: unit.structure ?? "-" },
    {
      label: "完成予定日",
      value: unit.completionDate
        ? unit.completionDate.toLocaleDateString("ja-JP")
        : "-",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        title={unit.unitNumber}
        action={
          <Link
            href={`/units/${unit.id}/edit`}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            編集
          </Link>
        }
      />

      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-3">
          <StatusBadge status={unit.status} />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          {fields.map((f) => (
            <div key={f.label}>
              <dt className="text-slate-500">{f.label}</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{f.value}</dd>
            </div>
          ))}
        </dl>
        {unit.notes && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <dt className="text-sm text-slate-500">備考</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
              {unit.notes}
            </dd>
          </div>
        )}
      </div>

      <h2 className="mb-3 text-base font-semibold text-slate-900">
        商談・問い合わせ履歴
      </h2>
      <div className="mb-4">
        <FormError message={error} />
      </div>
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
        <InteractionLogForm unitId={unit.id} customers={customers} />
      </div>
      <InteractionTimeline interactions={unit.interactions} />
    </div>
  );
}
