# macOS Local AI Dictation Pipeline (`whisper.cpp`)

Fast, private, and offline speech-to-text / translation pipeline running natively on Apple Silicon GPU/Neural Engine.

---

## 1. Installed Architecture

* **Engine:** `whisper-cli` from `whisper.cpp` (Metal GPU accelerated).
* **Audio Capture:** `sox` (`rec`) recording mono audio cleanly into `/tmp/dictate.wav`.
* **Models:** Stored in `~/.whisper-models/`:
  * `ggml-small.bin` (~465MB) — Blazing fast, ideal for everyday coding & terminal dictation.
  * `ggml-medium.bin` (~1.4GB) — Higher accuracy, superior punctuation and accent handling.
* **Text Injection:** Instant paste via `Cmd+V` (with automatic clipboard preservation) and fallback to clipboard copy if permissions are pending.

---

## 2. CLI Commands Available

Both scripts are installed in your PATH at `~/.local/bin/`:

### A. Toggle Dictation (`dictate`)
Run `dictate` once to start recording (plays **Ping** chime).  
Run `dictate` again to stop and transcribe (plays **Pop** chime followed by **Glass** chime upon completion).

```bash
dictate
```

### B. Manage Models (`dictate-model`)
Inspect or switch between `small` and `medium` models anytime:

```bash
# Check current active model
dictate-model status

# Switch to small
dictate-model small

# Switch to medium
dictate-model medium

# Toggle between small and medium
dictate-model toggle
```

---

## 3. Global Hotkey Setup (Recommended)

To use Push-to-Talk / Toggle dictation anywhere in macOS (including in `gemini-cli`), bind `dictate` to a keyboard shortcut.

### Option A: Using Raycast (Easiest & Fastest)
1. Open **Raycast Settings** (`Cmd + ,`) -> **Extensions** -> **Script Commands**.
2. Click **Add Script Directory** and choose:
   ```
   /Users/vettrivel.k/vettri/vettrivel-kl.github.io/scripts/dictation
   ```
3. Set a Hotkey for `dictate` (e.g. `Option + Space` or `Cmd + Shift + D`).

### Option B: Using macOS Shortcuts App
1. Open the **Shortcuts** app on macOS.
2. Click **+** to create a new shortcut. Name it **Dictate**.
3. Add action: **Run Shell Script**.
4. Set the script to:
   ```bash
   /Users/vettrivel.k/.local/bin/dictate
   ```
5. In Shortcut details (right sidebar):
   * Enable **Use as Quick Action**.
   * Click **Add Keyboard Shortcut** (e.g. `Cmd + Shift + D` or `Option + Space`).

---

## 4. Accessibility Permissions (For Auto-Paste)

For `osascript` to automatically trigger `Cmd+V` at your cursor, macOS requires Accessibility permission for the host application triggering the command:

1. Open **System Settings** -> **Privacy & Security** -> **Accessibility**.
2. Enable the toggle for whichever tool triggers the script (e.g., **Raycast**, **Shortcuts**, or **Terminal / iTerm2**).
3. If permissions are ever missing, the script will show a macOS notification and keep the transcribed text safely copied to your clipboard so you can press `Cmd+V` manually.
