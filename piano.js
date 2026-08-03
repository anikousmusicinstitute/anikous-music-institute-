// --- Core Piano Logic & State Handling ---

function pressKey(note, key) {
    if (activeKeys.has(note)) return;

    activeKeys.add(note);
    key?.classList.add("active");

    if (typeof playSound === "function") {
        playSound(note);
    }

    updateDisplay();
}

function releaseKey(note, key) {
    if (holdMode) return;

    activeKeys.delete(note);
    key?.classList.remove("active");

    if (typeof stopSound === "function") {
        stopSound(note);
    }

    updateDisplay();
}

function updateDisplay() {
    const sortedNotes = [...activeKeys].sort((a, b) => a - b);
    
    const names = sortedNotes.map(n => `${notes[n % 12]}${Math.floor(n / 12) - 1}`);

    const keyShow = document.getElementById("keyShow");
    const chordShow = document.getElementById("chordShow");

    keyShow.textContent = (showKeys && names.length) ? names.join(" ") : "-";

    chordShow.textContent = (showChords && activeKeys.size >= 3 && typeof findChord === "function")
        ? findChord(sortedNotes)
        : "-";
}

// --- Toggle Controls ---

function toggleKeys() {
    showKeys = !showKeys;
    const btn = document.getElementById("keysBtn");
    
    btn.classList.toggle("active", showKeys);
    btn.textContent = showKeys ? "🎹 Keys ON" : "🎹 Keys OFF";

    updateDisplay();
}

function toggleChords() {
    showChords = !showChords;
    const btn = document.getElementById("chordsBtn");
    
    btn.classList.toggle("active", showChords);
    btn.textContent = showChords ? "🎵 Chords ON" : "🎵 Chords OFF";

    updateDisplay();
}

function toggleHold() {
    holdMode = !holdMode;
    const btn = document.getElementById("holdBtn");
    
    btn.classList.toggle("active", holdMode);
    btn.textContent = holdMode ? "✋ HOLD ON" : "✋ HOLD OFF";

    if (!holdMode) {
        activeKeys.forEach(note => {
            if (typeof stopSound === "function") {
                stopSound(note);
            }
            document.querySelector(`[data-note="${note}"]`)?.classList.remove("active");
        });

        activeKeys.clear();
        pointerMap?.clear();
        updateDisplay();
    }
}

// --- Initialization ---

if (typeof createPiano === "function") {
    createPiano();
}
updateDisplay();
