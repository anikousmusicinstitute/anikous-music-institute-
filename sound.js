const AudioCtx = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioCtx();

const sounds = {};


function getFrequency(note){

return 440 * Math.pow(2,(note-69)/12);

}



function playSound(note){

if(audioContext.state==="suspended"){

audioContext.resume();

}


if(sounds[note]) return;


const osc = audioContext.createOscillator();

const gain = audioContext.createGain();

const filter = audioContext.createBiquadFilter();



filter.type = "lowpass";
filter.frequency.value = 4500;


osc.type = "triangle";

osc.frequency.value = getFrequency(note);


gain.gain.setValueAtTime(
0,
audioContext.currentTime
);

gain.gain.linearRampToValueAtTime(
0.28,
audioContext.currentTime+0.02
);

gain.gain.linearRampToValueAtTime(
0.22,
audioContext.currentTime+0.15
);


osc.connect(filter);

filter.connect(gain);

gain.connect(audioContext.destination);


osc.start();


sounds[note]={

osc,

gain,

filter

};

}




function stopSound(note){

const sound = sounds[note];

if(!sound) return;


sound.gain.gain.cancelScheduledValues(
audioContext.currentTime
);

sound.gain.gain.setValueAtTime(
sound.gain.gain.value,
audioContext.currentTime
);

sound.gain.gain.exponentialRampToValueAtTime(
0.0001,
audioContext.currentTime+0.25
);


sound.osc.stop(
audioContext.currentTime+0.3
);


delete sounds[note];

}




function stopAllSounds(){

Object.keys(sounds).forEach(note=>{

stopSound(Number(note));

});

}
