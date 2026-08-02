let audioContext;

let showKeys=true;

let showChords=true;

let pressed=[];



let names=[
"C","C#","D","D#",
"E","F","F#","G",
"G#","A","A#","B"
];



function createPiano(){


let piano=document.getElementById("piano");

piano.innerHTML="";


let white=0;



for(let midi=21;midi<=108;midi++){


let name=
names[midi%12];


let octave=
Math.floor(midi/12)-1;



let key=document.createElement("div");


key.dataset.note=midi;

key.dataset.name=name+octave;



key.innerHTML=
showKeys ? name+octave:"";



if(name.includes("#")){


key.className="black";


key.style.left=
(white*55)+"px";


}

else{


key.className="white";


key.style.left=
(white*55)+"px";


white++;

}



key.onpointerdown=function(){


let n=Number(this.dataset.note);


playSound(n);


this.style.background="yellow";


pressed.push(n);


detectChord();


};



key.onpointerup=function(){


pressed=
pressed.filter(x=>x!==Number(this.dataset.note));


this.style.background="";

};



piano.appendChild(key);


}



piano.style.width=
white*55+"px";


}







function playSound(note){


if(!audioContext)

audioContext=new AudioContext();



let osc=
audioContext.createOscillator();


let gain=
audioContext.createGain();


osc.frequency.value=
440*Math.pow(2,(note-69)/12);



osc.connect(gain);

gain.connect(
audioContext.destination
);


gain.gain.value=.3;


osc.start();


osc.stop(
audioContext.currentTime+1
);


}







function toggleKeys(){


showKeys=!showKeys;


document.querySelectorAll(".white,.black")
.forEach(k=>{

k.innerHTML=
showKeys?k.dataset.name:"";

});


}






function toggleChords(){


showChords=!showChords;


if(!showChords)

document.getElementById("chordDisplay")
.innerHTML="Chord OFF";


}







function detectChord(){


if(!showChords)
return;


let n=
pressed.map(x=>x%12)
.sort()
.join(",");



let list={

"0,4,7":"C Major",

"0,3,7":"C Minor",

"7,11,2":"G Major",

"9,0,4":"A Minor"

};



document.getElementById("chordDisplay")
.innerHTML=
"Chord : "+(list[n]||"");


}







async function connectMIDI(){


let midi=
await navigator.requestMIDIAccess();


alert("MIDI Connected 🎹");



midi.inputs.forEach(input=>{


input.onmidimessage=function(e){


let note=e.data[1];

let velocity=e.data[2];


if(velocity>0){

playSound(note);

}

};


});


}






window.onload=function(){

createPiano();

};
