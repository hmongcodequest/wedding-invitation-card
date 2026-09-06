import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { getWeddingById, getGuests } from "@/lib/data";
import GuestAdmin from "@/components/admin/GuestAdmin";
import { ArrowLeftIcon, PaletteIcon, EyeIcon, UsersIcon } from "@/components/icons";

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
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link
          href={`/admin/weddings/${weddingId}`}
          className="admin-btn admin-btn-secondary admin-btn-sm"
        >
          <ArrowLeftIcon size={15} /> ແກ້ໄຂບັດ
        </Link>
        <Link
          href={`/admin/weddings/${weddingId}/design`}
          className="admin-btn admin-btn-secondary admin-btn-sm"
        >
          <PaletteIcon size={15} /> ອອກແບບບັດ
        </Link>
        <Link
          href={`/w/${weddingId}`}
          className="admin-btn admin-btn-secondary admin-btn-sm"
        >
          <EyeIcon size={15} /> ເບິ່ງບັດ
        </Link>
      </div>

      <h1 className="admin-page-title">
        <UsersIcon size={22} /> ແຂກຂອງບັດ: {wedding.bride_first_name} &amp;{" "}
        {wedding.groom_first_name}
      </h1>
      <p className="admin-page-subtitle">
        ເພີ່ມ, ແກ້ໄຂ, ລຶບ ແລະ ຈັດການສະຖານະການພິມຂອງແຂກໃນບັດນີ້
      </p>

      <GuestAdmin weddingId={weddingId} guests={guests} />
    </div>
  );
}