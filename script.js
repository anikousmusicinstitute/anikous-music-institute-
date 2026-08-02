let audioContext;

let zoom = 1;



// Piano notes

const notes = [

"C",
"C#",
"D",
"D#",
"E",
"F",
"F#",
"G",
"G#",
"A",
"A#",
"B"

];



// Create 88 Keys

function createPiano(){


    let piano = document.getElementById("piano");

    piano.innerHTML="";


    let whiteIndex = 0;


    // A0 to C8 = 88 keys

    for(let midi = 21; midi <=108; midi++){


        let noteName =
        notes[midi % 12];


        let octave =
        Math.floor(midi / 12) - 1;



        let key =
        document.createElement("div");



        key.innerHTML =
        noteName + octave;



        key.dataset.note=midi;



        if(noteName.includes("#")){


            key.className="black";


            key.style.left =
            (whiteIndex * 60 - 19)+"px";


        }

        else{


            key.className="white";


            key.style.left =
            (whiteIndex * 60)+"px";


            whiteIndex++;


        }



        key.onclick=function(){


            playSound(Number(this.dataset.note));


            document.getElementById("note").innerHTML =
            "Playing : "+this.innerHTML;


        };



        piano.appendChild(key);


    }


}






// Piano Sound

function playSound(note){


    if(!audioContext){

        audioContext =
        new AudioContext();

    }



    let oscillator =
    audioContext.createOscillator();


    let gain =
    audioContext.createGain();



    oscillator.frequency.value =
    440 * Math.pow(2,(note-69)/12);



    oscillator.connect(gain);


    gain.connect(
    audioContext.destination
    );


    gain.gain.value=0.3;



    oscillator.start();



    oscillator.stop(
        audioContext.currentTime+1
    );


}







// Zoom Controls


function zoomIn(){

    zoom +=0.1;

    document.getElementById("piano")
    .style.transform =
    "scale("+zoom+")";

}



function zoomOut(){

    zoom -=0.1;

    if(zoom<0.5)
    zoom=0.5;


    document.getElementById("piano")
    .style.transform =
    "scale("+zoom+")";

}



function resetZoom(){

    zoom=1;

    document.getElementById("piano")
    .style.transform =
    "scale(1)";

}






window.onload=function(){

    createPiano();

};
