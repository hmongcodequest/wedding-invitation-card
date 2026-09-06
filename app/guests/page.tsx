import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { getDefaultWedding } from "@/lib/data";

export default async function GuestsPage() {
  await connection();
  ensureDatabase();
  const wedding = getDefaultWedding();
  if (!wedding) {
    throw new Error(
      "Wedding data not found. Run `npx tsx scripts/migrate-data.ts` to seed the database."
    );
  }
  redirect(`/w/${wedding.id}/guests`);
}