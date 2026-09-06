import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { ensureDatabase } from "@/lib/init";
import {
  SESSION_COOKIE,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth";

// POST /api/auth/login — verify credentials and set the session cookie.
export async function POST(req: NextRequest) {
  await connection();
  ensureDatabase();
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "ກະລຸນາໃສ່ອີເມວ ແລະ ລະຫັດຜ່ານ" },
      { status: 400 }
    );
  }

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email) as
    | { id: number; email: string; password_hash: string; name: string }
    | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json(
      { error: "ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set(SESSION_COOKIE, createSessionToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}