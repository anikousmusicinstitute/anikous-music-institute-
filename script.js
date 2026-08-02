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
let audioContext;
let midiAccess;

async function connectMIDI(){

    audioContext = new AudioContext();

    midiAccess = await navigator.requestMIDIAccess();

    midiAccess.inputs.forEach((input)=>{
        input.onmidimessage = playPiano;
    });

    alert("MIDI Connected 🎹");
}


function playPiano(event){

    let note = event.data[1];
    let velocity = event.data[2];

    if(velocity > 0){

        document.getElementById("note").innerHTML =
        "Playing Note : " + note;

        playSound(note);
    }
}


function playSound(note){

    let oscillator = audioContext.createOscillator();
    let gain = audioContext.createGain();

    oscillator.frequency.value =
    440 * Math.pow(2,(note-69)/12);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.value = 0.3;

    oscillator.start();

    setTimeout(()=>{
        oscillator.stop();
    },500);
}
