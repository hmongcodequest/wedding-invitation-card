import { db } from "./db";
import { initSchema, seedSchedule } from "./seed";
import { insertWeddingData, loadWeddingDataFromJson } from "./seed-data";

let initialized = false;

/**
 * Ensure the database is ready before any read/write:
 * 1. Apply the schema (idempotent).
 * 2. Seed the schedule table if empty.
 * 3. Auto-import legacy data.json on a truly empty database (fresh clone convenience).
 *    (Excel-based migration stays in scripts/migrate-data.ts — it needs SheetJS.)
 */
export function ensureDatabase(): void {
  if (initialized) return;
  initSchema();
  seedSchedule();

  const { c: weddingCount } = db
    .prepare("SELECT COUNT(*) AS c FROM wedding")
    .get() as { c: number };
  const { c: guestCount } = db
    .prepare("SELECT COUNT(*) AS c FROM guests")
    .get() as { c: number };

  if (weddingCount === 0 && guestCount === 0) {
    const data = loadWeddingDataFromJson();
    if (data) {
      const n = insertWeddingData(data);
      console.log(`Auto-seeded ${n} guests from legacy/data.json`);
    }
  }

  initialized = true;
}