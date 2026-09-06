import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { getWeddingById, getGuests } from "@/lib/data";
import GuestManager from "@/components/guests/GuestManager";
import { RingIcon, HomeIcon } from "@/components/icons";

export const metadata = {
  title: "ລາຍຊື່ແຂກ | ບັດເຊີນງານແຕ່ງງານ",
};

export default async function WeddingGuestsPage({
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

  return (
    <div className="app-shell">
      <div className="toolbar">
        <div className="toolbar-title">
          <RingIcon size={18} /> ບັດເຊີນ: {wedding.bride_first_name} &amp;{" "}
          {wedding.groom_first_name}
        </div>
        <div className="toolbar-actions">
          <Link href={`/w/${weddingId}`} className="btn">
            <HomeIcon size={16} /> ໜ້າບັດເຊີນ
          </Link>
        </div>
      </div>
      <GuestManager guests={guests} />
    </div>
  );
}