import Link from "next/link";
import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { db } from "@/lib/db";
import { getWeddings } from "@/lib/data";

function CardIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 5.6" />
      <path d="M17.5 15.4c1.8.7 3.2 2.2 4 4.6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default async function AdminDashboard() {
  await connection();
  ensureDatabase();

  const weddings = getWeddings();
  const { c: totalGuests } = db
    .prepare("SELECT COUNT(*) AS c FROM guests")
    .get() as { c: number };
  const { c: printed } = db
    .prepare("SELECT COUNT(*) AS c FROM guests WHERE printed = 1")
    .get() as { c: number };
  const { c: unprinted } = db
    .prepare("SELECT COUNT(*) AS c FROM guests WHERE printed = 0")
    .get() as { c: number };

  const printPercent = totalGuests > 0 ? Math.round((printed / totalGuests) * 100) : 0;

  const stats = [
    {
      label: "ບັດເຊີນທັງໝົດ",
      value: weddings.length,
      icon: <CardIcon />,
      tone: "pink",
    },
    {
      label: "ແຂກທັງໝົດ",
      value: totalGuests,
      icon: <UsersIcon />,
      tone: "gold",
    },
    {
      label: "ພິມບັດແລ້ວ",
      value: printed,
      icon: <CheckIcon />,
      tone: "green",
    },
    {
      label: "ຍັງບໍ່ທັນພິມ",
      value: unprinted,
      icon: <ClockIcon />,
      tone: "neutral",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            ພາບລວມຂອງລະບົບບັດເຊີນງານແຕ່ງງານ
          </p>
        </div>
        <Link href="/admin/weddings/new" className="admin-btn">
          <PlusIcon />
          ສ້າງບັດເຊີນໃໝ່
        </Link>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card stat-${s.tone}`}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-title">ຄວາມຄືບໜ້າການພິມບັດ</div>
        <div className="progress-row">
          <div className="progress-track" role="progressbar" aria-valuenow={printPercent} aria-valuemin={0} aria-valuemax={100} aria-label="ຄວາມຄືບໜ້າການພິມບັດ">
            <div className="progress-fill" style={{ width: `${printPercent}%` }} />
          </div>
          <span className="progress-label">
            {printed} / {totalGuests} ຄົນ ({printPercent}%)
          </span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-title">ບັດເຊີນຫຼ້າສຸດ</div>
        {weddings.length === 0 ? (
          <p className="admin-empty">
            ຍັງບໍ່ມີບັດເຊີນ — ກົດປຸ່ມລຸ່ມນີ້ເພື່ອສ້າງບັດທຳອິດ.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="num">#</th>
                  <th>ຄູ່ບ່າວສາວ</th>
                  <th>ວັນທີ</th>
                  <th>ສະຖານທີ່</th>
                  <th>ແຂກ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {weddings.map((w, i) => {
                  const { c } = db
                    .prepare("SELECT COUNT(*) AS c FROM guests WHERE wedding_id = ?")
                    .get(w.id) as { c: number };
                  return (
                    <tr key={w.id}>
                      <td className="num">{i + 1}</td>
                      <td>
                        <Link
                          href={`/admin/weddings/${w.id}`}
                          className="admin-couple-link"
                        >
                          {w.bride_first_name} {w.bride_last_name} &amp;{" "}
                          {w.groom_first_name} {w.groom_last_name}
                        </Link>
                      </td>
                      <td>{w.date || "—"}</td>
                      <td>{w.location || "—"}</td>
                      <td>
                        <span className="wedding-badge">{c} ຄົນ</span>
                      </td>
                      <td>
                        <Link
                          href={`/w/${w.id}`}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                          <EyeIcon />
                          ເບິ່ງບັດ
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}