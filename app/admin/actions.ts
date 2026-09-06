"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { TEMPLATES } from "@/lib/templates";

function clean(s: unknown): string {
  return String(s ?? "").trim();
}

function requireWeddingId(id: number): void {
  const row = db.prepare("SELECT id FROM weddings WHERE id = ?").get(id);
  if (!row) redirect("/admin/weddings");
}

/* ===== Weddings ===== */

export interface WeddingFormInput {
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
  schedule: Array<{ time: string; description: string }>;
  bride_photo_path?: string | null;
  groom_photo_path?: string | null;
}

export async function createWedding(input: WeddingFormInput): Promise<{
  error?: string;
  weddingId?: number;
}> {
  await requireUser();
  const template = TEMPLATES.some((t) => t.id === input.template)
    ? input.template
    : "classic-gold";
  const schedule = (input.schedule ?? [])
    .map((s) => ({ time: clean(s.time), description: clean(s.description) }))
    .filter((s) => s.time || s.description);

  const weddingId = db.transaction(() => {
    const info = db
      .prepare(
        `INSERT INTO weddings (
           bride_title, bride_first_name, bride_last_name,
           groom_title, groom_first_name, groom_last_name,
           location, date, time, template, bride_photo_path, groom_photo_path
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        clean(input.bride_title),
        clean(input.bride_first_name),
        clean(input.bride_last_name),
        clean(input.groom_title),
        clean(input.groom_first_name),
        clean(input.groom_last_name),
        clean(input.location),
        clean(input.date),
        clean(input.time),
        template,
        input.bride_photo_path ?? null,
        input.groom_photo_path ?? null
      );
    const id = Number(info.lastInsertRowid);
    const insert = db.prepare(
      "INSERT INTO schedule (wedding_id, time, description, sort_order) VALUES (?, ?, ?, ?)"
    );
    schedule.forEach((s, i) => insert.run(id, s.time, s.description, i + 1));
    return id;
  })();

  revalidatePath("/admin");
  revalidatePath("/admin/weddings");
  redirect(`/admin/weddings/${weddingId}`);
}

export async function updateWedding(
  id: number,
  input: WeddingFormInput
): Promise<{ error?: string }> {
  await requireUser();
  requireWeddingId(id);
  const template = TEMPLATES.some((t) => t.id === input.template)
    ? input.template
    : "classic-gold";
  const schedule = (input.schedule ?? [])
    .map((s) => ({ time: clean(s.time), description: clean(s.description) }))
    .filter((s) => s.time || s.description);

  db.transaction(() => {
    db.prepare(
      `UPDATE weddings SET
         bride_title = ?, bride_first_name = ?, bride_last_name = ?,
         groom_title = ?, groom_first_name = ?, groom_last_name = ?,
         location = ?, date = ?, time = ?, template = ?,
         bride_photo_path = ?, groom_photo_path = ?,
         updated_at = datetime('now')
       WHERE id = ?`
    ).run(
      clean(input.bride_title),
      clean(input.bride_first_name),
      clean(input.bride_last_name),
      clean(input.groom_title),
      clean(input.groom_first_name),
      clean(input.groom_last_name),
      clean(input.location),
      clean(input.date),
      clean(input.time),
      template,
      input.bride_photo_path ?? null,
      input.groom_photo_path ?? null,
      id
    );
    db.prepare("DELETE FROM schedule WHERE wedding_id = ?").run(id);
    const insert = db.prepare(
      "INSERT INTO schedule (wedding_id, time, description, sort_order) VALUES (?, ?, ?, ?)"
    );
    schedule.forEach((s, i) => insert.run(id, s.time, s.description, i + 1));
  })();

  revalidatePath("/admin");
  revalidatePath("/admin/weddings");
  revalidatePath(`/admin/weddings/${id}`);
  revalidatePath(`/w/${id}`);
  return {};
}

export async function deleteWedding(id: number): Promise<void> {
  await requireUser();
  requireWeddingId(id);
  const tx = db.transaction(() => {
    db.prepare("DELETE FROM guests WHERE wedding_id = ?").run(id);
    db.prepare("DELETE FROM weddings WHERE id = ?").run(id);
  });
  tx();
  revalidatePath("/admin");
  revalidatePath("/admin/weddings");
  redirect("/admin/weddings");
}

/* ===== Guests ===== */

export interface GuestFormInput {
  title: string;
  first_name: string;
  last_name: string;
  position: string;
  ready: string;
}

export async function addGuest(
  weddingId: number,
  input: GuestFormInput
): Promise<{ error?: string }> {
  await requireUser();
  requireWeddingId(weddingId);
  db.prepare(
    "INSERT INTO guests (wedding_id, title, first_name, last_name, position, ready) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    weddingId,
    clean(input.title),
    clean(input.first_name),
    clean(input.last_name),
    clean(input.position),
    clean(input.ready)
  );
  revalidatePath(`/admin/weddings/${weddingId}/guests`);
  revalidatePath(`/w/${weddingId}`);
  return {};
}

export async function updateGuest(
  guestId: number,
  input: GuestFormInput
): Promise<{ error?: string }> {
  await requireUser();
  const guest = db.prepare("SELECT wedding_id FROM guests WHERE id = ?").get(
    guestId
  ) as { wedding_id: number } | undefined;
  if (!guest) return { error: "ແຂກບໍ່ພົບ" };
  db.prepare(
    "UPDATE guests SET title = ?, first_name = ?, last_name = ?, position = ?, ready = ? WHERE id = ?"
  ).run(
    clean(input.title),
    clean(input.first_name),
    clean(input.last_name),
    clean(input.position),
    clean(input.ready),
    guestId
  );
  revalidatePath(`/admin/weddings/${guest.wedding_id}/guests`);
  revalidatePath(`/w/${guest.wedding_id}`);
  return {};
}

export async function deleteGuest(guestId: number): Promise<void> {
  await requireUser();
  const guest = db.prepare("SELECT wedding_id FROM guests WHERE id = ?").get(
    guestId
  ) as { wedding_id: number } | undefined;
  if (!guest) return;
  db.prepare("DELETE FROM guests WHERE id = ?").run(guestId);
  revalidatePath(`/admin/weddings/${guest.wedding_id}/guests`);
  revalidatePath(`/w/${guest.wedding_id}`);
}

export async function setGuestPrinted(
  guestId: number,
  printed: boolean
): Promise<void> {
  await requireUser();
  const guest = db.prepare("SELECT wedding_id FROM guests WHERE id = ?").get(
    guestId
  ) as { wedding_id: number } | undefined;
  if (!guest) return;
  db.prepare("UPDATE guests SET printed = ? WHERE id = ?").run(
    printed ? 1 : 0,
    guestId
  );
  revalidatePath(`/admin/weddings/${guest.wedding_id}/guests`);
  revalidatePath(`/w/${guest.wedding_id}`);
}

/* ===== Design ===== */

export async function updateDesign(
  weddingId: number,
  template: string,
  colors: Record<string, string>
): Promise<{ error?: string }> {
  await requireUser();
  requireWeddingId(weddingId);
  const safeTemplate = TEMPLATES.some((t) => t.id === template)
    ? template
    : "classic-gold";

  // Keep only known color keys, validate hex format.
  const known = [
    "gold",
    "goldLight",
    "goldDark",
    "cream",
    "creamDark",
    "ink",
    "inkLight",
    "rose",
    "roseLight",
    "white",
  ];
  const hexRe = /^#[0-9a-fA-F]{6}$/;
  const safeColors: Record<string, string> = {};
  for (const key of known) {
    const v = colors[key];
    if (typeof v === "string" && hexRe.test(v)) safeColors[key] = v;
  }

  db.prepare(
    "UPDATE weddings SET template = ?, design = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(safeTemplate, JSON.stringify({ colors: safeColors }), weddingId);

  revalidatePath(`/admin/weddings/${weddingId}/design`);
  revalidatePath(`/w/${weddingId}`);
  return {};
}

export async function resetDesign(weddingId: number): Promise<void> {
  await requireUser();
  requireWeddingId(weddingId);
  db.prepare(
    "UPDATE weddings SET design = '{}', updated_at = datetime('now') WHERE id = ?"
  ).run(weddingId);
  revalidatePath(`/admin/weddings/${weddingId}/design`);
  revalidatePath(`/w/${weddingId}`);
}