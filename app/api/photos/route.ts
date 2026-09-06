import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import fs from "node:fs";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "weddings");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function requireWeddingId(id: number): void {
  const row = db.prepare("SELECT id FROM weddings WHERE id = ?").get(id);
  if (!row) throw new Error("Wedding not found");
}

export async function POST(request: NextRequest) {
  try {
    await requireUser();

    const formData = await request.formData();
    const weddingId = Number(formData.get("weddingId"));
    const type = formData.get("type") as "bride" | "groom";
    const file = formData.get("file") as File;

    if (!weddingId || !type || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    requireWeddingId(weddingId);

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Must be an image file (JPG, PNG)" }, { status: 400 });
    }

    ensureUploadDir();

    const ext = path.extname(file.name).toLowerCase();
    // Use a simple filename without nanoid
    const safeName = `${type}-${weddingId}${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Update wedding record
    const column = type === "bride" ? "bride_photo_path" : "groom_photo_path";
    db.prepare(`UPDATE weddings SET ${column} = ? WHERE id = ?`).run(
      safeName,
      weddingId
    );

    return NextResponse.json({ path: safeName });
  } catch (err: any) {
    console.error("Photo upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireUser();

    const formData = await request.formData();
    const weddingId = Number(formData.get("weddingId"));
    const type = formData.get("type") as "bride" | "groom";

    if (!weddingId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    requireWeddingId(weddingId);

    const column = type === "bride" ? "bride_photo_path" : "groom_photo_path";
    const row = db.prepare(`SELECT ${column} FROM weddings WHERE id = ?`).get(
      weddingId
    ) as { [key: string]: string | null } | undefined;

    if (row?.[column]) {
      const filePath = path.join(UPLOAD_DIR, row[column]);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.prepare(`UPDATE weddings SET ${column} = NULL WHERE id = ?`).run(
      weddingId
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Photo delete error:", err);
    return NextResponse.json({ error: err.message || "Delete failed" }, { status: 500 });
  }
}
