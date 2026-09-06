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
}

export interface Guest {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  position: string;
  ready: string;
  printed: number;
}

export interface ScheduleItem {
  id: number;
  time: string;
  description: string;
  sort_order: number;
}

export function getWedding(): WeddingInfo | null {
  const row = db.prepare("SELECT * FROM wedding WHERE id = 1").get();
  return (row as WeddingInfo | undefined) ?? null;
}

export function getGuests(): Guest[] {
  return db.prepare("SELECT * FROM guests ORDER BY id").all() as Guest[];
}

export function getSchedule(): ScheduleItem[] {
  return db
    .prepare("SELECT * FROM schedule ORDER BY sort_order")
    .all() as ScheduleItem[];
}