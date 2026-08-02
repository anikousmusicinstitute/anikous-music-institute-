window.onload = function(){

    let piano = document.getElementById("piano");

    piano.innerHTML = "";

    let notes = [
        "C",
        "D",
        "E",
        "F",
        "G",
        "A",
        "B"
    ];


    notes.forEach(function(note){


        let key = document.createElement("button");


        key.innerHTML = note;


        key.style.width = "60px";
        key.style.height = "200px";
        key.style.background = "white";
        key.style.color = "black";
        key.style.border = "2px solid black";


        key.onclick = function(){

            let audio = new AudioContext();

            let osc = audio.createOscillator();

            osc.frequency.value = 440;

            osc.connect(audio.destination);

            osc.start();

            osc.stop(audio.currentTime + 0.5);

        };


        piano.appendChild(key);


    });

};
