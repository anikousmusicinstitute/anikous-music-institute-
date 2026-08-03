const NOTE_NAMES = [
    "C", "C#", "D", "D#",
    "E", "F", "F#", "G",
    "G#", "A", "A#", "B"
];

const CHORDS = {
    "0,4,7": "Major",
    "0,3,7": "Minor",
    "0,3,6": "Diminished",
    "0,4,8": "Augmented",
    "0,5,7": "Sus4",
    "0,2,7": "Sus2",
    "0,4,7,10": "7",
    "0,4,7,11": "Maj7",
    "0,3,7,10": "m7",
    "0,3,6,10": "m7♭5",
    "0,3,6,9": "Dim7",
    "0,4,8,10": "Aug7",
    "0,2,4,7": "Add9",
    "0,4,7,9": "6",
    "0,3,7,9": "m6"
};

function findChord(notes) {
    if (!notes || notes.length < 3) {
        return "-";
    }

    const pitchClasses = [...new Set(notes.map(n => n % 12))].sort((a, b) => a - b);

    // --- Check standard roots ---
    for (const root of pitchClasses) {
        const intervals = pitchClasses
            .map(n => (n - root + 12) % 12)
            .sort((a, b) => a - b);

        const key = intervals.join(",");
        if (CHORDS[key]) {
            return `${NOTE_NAMES[root]} ${CHORDS[key]}`;
        }
    }

    // --- Try inversions ---
    for (let i = 0; i < pitchClasses.length; i++) {
        const rotated = [
            ...pitchClasses.slice(i),
            ...pitchClasses.slice(0, i).map(n => n + 12)
        ];

        const root = rotated[0] % 12;
        const intervals = rotated.map(n => (n - root + 12) % 12);

        const key = intervals.join(",");
        if (CHORDS[key]) {
            return `${NOTE_NAMES[root]} ${CHORDS[key]}`;
        }
    }

    return "-";
}
