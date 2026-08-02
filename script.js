let audio;


function sound(note){


if(!audio){

audio=new AudioContext();

}


let osc=audio.createOscillator();

let gain=audio.createGain();


osc.frequency.value =
440 * Math.pow(2,(note-69)/12);


osc.connect(gain);

gain.connect(audio.destination);


gain.gain.value=0.3;


osc.start();


osc.stop(
audio.currentTime+0.5
);


}



function createPiano(){


let piano=document.getElementById("piano");

piano.innerHTML="";


let octave =
Number(document.getElementById("octave").value);



let start =
(octave+1)*12;



let white=[

"C","D","E","F","G","A","B"

];


let whiteMidi=[

0,2,4,5,7,9,11

];



white.forEach((key,i)=>{


let div=document.createElement("div");


div.className="white";


div.innerHTML=key+octave;


div.style.left=(i*70)+"px";



div.onclick=function(){

sound(start+whiteMidi[i]);

document.getElementById("note").innerHTML=
"Playing "+key+octave;

};



piano.appendChild(div);



});





let black=[

["C#",45,1],
["D#",115,2],
["F#",255,4],
["G#",325,5],
["A#",395,6]

];



black.forEach(item=>{


let div=document.createElement("div");


div.className="black";


div.innerHTML=item[0];


div.style.left=item[1]+"px";



div.onclick=function(){

sound(start+item[2]);

document.getElementById("note").innerHTML=
"Playing "+item[0];

};



piano.appendChild(div);



});


}



window.onload=function(){

createPiano();

};
