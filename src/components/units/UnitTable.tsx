import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatArea, formatPrice } from "@/lib/status";
import type { UnitStatus } from "@/generated/prisma/enums";

export type UnitRow = {
  id: string;
  unitNumber: string;
  status: UnitStatus;
  price: number | null;
  landAreaSqm: number | null;
  floorAreaSqm: number | null;
  layout: string | null;
  project: { id: string; name: string };
};

export function UnitTable({
  units,
  showProject = true,
}: {
  units: UnitRow[];
  showProject?: boolean;
}) {
  if (units.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        該当する区画/棟がありません。
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
          <tr>
            <th className="px-4 py-2 font-medium">区画/棟</th>
            {showProject && <th className="px-4 py-2 font-medium">プロジェクト</th>}
            <th className="px-4 py-2 font-medium">ステータス</th>
            <th className="px-4 py-2 font-medium">価格</th>
            <th className="px-4 py-2 font-medium">土地面積</th>
            <th className="px-4 py-2 font-medium">延床面積</th>
            <th className="px-4 py-2 font-medium">間取り</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {units.map((unit) => (
            <tr key={unit.id} className="hover:bg-slate-50">
              <td className="px-4 py-2.5">
                <Link
                  href={`/units/${unit.id}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {unit.unitNumber}
                </Link>
              </td>
              {showProject && (
                <td className="px-4 py-2.5 text-slate-600">
                  {unit.project.name}
                </td>
              )}
              <td className="px-4 py-2.5">
                <StatusBadge status={unit.status} />
              </td>
              <td className="px-4 py-2.5 text-slate-600">
                {formatPrice(unit.price)}
              </td>
              <td className="px-4 py-2.5 text-slate-600">
                {formatArea(unit.landAreaSqm)}
              </td>
              <td className="px-4 py-2.5 text-slate-600">
                {formatArea(unit.floorAreaSqm)}
              </td>
              <td className="px-4 py-2.5 text-slate-600">
                {unit.layout ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
