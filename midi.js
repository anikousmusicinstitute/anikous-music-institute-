let midi=null;

async function connectMIDI(){

if(!navigator.requestMIDIAccess){

alert("MIDI Not Supported");

return;

}

try{

midi=await navigator.requestMIDIAccess();

midi.inputs.forEach(input=>{

input.onmidimessage=midiMessage;

});

alert("🎹 MIDI Connected");

}catch(err){

alert("MIDI Connection Failed");

}

}


function midiMessage(event){

const [status,note,velocity]=event.data;

const command=status&0xf0;

const key=document.querySelector(
'[data-note="'+note+'"]'
);

if(command===144 && velocity>0){

if(key){

pressKey(note,key);

}

}

if(command===128 || (command===144 && velocity===0)){

if(key){

releaseKey(note,key);

}

}

}
