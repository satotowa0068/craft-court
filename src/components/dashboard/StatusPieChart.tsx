"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { UnitStatus } from "@/generated/prisma/enums";
import {
  UNIT_STATUS_CHART_COLORS,
  UNIT_STATUS_LABELS,
  UNIT_STATUS_ORDER,
} from "@/lib/status";

export type StatusCount = { status: UnitStatus; count: number };

export function StatusPieChart({ data }: { data: StatusCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const ordered = UNIT_STATUS_ORDER.map(
    (status) => data.find((d) => d.status === status) ?? { status, count: 0 },
  ).filter((d) => d.count > 0);

  if (total === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        データがありません。
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-56 w-full sm:w-56 sm:flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={ordered}
              dataKey="count"
              nameKey="status"
              innerRadius="55%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="#fcfcfb"
              strokeWidth={2}
            >
              {ordered.map((d) => (
                <Cell
                  key={d.status}
                  fill={UNIT_STATUS_CHART_COLORS[d.status]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, entry) => {
                const status = entry.payload?.status as UnitStatus;
                return [`${value}件`, UNIT_STATUS_LABELS[status]];
              }}
              contentStyle={{
                fontSize: 13,
                borderRadius: 6,
                border: "1px solid #e1e0d9",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="flex flex-1 flex-col gap-1.5 text-sm">
        {ordered.map((d) => (
          <li key={d.status} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: UNIT_STATUS_CHART_COLORS[d.status] }}
                aria-hidden
              />
              {UNIT_STATUS_LABELS[d.status]}
            </span>
            <span className="tabular-nums text-slate-500">
              {d.count}件 ({((d.count / total) * 100).toFixed(0)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
