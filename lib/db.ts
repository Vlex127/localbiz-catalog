import { createClient } from '@libsql/client';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS catalogs (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  business    TEXT NOT NULL DEFAULT 'My Store',
  description TEXT,
  is_published INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT (datetime('now'))
);

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
`;

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (_client) return _client;

  const url = process.env.DATABASE_URL;
  const token = process.env.DATABASE_TOKEN;

  if (url && token) {
    _client = createClient({ url, authToken: token });
  } else {
    _client = createClient({ url: `file:${process.cwd()}/data.db` });
  }

  return _client;
}

export async function initDB() {
  const client = getClient();
  const statements = SCHEMA.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    try { await client.execute(stmt); } catch {}
  }
}

export { getClient };
