/**
 * One-time migration: legacy/data.json + legacy/wedding-invitation-card.xlsx → SQLite.
 *
 * Usage:
 *   npx tsx scripts/migrate-data.ts          # skip if data already exists
 *   npx tsx scripts/migrate-data.ts --force  # wipe wedding/guests and re-import
 */
import path from "node:path";
import { db } from "../lib/db";
import { initSchema, seedSchedule } from "../lib/seed";
import { migrateFromLegacy } from "../lib/migrate";

initSchema();
seedSchedule();

const force = process.argv.includes("--force");
const result = migrateFromLegacy({ force });

if (!result.migrated) {
  console.log(
    "No data imported. Either the database already has data (use --force to re-import) " +
      "or no legacy source was found (legacy/wedding-invitation-card.xlsx or legacy/data.json)."
  );
  process.exit(1);
}

const { c: scheduleCount } = db
  .prepare("SELECT COUNT(*) AS c FROM schedule")
  .get() as { c: number };

console.log(
  `Migration complete: wedding info + ${result.guests} guests + ${scheduleCount} schedule items.`
);
console.log(`Database file: ${path.join(process.cwd(), "data", "wedding.db")}`);