import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q } },
            { phone: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { interactions: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        title="顧客一覧"
        action={
          <Link
            href="/customers/new"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            + 新規顧客
          </Link>
        }
      />

      <form className="mb-4">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="名前・電話番号・メールで検索"
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </form>

      {customers.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          該当する顧客がいません。
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">氏名</th>
                <th className="px-4 py-2 font-medium">電話番号</th>
                <th className="px-4 py-2 font-medium">メール</th>
                <th className="px-4 py-2 font-medium">反響元</th>
                <th className="px-4 py-2 font-medium">履歴件数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/customers/${c.id}`}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {c.phone ?? "-"}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {c.email ?? "-"}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {c.source ?? "-"}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {c._count.interactions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
