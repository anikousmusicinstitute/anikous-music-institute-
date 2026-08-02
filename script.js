let audioContext;

let showKeys=true;

let showChords=true;


const notes=[
"C","C#","D","D#",
"E","F","F#","G",
"G#","A","A#","B"
];




function createPiano(){


let piano=document.getElementById("piano");

piano.innerHTML="";


let white=0;



for(let midi=21;midi<=108;midi++){


let name=notes[midi%12];


let octave=Math.floor(midi/12)-1;



let key=document.createElement("div");


key.dataset.note=midi;


key.dataset.name=name+octave;


key.innerHTML =
showKeys ? name+octave:"";



if(name.includes("#")){


key.className="black";


key.style.left=
(white*54-17)+"px";


}

else{


key.className="white";


key.style.left=
(white*54)+"px";


white++;

}



key.onclick=function(){

playSound(Number(this.dataset.note));

};


piano.appendChild(key);


}



piano.style.width=
white*54+"px";


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


document.getElementById("display")
.innerHTML=
showChords?
"Chord ON":
"Chord OFF";


}





async function connectMIDI(){


let midi=
await navigator.requestMIDIAccess();


alert("MIDI Connected 🎹");


midi.inputs.forEach(input=>{


input.onmidimessage=function(e){


if(e.data[2]>0){

playSound(e.data[1]);

}

};


});


}





window.onload=function(){

createPiano();

};
