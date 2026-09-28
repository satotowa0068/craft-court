import Link from "next/link";
import { createInteraction } from "@/app/interactions/actions";

const INTERACTION_TYPES = ["問合せ", "内見", "商談", "申込", "契約"];

export function InteractionLogForm({
  unitId,
  customers,
}: {
  unitId: string;
  customers: { id: string; name: string }[];
}) {
  if (customers.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        顧客が登録されていません。先に
        <Link href="/customers/new" className="mx-1 underline">
          顧客を登録
        </Link>
        してください。
      </p>
    );
  }

  const now = new Date();
  const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <form action={createInteraction} className="flex flex-col gap-3">
      <input type="hidden" name="unitId" value={unitId} />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="customerId"
            className="text-sm font-medium text-slate-700"
          >
            顧客 *
          </label>
          <select
            id="customerId"
            name="customerId"
            required
            defaultValue=""
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              選択してください
            </option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="text-sm font-medium text-slate-700">
            種別 *
          </label>
          <select
            id="type"
            name="type"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {INTERACTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="occurredAt"
            className="text-sm font-medium text-slate-700"
          >
            日時 *
          </label>
          <input
            id="occurredAt"
            name="occurredAt"
            type="datetime-local"
            required
            defaultValue={localDatetime}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700">
          メモ
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        履歴を登録
      </button>
    </form>
  );
}
