function startVideo(){

const box =
document.getElementById("videoBox");

const meet =
document.getElementById("meet");

const btn =
document.getElementById("videoBtn");


if(meet.src===""){

const room =
"PianoLiveProClass";

meet.src =
"https://meet.jit.si/"+room;

meet.style.display="block";

box.style.height="400px";

box.style.transition=
"height .3s ease";

btn.innerHTML=
"❌ Close Video";

btn.classList.add("active");

}
else{

meet.src="";

meet.style.display="none";

box.style.height="0";

btn.innerHTML=
"🎥 Video Call";

btn.classList.remove("active");

}

}


/* Close video automatically when page closes */

window.addEventListener("beforeunload",()=>{

const meet =
document.getElementById("meet");

if(meet){

meet.src="";

}

});


/* Prevent accidental zoom on mobile */

document.addEventListener("gesturestart",(e)=>{

e.preventDefault();

});


document.addEventListener("dblclick",(e)=>{

e.preventDefault();

});
