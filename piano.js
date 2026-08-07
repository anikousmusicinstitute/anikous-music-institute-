let currentSynth = new Tone.Synth().toDestination();

document.getElementById('instrument-select').addEventListener('change', (e) => {
    console.log("Selected Instrument:", e.target.value);
});

const pianoContainer = document.getElementById('piano-keyboard');
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const startOctave = 4;
const numOctaves = 2;

for (let octave = startOctave; octave < startOctave + numOctaves; octave++) {
    notes.forEach(note => {
        const fullNote = note + octave;
        const key = document.createElement('div');
        const isSharp = note.includes('#');
        key.className = isSharp ? 'piano-key black-key' : 'piano-key white-key';
        key.dataset.note = fullNote;

        key.addEventListener('mousedown', async () => {
            await Tone.start();
            currentSynth.triggerAttackRelease(fullNote, '8n');
            key.style.background = '#6200ee';
            if (typeof renderSheetMusic === 'function') renderSheetMusic(fullNote);
        });

        key.addEventListener('mouseup', () => {
            key.style.background = isSharp ? '#000' : '#fff';
        });

        pianoContainer.appendChild(key);
    });
}

window.addEventListener('keydown', async (e) => {
    if (e.repeat) return;
    await Tone.start();
    let noteMap = { 'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4', 'g': 'G4', 'h': 'A4', 'j': 'B4' };
    if (noteMap[e.key]) {
        currentSynth.triggerAttackRelease(noteMap[e.key], '8n');
        if (typeof renderSheetMusic === 'function') renderSheetMusic(noteMap[e.key]);
    }
});

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}
function onMIDISuccess(midiAccess) {
    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = (message) => {
            if (message.data[0] === 144 && message.data[2] > 0) {
                const freq = Tone.Frequency(message.data[1], "midi").toNote();
                currentSynth.triggerAttackRelease(freq, '8n');
                if (typeof renderSheetMusic === 'function') renderSheetMusic(freq);
            }
        };
    }
}
function onMIDIFailure() { console.error("MIDI access failed"); }
