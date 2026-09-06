import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "wedding.db");

// Ensure the data directory exists (SQLite needs a writable folder).
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Singleton connection, reused across hot reloads in dev.
const globalForDb = globalThis as unknown as { __weddingDb?: Database.Database };

export const db: Database.Database =
  globalForDb.__weddingDb ?? new Database(dbPath);

if (process.env.NODE_ENV !== "production") {
  globalForDb.__weddingDb = db;
}

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export { dbPath };