const piano = document.getElementById("piano");


const notes = [

"C","C#","D","D#","E","F",
"F#","G","G#","A","A#","B"

];


let activeKeys = new Set();



let start = 36; 
// C2


let end = 96;  
// C7



function createPiano(){


let white = 0;



for(let i=start;i<=end;i++){


let name =
notes[i%12];


let octave =
Math.floor(i/12)-1;



let key =
document.createElement("div");



key.dataset.note=i;



if(name.includes("#")){


key.className="black";


key.style.left =
(white*55-18)+"px";



}else{


key.className="white";


key.innerHTML =
"<span>"+name+octave+"</span>";



white++;


}



key.addEventListener(
"pointerdown",
()=>{

pressKey(i,key);

}

);



key.addEventListener(
"pointerup",
()=>{

releaseKey(i,key);

}

);



key.addEventListener(
"pointerleave",
()=>{

releaseKey(i,key);

}

);



piano.appendChild(key);


}



}



function pressKey(note,key){


key.classList.add("active");


activeKeys.add(note);


playSound(note);



updateDisplay();


}



function releaseKey(note,key){


key.classList.remove("active");


activeKeys.delete(note);


stopSound(note);


updateDisplay();


}



function updateDisplay(){


let names=[...activeKeys].map(n=>{


return notes[n%12]+
(Math.floor(n/12)-1);


});



document.getElementById("keyShow").innerHTML =
names.join(" ") || "-";


document.getElementById("noteShow").innerHTML =
names.join(" ") || "-";



}



createPiano();
