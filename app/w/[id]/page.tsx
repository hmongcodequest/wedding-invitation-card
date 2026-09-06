import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { getWeddingById, getGuests, getSchedule } from "@/lib/data";
import CardViewer from "@/components/card/CardViewer";

export default async function WeddingCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  ensureDatabase();
  const { id } = await params;
  const weddingId = parseInt(id, 10);
  if (Number.isNaN(weddingId)) notFound();

  const wedding = getWeddingById(weddingId);
  if (!wedding) notFound();

  const guests = getGuests(weddingId);
  const schedule = getSchedule(weddingId);

  return (
    <CardViewer wedding={wedding} guests={guests} schedule={schedule} />
  );
}