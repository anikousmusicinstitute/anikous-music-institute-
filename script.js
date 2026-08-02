let socket = io("https://pianobackend.onrender.com");

let audioContext;
let jitsiApi;


// VIDEO CALL

function joinVideo(){

    const options = {

        roomName: "PianoLiveClassRoom",

        width: "100%",

        height: 600,

        parentNode: document.getElementById("jitsi-container"),

        userInfo: {

            displayName: prompt("Enter your name")

        }

    };


    jitsiApi = new JitsiMeetExternalAPI(
        "meet.jit.si",
        options
    );

}





// CREATE PIANO

function createPiano(){


    console.log("Creating Piano");


    let piano = document.getElementById("piano");


    if(!piano){

        console.log("Piano not found");

        return;

    }



    piano.innerHTML = "";



    let octave = 3;



    let octaveBox =
    document.getElementById("octave");



    if(octaveBox){

        octave = octaveBox.value;

    }





    let notes = [

        "C",
        "D",
        "E",
        "F",
        "G",
        "A",
        "B"

    ];





    notes.forEach(function(note,index){


        let key =
        document.createElement("div");



        key.className = "key";



        key.innerHTML =
        note + octave;



        key.dataset.note =
        60 + index;





        key.onclick = function(){



            let midiNote =
            Number(this.dataset.note);



            playSound(midiNote);



            socket.emit(
                "midiNote",
                {
                    note:midiNote
                }
            );



            highlight(this);



        };




        piano.appendChild(key);



    });



}





// SOUND

function playSound(note){



    if(!audioContext){

        audioContext = new AudioContext();

    }



    let oscillator =
    audioContext.createOscillator();



    let gain =
    audioContext.createGain();



    oscillator.frequency.value =

    440 * Math.pow(
        2,
        (note-69)/12
    );



    oscillator.connect(gain);



    gain.connect(
        audioContext.destination
    );



    gain.gain.value = 0.3;



    oscillator.start();



    oscillator.stop(
        audioContext.currentTime + 0.5
    );



}





// MIDI CONNECT


async function connectMIDI(){


    try{


        let midi =
        await navigator.requestMIDIAccess();



        alert("MIDI Connected 🎹");



        midi.inputs.forEach(function(input){



            input.onmidimessage =
            function(event){



                let note =
                event.data[1];


                let velocity =
                event.data[2];



                if(velocity > 0){



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


    catch(error){


        alert("MIDI Not Available");


        console.log(error);


    }


}





// RECEIVE STUDENT


socket.on(
"studentNote",
function(data){


    playSound(data.note);


});





// OCTAVE CHANGE

window.addEventListener("load",function(){


    console.log("Page Loaded");


    createPiano();


});
