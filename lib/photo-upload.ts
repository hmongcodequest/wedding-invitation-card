"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "weddings");

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function clean(s: unknown): string {
  return String(s ?? "").trim();
}

function requireWeddingId(id: number): void {
  const row = db.prepare("SELECT id FROM weddings WHERE id = ?").get(id);
  if (!row) redirect("/admin/weddings");
}

export async function uploadPhoto(
  weddingId: number,
  file: File,
  type: "bride" | "groom"
): Promise<{ error?: string; path?: string }> {
  try {
    await requireUser();
    requireWeddingId(weddingId);

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      return { error: "ຝາຍໃຫຍ່ເກີນ 5MB" };
    }
    if (!file.type.startsWith("image/")) {
      return { error: "ເປັນໄຟລ໌ຮູບພາບທີ່ຖືກຕ້ອງ (JPG, PNG, etc.)" };
    }

    ensureUploadDir();

    const ext = path.extname(file.name).toLowerCase();
    const safeName = `${type}-${nanoid()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, `${weddingId}-${safeName}`);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Update wedding record
    const column = type === "bride" ? "bride_photo_path" : "groom_photo_path";
    db.prepare(`UPDATE weddings SET ${column} = ? WHERE id = ?`).run(
      safeName,
      weddingId
    );

    revalidatePath(`/admin/weddings/${weddingId}`);
    revalidatePath(`/w/${weddingId}`);

    return { path: safeName };
  } catch (err) {
    console.error("Photo upload error:", err);
    return { error: "ເກີດຂໍ້ຜິດພາດ during upload" };
  }
}

export async function deletePhoto(weddingId: number, type: "bride" | "groom") {
  try {
    await requireUser();
    requireWeddingId(weddingId);

    const column = type === "bride" ? "bride_photo_path" : "groom_photo_path";
    const row = db.prepare(`SELECT ${column} FROM weddings WHERE id = ?`).get(
      weddingId
    ) as { [key: string]: string | null } | undefined;

    if (row?.[column]) {
      const filePath = path.join(UPLOAD_DIR, `${weddingId}-${row[column]}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.prepare(`UPDATE weddings SET ${column} = NULL WHERE id = ?`).run(
      weddingId
    );

    revalidatePath(`/admin/weddings/${weddingId}`);
    revalidatePath(`/w/${weddingId}`);
  } catch (err) {
    console.error("Photo delete error:", err);
  }
}

export interface WeddingWithPhotos extends WeddingInfo {
  bride_photo_path?: string | null;
  groom_photo_path?: string | null;
}

export interface WeddingInfo {
  id: number;
  bride_title: string;
  bride_first_name: string;
  bride_last_name: string;
  groom_title: string;
  groom_first_name: string;
  groom_last_name: string;
  location: string;
  date: string;
  time: string;
  template: string;
  design: string;
  bride_photo_path?: string | null;
  groom_photo_path?: string | null;
}

export function getWeddingById(id: number): WeddingWithPhotos | null {
  const row = db.prepare("SELECT * FROM weddings WHERE id = ?").get(id);
  return (row as WeddingWithPhotos | undefined) ?? null;
}
