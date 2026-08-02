let socket = io("https://pianobackend.onrender.com");

let audioContext;
let jitsiApi;


// Video Call

function joinVideo(){

    const options = {

        roomName:"PianoLiveClassRoom",

        width:"100%",

        height:600,

        parentNode:
        document.getElementById("jitsi-container"),

        userInfo:{
            displayName:prompt("Enter your name")
        }

    };


    jitsiApi = new JitsiMeetExternalAPI(
        "meet.jit.si",
        options
    );

}



// Create Piano

function createPiano(){

    console.log("Creating Piano");


    let piano = document.getElementById("piano");


    if(!piano){

        console.log("Piano div not found");

        return;

    }



    piano.innerHTML="";


    let octave =
    document.getElementById("octave").value;



    let notes=[
        "C",
        "D",
        "E",
        "F",
        "G",
        "A",
        "B"
    ];



    notes.forEach((note,index)=>{


        let key =
        document.createElement("div");


        key.className="key";


        key.innerHTML =
        note + octave;



        key.dataset.note =
        60 + index;



        key.onclick=function(){


            playSound(
                Number(this.dataset.note)
            );


            this.style.background="yellow";


            setTimeout(()=>{

                this.style.background="white";

            },200);


        };



        piano.appendChild(key);


    });



}



// Sound

function playSound(note){


    if(!audioContext){

        audioContext =
        new AudioContext();

    }


    let osc =
    audioContext.createOscillator();


    let gain =
    audioContext.createGain();



    osc.frequency.value =
    440 * Math.pow(
        2,
        (note-69)/12
    );


    osc.connect(gain);

    gain.connect(
        audioContext.destination
    );


    gain.gain.value=0.3;


    osc.start();


    osc.stop(
        audioContext.currentTime+0.5
    );


}



// MIDI

async function connectMIDI(){


    let midi =
    await navigator.requestMIDIAccess();


    alert("MIDI Connected 🎹");



    midi.inputs.forEach(input=>{


        input.onmidimessage=function(e){


            let note=e.data[1];

            let velocity=e.data[2];



            if(velocity>0){


                playSound(note);


                socket.emit(
                    "midiNote",
                    {
                        note:note
                    }
                );


            }


        };


    });


}



// Receive

socket.on("studentNote",(data)=>{


    playSound(data.note);


});



// Start

createPiano();
