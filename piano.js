function pressKey(note,key){

if(activeKeys.has(note)) return;

activeKeys.add(note);

key.classList.add("active");

if(typeof playSound==="function"){

playSound(note);

}

updateDisplay();

}

function releaseKey(note,key){

if(holdMode) return;

activeKeys.delete(note);

key.classList.remove("active");

if(typeof stopSound==="function"){

stopSound(note);

}

updateDisplay();

}
function updateDisplay(){

let names=[...activeKeys]
.sort((a,b)=>a-b)
.map(n=>{

return notes[n%12]+
(Math.floor(n/12)-1);

});

const keyShow=document.getElementById("keyShow");
const chordShow=document.getElementById("chordShow");

if(showKeys){

keyShow.innerHTML=

names.length
?
names.join(" ")
:
"-";

}else{

keyShow.innerHTML="-";

}

if(showChords &&
activeKeys.size>=3 &&
typeof findChord==="function"){

chordShow.innerHTML=

findChord(
[...activeKeys]
.sort((a,b)=>a-b)
);

}else{

chordShow.innerHTML="-";

}

}
function toggleKeys(){

showKeys=!showKeys;

const btn=document.getElementById("keysBtn");

btn.classList.toggle("active");

btn.innerHTML=
showKeys
?
"🎹 Keys ON"
:
"🎹 Keys OFF";

updateDisplay();

}

function toggleChords(){

showChords=!showChords;

const btn=document.getElementById("chordsBtn");

btn.classList.toggle("active");

btn.innerHTML=
showChords
?
"🎵 Chords ON"
:
"🎵 Chords OFF";

updateDisplay();

}

function toggleHold(){

holdMode=!holdMode;

const btn=document.getElementById("holdBtn");

btn.classList.toggle("active");

btn.innerHTML=
holdMode
?
"✋ HOLD ON"
:
"✋ HOLD OFF";

if(!holdMode){

pointerMap.clear();

}

}

createPiano();

updateDisplay();
