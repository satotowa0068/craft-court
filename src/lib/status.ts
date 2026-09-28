import { UnitStatus } from "@/generated/prisma/enums";

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  UNPUBLISHED: "未公開",
  AVAILABLE: "未販売",
  NEGOTIATING: "商談中",
  APPLIED: "申込",
  CONTRACTED: "契約済",
  DELIVERED: "引渡済",
};

export const UNIT_STATUS_ORDER: UnitStatus[] = [
  "UNPUBLISHED",
  "AVAILABLE",
  "NEGOTIATING",
  "APPLIED",
  "CONTRACTED",
  "DELIVERED",
];

export const UNIT_STATUS_BADGE_CLASSES: Record<UnitStatus, string> = {
  UNPUBLISHED: "bg-slate-100 text-slate-600",
  AVAILABLE: "bg-sky-100 text-sky-700",
  NEGOTIATING: "bg-amber-100 text-amber-700",
  APPLIED: "bg-orange-100 text-orange-700",
  CONTRACTED: "bg-emerald-100 text-emerald-700",
  DELIVERED: "bg-slate-200 text-slate-700",
};

// Ordinal single-hue ramp (light -> dark = further along the sales funnel).
// UNPUBLISHED sits outside the funnel (not yet listed), so it gets a neutral
// gray instead of the lightest ramp step. Validated with dataviz's
// scripts/validate_palette.js --ordinal (light mode; this app is light-only).
export const UNIT_STATUS_CHART_COLORS: Record<UnitStatus, string> = {
  UNPUBLISHED: "#898781",
  AVAILABLE: "#86b6ef",
  NEGOTIATING: "#5598e7",
  APPLIED: "#2a78d6",
  CONTRACTED: "#1c5cab",
  DELIVERED: "#104281",
};

export function formatPrice(price: number | null): string {
  if (price == null) return "未定";
  return `${(price / 10000).toLocaleString("ja-JP")}万円`;
}

export function formatArea(area: number | null): string {
  if (area == null) return "-";
  return `${area.toLocaleString("ja-JP")}㎡`;
}
