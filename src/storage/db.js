// SQLite (via sql.js WASM) persisted to IndexedDB.
// Schema is intentionally simple: one kv table for the legacy JSON state shape,
// plus a structured notes table so the slide-out editor can attach larger / richer
// notes to anything in the plan. Exposes JSON + binary .sqlite export/import.

const IDB_NAME = 'edu_plan_db';
const IDB_STORE = 'blobs';
const IDB_KEY = 'sqlite-v1';
const LEGACY_LS_KEY = 'edu_plan_v2';

let SQL = null;
let dbInstance = null;
let saveTimer = null;

async function loadSqlJs() {
  if (SQL) return SQL;
  // Load sql.js from CDN — keeps the bundle small.
  if (!window.initSqlJs) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  SQL = await window.initSqlJs({
    locateFile: (file) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
  });
  return SQL;
}

function openIdb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key) {
  const db = await openIdb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(key, value) {
  const db = await openIdb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function ensureSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS kv (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notes (
      target_type TEXT NOT NULL,
      target_id   TEXT NOT NULL,
      body        TEXT NOT NULL DEFAULT '',
      updated_at  INTEGER NOT NULL,
      PRIMARY KEY (target_type, target_id)
    );
  `);
}

export async function openDB() {
  if (dbInstance) return dbInstance;
  const sql = await loadSqlJs();
  const saved = await idbGet(IDB_KEY);
  if (saved) {
    dbInstance = new sql.Database(new Uint8Array(saved));
  } else {
    dbInstance = new sql.Database();
  }
  ensureSchema(dbInstance);
  return dbInstance;
}

async function persistNow() {
  if (!dbInstance) return;
  const bytes = dbInstance.export();
  await idbPut(IDB_KEY, bytes);
}

// Debounced save — coalesces rapid edits (typing in note panel, slider, etc).
export function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    persistNow().catch(e => console.error('SQLite persist failed', e));
  }, 400);
}

// ---------- state JSON (legacy shape) ----------

export async function readStateJson() {
  const db = await openDB();
  const res = db.exec(`SELECT value FROM kv WHERE key='state'`);
  if (res.length && res[0].values.length) {
    try { return JSON.parse(res[0].values[0][0]); } catch (e) {
      console.warn('Bad state JSON in DB', e);
    }
  }
  // First boot: try to migrate from localStorage (legacy).
  try {
    const raw = localStorage.getItem(LEGACY_LS_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      await writeStateJson(obj);
      return obj;
    }
  } catch (e) {
    console.warn('Legacy migration skipped', e);
  }
  return null;
}

export async function writeStateJson(obj) {
  const db = await openDB();
  const json = JSON.stringify(obj);
  const stmt = db.prepare(`INSERT INTO kv (key, value) VALUES ('state', $v)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value`);
  stmt.run({ $v: json });
  stmt.free();
  scheduleSave();
}

// ---------- notes table ----------

export async function readNote(targetType, targetId) {
  const db = await openDB();
  const stmt = db.prepare(`SELECT body FROM notes WHERE target_type=$t AND target_id=$i`);
  stmt.bind({ $t: targetType, $i: String(targetId) });
  let body = '';
  if (stmt.step()) body = stmt.get()[0];
  stmt.free();
  return body;
}

export async function writeNote(targetType, targetId, body) {
  const db = await openDB();
  const now = Date.now();
  const stmt = db.prepare(`
    INSERT INTO notes (target_type, target_id, body, updated_at) VALUES ($t, $i, $b, $u)
    ON CONFLICT(target_type, target_id) DO UPDATE SET body=excluded.body, updated_at=excluded.updated_at
  `);
  stmt.run({ $t: targetType, $i: String(targetId), $b: body || '', $u: now });
  stmt.free();
  scheduleSave();
}

export async function listAllNotes() {
  const db = await openDB();
  const res = db.exec(`SELECT target_type, target_id, body, updated_at FROM notes WHERE length(body) > 0 ORDER BY updated_at DESC`);
  if (!res.length) return [];
  return res[0].values.map(([target_type, target_id, body, updated_at]) => ({
    target_type, target_id, body, updated_at,
  }));
}

// ---------- backup / restore ----------

export async function exportSqlite() {
  const db = await openDB();
  return db.export(); // Uint8Array
}

export async function importSqlite(bytes) {
  const sql = await loadSqlJs();
  if (dbInstance) {
    try { dbInstance.close(); } catch (e) {}
  }
  dbInstance = new sql.Database(new Uint8Array(bytes));
  ensureSchema(dbInstance);
  await persistNow();
}

export async function resetDb() {
  const sql = await loadSqlJs();
  if (dbInstance) {
    try { dbInstance.close(); } catch (e) {}
  }
  dbInstance = new sql.Database();
  ensureSchema(dbInstance);
  await persistNow();
}
