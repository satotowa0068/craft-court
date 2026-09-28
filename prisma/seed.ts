import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { UnitStatus } from "../src/generated/prisma/enums";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const staff = await prisma.user.upsert({
    where: { email: "t.sato.towa@gmail.com" },
    update: {},
    create: {
      email: "t.sato.towa@gmail.com",
      name: "佐藤 十和",
      passwordHash,
    },
  });

  const colleague = await prisma.user.upsert({
    where: { email: "staff2@example.com" },
    update: {},
    create: {
      email: "staff2@example.com",
      name: "鈴木 花子",
      passwordHash,
    },
  });

  const project = await prisma.project.create({
    data: {
      name: "グリーンヒルズ本町",
      location: "埼玉県川口市本町1丁目",
      description: "全12区画の分譲住宅プロジェクト",
    },
  });

  const unitsData = [
    { unitNumber: "1号棟", status: UnitStatus.DELIVERED, price: 42800000, landAreaSqm: 132.5, floorAreaSqm: 98.2, layout: "4LDK", structure: "木造2階建" },
    { unitNumber: "2号棟", status: UnitStatus.CONTRACTED, price: 43500000, landAreaSqm: 130.1, floorAreaSqm: 98.2, layout: "4LDK", structure: "木造2階建" },
    { unitNumber: "3号棟", status: UnitStatus.CONTRACTED, price: 41900000, landAreaSqm: 128.8, floorAreaSqm: 95.6, layout: "4LDK", structure: "木造2階建" },
    { unitNumber: "4号棟", status: UnitStatus.APPLIED, price: 44200000, landAreaSqm: 135.0, floorAreaSqm: 101.3, layout: "5LDK", structure: "木造2階建" },
    { unitNumber: "5号棟", status: UnitStatus.NEGOTIATING, price: 43900000, landAreaSqm: 133.7, floorAreaSqm: 99.0, layout: "4LDK", structure: "木造2階建" },
    { unitNumber: "6号棟", status: UnitStatus.NEGOTIATING, price: 42300000, landAreaSqm: 129.4, floorAreaSqm: 96.8, layout: "4LDK", structure: "木造2階建" },
    { unitNumber: "7号棟", status: UnitStatus.AVAILABLE, price: 44800000, landAreaSqm: 136.2, floorAreaSqm: 102.5, layout: "5LDK", structure: "木造2階建" },
    { unitNumber: "8号棟", status: UnitStatus.AVAILABLE, price: 43100000, landAreaSqm: 131.0, floorAreaSqm: 97.4, layout: "4LDK", structure: "木造2階建" },
    { unitNumber: "9号棟", status: UnitStatus.UNPUBLISHED, price: null, landAreaSqm: 134.5, floorAreaSqm: 100.1, layout: "4LDK", structure: "木造2階建" },
  ];

  const units: Awaited<ReturnType<typeof prisma.unit.create>>[] = [];
  for (const u of unitsData) {
    units.push(await prisma.unit.create({ data: { ...u, projectId: project.id } }));
  }

  const customersData = [
    { name: "山田 太郎", phone: "090-1234-5678", email: "yamada@example.com", source: "Web広告" },
    { name: "田中 美咲", phone: "080-2345-6789", email: "tanaka@example.com", source: "チラシ" },
    { name: "伊藤 健一", phone: "070-3456-7890", email: "ito@example.com", source: "紹介" },
  ];

  const customers = [];
  for (const c of customersData) {
    customers.push(await prisma.customer.create({ data: c }));
  }

  const findUnit = (n: string) => units.find((u) => u.unitNumber === n)!;

  await prisma.interaction.createMany({
    data: [
      {
        unitId: findUnit("5号棟").id,
        customerId: customers[0].id,
        staffId: staff.id,
        type: "内見",
        occurredAt: new Date("2026-09-10T10:00:00+09:00"),
        notes: "来場後、間取りとローンについて相談あり。",
      },
      {
        unitId: findUnit("5号棟").id,
        customerId: customers[0].id,
        staffId: staff.id,
        type: "商談",
        occurredAt: new Date("2026-09-18T14:00:00+09:00"),
        notes: "値引き交渉あり。上長確認中。",
      },
      {
        unitId: findUnit("6号棟").id,
        customerId: customers[1].id,
        staffId: colleague.id,
        type: "問合せ",
        occurredAt: new Date("2026-09-15T11:30:00+09:00"),
        notes: "電話にて資料請求。来週末に現地案内予定。",
      },
      {
        unitId: findUnit("4号棟").id,
        customerId: customers[2].id,
        staffId: staff.id,
        type: "申込",
        occurredAt: new Date("2026-09-20T09:00:00+09:00"),
        notes: "住宅ローン事前審査通過、申込書受領済み。",
      },
      {
        unitId: findUnit("2号棟").id,
        customerId: customers[2].id,
        staffId: colleague.id,
        type: "契約",
        occurredAt: new Date("2026-08-05T13:00:00+09:00"),
        notes: "本契約締結。引渡し予定2026年12月。",
      },
    ],
  });

  console.log("Seed completed:", {
    staff: [staff.email, colleague.email],
    project: project.name,
    units: units.length,
    customers: customers.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
