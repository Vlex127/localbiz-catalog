CREATE TABLE IF NOT EXISTS catalogs (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  business    TEXT NOT NULL DEFAULT 'My Store',
  description TEXT,
  is_published INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT (datetime('now'))
);

-- Migration: add description column for older databases
ALTER TABLE catalogs ADD COLUMN description TEXT;

CREATE TABLE IF NOT EXISTS products (
  id       TEXT PRIMARY KEY,
  catalog_id TEXT NOT NULL REFERENCES catalogs(id),
  name     TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price    REAL,
  currency TEXT DEFAULT 'INR',
  image    TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
