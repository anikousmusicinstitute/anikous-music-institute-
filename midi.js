let midiAccess = null;


async function connectMIDI(){


try{


midiAccess = await navigator.requestMIDIAccess();



midiAccess.inputs.forEach(input=>{


input.onmidimessage = handleMIDI;


});



alert("MIDI Connected 🎹");


}

catch(error){


alert("MIDI Not Supported");


}


}




function handleMIDI(message){


let data = message.data;



let command = data[0] & 0xf0;


let note = data[1];


let velocity = data[2];



if(command === 144 && velocity > 0){


pressedKeys.add(note);


playSound(note,velocity/127);


updateDisplay();


}



if(command === 128 || (command===144 && velocity===0)){


pressedKeys.delete(note);


stopSound(note);


updateDisplay();


}


}



document
.getElementById("midiBtn")
?.addEventListener(
"click",
connectMIDI
);
