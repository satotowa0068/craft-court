import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { InteractionTimeline } from "@/components/customers/InteractionTimeline";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      interactions: {
        orderBy: { occurredAt: "desc" },
        include: {
          customer: { select: { id: true, name: true } },
          staff: { select: { id: true, name: true } },
          unit: {
            select: {
              id: true,
              unitNumber: true,
              project: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!customer) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader title={customer.name} />

      <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 bg-white p-5 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">電話番号</dt>
          <dd className="mt-0.5 font-medium text-slate-900">
            {customer.phone ?? "-"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">メールアドレス</dt>
          <dd className="mt-0.5 font-medium text-slate-900">
            {customer.email ?? "-"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">反響元</dt>
          <dd className="mt-0.5 font-medium text-slate-900">
            {customer.source ?? "-"}
          </dd>
        </div>
      </div>

      <h2 className="mb-3 text-base font-semibold text-slate-900">
        商談・問い合わせ履歴
      </h2>
      <InteractionTimeline interactions={customer.interactions} showUnit />
    </div>
  );
}
