"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { UNIT_STATUS_LABELS, UNIT_STATUS_ORDER } from "@/lib/status";

export function UnitFilterBar({
  projects,
}: {
  projects: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/units?${params.toString()}`);
    });
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <select
        defaultValue={searchParams.get("projectId") ?? ""}
        onChange={(e) => updateParam("projectId", e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
      >
        <option value="">すべてのプロジェクト</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
      >
        <option value="">すべてのステータス</option>
        {UNIT_STATUS_ORDER.map((status) => (
          <option key={status} value={status}>
            {UNIT_STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      <input
        type="search"
        placeholder="区画番号/棟名で検索"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={(e) => updateParam("q", e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
      />
    </div>
  );
}
