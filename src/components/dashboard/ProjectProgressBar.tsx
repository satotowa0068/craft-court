import Link from "next/link";
import type { UnitStatus } from "@/generated/prisma/enums";
import {
  UNIT_STATUS_CHART_COLORS,
  UNIT_STATUS_LABELS,
  UNIT_STATUS_ORDER,
} from "@/lib/status";

export type ProjectProgress = {
  id: string;
  name: string;
  counts: Partial<Record<UnitStatus, number>>;
};

export function ProjectProgressBar({ project }: { project: ProjectProgress }) {
  const total = UNIT_STATUS_ORDER.reduce(
    (sum, s) => sum + (project.counts[s] ?? 0),
    0,
  );

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm font-medium text-slate-900 hover:underline"
        >
          {project.name}
        </Link>
        <span className="text-xs text-slate-500">総区画数 {total}</span>
      </div>
      {total === 0 ? (
        <div className="h-3 rounded-full bg-slate-100" />
      ) : (
        <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
          {UNIT_STATUS_ORDER.map((status) => {
            const count = project.counts[status] ?? 0;
            if (count === 0) return null;
            return (
              <div
                key={status}
                title={`${UNIT_STATUS_LABELS[status]}: ${count}件`}
                style={{
                  width: `${(count / total) * 100}%`,
                  backgroundColor: UNIT_STATUS_CHART_COLORS[status],
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
