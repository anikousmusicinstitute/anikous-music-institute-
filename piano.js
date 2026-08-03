function pressKey(note,key){

if(activeKeys.has(note)) return;

activeKeys.add(note);

if(key){
key.classList.add("active");
}

if(typeof playSound==="function"){
playSound(note);
}

updateDisplay();

}



function releaseKey(note,key){

if(holdMode) return;

activeKeys.delete(note);

if(key){
key.classList.remove("active");
}

if(typeof stopSound==="function"){
stopSound(note);
}

updateDisplay();

}



function updateDisplay(){

const names=[...activeKeys]
.sort((a,b)=>a-b)
.map(n=>notes[n%12]+(Math.floor(n/12)-1));

const keyShow=document.getElementById("keyShow");
const chordShow=document.getElementById("chordShow");

keyShow.innerHTML=
(showKeys && names.length)
? names.join(" ")
: "-";

chordShow.innerHTML=
(showChords &&
activeKeys.size>=3 &&
typeof findChord==="function")
? findChord([...activeKeys].sort((a,b)=>a-b))
: "-";

}



function toggleKeys(){

showKeys=!showKeys;

const btn=document.getElementById("keysBtn");

btn.classList.toggle("active",showKeys);

btn.innerHTML=
showKeys
? "🎹 Keys ON"
: "🎹 Keys OFF";

updateDisplay();

}



function toggleChords(){

showChords=!showChords;

const btn=document.getElementById("chordsBtn");

btn.classList.toggle("active",showChords);

btn.innerHTML=
showChords
? "🎵 Chords ON"
: "🎵 Chords OFF";

updateDisplay();

}



function toggleHold(){

holdMode=!holdMode;

const btn=document.getElementById("holdBtn");

btn.classList.toggle("active",holdMode);

btn.innerHTML=
holdMode
? "✋ HOLD ON"
: "✋ HOLD OFF";

if(!holdMode){

activeKeys.forEach(note=>{

if(typeof stopSound==="function"){
stopSound(note);
}

const key=document.querySelector('[data-note="'+note+'"]');

if(key){
key.classList.remove("active");
}

});

activeKeys.clear();

pointerMap.clear();

updateDisplay();

}

}



createPiano();

updateDisplay();
