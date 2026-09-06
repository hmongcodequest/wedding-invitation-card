import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { db } from "@/lib/db";
import { getWeddingById, getSchedule } from "@/lib/data";
import WeddingForm from "@/components/admin/WeddingForm";
import { ArrowLeftIcon, UsersIcon, PaletteIcon, EyeIcon, EditIcon } from "@/components/icons";

export default async function EditWeddingPage({
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

  const schedule = getSchedule(weddingId);

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Link
          href="/admin/weddings"
          className="admin-btn admin-btn-secondary admin-btn-sm"
        >
          <ArrowLeftIcon size={15} /> ລາຍຊື່ບັດເຊີນ
        </Link>
        <Link
          href={`/admin/weddings/${weddingId}/guests`}
          className="admin-btn admin-btn-secondary admin-btn-sm"
        >
          <UsersIcon size={15} /> ຈັດການແຂກ
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
        <EditIcon size={22} /> ແກ້ໄຂບັດເຊີນ: {wedding.bride_first_name} &amp;{" "}
        {wedding.groom_first_name}
      </h1>
      <p className="admin-page-subtitle">
        ແກ້ໄຂຂໍ້ມູນຄູ່ບ່າວສາວ, ລາຍລະອຽດງານ ແລະ ກຳນົດການງານ
      </p>

      <WeddingForm
        mode="edit"
        weddingId={weddingId}
        initial={{
          bride_title: wedding.bride_title,
          bride_first_name: wedding.bride_first_name,
          bride_last_name: wedding.bride_last_name,
          groom_title: wedding.groom_title,
          groom_first_name: wedding.groom_first_name,
          groom_last_name: wedding.groom_last_name,
          location: wedding.location,
          date: wedding.date,
          time: wedding.time,
          template: wedding.template,
        }}
        initialSchedule={schedule.map((s) => ({
          time: s.time,
          description: s.description,
        }))}
      />
    </div>
  );
}