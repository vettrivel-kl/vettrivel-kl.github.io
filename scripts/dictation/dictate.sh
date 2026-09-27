#!/usr/bin/env bash
# dictate: High-speed local offline speech-to-text / translation pipeline
# Uses sox (rec) for capture, whisper.cpp with Metal acceleration, and instant paste via osascript.

set -euo pipefail

# Ensure Homebrew and user local binaries are in PATH for macOS Shortcuts / Automator
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"

PID_FILE="/tmp/dictate.pid"
AUDIO_FILE="/tmp/dictate.wav"
OUTPUT_BASE="/tmp/dictate_out"
OUTPUT_TXT="/tmp/dictate_out.txt"
CONFIG_FILE="$HOME/.dictate_model"
MODELS_DIR="$HOME/.whisper-models"

# Sound effects
SOUND_START="/System/Library/Sounds/Ping.aiff"
SOUND_STOP="/System/Library/Sounds/Pop.aiff"
SOUND_SUCCESS="/System/Library/Sounds/Glass.aiff"
SOUND_CANCEL="/System/Library/Sounds/Basso.aiff"

play_sound() {
    local sound="$1"
    if [[ -f "$sound" ]]; then
        afplay "$sound" &
    fi
}

# Determine if we are currently recording
if [[ -f "$PID_FILE" ]]; then
    REC_PID=$(cat "$PID_FILE" 2>/dev/null || echo "")

    # Check if the recording process is actually running
    if [[ -n "$REC_PID" ]] && kill -0 "$REC_PID" 2>/dev/null; then
        # 1. Stop recording (SIGINT ensures Sox flushes the WAV headers cleanly)
        kill -INT "$REC_PID" 2>/dev/null || kill -TERM "$REC_PID" 2>/dev/null
        wait "$REC_PID" 2>/dev/null || sleep 0.2
        rm -f "$PID_FILE"
        play_sound "$SOUND_STOP"

        # 2. Resolve model preference
        MODEL_NAME="small"
        if [[ -f "$CONFIG_FILE" ]]; then
            MODEL_NAME=$(cat "$CONFIG_FILE")
        fi

        MODEL_PATH="$MODELS_DIR/ggml-${MODEL_NAME}.bin"
        if [[ ! -f "$MODEL_PATH" ]]; then
            # Fallback to small if configured model doesn't exist
            MODEL_PATH="$MODELS_DIR/ggml-small.bin"
        fi

        if [[ ! -f "$AUDIO_FILE" ]]; then
            play_sound "$SOUND_CANCEL"
            exit 1
        fi

        # 3. Transcribe and translate to English using whisper.cpp Metal GPU engine
        rm -f "$OUTPUT_TXT"
        whisper-cli \
            -m "$MODEL_PATH" \
            -f "$AUDIO_FILE" \
            -np \
            -nt \
            --translate \
            -l auto \
            -otxt \
            -of "$OUTPUT_BASE" > /dev/null 2>&1 || true

        # 4. Check transcription result
        if [[ -f "$OUTPUT_TXT" ]]; then
            # Clean and trim whitespace/newlines
            TRANSCRIBED_TEXT=$(sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' "$OUTPUT_TXT" | tr '\r\n' ' ' | sed 's/  */ /g' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

            # Ignore empty or blank audio markers
            if [[ -n "$TRANSCRIBED_TEXT" && "$TRANSCRIBED_TEXT" != "[BLANK_AUDIO]" ]]; then
                # Preserve existing clipboard
                OLD_CLIPBOARD=$(pbpaste 2>/dev/null || true)

                # Inject text into clipboard
                printf "%s" "$TRANSCRIBED_TEXT" | pbcopy

                # Emulate Cmd+V with fallback
                if osascript -e 'tell application "System Events" to keystroke "v" using command down' 2>/dev/null; then
                    # Give active app time to register the paste event before restoring clipboard
                    sleep 0.25
                    printf "%s" "$OLD_CLIPBOARD" | pbcopy
                    play_sound "$SOUND_SUCCESS"
                else
                    # Accessibility permission missing for keystroke emulation
                    # Keep transcription in clipboard so user can manually Cmd+V
                    osascript -e 'display notification "Transcribed text copied to clipboard! (Grant Accessibility permissions to enable auto-paste)" with title "Dictate: Copied to Clipboard"' 2>/dev/null || true
                    play_sound "$SOUND_SUCCESS"
                fi
                exit 0
            fi
        fi

        # If audio was blank or transcription failed
        play_sound "$SOUND_CANCEL"
        exit 0
    else
        # Stale PID file
        rm -f "$PID_FILE"
    fi
fi

# NOT currently recording: Start recording
rm -f "$AUDIO_FILE" "$OUTPUT_TXT" "$PID_FILE"
play_sound "$SOUND_START"

# Start recording in background (recording mono audio)
rec -q -c 1 "$AUDIO_FILE" >/dev/null 2>&1 &
echo $! > "$PID_FILE"
