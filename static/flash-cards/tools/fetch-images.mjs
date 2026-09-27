/* ============================================================
   Download every picture once, so the app works offline.

     node tools/fetch-images.mjs

   Reads the word files listed in words.js, downloads each remote
   picture into images/, and writes images/local-images.js — a
   word -> local file lookup the app prefers over the web URL.

   Your word files are never modified: the URLs in them stay the
   source of truth. Delete images/ and re-run to start over, or
   empty images/local-images.js to go back to loading from the web.

   Safe to re-run: pictures already downloaded are skipped, so
   after adding a few words you only fetch the new ones.
   ============================================================ */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = join(ROOT, 'images');
const LOOKUP_FILE = join(IMAGES_DIR, 'local-images.js');

const UA = 'FlashCardsLocal/1.0 (personal educational project)';
const RETRIES = 5;
const PAUSE_MS = 600;      // be polite between downloads
const OK_TYPES = /^image\/(jpeg|png|gif|webp|avif|svg\+xml)$/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const slug = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'word';

function extensionFor(url, contentType) {
  const fromType = {
    'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif',
    'image/webp': '.webp', 'image/avif': '.avif', 'image/svg+xml': '.svg',
  }[contentType];
  if (fromType) return fromType;
  const m = String(url).split('?')[0].match(/\.(jpe?g|png|gif|webp|avif|svg)$/i);
  return m ? '.' + m[1].toLowerCase().replace('jpeg', 'jpg') : '.jpg';
}

/* ---------- read the word files the same way the browser does ---------- */

function readWordFiles() {
  const manifestSrc = readFileSync(join(ROOT, 'words.js'), 'utf8');
  let files;
  try {
    files = new Function(manifestSrc + '\n;return typeof WORD_FILES !== "undefined" ? WORD_FILES : undefined;')();
  } catch (e) {
    throw new Error('words.js could not be read: ' + e.message);
  }
  if (!Array.isArray(files) || !files.length) {
    throw new Error('words.js must define a non-empty WORD_FILES list.');
  }

  const cards = [];
  for (const name of files) {
    const path = join(ROOT, 'words', name + '.js');
    if (!existsSync(path)) {
      console.warn(`  ! words/${name}.js is listed in words.js but does not exist — skipping`);
      continue;
    }
    const src = readFileSync(path, 'utf8');
    try {
      new Function('addWords', src)((category, list) => {
        if (!Array.isArray(list)) return;
        for (const c of list) {
          if (c && typeof c.word === 'string' && c.word.trim()) {
            cards.push({ word: c.word.trim(), image: c.image, category, file: name });
          }
        }
      });
    } catch (e) {
      console.warn(`  ! words/${name}.js has an error and was skipped: ${e.message}`);
    }
  }
  return cards;
}

/* ---------- download one picture ---------- */

async function download(url) {
  let lastError = 'unknown error';
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    let res;
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA } });
    } catch (e) {
      lastError = e.message;
      await sleep(1500 * attempt);
      continue;
    }
    // Wikimedia rate-limits bursts; back off and try again.
    if (res.status === 429 || res.status >= 500) {
      lastError = 'HTTP ' + res.status;
      await sleep(3000 * attempt);
      continue;
    }
    if (!res.ok) return { error: 'HTTP ' + res.status };

    const type = (res.headers.get('content-type') || '').split(';')[0].trim();
    if (!OK_TYPES.test(type)) {
      return { error: `not an image (got ${type || 'no content-type'})` };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (!buf.length) return { error: 'empty response' };
    return { buf, type };
  }
  return { error: lastError + ` (gave up after ${RETRIES} tries)` };
}

/* ---------- main ---------- */

console.log('Reading word files...');
const cards = readWordFiles();
console.log(`Found ${cards.length} words.\n`);

mkdirSync(IMAGES_DIR, { recursive: true });

// Keep whatever was already downloaded, so re-runs are cheap.
const lookup = {};
if (existsSync(LOOKUP_FILE)) {
  try {
    const prev = new Function(
      'window',
      readFileSync(LOOKUP_FILE, 'utf8') + '\n;return window.LOCAL_IMAGES;'
    )({});
    if (prev && typeof prev === 'object') Object.assign(lookup, prev);
  } catch { /* regenerate from scratch */ }
}

let downloaded = 0, skipped = 0, localAlready = 0;
const failures = [];
const usedNames = new Map();

for (const card of cards) {
  const image = typeof card.image === 'string' ? card.image.trim() : '';

  if (!image) { continue; }

  // Already a local path in the word file — nothing to fetch.
  if (!/^https?:\/\//i.test(image)) {
    localAlready++;
    continue;
  }

  // Two different words could slug the same; keep them distinct.
  let base = slug(card.word);
  if (usedNames.has(base) && usedNames.get(base) !== card.word) {
    base = base + '-' + slug(card.category);
  }
  usedNames.set(base, card.word);

  // If we already have a file for this word, keep it.
  const existing = lookup[card.word];
  if (existing) {
    const p = join(ROOT, existing);
    if (existsSync(p) && statSync(p).size > 0) { skipped++; continue; }
  }

  process.stdout.write(`  ${card.word.padEnd(12)} `);
  const result = await download(image);
  if (result.error) {
    console.log(`FAILED — ${result.error}`);
    failures.push({ word: card.word, file: card.file, image, error: result.error });
    await sleep(PAUSE_MS);
    continue;
  }

  const rel = 'images/' + base + extensionFor(image, result.type);
  writeFileSync(join(ROOT, rel), result.buf);
  lookup[card.word] = rel;
  downloaded++;
  console.log(`ok  ${(result.buf.length / 1024).toFixed(0).padStart(4)} KB  -> ${rel}`);
  await sleep(PAUSE_MS);
}

/* ---------- write the lookup the app reads ---------- */

const entries = Object.keys(lookup).sort();
let out = `/* GENERATED by tools/fetch-images.mjs — do not edit by hand.
   Maps each word to its downloaded picture, so the app works offline.
   The app uses these in preference to the web URLs in words/.
   Re-run:  node tools/fetch-images.mjs
   To go back to loading pictures from the web, replace the object
   below with an empty one: window.LOCAL_IMAGES = {}; */

window.LOCAL_IMAGES = {
`;
for (const word of entries) out += `  ${JSON.stringify(word)}: ${JSON.stringify(lookup[word])},\n`;
out += `};\n`;
writeFileSync(LOOKUP_FILE, out);

/* ---------- report ---------- */

console.log('\n' + '-'.repeat(52));
console.log(`downloaded now      ${downloaded}`);
console.log(`already had         ${skipped}`);
if (localAlready) console.log(`already local paths ${localAlready}`);
console.log(`total offline       ${entries.length} of ${cards.length} words`);

if (failures.length) {
  console.log(`\n${failures.length} picture(s) could not be downloaded:`);
  for (const f of failures) {
    console.log(`  - ${f.word}  (words/${f.file}.js)\n      ${f.error}\n      ${f.image}`);
  }
  console.log('\nThose words still work — they fall back to their web URL, and');
  console.log('show a placeholder plus the word if that fails too.');
  console.log('Fix or replace the URLs and re-run to pick them up.');
  process.exitCode = 1;
} else if (entries.length) {
  console.log('\nAll pictures are local — the app now works with no internet.');
}
