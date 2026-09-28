import Link from "next/link";

export type InteractionRow = {
  id: string;
  type: string;
  occurredAt: Date;
  notes: string | null;
  customer: { id: string; name: string };
  staff: { id: string; name: string };
  unit?: { id: string; unitNumber: string; project: { name: string } };
};

export function InteractionTimeline({
  interactions,
  showUnit = false,
}: {
  interactions: InteractionRow[];
  showUnit?: boolean;
}) {
  if (interactions.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        商談・問い合わせ履歴はまだありません。
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {interactions.map((item) => (
        <li
          key={item.id}
          className="rounded-md border border-slate-200 bg-white p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {item.type}
              </span>
              <span className="text-sm text-slate-500">
                {item.occurredAt.toLocaleString("ja-JP", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              担当: {item.staff.name}
            </span>
          </div>
          <div className="mt-2 text-sm text-slate-700">
            <Link
              href={`/customers/${item.customer.id}`}
              className="font-medium hover:underline"
            >
              {item.customer.name}
            </Link>
            {showUnit && item.unit && (
              <>
                {" "}
                ―{" "}
                <Link
                  href={`/units/${item.unit.id}`}
                  className="hover:underline"
                >
                  {item.unit.project.name} {item.unit.unitNumber}
                </Link>
              </>
            )}
          </div>
          {item.notes && (
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
              {item.notes}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
