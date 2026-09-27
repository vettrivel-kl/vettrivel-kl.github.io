# Picture Flash Cards

A picture flash-card app for learning English words.

A picture appears → she taps the card → the word appears and is **spoken aloud**
→ press **Next**.

No install, no build step, no server, and — once you've run the picture
downloader — **no internet needed at all**.

---

## Opening it

Double-click **`index.html`**. That's it.

To use it on a phone or tablet on the same Wi-Fi, serve the folder instead:

```bash
cd /Users/vettrivel.k/vettri/flash-cards
python3 -m http.server 8000
```

…then open `http://<your-mac's-IP>:8000` on the tablet.

---

## Where things live

```
flash-cards/
├── index.html            the page
├── styles.css            appearance
├── app.js                behaviour
├── words.js              ← which category files to load
├── words/
│   ├── wild-animals.js   ← your words, one file per category
│   ├── farm-and-pets.js
│   ├── animal-babies.js
│   ├── opposites.js      ← prompt cards, no pictures needed
│   └── … 31 files in all
├── images/
│   ├── local-images.js   generated — the offline picture lookup
│   └── cat.jpg …         downloaded pictures
└── tools/
    └── fetch-images.mjs  downloads the pictures for offline use
```

You only ever edit **`words.js`** and the files in **`words/`**.

---

## Adding words

Open the category file, add a line, save, refresh the page.

```js
addWords("Farm & Pet Animals", [

  { word: "cat",
    image: "images/cat.jpg",
    sentence: "The cat is soft." },

  { word: "zebra",
    image: "https://upload.wikimedia.org/.../960px-Zebra.jpg" },

]);
```

| Field | Needed? | What it does |
| --- | --- | --- |
| `word` | **yes** | Shown after she taps the card, and spoken aloud |
| `image` | no | A web URL **or** a local path like `images/cat.jpg` |
| `prompt` | no | A question shown on the **front** of the card |
| `sentence` | no | A short example shown under the word |

A card with no `image` still works — it shows a placeholder and the word.

## Prompt cards

Some things aren't a picture of an object — they're a *relationship*. For those,
give the card a `prompt`: the question sits on the front, and tapping reveals
the answer exactly as it reveals a word.

```js
{ prompt: "big",              word: "small",  sentence: "Big is the opposite of small." },
{ prompt: "one tooth, two —", word: "teeth" },
{ prompt: "Someone gives you a gift", word: "Thank you" },
```

With **no** `image`, the prompt fills the space the picture would have used, in
large type. With an image as well, the prompt sits above the picture — that's how
`animal-sounds.js` works: the front shows *"The lion —"* over the lion photo, and
the answer is `roars`.

Cards with no `prompt` behave exactly as before, so nothing else needs changing.

**One gotcha.** `images/local-images.js` is keyed by the `word`, and a downloaded
picture always wins over the `image` field. So if a prompt card's answer happens
to match a word that has a picture, that picture appears on the *front* and gives
the answer away. Pick the direction that avoids it — `{ prompt: "cow", word: "bull" }`
rather than the reverse, because `cow` has a photo and `bull` doesn't.

## Adding a category

Two steps:

1. Create `words/my-topic.js`:

   ```js
   addWords("Sight Words", [
     { word: "because" },
     { word: "friend" },
   ]);
   ```

2. Add its file name to the list in `words.js`:

   ```js
   const WORD_FILES = [
     "wild-animals",
     "farm-and-pets",
     // … the rest …
     "my-topic",     // <- new
   ];
   ```

The order in `words.js` is the order the buttons appear on the start screen.
Remove a name to hide that category without deleting the file. You never need to
touch `index.html`.

### Why `.js` and not `.json`?

So that double-clicking `index.html` keeps working. A browser refuses to
`fetch()` a local `.json` file when the page is opened straight from disk
(it's blocked as a cross-origin request), which would force you to start a web
server every single time. A `<script>` file has no such restriction. The content
is plain JSON — it just sits inside one `addWords(...)` call.

### If you make a typo

A bad file can't take the app down. The other categories still load, and the
start screen shows a small note saying how many problems were found; the browser
console (View › Developer › JavaScript Console) names the file and line. Only a
broken **`words.js`** stops everything, and that shows a clear red screen.

---

## Pictures

### Downloading them for offline use

```bash
node tools/fetch-images.mjs
```

This reads your word files, downloads every web picture into `images/`, and
writes `images/local-images.js` — a word → file lookup that the app uses **in
preference to** the web URLs. Result: the app needs no internet, loads instantly,
and can't be broken by a dead link later.

Already done for all 319 bundled pictures (~58 MB). Re-run it after adding words with
web URLs; pictures you already have are skipped, so it only fetches the new ones.

**One caveat.** The script has no per-request timeout, so a slow or unresponsive
host can stall it indefinitely, and `local-images.js` is only written when the
whole run finishes — kill it early and the run's progress isn't recorded. If it
seems stuck, stop it and re-run; anything already listed in `local-images.js`
is skipped.

Your word files are **never modified** — the URLs in them stay the source of
truth. To go back to loading from the web, replace the contents of
`images/local-images.js` with `window.LOCAL_IMAGES = {};`.

If a download fails, the script says which word and why, and that card simply
falls back to its web URL.

### Finding new pictures

Any public image URL works. The bundled words come from
[Wikimedia Commons](https://commons.wikimedia.org), which is free to use and
doesn't block hotlinking. To get a link: find an image → right-click →
*Copy Image Address*.

**One gotcha.** Wikimedia only serves a fixed set of thumbnail widths. In:

```
https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/960px-Cat_August_2010-4.jpg
                                                                               ^^^
```

that number must be **250, 500, 960, or 1280**. Anything else (800, 1024, …)
returns an error and looks like a broken picture. `960` suits these cards.

### Using your own picture files

Drop them in `images/` and point at them directly — no downloader needed:

```js
{ word: "kite", image: "images/kite.jpg" }
```

Local paths work fine when opening `index.html` by double-click.

---

## Controls

| Action | Mouse / touch | Keyboard |
| --- | --- | --- |
| Reveal the word | Tap the card | `Space` or `Enter` |
| Next card | **Next** button | `Space` (once revealed), `→` |
| Previous card | **Back** button | `←` |
| Hear the word again | Speaker button | — |
| Back to the start | **✕** button | `Esc` |

**Mix up the order** on the start screen shuffles each run. Turn it off to go in
file order.

---

## Notes

- Speech uses the voice built into your browser — no audio files, works offline.
  If a browser has no speech support the speaker button is hidden and everything
  else still works.
- **To change the accent**, edit `VOICE_PREFERENCE` near the top of `app.js`:
  `['en-GB', 'en-US', 'en-AU', 'en-IN']`, tried in order, falling back to any
  English voice. `SPEECH_RATE` just below controls how slowly the word is read
  (0.85 by default).
- No scores, no accounts, nothing saved. Every run starts fresh.
- The bundled pictures are freely licensed from Wikimedia Commons. The original
  URL for each is still in the `words/` files if you ever need to credit a
  source.
