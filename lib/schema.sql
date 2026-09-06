-- Wedding invitation card database schema (V2)
-- Multi-wedding: users, weddings, guests (per wedding), schedule (per wedding).

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS weddings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bride_title TEXT NOT NULL DEFAULT '',
  bride_first_name TEXT NOT NULL DEFAULT '',
  bride_last_name TEXT NOT NULL DEFAULT '',
  groom_title TEXT NOT NULL DEFAULT '',
  groom_first_name TEXT NOT NULL DEFAULT '',
  groom_last_name TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '',
  template TEXT NOT NULL DEFAULT 'classic-gold',
  design TEXT NOT NULL DEFAULT '{}',
  bride_photo_path TEXT DEFAULT NULL,
  groom_photo_path TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  position TEXT NOT NULL DEFAULT '',
  ready TEXT NOT NULL DEFAULT '',
  printed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  time TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);