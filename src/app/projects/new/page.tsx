import { createProject } from "@/app/projects/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormError } from "@/components/ui/FormError";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <PageHeader title="新規プロジェクト" />
      <form action={createProject} className="flex flex-col gap-4">
        <FormError message={error} />
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            プロジェクト名 *
          </label>
          <input
            id="name"
            name="name"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="location"
            className="text-sm font-medium text-slate-700"
          >
            所在地
          </label>
          <input
            id="location"
            name="location"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700"
          >
            概要
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
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
