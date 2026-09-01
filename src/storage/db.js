// SQLite (via sql.js WASM) persisted to IndexedDB.
// Schema is intentionally simple: one kv table for the legacy JSON state shape,
// plus a structured notes table so the slide-out editor can attach larger / richer
// notes to anything in the plan. Exposes JSON + binary .sqlite export/import.
//
// Storage is browser-local: the database file lives in this browser profile's
// IndexedDB, scoped to this origin. A different device, a different browser, or a
// different deploy URL (a Vercel preview vs production) is a different database.
// Settings → Download .sqlite is the only way progress moves between them.

import initSqlJs from 'sql.js';
// Served from our own origin and content-hashed by Vite. Bundling this rather
// than pulling sql.js off a CDN at runtime means a blocked or unreachable CDN
// can no longer silently disable every write.
import sqlWasmUrl from 'sql.js/dist/sql-wasm-browser.wasm?url';

const IDB_NAME = 'edu_plan_db';
const IDB_STORE = 'blobs';
const IDB_KEY = 'sqlite-v1';
const LEGACY_LS_KEY = 'edu_plan_v2';

let SQL = null;
let sqlLoading = null;
let dbInstance = null;
let dbOpening = null;
let saveTimer = null;

// ---------- storage health ----------
// Persistence failures used to surface only as a console error, so the UI looked
// like it was saving when nothing was. Anything that can lose data reports here
// and the dashboard renders a banner.

let status = { ok: true, error: null };
const statusListeners = new Set();

function setStatus(next) {
  status = next;
  statusListeners.forEach(fn => { try { fn(status); } catch (e) {} });
}

function reportFailure(where, err) {
  console.error(`SQLite ${where} failed`, err);
  setStatus({ ok: false, error: `${where}: ${err?.message || String(err)}` });
}

function reportOk() {
  if (!status.ok) setStatus({ ok: true, error: null });
}

export function getStorageStatus() {
  return status;
}

// Returns an unsubscribe function.
export function subscribeStorageStatus(fn) {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

async function loadSqlJs() {
  if (SQL) return SQL;
  // Cached so concurrent callers share one initialisation.
  if (!sqlLoading) {
    sqlLoading = initSqlJs({ locateFile: () => sqlWasmUrl })
      .then(mod => { SQL = mod; return mod; })
      .catch(err => { sqlLoading = null; throw err; });
  }
  return sqlLoading;
}

// The live connection is cached rather than reopened per write. Opening one is
// async, and on the unload path there is no time for that round trip — holding
// it open is what lets the last save start synchronously. See persistSync().
let idbConn = null;
let idbConnPromise = null;

function openIdb() {
  if (idbConn) return Promise.resolve(idbConn);
  if (idbConnPromise) return idbConnPromise;
  idbConnPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => {
      const db = req.result;
      // Drop the cache if the connection dies, so the next write reopens.
      db.onclose = () => { idbConn = null; idbConnPromise = null; };
      db.onversionchange = () => { try { db.close(); } catch (e) {} idbConn = null; idbConnPromise = null; };
      idbConn = db;
      resolve(db);
    };
    req.onerror = () => { idbConnPromise = null; reject(req.error); };
    // Private-mode Safari and some locked-down profiles neither resolve nor
    // reject; without this the very first save would hang forever.
    req.onblocked = () => { idbConnPromise = null; reject(new Error('IndexedDB blocked')); };
  });
  return idbConnPromise;
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
    tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted'));
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
  // Cached so that a note read and a state write racing on first paint can't
  // each build their own Database — whichever exported last used to win, and
  // the other's rows were silently dropped.
  if (!dbOpening) {
    dbOpening = (async () => {
      const sql = await loadSqlJs();
      let saved = null;
      try {
        saved = await idbGet(IDB_KEY);
      } catch (e) {
        // A read failure must not cost us the ability to save later.
        reportFailure('load', e);
      }
      const db = saved ? new sql.Database(new Uint8Array(saved)) : new sql.Database();
      ensureSchema(db);
      dbInstance = db;
      return db;
    })().catch(err => {
      dbOpening = null;
      reportFailure('open', err);
      throw err;
    });
  }
  return dbOpening;
}

async function persistNow() {
  if (!dbInstance) return;
  try {
    const bytes = dbInstance.export();
    await idbPut(IDB_KEY, bytes);
    reportOk();
  } catch (e) {
    reportFailure('save', e);
    throw e;
  }
}

// Best-effort save with no awaits before the write is queued. The browser only
// guarantees an IndexedDB transaction survives teardown if it was opened while
// the page was still alive, so on unload we must reach `put()` synchronously —
// an `await` first (as a fresh connection would need) loses the write outright.
// Returns false if there is no live connection to ride, in which case the caller
// falls back to the async path.
function persistSync() {
  if (!dbInstance || !idbConn) return false;
  try {
    const bytes = dbInstance.export();
    const tx = idbConn.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(bytes, IDB_KEY);
    return true;
  } catch (e) {
    console.error('SQLite unload save failed', e);
    return false;
  }
}

// Debounced save. `delay` is how long to coalesce for:
//   0   — discrete actions (ticking a box, changing a setting). Still coalesces
//         a burst within the same task, but commits on the next tick, so closing
//         the tab straight after a click cannot lose it. Browsers abort
//         IndexedDB transactions started during navigation, so the only reliable
//         way to survive that is to have already written.
//   400 — free text (the note editor), where a write per keystroke is wasteful.
export function scheduleSave(delay = 400) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    persistNow().catch(() => {});
  }, delay);
}

// Cancel any pending debounced save and persist immediately.
export async function flushSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  await persistNow();
}

// Best-effort persist on the way out, covering note text still inside its 400ms
// debounce. `pagehide` and the hidden transition of `visibilitychange` are the
// two events that actually fire on mobile Safari and on Android task-switching,
// where `beforeunload` does not. This is a backstop only: browsers may abort an
// IndexedDB transaction opened during teardown, which is why progress writes go
// through scheduleSave(0) and never depend on this firing.
export function installUnloadFlush() {
  if (typeof window === 'undefined') return () => {};
  const flush = () => {
    if (!saveTimer) return; // nothing pending
    clearTimeout(saveTimer);
    saveTimer = null;
    // Synchronous first — it is the only variant that reliably commits while
    // the page is being torn down. The async path is just a fallback for the
    // case where no connection is open yet (i.e. nothing has been saved).
    if (!persistSync()) persistNow().catch(() => {});
  };
  const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', onVisibility);
  return () => {
    window.removeEventListener('pagehide', flush);
    document.removeEventListener('visibilitychange', onVisibility);
  };
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
      await flushSave();
      // Remove the legacy key so it can never resurrect old progress
      // (e.g. after a reset) once it is safely in SQLite.
      localStorage.removeItem(LEGACY_LS_KEY);
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
  scheduleSave(0);   // progress toggles must not sit in a debounce window
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
  scheduleSave();    // typing: coalesce keystrokes, flushed on close/hide
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
  dbOpening = Promise.resolve(dbInstance);
  ensureSchema(dbInstance);
  await persistNow();
}

export async function resetDb() {
  const sql = await loadSqlJs();
  if (dbInstance) {
    try { dbInstance.close(); } catch (e) {}
  }
  dbInstance = new sql.Database();
  dbOpening = Promise.resolve(dbInstance);
  ensureSchema(dbInstance);
  // Also clear the legacy localStorage state so the first-boot migration
  // can't restore pre-reset progress.
  try { localStorage.removeItem(LEGACY_LS_KEY); } catch (e) {}
  await persistNow();
}
