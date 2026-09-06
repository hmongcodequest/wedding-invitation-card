/**
 * Pure data-insert helpers shared by the migration script and the server's
 * auto-seed. No Excel dependency here — safe for the server bundle.
 */
import fs from "node:fs";
import path from "node:path";
import { db } from "./db";

export interface GuestRow {
  title: string;
  first_name: string;
  last_name: string;
  position: string;
  ready: string;
}

export interface WeddingData {
  bride: { title: string; first_name: string; last_name: string };
  groom: { title: string; first_name: string; last_name: string };
  location: string;
  date: string;
  time: string;
  guests: GuestRow[];
}

export function loadWeddingDataFromJson(): WeddingData | null {
  try {
    const filePath = path.join(process.cwd(), "legacy", "data.json");
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as WeddingData;
  } catch (error) {
    console.warn("data.json load failed:", error);
    return null;
  }
}

export interface InsertResult {
  weddingId: number;
  guests: number;
}

/** Insert a wedding + its guests inside one transaction. */
export function insertWeddingData(
  data: WeddingData,
  options?: { template?: string }
): InsertResult {
  const insertWedding = db.prepare(
    `INSERT INTO weddings (
       bride_title, bride_first_name, bride_last_name,
       groom_title, groom_first_name, groom_last_name,
       location, date, time, template
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertGuest = db.prepare(
    "INSERT INTO guests (wedding_id, title, first_name, last_name, position, ready) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const weddingId = db.transaction(() => {
    const info = insertWedding.run(
      data.bride.title,
      data.bride.first_name,
      data.bride.last_name,
      data.groom.title,
      data.groom.first_name,
      data.groom.last_name,
      data.location,
      data.date,
      data.time,
      options?.template ?? "classic-gold"
    );
    const id = Number(info.lastInsertRowid);
    for (const g of data.guests) {
      insertGuest.run(id, g.title, g.first_name, g.last_name, g.position, g.ready);
    }
    return id;
  })();

  return { weddingId, guests: data.guests.length };
}