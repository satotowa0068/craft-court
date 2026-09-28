"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { unitSchema } from "@/lib/validation";

function parseUnitForm(formData: FormData) {
  return unitSchema.safeParse({
    projectId: formData.get("projectId"),
    unitNumber: formData.get("unitNumber"),
    status: formData.get("status"),
    price: formData.get("price") || null,
    landAreaSqm: formData.get("landAreaSqm") || null,
    floorAreaSqm: formData.get("floorAreaSqm") || null,
    layout: formData.get("layout"),
    structure: formData.get("structure"),
    completionDate: formData.get("completionDate"),
    notes: formData.get("notes"),
  });
}

export async function createUnit(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = parseUnitForm(formData);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "入力内容を確認してください。";
    redirect(
      `/units/new?projectId=${formData.get("projectId")}&error=${encodeURIComponent(message)}`,
    );
  }

  const d = parsed.data;
  const unit = await prisma.unit.create({
    data: {
      projectId: d.projectId,
      unitNumber: d.unitNumber,
      status: d.status,
      price: d.price ?? null,
      landAreaSqm: d.landAreaSqm ?? null,
      floorAreaSqm: d.floorAreaSqm ?? null,
      layout: d.layout || null,
      structure: d.structure || null,
      completionDate: d.completionDate ? new Date(d.completionDate) : null,
      notes: d.notes || null,
    },
  });

  redirect(`/units/${unit.id}`);
}

export async function updateUnit(unitId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = parseUnitForm(formData);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "入力内容を確認してください。";
    redirect(`/units/${unitId}/edit?error=${encodeURIComponent(message)}`);
  }

  const d = parsed.data;
  await prisma.unit.update({
    where: { id: unitId },
    data: {
      projectId: d.projectId,
      unitNumber: d.unitNumber,
      status: d.status,
      price: d.price ?? null,
      landAreaSqm: d.landAreaSqm ?? null,
      floorAreaSqm: d.floorAreaSqm ?? null,
      layout: d.layout || null,
      structure: d.structure || null,
      completionDate: d.completionDate ? new Date(d.completionDate) : null,
      notes: d.notes || null,
    },
  });

  redirect(`/units/${unitId}`);
}
