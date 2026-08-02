let socket = io("https://pianobackend.onrender.com");

let audioContext;
let midiAccess;
let jitsiApi;



// Video Call

function joinVideo(){

    const options={

        roomName:"PianoLiveClassRoom",

        width:"100%",

        height:600,

        parentNode:
        document.getElementById("jitsi-container"),

        userInfo:{

            displayName:
            prompt("Enter your name")

        }

    };


    jitsiApi =
    new JitsiMeetExternalAPI(
        "meet.jit.si",
        options
    );

}





// Create Piano

function createPiano(){


    let piano =
    document.getElementById("piano");


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


            let midiNote =
            Number(this.dataset.note);



            playPianoSound(midiNote);


            lightKey(this);



            socket.emit(
                "midiNote",
                {
                    note:midiNote
                }
            );


        };



        piano.appendChild(key);


    });


}







// Sound

function playPianoSound(note){


    if(!audioContext)

    audioContext =
    new AudioContext();



    let oscillator =
    audioContext.createOscillator();



    let gain =
    audioContext.createGain();



    oscillator.type="sine";


    oscillator.frequency.value =
    440 * Math.pow(
        2,
        (note-69)/12
    );



    oscillator.connect(gain);


    gain.connect(
        audioContext.destination
    );


    gain.gain.value=0.3;



    oscillator.start();


    oscillator.stop(
        audioContext.currentTime+0.5
    );


}






// MIDI Connect

async function connectMIDI(){


    audioContext =
    new AudioContext();



    midiAccess =
    await navigator.requestMIDIAccess();



    alert("MIDI Connected 🎹");



    midiAccess.inputs.forEach(input=>{


        input.onmidimessage =
        function(event){


            let note =
            event.data[1];


            let velocity =
            event.data[2];



            if(velocity>0){


                playPianoSound(note);


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







// Highlight

function lightKey(key){


    key.classList.add("active");



    setTimeout(()=>{


        key.classList.remove("active");


    },200);


}







// Student Receive

socket.on(
"studentNote",
(data)=>{


    let keys =
    document.querySelectorAll(".key");



    keys.forEach(key=>{


        if(
        Number(key.dataset.note)
        ===
        data.note
        ){


            playPianoSound(data.note);


            lightKey(key);


        }


    });


});






// Start

window.onload=function(){

    createPiano();

};
