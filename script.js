function buildPiano(){

let piano=document.getElementById("piano");

piano.innerHTML="";


let octave =
Number(document.getElementById("octave").value);



let white=[
"C","D","E","F","G","A","B"
];


white.forEach((n,i)=>{

let key=document.createElement("div");

key.className="white";

key.innerHTML=n+octave;

key.style.left=(i*60)+"px";


piano.appendChild(key);


});



let black=[

["C#",45],
["D#",105],
["F#",225],
["G#",285],
["A#",345]

];


black.forEach(k=>{


let key=document.createElement("div");


key.className="black";

key.innerHTML=k[0];

key.style.left=k[1]+"px";


piano.appendChild(key);


});


}



window.onload=()=>{

buildPiano();

};
