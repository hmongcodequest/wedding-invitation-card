import { db } from "./db";
import { initSchema, ensureIndexes, seedSchedule, seedUsers } from "./seed";
import { migrateV2 } from "./migrate-v2";
import { insertWeddingData, loadWeddingDataFromJson } from "./seed-data";

let initialized = false;

/**
 * Ensure the database is ready before any read/write:
 * 1. Apply the schema (idempotent).
 * 2. Migrate a V1 database to V2 (multi-wedding) if needed.
 * 3. Create indexes (after migration so wedding_id columns exist).
 * 4. Seed the admin user.
 * 5. Auto-import legacy data.json on a truly empty database (fresh clone convenience).
 *    (Excel-based migration stays in scripts/migrate-data.ts — it needs SheetJS.)
 */
export function ensureDatabase(): void {
  if (initialized) return;
  initSchema();
  migrateV2();
  ensureIndexes();
  seedUsers();

  const { c: weddingCount } = db
    .prepare("SELECT COUNT(*) AS c FROM weddings")
    .get() as { c: number };
  const { c: guestCount } = db
    .prepare("SELECT COUNT(*) AS c FROM guests")
    .get() as { c: number };

  if (weddingCount === 0 && guestCount === 0) {
    const data = loadWeddingDataFromJson();
    if (data) {
      const { weddingId, guests } = insertWeddingData(data);
      seedSchedule(weddingId);
      console.log(`Auto-seeded ${guests} guests from legacy/data.json`);
    }
  } else {
    // Make sure every existing wedding has a schedule.
    const weddings = db
      .prepare("SELECT id FROM weddings")
      .all() as Array<{ id: number }>;
    for (const w of weddings) seedSchedule(w.id);
  }

  initialized = true;
}