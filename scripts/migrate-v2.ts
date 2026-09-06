/**
 * Standalone V1 → V2 migration script.
 *
 * Upgrades an existing single-wedding database (V1: `wedding` table,
 * guests/schedule without wedding_id) to the multi-wedding V2 layout.
 *
 * Usage:
 *   npx tsx scripts/migrate-v2.ts
 */
import path from "node:path";
import { db } from "../lib/db";
import { initSchema, ensureIndexes } from "../lib/seed";
import { migrateV2 } from "../lib/migrate-v2";

initSchema();
const changed = migrateV2();
ensureIndexes();

const { c: weddingCount } = db
  .prepare("SELECT COUNT(*) AS c FROM weddings")
  .get() as { c: number };
const { c: guestCount } = db
  .prepare("SELECT COUNT(*) AS c FROM guests")
  .get() as { c: number };

console.log(
  changed
    ? "V2 migration applied."
    : "V2 migration not needed (already up to date)."
);
console.log(`weddings: ${weddingCount}, guests: ${guestCount}`);
console.log(`Database file: ${path.join(process.cwd(), "data", "wedding.db")}`);