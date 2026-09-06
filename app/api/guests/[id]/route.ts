import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/guests/[id]  — update a guest's printed status
export async function PATCH(
  _req: NextRequest,
  ctx: RouteContext<"/api/guests/[id]">
) {
  await connection();
  const { id } = await ctx.params;
  const guestId = parseInt(id, 10);
  if (Number.isNaN(guestId)) {
    return NextResponse.json({ error: "Invalid guest id" }, { status: 400 });
  }

  const body = await _req.json().catch(() => null);
  const printed = body?.printed;
  if (printed !== 0 && printed !== 1) {
    return NextResponse.json(
      { error: "printed must be 0 or 1" },
      { status: 400 }
    );
  }

  const result = db
    .prepare("UPDATE guests SET printed = ? WHERE id = ?")
    .run(printed, guestId);
  if (result.changes === 0) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }

  const guest = db.prepare("SELECT * FROM guests WHERE id = ?").get(guestId);
  return NextResponse.json(guest);
}