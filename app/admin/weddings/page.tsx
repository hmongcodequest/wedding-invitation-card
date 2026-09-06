import Link from "next/link";
import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { db } from "@/lib/db";
import { getWeddings } from "@/lib/data";
import DeleteWeddingButton from "@/components/admin/DeleteWeddingButton";
import { MailIcon, PlusIcon, EditIcon, UsersIcon, PaletteIcon, EyeIcon } from "@/components/icons";

export default async function AdminWeddingsPage() {
  await connection();
  ensureDatabase();
  const weddings = getWeddings();

  return (
    <div>
      <h1 className="admin-page-title">
        <MailIcon size={22} /> ບັດເຊີນທັງໝົດ
      </h1>
      <p className="admin-page-subtitle">
        ຈັດການບັດເຊີນງານແຕ່ງງານທັງໝົດ — ສາມາດສ້າງໄດ້ຫຼາຍບັດ
      </p>

      <div style={{ marginBottom: 20 }}>
        <Link href="/admin/weddings/new" className="admin-btn">
          <PlusIcon size={18} /> ສ້າງບັດເຊີນໃໝ່
        </Link>
      </div>

      {weddings.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: "var(--ink-light)" }}>
            ຍັງບໍ່ມີບັດເຊີນ — ກົດປຸ່ມ "ສ້າງບັດເຊີນໃໝ່" ເພື່ອເລີ່ມຕົ້ນ.
          </p>
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="num">#</th>
                <th>ຄູ່ບ່າວສາວ</th>
                <th>ວັນທີ</th>
                <th>ສະຖານທີ່</th>
                <th>ແບບບັດ</th>
                <th>ແຂກ</th>
                <th>ການຈັດການ</th>
              </tr>
            </thead>
            <tbody>
              {weddings.map((w, i) => {
                const { c: guestCount } = db
                  .prepare(
                    "SELECT COUNT(*) AS c FROM guests WHERE wedding_id = ?"
                  )
                  .get(w.id) as { c: number };
                return (
                  <tr key={w.id}>
                    <td className="num">{i + 1}</td>
                    <td>
                      <div className="wedding-couple">
                        {w.bride_first_name} {w.bride_last_name} &amp;{" "}
                        {w.groom_first_name} {w.groom_last_name}
                      </div>
                      <div className="wedding-meta">
                        {w.bride_title} × {w.groom_title}
                      </div>
                    </td>
                    <td>{w.date || "—"}</td>
                    <td>{w.location || "—"}</td>
                    <td>
                      <span className="wedding-badge">{w.template}</span>
                    </td>
                    <td>
                      <span className="wedding-badge">{guestCount} ຄົນ</span>
                    </td>
                    <td>
                      <div className="wedding-row-actions">
                        <Link
                          href={`/admin/weddings/${w.id}`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          <EditIcon size={15} /> ແກ້ໄຂ
                        </Link>
                        <Link
                          href={`/admin/weddings/${w.id}/guests`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          <UsersIcon size={15} /> ແຂກ
                        </Link>
                        <Link
                          href={`/admin/weddings/${w.id}/design`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          <PaletteIcon size={15} /> ອອກແບບ
                        </Link>
                        <Link
                          href={`/w/${w.id}`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          <EyeIcon size={15} /> ເບິ່ງບັດ
                        </Link>
                        <DeleteWeddingButton
                          weddingId={w.id}
                          label={`${w.bride_first_name} & ${w.groom_first_name}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}