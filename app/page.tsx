import Link from "next/link";
import { connection } from "next/server";
import { ensureDatabase } from "@/lib/init";
import { getDefaultWedding } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { formatLaoDateShort } from "@/lib/lao-format";
import "./landing.css";

export const metadata = {
  title: "ຍິນດີຕ້ອນຮັບ | ບັດເຊີນງານແຕ່ງງານ",
  description:
    "ສ້າງບັດເຊີນງານແຕ່ງງານທີ່ສວຍງາມ, ຈັດການລາຍຊື່ແຂກ ແລະ ພິມບັດໄດ້ທັນທີ",
};

/* ===== Inline SVG icons (stroke style, consistent 24px) ===== */

function RingsIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="14" r="6" />
      <circle cx="15" cy="14" r="6" />
      <path d="M12 8l1.5-3.5L15 8" />
      <path d="M12 8l-1.5-3.5L9 8" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      width="28"
      height="28"
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
      width="28"
      height="28"
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

function PrinterIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9V3h12v6" />
      <rect x="3" y="9" width="18" height="8" rx="2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
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

export default async function HomePage() {
  await connection();
  ensureDatabase();
  const wedding = getDefaultWedding();
  const user = await getCurrentUser();

  const bride = wedding
    ? [wedding.bride_first_name, wedding.bride_last_name].filter(Boolean).join(" ")
    : "";
  const groom = wedding
    ? [wedding.groom_first_name, wedding.groom_last_name].filter(Boolean).join(" ")
    : "";

  const primaryHref = user ? "/admin" : "/login";
  const primaryLabel = user ? "ໄປທີ່ Dashboard" : "ເຂົ້າສູ່ລະບົບ";

  return (
    <div className="landing">
      <header className="landing-nav">
        <Link href="/" className="landing-logo" aria-label="ບັດເຊີນງານແຕ່ງງານ">
          <span className="landing-logo-icon">
            <RingsIcon />
          </span>
          <span className="landing-logo-text">ບັດເຊີນງານແຕ່ງງານ</span>
        </Link>
        <nav className="landing-nav-links" aria-label="ການນຳທາງຫຼັກ">
          {wedding && (
            <Link href={`/w/${wedding.id}`} className="landing-nav-link">
              <EyeIcon />
              ເບິ່ງບັດ
            </Link>
          )}
          <Link href={primaryHref} className="landing-btn landing-btn-primary">
            {user ? <DashboardIcon /> : <LockIcon />}
            {primaryLabel}
          </Link>
        </nav>
      </header>

      <main>
        {/* ===== Hero ===== */}
        <section className="landing-hero">
          <div className="landing-hero-inner">
            <p className="landing-eyebrow">❀ ຍິນດີຕ້ອນຮັບ ❀</p>
            <h1 className="landing-title">ບັດເຊີນງານແຕ່ງງານ</h1>

            {wedding && (
              <div className="landing-couple">
                <span className="landing-couple-name">{bride}</span>
                <span className="landing-couple-amp">&amp;</span>
                <span className="landing-couple-name">{groom}</span>
              </div>
            )}

            {wedding && (
              <p className="landing-meta">
                {wedding.date ? formatLaoDateShort(wedding.date) : ""} ·{" "}
                {wedding.location}
              </p>
            )}

            <p className="landing-subtitle">
              ສ້າງບັດເຊີນທີ່ສວຍງາມ ຈັດການລາຍຊື່ແຂກ
              ແລະ ພິມບັດພ້ອມໃຊ້ງານໄດ້ທັນທີ
            </p>

            <div className="landing-cta">
              <Link
                href={primaryHref}
                className="landing-btn landing-btn-primary landing-btn-lg"
              >
                {user ? <DashboardIcon /> : <LockIcon />}
                {primaryLabel}
              </Link>
              {wedding && (
                <Link
                  href={`/w/${wedding.id}`}
                  className="landing-btn landing-btn-ghost landing-btn-lg"
                >
                  <EyeIcon />
                  ເບິ່ງບັດເຊີນ
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ===== Features ===== */}
        <section className="landing-features" aria-labelledby="features-title">
          <h2 id="features-title" className="landing-section-title">
            ຄຸນສົມບັດຫຼັກ
          </h2>
          <div className="landing-features-grid">
            <article className="landing-feature">
              <span className="landing-feature-icon">
                <CardIcon />
              </span>
              <h3 className="landing-feature-title">ສ້າງບັດເຊີນ</h3>
              <p className="landing-feature-text">
                ສ້າງບັດເຊີນໄດ້ຫຼາຍບັດ ດ້ວຍແບບທີ່ສວຍງາມ
                ພ້ອມປັບແຕ່ງລາຍລະອຽດໄດ້ຕາມຕ້ອງການ
              </p>
            </article>
            <article className="landing-feature">
              <span className="landing-feature-icon">
                <UsersIcon />
              </span>
              <h3 className="landing-feature-title">ຈັດການແຂກ</h3>
              <p className="landing-feature-text">
                ເພີ່ມລາຍຊື່ແຂກ ຕິດຕາມສະຖານະການພິມບັດ
                ແລະ ຄົ້ນຫາແຂກໄດ້ງ່າຍໆ
              </p>
            </article>
            <article className="landing-feature">
              <span className="landing-feature-icon">
                <PrinterIcon />
              </span>
              <h3 className="landing-feature-title">ພິມບັດພ້ອມໃຊ້</h3>
              <p className="landing-feature-text">
                ພິມບັດຂະໜາດ A4 ຫຼື A7 (5×7 ນິ້ວ) ໄດ້ທັນທີ
                ພ້ອມຮູບແບບທີ່ພ້ອມພິມ
              </p>
            </article>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="landing-cta-section" aria-labelledby="cta-title">
          <h2 id="cta-title" className="landing-cta-title">
            ພ້ອມທີ່ຈະສ້າງບັດເຊີນຂອງທ່ານບໍ່?
          </h2>
          <p className="landing-cta-text">
            {user
              ? "ເຂົ້າສູ່ລະບົບຈັດການບັດເຊີນຂອງທ່ານຕໍ່ໄປ"
              : "ເຂົ້າສູ່ລະບົບເພື່ອເລີ່ມສ້າງບັດເຊີນຂອງທ່ານ"}
          </p>
          <Link
            href={primaryHref}
            className="landing-btn landing-btn-primary landing-btn-lg"
          >
            {user ? <DashboardIcon /> : <LockIcon />}
            {primaryLabel}
          </Link>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© 2026 ບັດເຊີນງານແຕ່ງງານ · ສ້າງດ້ວຍຄວາມຮັກ</p>
      </footer>
    </div>
  );
}