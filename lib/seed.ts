import fs from "node:fs";
import path from "node:path";
import { db } from "./db";

/** Apply the schema (idempotent — uses IF NOT EXISTS). */
export function initSchema(): void {
  const schema = fs.readFileSync(
    path.join(process.cwd(), "lib", "schema.sql"),
    "utf-8"
  );
  db.exec(schema);
}

/** Seed the event schedule if the table is empty. */
export function seedSchedule(): void {
  const { c } = db
    .prepare("SELECT COUNT(*) AS c FROM schedule")
    .get() as { c: number };
  if (c > 0) return;

  const insert = db.prepare(
    "INSERT INTO schedule (time, description, sort_order) VALUES (?, ?, ?)"
  );
  const items: Array<[string, string, number]> = [
    ["11:30", "ຮັບແຂກ ແລະ ລົງທະບຽນ", 1],
    ["12:00", "ພິທີມຸງທຸນ ແລະ ອວຍພອນໄຊ", 2],
    ["12:30", "ຮັບປະທານອາຫານທ່ຽງ", 3],
    ["14:00", "ສະເຫຼີມສະຫຼອງ ແລະ ບັນເທີງ", 4],
  ];
  const tx = db.transaction(() => {
    for (const [time, description, sortOrder] of items) {
      insert.run(time, description, sortOrder);
    }
  });
  tx();
}