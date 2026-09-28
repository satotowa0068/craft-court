import { createCustomer } from "@/app/customers/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormError } from "@/components/ui/FormError";

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <PageHeader title="新規顧客" />
      <form action={createCustomer} className="flex flex-col gap-4">
        <FormError message={error} />
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            氏名 *
          </label>
          <input
            id="name"
            name="name"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            電話番号
          </label>
          <input
            id="phone"
            name="phone"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="source"
            className="text-sm font-medium text-slate-700"
          >
            反響元
          </label>
          <input
            id="source"
            name="source"
            placeholder="例: Web広告、チラシ、紹介"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          作成
        </button>
      </form>
    </div>
  );
}
