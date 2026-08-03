function startVideo(){


let box =
document.getElementById("videoBox");


let meet =
document.getElementById("meet");



if(meet.style.display==="none"){


meet.style.display="block";


box.style.height="400px";



let room =
"PianoLiveProClass";


meet.src =
"https://meet.jit.si/"+room;


}

else{


meet.style.display="none";


box.style.height="0";


meet.src="";


}


}
