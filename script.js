let audioContext;

let showKeys = true;

let showChords = true;

let pressedKeys = [];



const noteNames = [
"C","C#","D","D#",
"E","F","F#","G",
"G#","A","A#","B"
];




// Create 88 Keys Piano

function createPiano(){


    let piano =
    document.getElementById("piano");


    piano.innerHTML="";


    let whiteCount=0;



    for(let midi=21; midi<=108; midi++){


        let name =
        noteNames[midi % 12];


        let octave =
        Math.floor(midi/12)-1;



        let key =
        document.createElement("div");



        key.dataset.note=midi;

        key.dataset.name =
        name+octave;



        key.innerHTML =
        showKeys ? name+octave : "";




        if(name.includes("#")){


            key.className="black";


            key.style.left =
            (whiteCount*55-17)+"px";


        }

        else{


            key.className="white";


            key.style.left =
            (whiteCount*55)+"px";


            whiteCount++;


        }




        key.onpointerdown=function(){


            let note =
            Number(this.dataset.note);



            playSound(note);



            this.style.background="yellow";



            pressedKeys.push(note);



            detectChord();


        };




        key.onpointerup=function(){


            this.style.background="";



            pressedKeys =
            pressedKeys.filter(
            n=>n!==Number(this.dataset.note)
            );

        };



        piano.appendChild(key);



    }



    piano.style.width =
    whiteCount*55+"px";


}







// Piano Sound

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
    440*Math.pow(2,(note-69)/12);



    osc.connect(gain);

    gain.connect(
    audioContext.destination
    );


    gain.gain.value=.3;



    osc.start();


    osc.stop(
    audioContext.currentTime+1
    );


}







// Keys Name ON/OFF

function toggleKeys(){


    showKeys=!showKeys;



    document.querySelectorAll(
    ".white,.black"
    )
    .forEach(key=>{


        key.innerHTML =
        showKeys ?
        key.dataset.name :
        "";


    });


}







// Chords ON/OFF

function toggleChords(){


    showChords=!showChords;


    document.getElementById("display")
    .innerHTML =
    showChords ?
    "Chord ON 🎵" :
    "Chord OFF";



}







// Chord Detection

function detectChord(){


    if(!showChords)
    return;



    let notes =
    pressedKeys.map(
    n=>n%12
    )
    .sort()
    .join(",");



    let chords={


    "0,4,7":"C Major",

    "0,3,7":"C Minor",

    "7,11,2":"G Major",

    "9,0,4":"A Minor"


    };



    if(chords[notes]){


        document.getElementById("display")
        .innerHTML =
        chords[notes];


    }


}







// MIDI Connect

async function connectMIDI(){


    if(!navigator.requestMIDIAccess){


        alert("MIDI Not Supported");


        return;

    }



    let midi =
    await navigator.requestMIDIAccess();



    alert("🎹 MIDI Connected");



    midi.inputs.forEach(input=>{


        input.onmidimessage=function(e){


            let note=e.data[1];

            let velocity=e.data[2];



            if(velocity>0){


                playSound(note);


            }


        };


    });


}







window.onload=function(){

    createPiano();

};
