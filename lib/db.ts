import { createClient } from '@libsql/client';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data.db');

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (_client) return _client;
  _client = createClient({ url: `file:${DB_PATH}` });
  return _client;
}

export async function initDB() {
  const client = getClient();
  const schema = readFileSync(join(process.cwd(), 'schema.sql'), 'utf-8');
  const statements = schema.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    await client.execute(stmt);
  }
}

export { getClient };
