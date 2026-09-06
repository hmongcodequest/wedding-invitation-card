import { db } from "./db";

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

export interface Guest {
  id: number;
  wedding_id: number;
  title: string;
  first_name: string;
  last_name: string;
  position: string;
  ready: string;
  printed: number;
}

export interface ScheduleItem {
  id: number;
  wedding_id: number;
  time: string;
  description: string;
  sort_order: number;
}

export function getWeddings(): WeddingInfo[] {
  return db
    .prepare("SELECT * FROM weddings ORDER BY id")
    .all() as WeddingInfo[];
}

export function getWeddingById(id: number): WeddingInfo | null {
  const row = db.prepare("SELECT * FROM weddings WHERE id = ?").get(id);
  return (row as WeddingInfo | undefined) ?? null;
}

/** First wedding by id — used as the default landing card. */
export function getDefaultWedding(): WeddingInfo | null {
  const row = db.prepare("SELECT * FROM weddings ORDER BY id LIMIT 1").get();
  return (row as WeddingInfo | undefined) ?? null;
}

export function getGuests(weddingId: number): Guest[] {
  return db
    .prepare("SELECT * FROM guests WHERE wedding_id = ? ORDER BY id")
    .all(weddingId) as Guest[];
}

export function getSchedule(weddingId: number): ScheduleItem[] {
  return db
    .prepare(
      "SELECT * FROM schedule WHERE wedding_id = ? ORDER BY sort_order, id"
    )
    .all(weddingId) as ScheduleItem[];
}

export function getGuestCount(weddingId: number): number {
  const { c } = db
    .prepare("SELECT COUNT(*) AS c FROM guests WHERE wedding_id = ?")
    .get(weddingId) as { c: number };
  return c;
}

export function getPrintedCount(weddingId: number): number {
  const { c } = db
    .prepare(
      "SELECT COUNT(*) AS c FROM guests WHERE wedding_id = ? AND printed = 1"
    )
    .get(weddingId) as { c: number };
  return c;
}