const piano = document.getElementById("piano");

let pressedKeys = new Set();


const WHITE_NOTES = [
"C","D","E","F","G","A","B"
];


const BLACK_POSITIONS = [
"C#","D#",
"F#","G#","A#"
];



let startNote = 21; // A0
let endNote = 108;  // C8



function createPiano(){


let whiteCount = 0;



for(let note=startNote; note<=endNote; note++){


let noteName =
NOTE_NAMES[note%12];

let octave =
Math.floor(note/12)-1;



let key=document.createElement("div");



key.dataset.note=note;



if(noteName.includes("#")){


key.className="blackKey";


key.style.left=
(whiteCount*55-18)+"px";


}

else{


key.className="whiteKey";


key.innerHTML=

"<span>"+
noteName+
octave+
"</span>";


whiteCount++;


}



key.addEventListener("pointerdown",()=>{


pressKey(note,key);


});


key.addEventListener("pointerup",()=>{


releaseKey(note,key);


});


key.addEventListener("pointerleave",()=>{


releaseKey(note,key);


});



piano.appendChild(key);


}



}



function pressKey(note,key){


key.classList.add("active");


pressedKeys.add(note);


playSound(note);



updateDisplay();


}



function releaseKey(note,key){


key.classList.remove("active");


pressedKeys.delete(note);


stopSound(note);


updateDisplay();


}



function updateDisplay(){


let notes=[...pressedKeys];



let names=notes.map(n=>{


let name=NOTE_NAMES[n%12];

let octave=Math.floor(n/12)-1;


return name+octave;


});



document.getElementById("keysPressed").innerHTML=

names.join(" ") || "-";



document.getElementById("notesName").innerHTML=

names.join(" ") || "-";



let chord=detectChord(notes);



document.getElementById("chordName").innerHTML=

chord.name;



document.getElementById("rootName").innerHTML=

chord.root;



document.getElementById("inversionName").innerHTML=

chord.inversion;


}



createPiano();
