let midi = null;


async function connectMIDI(){


try{


midi =
await navigator.requestMIDIAccess();



midi.inputs.forEach(device=>{


device.onmidimessage =
midiMessage;


});



alert("MIDI Connected 🎹");


}

catch(error){


alert("MIDI Not Supported");


}


}



function midiMessage(event){


let data =
event.data;



let command =
data[0] & 0xf0;



let note =
data[1];



let velocity =
data[2];



if(command===144 && velocity>0){


playSound(note);



document.getElementById("keyShow").innerHTML =
note;



}



if(command===128 || 
(command===144 && velocity===0)){


stopSound(note);


}


}



window.addEventListener(
"load",
()=>{


let btn =
document.querySelector("button");


if(btn){

btn.onclick=connectMIDI;

}


}

);
