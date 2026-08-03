let audioContext = new (window.AudioContext || window.webkitAudioContext)();

let playingNotes = {};


function midiToFrequency(note){

return 440 * Math.pow(2,(note-69)/12);

}



function playSound(note,velocity=1){


if(audioContext.state==="suspended"){

audioContext.resume();

}


if(playingNotes[note]) return;



let oscillator =
audioContext.createOscillator();


let gain =
audioContext.createGain();



oscillator.type="sine";


oscillator.frequency.value =
midiToFrequency(note);



gain.gain.value =
0.25 * velocity;



oscillator.connect(gain);

gain.connect(audioContext.destination);



oscillator.start();



playingNotes[note]={

oscillator:oscillator,
gain:gain

};


}



function stopSound(note){


let sound=playingNotes[note];


if(!sound) return;



sound.gain.gain.exponentialRampToValueAtTime(

0.001,

audioContext.currentTime+0.3

);



sound.oscillator.stop(

audioContext.currentTime+0.3

);



delete playingNotes[note];


}
