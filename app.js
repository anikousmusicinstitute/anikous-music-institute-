document.addEventListener("DOMContentLoaded",()=>{


const soundButton =
document.getElementById("soundBtn");


if(soundButton){


soundButton.addEventListener("click",()=>{


if(audioContext.state==="suspended"){

audioContext.resume();

}


});


}



const videoButton =
document.getElementById("videoBtn");


if(videoButton){


videoButton.addEventListener("click",()=>{


const room =
"PianoLiveClassRoom";


const url =
"https://meet.jit.si/"+room;



window.open(
url,
"_blank"
);



});


}



});
