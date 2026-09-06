import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { getWedding, getGuests, getSchedule } from "@/lib/data";
import CardViewer from "@/components/card/CardViewer";

export default async function HomePage() {
  // Force per-request rendering: better-sqlite3 is a synchronous source.
  await connection();
  ensureDatabase();

  const wedding = getWedding();
  if (!wedding) {
    throw new Error(
      "Wedding data not found. Run `npx tsx scripts/migrate-data.ts` to seed the database."
    );
  }
  const guests = getGuests();
  const schedule = getSchedule();

  return (
    <CardViewer wedding={wedding} guests={guests} schedule={schedule} />
  );
}