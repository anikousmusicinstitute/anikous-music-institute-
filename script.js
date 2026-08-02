function joinVideo(){
    alert("Video Call Coming...");
}

function connectMIDI(){
    alert("MIDI Connect Starting...");
}
function joinVideo(){
    document.getElementById("video").style.display="block";
}
let midiAccess;

async function connectMIDI(){

    if(navigator.requestMIDIAccess){

        midiAccess = await navigator.requestMIDIAccess();

        alert("MIDI Connected 🎹");

        midiAccess.inputs.forEach(input=>{
            input.onmidimessage = playNote;
        });

    }else{
        alert("MIDI not supported");
    }
}


function playNote(message){

    let note = message.data[1];

    console.log("Note:", note);

    let keys = document.querySelectorAll(".key");

    if(note){
        keys[note % 7].style.background="yellow";

        setTimeout(()=>{
            keys[note % 7].style.background="white";
        },200);
    }
}
function joinVideo(){

const domain = "meet.jit.si";

const options = {
    roomName: "PianoLiveClassRoom",
    width: "100%",
    height: 600,
    parentNode: document.querySelector("#jitsi-container"),
    userInfo:{
        displayName:"Student"
    }
};

const api = new JitsiMeetExternalAPI(domain, options);

}
