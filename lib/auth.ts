/**
 * Authentication helpers — dependency-free:
 * - Passwords hashed with Node's scrypt (salt:hash format).
 * - Sessions are HMAC-SHA256 signed cookies (userId.exp.sig).
 * - The signing secret is generated once and stored in data/.secret (gitignored).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";

export const SESSION_COOKIE = "wedding_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface User {
  id: number;
  email: string;
  name: string;
}

function getSecret(): string {
  const file = path.join(process.cwd(), "data", ".secret");
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, "utf-8").trim();
  }
  const secret = crypto.randomBytes(32).toString("hex");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, secret, { mode: 0o600 });
  return secret;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(candidate, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function createSessionToken(userId: number): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${userId}.${exp}`;
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userIdStr, expStr, sig] = parts;
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(`${userIdStr}.${expStr}`)
    .digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (Number(expStr) < Date.now()) return null;
  const userId = parseInt(userIdStr, 10);
  return Number.isNaN(userId) ? null : userId;
}

/** Returns the logged-in user, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const userId = verifySessionToken(token);
  if (!userId) return null;
  const row = db
    .prepare("SELECT id, email, name FROM users WHERE id = ?")
    .get(userId) as User | undefined;
  return row ?? null;
}

/** For server components: redirects to /login when not authenticated. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}