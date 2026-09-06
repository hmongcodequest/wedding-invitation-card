"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function RingsIcon() {
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
      <circle cx="9" cy="14" r="6" />
      <circle cx="15" cy="14" r="6" />
      <path d="M12 8l1.5-3.5L15 8" />
      <path d="M12 8l-1.5-3.5L9 8" />
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
      strokeWidth="1.8"
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

function CardIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: <DashboardIcon />, exact: true },
    { href: "/admin/weddings", label: "ບັດເຊີນ", icon: <CardIcon />, exact: false },
    { href: "/", label: "ເບິ່ງບັດ", icon: <EyeIcon />, exact: false },
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header className="admin-nav">
      <Link href="/admin" className="admin-nav-brand" aria-label="ລະບົບບັດເຊີນງານແຕ່ງງານ">
        <span className="admin-nav-brand-icon">
          <RingsIcon />
        </span>
        <span className="admin-nav-brand-text">ລະບົບບັດເຊີນງານແຕ່ງງານ</span>
      </Link>

      <nav className="admin-nav-links" aria-label="ການນຳທາງຫຼັກ">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`admin-nav-link${isActive(link.href, link.exact) ? " active" : ""}`}
            aria-current={isActive(link.href, link.exact) ? "page" : undefined}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="admin-nav-user">
        <span className="admin-user-email">{userEmail}</span>
        <LogoutButton />
      </div>
    </header>
  );
}

function LogoutButton() {
  return (
    <button
      className="admin-logout-btn"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }}
    >
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
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
      ອອກຈາກລະບົບ
    </button>
  );
}