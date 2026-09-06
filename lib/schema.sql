-- Wedding invitation card database schema
-- Single wedding row (id is locked to 1), guests, and event schedule.

CREATE TABLE IF NOT EXISTS wedding (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  bride_title TEXT NOT NULL DEFAULT '',
  bride_first_name TEXT NOT NULL DEFAULT '',
  bride_last_name TEXT NOT NULL DEFAULT '',
  groom_title TEXT NOT NULL DEFAULT '',
  groom_first_name TEXT NOT NULL DEFAULT '',
  groom_last_name TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  time TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);