const socket = io("https://pianobackend.onrender.com");

console.log("script loaded");

let audioContext;
let midiAccess;
let jitsiApi;


// Jitsi Video Call
function joinVideo(){

    const domain = "meet.jit.si";

    const options = {
        roomName: "PianoLiveClassRoom",
        width: "100%",
        height: 600,
        parentNode: document.querySelector("#jitsi-container"),
        userInfo:{
            displayName:"Teacher"
        }
    };

    jitsiApi = new JitsiMeetExternalAPI(domain, options);

}



// MIDI Connect
async function connectMIDI(){

    try{

        audioContext = new AudioContext();


        if(navigator.requestMIDIAccess){

            midiAccess = await navigator.requestMIDIAccess();


            alert("MIDI Connected 🎹");


            midiAccess.inputs.forEach(input=>{

                input.onmidimessage = playPiano;

            });


        }else{

            alert("MIDI not supported");

        }


    }catch(error){

        console.log(error);

        alert("MIDI Connection Failed");

    }

}



// MIDI Key Press
function playPiano(event){

    let command = event.data[0];

    let note = event.data[1];

    let velocity = event.data[2];


    // Key press only
    if(command === 144 && velocity > 0){


        document.getElementById("note").innerHTML =
        "Playing Note : " + note;


        playSound(note);


        // Send to students
        socket.emit("midiNote",{

            note: note

        });


        lightKey(note);


    }

}



// Piano Sound
function playSound(note){

    let oscillator = audioContext.createOscillator();

    let gain = audioContext.createGain();


    oscillator.frequency.value =
    440 * Math.pow(2,(note-69)/12);


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    gain.gain.value = 0.3;


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime + 0.5
    );

}



// Show Piano Key
function lightKey(note){

    let keys = document.querySelectorAll(".key");


    let key = keys[note % 7];


    if(key){

        key.style.background = "yellow";


        setTimeout(()=>{

            key.style.background = "white";

        },200);

    }

}



// Receive Student Side
socket.on("studentNote",(data)=>{


    document.getElementById("note").innerHTML =
    "Teacher Playing : " + data.note;


    lightKey(data.note);


});
