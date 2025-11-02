import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.callLog.findMany({ orderBy: { createdAt: "desc" }, take: 1000 });
  const header = ["id","createdAt","phone","strategy","status","rawResult"].join(",");
  const rows = items.map(i => [i.id, i.createdAt.toISOString(), i.phone, i.strategy, i.status, JSON.stringify(i.rawResult ?? {})].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [header, ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=call-history.csv`
    }
  });
}
