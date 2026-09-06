import { connection } from "next/server";
import { requireUser } from "@/lib/auth";
import { ensureDatabase } from "@/lib/init";
import AdminNav from "@/components/admin/AdminNav";
import "./admin.css";

export const metadata = {
  title: "ລະບົບຈັດການ | ບັດເຊີນງານແຕ່ງງານ",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  ensureDatabase();
  const user = await requireUser();

  return (
    <div className="admin-shell">
      <AdminNav userEmail={user.email} />
      <main className="admin-content">{children}</main>
    </div>
  );
}