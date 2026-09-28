"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { interactionSchema } from "@/lib/validation";

export async function createInteraction(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const unitId = formData.get("unitId") as string;

  const parsed = interactionSchema.safeParse({
    unitId,
    customerId: formData.get("customerId"),
    type: formData.get("type"),
    occurredAt: formData.get("occurredAt"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "入力内容を確認してください。";
    redirect(`/units/${unitId}?error=${encodeURIComponent(message)}`);
  }

  const d = parsed.data;
  await prisma.interaction.create({
    data: {
      unitId: d.unitId,
      customerId: d.customerId,
      staffId: session.user.id,
      type: d.type,
      occurredAt: new Date(d.occurredAt),
      notes: d.notes || null,
    },
  });

  redirect(`/units/${unitId}`);
}
