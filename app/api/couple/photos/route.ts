import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "node:fs";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "weddings");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const bridePhoto = formData.get("bridePhoto") as File | null;
    const groomPhoto = formData.get("groomPhoto") as File | null;

    if (!bridePhoto && !groomPhoto) {
      return NextResponse.json({ error: "No photos provided" }, { status: 400 });
    }

    // Get the default wedding
    const wedding = db
      .prepare("SELECT id FROM weddings ORDER BY id LIMIT 1")
      .get() as { id: number } | undefined;

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const weddingId = wedding.id;
    ensureUploadDir();

    const results: { bridePhotoPath?: string; groomPhotoPath?: string } = {};

    // Process bride photo
    if (bridePhoto) {
      if (bridePhoto.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Bride photo too large (max 5MB)" }, { status: 400 });
      }
      if (!bridePhoto.type.startsWith("image/")) {
        return NextResponse.json({ error: "Bride photo must be an image file" }, { status: 400 });
      }

      const ext = path.extname(bridePhoto.name).toLowerCase();
      const safeName = `bride-${weddingId}${ext}`;
      const filePath = path.join(UPLOAD_DIR, safeName);

      const buffer = Buffer.from(await bridePhoto.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      results.bridePhotoPath = safeName;
    }

    // Process groom photo
    if (groomPhoto) {
      if (groomPhoto.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Groom photo too large (max 5MB)" }, { status: 400 });
      }
      if (!groomPhoto.type.startsWith("image/")) {
        return NextResponse.json({ error: "Groom photo must be an image file" }, { status: 400 });
      }

      const ext = path.extname(groomPhoto.name).toLowerCase();
      const safeName = `groom-${weddingId}${ext}`;
      const filePath = path.join(UPLOAD_DIR, safeName);

      const buffer = Buffer.from(await groomPhoto.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      results.groomPhotoPath = safeName;
    }

    // Update wedding record
    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (results.bridePhotoPath) {
      updates.push("bride_photo_path = ?");
      params.push(results.bridePhotoPath);
    }
    if (results.groomPhotoPath) {
      updates.push("groom_photo_path = ?");
      params.push(results.groomPhotoPath);
    }

    if (updates.length > 0) {
      params.push(weddingId);
      db.prepare(
        `UPDATE weddings SET ${updates.join(", ")} WHERE id = ?`
      ).run(...params);
    }

    return NextResponse.json({ success: true, ...results });
  } catch (err: any) {
    console.error("Photo upload error:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}