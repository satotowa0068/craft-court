"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validation";

export async function createCustomer(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    source: formData.get("source"),
  });

  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "入力内容を確認してください。";
    redirect(`/customers/new?error=${encodeURIComponent(message)}`);
  }

  const d = parsed.data;
  const customer = await prisma.customer.create({
    data: {
      name: d.name,
      phone: d.phone || null,
      email: d.email || null,
      source: d.source || null,
    },
  });

  redirect(`/customers/${customer.id}`);
}
