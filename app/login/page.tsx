import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ensureDatabase } from "@/lib/init";
import LoginForm from "@/components/auth/LoginForm";
import "./login.css";

export const metadata = {
  title: "ເຂົ້າສູ່ລະບົບ | ບັດເຊີນງານແຕ່ງງານ",
};

function RingsIcon() {
  return (
    <svg
      width="30"
      height="30"
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

export default async function LoginPage() {
  await connection();
  ensureDatabase();
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <RingsIcon />
        </div>
        <h1 className="login-title">ບັດເຊີນງານແຕ່ງງານ</h1>
        <p className="login-subtitle">ເຂົ້າສູ່ລະບົບເພື່ອຈັດການບັດເຊີນ</p>
        <LoginForm />
      </div>
    </div>
  );
}