function createPiano(){


let piano=document.getElementById("piano");


piano.innerHTML="";


let octave=document.getElementById("octave").value;



let whiteNotes=[

"C",
"D",
"E",
"F",
"G",
"A",
"B"

];



whiteNotes.forEach(function(note,index){


let key=document.createElement("div");


key.className="white";


key.innerHTML=note+octave;


piano.appendChild(key);


});





let blackNotes=[

{
name:"C#",
left:45
},

{
name:"D#",
left:105
},

{
name:"F#",
left:225
},

{
name:"G#",
left:285
},

{
name:"A#",
left:345
}

];





blackNotes.forEach(function(item){


let key=document.createElement("div");


key.className="black";


key.innerHTML=item.name;


key.style.left=item.left+"px";


piano.appendChild(key);


});



}




window.onload=function(){

createPiano();

};
