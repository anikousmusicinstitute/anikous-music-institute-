let audioContext;

let showKeys = true;

let showChords = true;

let pressedNotes = [];

let zoom = 1;



const noteNames = [

"C",
"C#",
"D",
"D#",
"E",
"F",
"F#",
"G",
"G#",
"A",
"A#",
"B"

];





function createPiano(){


let piano=document.getElementById("piano");

piano.innerHTML="";


let whiteCount=0;



for(let midi=21;midi<=108;midi++){


let name =
noteNames[midi%12];


let octave =
Math.floor(midi/12)-1;



let key=document.createElement("div");


key.dataset.note=midi;


key.dataset.name=name+octave;



if(name.includes("#")){


key.className="black";


key.style.left=
(whiteCount*55-18)+"px";


}

else{


key.className="white";


key.style.left=
(whiteCount*55)+"px";


whiteCount++;


}



key.innerHTML =
showKeys ? name+octave : "";




key.onpointerdown=function(){


let note=Number(this.dataset.note);


pressedNotes.push(note);


playSound(note);


this.style.background="yellow";


detectChord();


};



key.onpointerup=function(){


this.style.background="";


pressedNotes =
pressedNotes.filter(
n=>n!==Number(this.dataset.note)
);


};



piano.appendChild(key);


}



piano.style.width=
(whiteCount*55)+"px";


}







function playSound(note){


if(!audioContext)

audioContext=new AudioContext();



let osc=
audioContext.createOscillator();


let gain=
audioContext.createGain();



osc.frequency.value =
440*Math.pow(2,(note-69)/12);



osc.connect(gain);

gain.connect(audioContext.destination);



gain.gain.value=.3;


osc.start();


osc.stop(
audioContext.currentTime+1
);


}








function detectChord(){


if(!showChords)
return;



let notes =
pressedNotes.map(
n=>n%12
);



notes.sort(
(a,b)=>a-b
);



let chord="None";



let chords={


"0,4,7":"C Major",

"0,3,7":"C Minor",

"2,6,9":"D Major",

"4,8,11":"E Major",

"5,9,0":"F Major",

"7,11,2":"G Major",

"9,1,4":"A Major"


};



let key =
notes.join(",");



if(chords[key])

chord=chords[key];



document.getElementById("chordDisplay").innerHTML=
"Chord: "+chord;


}








function toggleKeys(){


showKeys=!showKeys;


document.querySelectorAll(".white,.black")
.forEach(k=>{

k.innerHTML =
showKeys ?
k.dataset.name :
"";


});


}






function toggleChords(){


showChords=!showChords;


if(!showChords)

document.getElementById("chordDisplay")
.innerHTML="Chord: OFF";


}








function zoomIn(){


zoom+=0.1;


document.getElementById("piano")
.style.transform=
"scale("+zoom+")";


}



function zoomOut(){


zoom-=0.1;


if(zoom<0.5)

zoom=.5;



document.getElementById("piano")
.style.transform=
"scale("+zoom+")";


}






window.onload=function(){

createPiano();

};
