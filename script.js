let pressedNotes = new Set();

const NOTE_NAMES = [
"C","C#","D","D#",
"E","F","F#","G",
"G#","A","A#","B"
];
pressedNotes.add(note);

updateDisplay();

setTimeout(() => {

    pressedNotes.delete(note);

    updateDisplay();

},1000);
function updateDisplay(){

    let list = [...pressedNotes].sort((a,b)=>a-b);

    let keyNames = list.map(n=>{

        let note = NOTE_NAMES[n % 12];

        let octave = Math.floor(n/12)-1;

        return note + octave;

    });

    document.getElementById("keysPressed").innerHTML =
    keyNames.length ? keyNames.join("  ") : "-";

    document.getElementById("notesName").innerHTML =
    keyNames.length ? keyNames.join("  ") : "-";

}
const CHORDS = {

"0,4,7":"Major",

"0,3,7":"Minor",

"0,3,6":"Dim",

"0,4,8":"Aug",

"0,5,7":"Sus4",

"0,2,7":"Sus2",

"0,4,7,10":"7",

"0,4,7,11":"Maj7",

"0,3,7,10":"m7",

"0,3,6,9":"Dim7",

"0,3,6,10":"m7♭5",

"0,4,7,10,2":"9",

"0,3,7,10,2":"m9",

"0,4,7,11,2":"Maj9",

"0,4,7,10,2,5":"11",

"0,4,7,10,2,5,9":"13"

};
detectChord(list);
function detectChord(notes){

    if(notes.length<3){

        document.getElementById("chordName").innerHTML="-";

        document.getElementById("rootName").innerHTML="-";

        return;

    }

    let root = notes[0] % 12;

    let intervals = notes
    .map(n => (n % 12 - root + 12) % 12)
    .sort((a,b)=>a-b);

    let key = intervals.join(",");

    let chord = CHORDS[key];

    if(chord){

        document.getElementById("rootName").innerHTML =
        NOTE_NAMES[root];

        document.getElementById("chordName").innerHTML =
        NOTE_NAMES[root] + " " + chord;

    }else{

        document.getElementById("rootName").innerHTML =
        NOTE_NAMES[root];

        document.getElementById("chordName").innerHTML =
        "Unknown";

    }

}
