import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { getWeddingById, getSchedule } from "@/lib/data";
import { getTemplate, parseDesign } from "@/lib/templates";
import DesignEditor from "@/components/admin/DesignEditor";
import { ArrowLeftIcon, UsersIcon, EyeIcon, PaletteIcon } from "@/components/icons";

export default async function WeddingDesignPage({
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
  const design = parseDesign(wedding.design);

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
          href={`/admin/weddings/${weddingId}/guests`}
          className="admin-btn admin-btn-secondary admin-btn-sm"
        >
          <UsersIcon size={15} /> ແຂກ
        </Link>
        <Link
          href={`/w/${weddingId}`}
          className="admin-btn admin-btn-secondary admin-btn-sm"
        >
          <EyeIcon size={15} /> ເບິ່ງບັດ
        </Link>
      </div>

      <h1 className="admin-page-title">
        <PaletteIcon size={22} /> ອອກແບບບັດ: {wedding.bride_first_name} &amp;{" "}
        {wedding.groom_first_name}
      </h1>
      <p className="admin-page-subtitle">
        ເລືອກ template ຫຼື ປັບສີເອງ — ກົດບັນທຶກເພື່ອໃຊ້ກັບບັດຈິງ
      </p>

      <DesignEditor
        wedding={wedding}
        schedule={schedule}
        initialTemplate={wedding.template}
        initialColors={design.colors ?? {}}
      />
    </div>
  );
}