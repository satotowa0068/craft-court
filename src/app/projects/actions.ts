"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validation";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    location: formData.get("location"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "入力内容を確認してください。";
    redirect(`/projects/new?error=${encodeURIComponent(message)}`);
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      location: parsed.data.location || null,
      description: parsed.data.description || null,
    },
  });

  redirect(`/projects/${project.id}`);
}
