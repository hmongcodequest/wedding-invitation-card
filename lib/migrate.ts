/**
 * Migration from legacy data sources (Excel preferred, data.json fallback).
 * Used ONLY by scripts/migrate-data.ts — importing this module pulls in the
 * vendored SheetJS bundle, so keep it out of the server bundle.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { db } from "./db";
import { seedSchedule } from "./seed";
import {
  insertWeddingData,
  loadWeddingDataFromJson,
  type WeddingData,
} from "./seed-data";

// Runtime require (not statically analyzed by Turbopack) for the vendored
// SheetJS UMD bundle, which lives outside the app bundle in legacy/.
const nodeRequire = createRequire(import.meta.url);

function loadFromExcel(): WeddingData | null {
  try {
    const XLSX = nodeRequire(
      path.join(process.cwd(), "legacy", "xlsx.full.min.js")
    );
    const filePath = path.join(
      process.cwd(),
      "legacy",
      "wedding-invitation-card.xlsx"
    );
    if (!fs.existsSync(filePath)) return null;

    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    if (rows.length < 3) return null;

    // Same column mapping as the old app:
    // Bride: row 3 (idx 2), cols F/G/H (5/6/7)
    // Groom: row 3 (idx 2), cols I/J/K (8/9/10)
    // Location: L2 (idx 1, col 11), Date: M2 (idx 1, col 12), Time: M3 (idx 2, col 12)
    // Guests: rows 3+ (idx 2+), cols A/B/C/D/E (0/1/2/3/4)
    const metaRow = rows[2];
    const guests: WeddingData["guests"] = [];
    for (let i = 2; i < rows.length; i++) {
      const r = rows[i];
      const title = String(r[0] || "").trim();
      if (!title) continue;
      guests.push({
        title,
        first_name: String(r[1] || "").trim(),
        last_name: String(r[2] || "").trim(),
        position: String(r[3] || "").trim(),
        ready: String(r[4] || "").trim(),
      });
    }
    if (guests.length === 0) return null;

    return {
      bride: {
        title: String(metaRow[5] || "").trim(),
        first_name: String(metaRow[6] || "").trim(),
        last_name: String(metaRow[7] || "").trim(),
      },
      groom: {
        title: String(metaRow[8] || "").trim(),
        first_name: String(metaRow[9] || "").trim(),
        last_name: String(metaRow[10] || "").trim(),
      },
      location: String(rows[1][11] || "").trim(),
      date: String(rows[1][12] || "").trim(),
      time: String(rows[2][12] || "").trim(),
      guests,
    };
  } catch (error) {
    console.warn("Excel load failed, falling back to data.json:", error);
    return null;
  }
}

export interface MigrateResult {
  migrated: boolean;
  guests: number;
}

/**
 * Import wedding info + guests from legacy sources into SQLite.
 * Skips (or wipes with force) when data already exists.
 */
export function migrateFromLegacy(options?: { force?: boolean }): MigrateResult {
  const { c: weddingCount } = db
    .prepare("SELECT COUNT(*) AS c FROM weddings")
    .get() as { c: number };
  const { c: guestCount } = db
    .prepare("SELECT COUNT(*) AS c FROM guests")
    .get() as { c: number };

  if (weddingCount > 0 || guestCount > 0) {
    if (!options?.force) {
      return { migrated: false, guests: 0 };
    }
    const wipe = db.transaction(() => {
      db.exec("DELETE FROM guests; DELETE FROM schedule; DELETE FROM weddings;");
    });
    wipe();
  }

  const data = loadFromExcel() ?? loadWeddingDataFromJson();
  if (!data) {
    return { migrated: false, guests: 0 };
  }

  const { weddingId, guests } = insertWeddingData(data);
  seedSchedule(weddingId);
  return { migrated: true, guests };
}