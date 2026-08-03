const audioContext = new (window.AudioContext || window.webkitAudioContext)();


let sounds = {};



function getFrequency(note){

return 440 * Math.pow(2,(note-69)/12);

}



function playSound(note){


if(audioContext.state==="suspended"){

audioContext.resume();

}


if(sounds[note]) return;



let osc =
audioContext.createOscillator();


let gain =
audioContext.createGain();



osc.type="triangle";


osc.frequency.value =
getFrequency(note);



gain.gain.value=0.3;



osc.connect(gain);

gain.connect(audioContext.destination);



osc.start();



sounds[note]={

osc:osc,
gain:gain

};


}




function stopSound(note){


let s=sounds[note];


if(!s) return;



s.gain.gain.exponentialRampToValueAtTime(

0.001,

audioContext.currentTime+0.3

);



s.osc.stop(

audioContext.currentTime+0.3

);



delete sounds[note];


}
