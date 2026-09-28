import { FormError } from "@/components/ui/FormError";
import { UNIT_STATUS_LABELS, UNIT_STATUS_ORDER } from "@/lib/status";
import type { UnitStatus } from "@/generated/prisma/enums";

export type UnitFormValues = {
  projectId: string;
  unitNumber: string;
  status: UnitStatus;
  price: number | null;
  landAreaSqm: number | null;
  floorAreaSqm: number | null;
  layout: string | null;
  structure: string | null;
  completionDate: Date | null;
  notes: string | null;
};

export function UnitForm({
  action,
  projects,
  defaultValues,
  error,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  projects: { id: string; name: string }[];
  defaultValues?: Partial<UnitFormValues>;
  error?: string;
  submitLabel: string;
}) {
  const completionDateValue = defaultValues?.completionDate
    ? defaultValues.completionDate.toISOString().slice(0, 10)
    : "";

  return (
    <form action={action} className="flex flex-col gap-4">
      <FormError message={error} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="projectId"
            className="text-sm font-medium text-slate-700"
          >
            プロジェクト *
          </label>
          <select
            id="projectId"
            name="projectId"
            required
            defaultValue={defaultValues?.projectId ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              選択してください
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="unitNumber"
            className="text-sm font-medium text-slate-700"
          >
            区画番号/棟名 *
          </label>
          <input
            id="unitNumber"
            name="unitNumber"
            required
            defaultValue={defaultValues?.unitNumber ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="status"
            className="text-sm font-medium text-slate-700"
          >
            ステータス *
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue={defaultValues?.status ?? "UNPUBLISHED"}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {UNIT_STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {UNIT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="text-sm font-medium text-slate-700">
            価格(円)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            defaultValue={defaultValues?.price ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="landAreaSqm"
            className="text-sm font-medium text-slate-700"
          >
            土地面積(㎡)
          </label>
          <input
            id="landAreaSqm"
            name="landAreaSqm"
            type="number"
            step="0.01"
            min={0}
            defaultValue={defaultValues?.landAreaSqm ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="floorAreaSqm"
            className="text-sm font-medium text-slate-700"
          >
            延床面積(㎡)
          </label>
          <input
            id="floorAreaSqm"
            name="floorAreaSqm"
            type="number"
            step="0.01"
            min={0}
            defaultValue={defaultValues?.floorAreaSqm ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="layout" className="text-sm font-medium text-slate-700">
            間取り
          </label>
          <input
            id="layout"
            name="layout"
            placeholder="例: 4LDK"
            defaultValue={defaultValues?.layout ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="structure"
            className="text-sm font-medium text-slate-700"
          >
            構造
          </label>
          <input
            id="structure"
            name="structure"
            placeholder="例: 木造2階建"
            defaultValue={defaultValues?.structure ?? ""}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="completionDate"
            className="text-sm font-medium text-slate-700"
          >
            完成予定日
          </label>
          <input
            id="completionDate"
            name="completionDate"
            type="date"
            defaultValue={completionDateValue}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-slate-700">
          備考
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaultValues?.notes ?? ""}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
