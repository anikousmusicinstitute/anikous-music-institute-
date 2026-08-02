function createPiano(){

    let piano = document.getElementById("piano");

    piano.innerHTML = "";


    let octave = document.getElementById("octave").value;


    let whiteKeys = [
        {name:"C", note:60},
        {name:"D", note:62},
        {name:"E", note:64},
        {name:"F", note:65},
        {name:"G", note:67},
        {name:"A", note:69},
        {name:"B", note:71}
    ];



    let blackKeys = [
        {name:"C#", left:42},
        {name:"D#", left:102},
        {name:"F#", left:222},
        {name:"G#", left:282},
        {name:"A#", left:342}
    ];



    // White keys

    whiteKeys.forEach(function(item,index){


        let key=document.createElement("div");

        key.className="white";

        key.innerHTML =
        item.name + octave;


        key.style.order=index;


        piano.appendChild(key);


    });





    // Black keys

    blackKeys.forEach(function(item){


        let key=document.createElement("div");


        key.className="black";


        key.innerHTML=item.name;


        key.style.left=item.left+"px";


        piano.appendChild(key);


    });


}



// page load

window.onload=function(){

    createPiano();

};
