/**
 * V2 schema migration — transforms a V1 database (single `wedding` row,
 * guests/schedule without wedding_id) into the multi-wedding V2 layout.
 * Idempotent and cheap: each step checks before acting.
 */
import { db } from "./db";

function tableExists(name: string): boolean {
  return !!db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(name);
}

function columnExists(table: string, column: string): boolean {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{
    name: string;
  }>;
  return cols.some((c) => c.name === column);
}

export function migrateV2(): boolean {
  let changed = false;

  // 1. Old single-row `wedding` table → `weddings` (multi-wedding).
  if (tableExists("wedding") && tableExists("weddings")) {
    const { c } = db
      .prepare("SELECT COUNT(*) AS c FROM weddings")
      .get() as { c: number };
    if (c === 0) {
      db.transaction(() => {
        db.exec(
          `INSERT INTO weddings (
             id, bride_title, bride_first_name, bride_last_name,
             groom_title, groom_first_name, groom_last_name,
             location, date, time, updated_at
           )
           SELECT
             id, bride_title, bride_first_name, bride_last_name,
             groom_title, groom_first_name, groom_last_name,
             location, date, time, updated_at
           FROM wedding`
        );
        db.exec("DROP TABLE wedding");
      })();
      changed = true;
      console.log("V2 migration: moved wedding → weddings");
    }
  }

  // 2. guests.wedding_id (backfill to the default wedding id 1).
  if (tableExists("guests") && !columnExists("guests", "wedding_id")) {
    db.exec("ALTER TABLE guests ADD COLUMN wedding_id INTEGER NOT NULL DEFAULT 1");
    changed = true;
    console.log("V2 migration: added guests.wedding_id");
  }

  // 3. schedule.wedding_id.
  if (tableExists("schedule") && !columnExists("schedule", "wedding_id")) {
    db.exec(
      "ALTER TABLE schedule ADD COLUMN wedding_id INTEGER NOT NULL DEFAULT 1"
    );
    changed = true;
    console.log("V2 migration: added schedule.wedding_id");
  }

  // 4. bride_photo_path, groom_photo_path columns.
  if (tableExists("weddings") && !columnExists("weddings", "bride_photo_path")) {
    db.exec("ALTER TABLE weddings ADD COLUMN bride_photo_path TEXT DEFAULT NULL");
    changed = true;
    console.log("V2 migration: added weddings.bride_photo_path");
  }
  if (tableExists("weddings") && !columnExists("weddings", "groom_photo_path")) {
    db.exec("ALTER TABLE weddings ADD COLUMN groom_photo_path TEXT DEFAULT NULL");
    changed = true;
    console.log("V2 migration: added weddings.groom_photo_path");
  }

  return changed;
}