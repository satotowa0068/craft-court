import type { UnitStatus } from "@/generated/prisma/enums";
import { UNIT_STATUS_BADGE_CLASSES, UNIT_STATUS_LABELS } from "@/lib/status";

export function StatusBadge({ status }: { status: UnitStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${UNIT_STATUS_BADGE_CLASSES[status]}`}
    >
      {UNIT_STATUS_LABELS[status]}
    </span>
  );
}
