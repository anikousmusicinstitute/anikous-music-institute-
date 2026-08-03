const CHORD_DATABASE = {

"0,4,7":"Major",

"0,3,7":"Minor",

"0,3,6":"Diminished",

"0,4,8":"Augmented",


"0,5,7":"Sus4",

"0,2,7":"Sus2",


"0,4,7,9":"6",

"0,3,7,9":"m6",


"0,4,7,10":"7",

"0,4,7,11":"Maj7",

"0,3,7,10":"m7",


"0,3,6,10":"m7b5",

"0,3,6,9":"Dim7",


"0,4,7,10,2":"9",

"0,3,7,10,2":"m9",

"0,4,7,11,2":"Maj9",


"0,4,7,10,2,5":"11",

"0,3,7,10,2,5":"m11",

"0,4,7,11,2,5":"Maj11",


"0,4,7,10,2,5,9":"13",

"0,3,7,10,2,5,9":"m13",

"0,4,7,11,2,5,9":"Maj13"

};



const NOTE_NAMES = [

"C","C#","D","D#",

"E","F","F#","G",

"G#","A","A#","B"

];



function detectChord(notes){


if(notes.length < 3){

return {

name:"-",

root:"-",

inversion:"-"

};

}



let unique=[...new Set(notes.map(n=>n%12))];



for(let root of unique){


let intervals = unique.map(n=>{

return (n-root+12)%12;

}).sort((a,b)=>a-b);



let key=intervals.join(",");



if(CHORD_DATABASE[key]){


let bass=notes[0]%12;


return {


name:

NOTE_NAMES[root]+" "+CHORD_DATABASE[key],


root:

NOTE_NAMES[root],


inversion:

bass===root ?

"Root Position":

NOTE_NAMES[root]+"/"+NOTE_NAMES[bass]


};


}

}



return {

name:"Unknown",

root:"-",

inversion:"-"

};


}
