import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const wedding = db
      .prepare(
        `SELECT id, bride_title, bride_first_name, bride_last_name,
                groom_title, groom_first_name, groom_last_name,
                location, date, time, template, design,
                bride_photo_path, groom_photo_path
         FROM weddings
         ORDER BY id
         LIMIT 1`
      )
      .get();

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    return NextResponse.json(wedding);
  } catch (err: any) {
    console.error("Get wedding error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch wedding" }, { status: 500 });
  }
}