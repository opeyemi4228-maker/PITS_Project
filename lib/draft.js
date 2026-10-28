"use client";

/**
 * A return, kept on the agent's own phone until the server has it.
 *
 * ── THE FAILURE THIS EXISTS FOR ────────────────────────────────────────────
 * An agent stands at a booth at 9pm with a result sheet in one hand and a phone
 * in the other, types seven party figures and four totals off the sheet, presses
 * file, and the request dies on a network that was never going to hold. Before
 * this, everything they typed was gone and the whole job started again — at the
 * one moment in the entire product where a person is least able to do it twice.
 *
 * So every keystroke is written here, and nothing is cleared until the server
 * has confirmed the write. A crashed tab, a dead battery, a walk out of signal
 * and back: the figures are still there.
 *
 * ── WHY TWO STORES ─────────────────────────────────────────────────────────
 * The figures go in localStorage, which is synchronous and cannot fail halfway
 * — the right trade for eleven short numbers written on every keypress.
 *
 * The photograph cannot: localStorage holds strings, and base64ing a 300KB JPEG
 * into it wastes a third of it and blocks the main thread doing it. So the
 * prepared blob goes to IndexedDB, which stores Blobs natively and
 * asynchronously. It is more machinery for one value, and it is the difference
 * between a retry that needs the agent to photograph the sheet again and one
 * that does not.
 *
 * ── WHAT THIS IS NOT ───────────────────────────────────────────────────────
 * Not a queue, and not a background sync. Nothing here sends anything on its
 * own. A return is filed when a named person presses a button, which is the
 * only way a declaration that says "I am standing at this booth" can honestly
 * be made. This just means they never have to type it twice.
 */

const PREFIX = "map.return.";
const DB_NAME = "map-returns";
const STORE = "sheets";

/** One draft per (election, booth). An agent files four contests from one unit. */
export function draftKey(electionId, pollingUnitId) {
  return `${PREFIX}${electionId}.${pollingUnitId}`;
}

/* ------------------------------------------------------------- the figures */

export function saveDraft(key, draft) {
  try {
    localStorage.setItem(key, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    /* Private browsing, or a full quota. A draft that cannot be saved is a
       feature that quietly does not work — never an error thrown into the face
       of somebody in the middle of filing. */
  }
}

export function readDraft(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    return draft && typeof draft === "object" ? draft : null;
  } catch {
    return null;
  }
}

export function clearDraft(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  void deleteSheet(key);
}

/* --------------------------------------------------------- the photograph */

function open() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("No IndexedDB"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(mode, run) {
  const db = await open();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const request = run(tx.objectStore(STORE));
      // `onerror` on the request, `onabort` on the transaction: a quota failure
      // surfaces on one and a blocked upgrade on the other.
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

/** Keep the already-downscaled blob, not the camera original. */
export async function saveSheet(key, blob, name) {
  try {
    await withStore("readwrite", (store) => store.put({ blob, name, savedAt: Date.now() }, key));
    return true;
  } catch {
    return false;
  }
}

export async function readSheet(key) {
  try {
    const row = await withStore("readonly", (store) => store.get(key));
    return row?.blob instanceof Blob ? row : null;
  } catch {
    return null;
  }
}

export async function deleteSheet(key) {
  try {
    await withStore("readwrite", (store) => store.delete(key));
  } catch {
    /* ignore */
  }
}
