import { z } from "zod";
import { UnitStatus } from "@/generated/prisma/enums";

export const projectSchema = z.object({
  name: z.string().trim().min(1, "プロジェクト名は必須です"),
  location: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
});

export const unitStatusValues = Object.values(UnitStatus) as [
  UnitStatus,
  ...UnitStatus[],
];

export const unitSchema = z.object({
  projectId: z.string().trim().min(1, "プロジェクトを選択してください"),
  unitNumber: z.string().trim().min(1, "区画番号/棟名は必須です"),
  status: z.enum(unitStatusValues),
  price: z.coerce.number().int().nonnegative().nullable().optional(),
  landAreaSqm: z.coerce.number().nonnegative().nullable().optional(),
  floorAreaSqm: z.coerce.number().nonnegative().nullable().optional(),
  layout: z.string().trim().optional().or(z.literal("")),
  structure: z.string().trim().optional().or(z.literal("")),
  completionDate: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
});

export const customerSchema = z.object({
  name: z.string().trim().min(1, "顧客名は必須です"),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("メール形式が正しくありません").optional().or(z.literal("")),
  source: z.string().trim().optional().or(z.literal("")),
});

export const interactionSchema = z.object({
  unitId: z.string().trim().min(1),
  customerId: z.string().trim().min(1, "顧客を選択してください"),
  type: z.string().trim().min(1, "種別は必須です"),
  occurredAt: z.string().trim().min(1, "日時は必須です"),
  notes: z.string().trim().optional().or(z.literal("")),
});
