const CHORDS = {

"0,4,7":"Major",

"0,3,7":"Minor",

"0,3,6":"Diminished",

"0,4,8":"Augmented",

"0,5,7":"Sus4",

"0,2,7":"Sus2",

"0,4,7,10":"7",

"0,4,7,11":"Maj7",

"0,3,7,10":"m7",

"0,4,7,10,2":"9",

"0,4,7,10,2,5":"11",

"0,4,7,10,2,5,9":"13"

};



function findChord(notes){


if(notes.length<3){

return "-";

}



let root =
notes[0]%12;



let intervals =
notes.map(n=>{

return (n%12-root+12)%12;

})
.sort((a,b)=>a-b);



let result =
CHORDS[intervals.join(",")];



return result ? result : "Unknown";

}
