const piano = document.getElementById("piano");


const notes = [
"C","C#","D","D#",
"E","F","F#","G",
"G#","A","A#","B"
];


let activeKeys = new Set();


let start = 36; 
let end = 96;


let showKeys = true;
let showChords = true;
let holdMode = false;



function createPiano(){

let white = 0;


for(let i=start;i<=end;i++){


let name = notes[i % 12];

let octave = Math.floor(i / 12)-1;


let key = document.createElement("div");


key.dataset.note = i;



if(name.includes("#")){


key.className = "black";


key.style.left =
((white-1)*55+38)+"px";


}
else{


key.className = "white";


key.style.left =
(white*55)+"px";


key.innerHTML =
"<span>"+name+octave+"</span>";


white++;

}




// MULTI TOUCH SUPPORT

key.addEventListener("pointerdown",(e)=>{

e.preventDefault();

key.setPointerCapture(e.pointerId);

pressKey(i,key);

});



key.addEventListener("pointerup",(e)=>{

e.preventDefault();

releaseKey(i,key);

});



key.addEventListener("pointercancel",()=>{

releaseKey(i,key);

});



key.addEventListener("lostpointercapture",()=>{

releaseKey(i,key);

});



piano.appendChild(key);


}



piano.style.width =
(white*55)+"px";


}







function pressKey(note,key){


if(activeKeys.has(note)) return;


key.classList.add("active");


activeKeys.add(note);



if(typeof playSound==="function"){

playSound(note);

}



updateDisplay();


}







function releaseKey(note,key){


if(holdMode){

return;

}


key.classList.remove("active");


activeKeys.delete(note);



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




document.getElementById("keyShow").innerHTML =


(showKeys && names.length)

? names.join(" ")

: "-";






if(showChords && activeKeys.size>=3 && typeof findChord==="function"){


document.getElementById("chordShow").innerHTML =


findChord([...activeKeys].sort((a,b)=>a-b));


}

else{


document.getElementById("chordShow").innerHTML="-";


}


}








function toggleKeys(){


showKeys=!showKeys;


let btn=document.getElementById("keysBtn");


btn.classList.toggle("active");


btn.innerHTML =

showKeys ? "🎹 Keys ON" : "🎹 Keys OFF";


updateDisplay();


}








function toggleChords(){


showChords=!showChords;


let btn=document.getElementById("chordsBtn");


btn.classList.toggle("active");


btn.innerHTML =

showChords ? "🎵 Chords ON" : "🎵 Chords OFF";


updateDisplay();


}








function toggleHold(){


holdMode=!holdMode;


let btn=document.getElementById("holdBtn");


btn.classList.toggle("active");


btn.innerHTML =

holdMode ? "✋ HOLD ON" : "✋ HOLD OFF";


}







createPiano();
