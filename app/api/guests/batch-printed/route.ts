import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { db } from "@/lib/db";

// POST /api/guests/batch-printed — mark all guests of a wedding as printed (or unprinted)
export async function POST(req: NextRequest) {
  await connection();
  const body = await req.json().catch(() => null);
  const weddingId = body?.weddingId;
  const printed = body?.printed === 0 ? 0 : 1;

  if (!Number.isInteger(weddingId)) {
    return NextResponse.json(
      { error: "weddingId is required" },
      { status: 400 }
    );
  }

  const result = db
    .prepare("UPDATE guests SET printed = ? WHERE wedding_id = ?")
    .run(printed, weddingId);

  return NextResponse.json({ updated: result.changes });
}