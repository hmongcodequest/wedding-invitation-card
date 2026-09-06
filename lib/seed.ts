import fs from "node:fs";
import path from "node:path";
import { db } from "./db";
import { hashPassword } from "./auth";

/** Apply the schema (idempotent — uses IF NOT EXISTS). */
export function initSchema(): void {
  const schema = fs.readFileSync(
    path.join(process.cwd(), "lib", "schema.sql"),
    "utf-8"
  );
  db.exec(schema);
}

/**
 * Create indexes. Must run AFTER migrateV2() so the wedding_id columns
 * exist on databases that were created before V2.
 */
export function ensureIndexes(): void {
  db.exec(
    "CREATE INDEX IF NOT EXISTS idx_guests_wedding ON guests(wedding_id);" +
      "CREATE INDEX IF NOT EXISTS idx_schedule_wedding ON schedule(wedding_id);"
  );
}

/** Default event schedule used when a wedding has none yet. */
export const DEFAULT_SCHEDULE: Array<[string, string]> = [
  ["11:30", "ຮັບແຂກ ແລະ ລົງທະບຽນ"],
  ["12:00", "ພິທີມຸງທຸນ ແລະ ອວຍພອນໄຊ"],
  ["12:30", "ຮັບປະທານອາຫານທ່ຽງ"],
  ["14:00", "ສະເຫຼີມສະຫຼອງ ແລະ ບັນເທີງ"],
];

/** Seed the event schedule for a wedding if it has none. */
export function seedSchedule(weddingId: number): void {
  const { c } = db
    .prepare("SELECT COUNT(*) AS c FROM schedule WHERE wedding_id = ?")
    .get(weddingId) as { c: number };
  if (c > 0) return;

  const insert = db.prepare(
    "INSERT INTO schedule (wedding_id, time, description, sort_order) VALUES (?, ?, ?, ?)"
  );
  const tx = db.transaction(() => {
    DEFAULT_SCHEDULE.forEach(([time, description], i) => {
      insert.run(weddingId, time, description, i + 1);
    });
  });
  tx();
}

/** Seed the admin user if the users table is empty. */
export function seedUsers(): void {
  const { c } = db.prepare("SELECT COUNT(*) AS c FROM users").get() as {
    c: number;
  };
  if (c > 0) return;

  db.prepare(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)"
  ).run("admin@gmail.com", hashPassword("admin123"), "Admin");
  console.log("Seeded admin user (admin@gmail.com)");
}