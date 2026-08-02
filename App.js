const socket = io();

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const joinBtn = document.getElementById("joinBtn");
const roomInput = document.getElementById("roomId");

const micBtn = document.getElementById("micBtn");
const cameraBtn = document.getElementById("cameraBtn");
const leaveBtn = document.getElementById("leaveBtn");

let localStream;
let peerConnection;
let room;

const servers = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};


// Camera + Mic
async function startCamera(){

    localStream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
    });

    localVideo.srcObject = localStream;
}

startCamera();


// Join Room
joinBtn.onclick = () => {

    room = roomInput.value.trim();

    if(!room){
        alert("Enter Class ID");
        return;
    }

    socket.emit("join-room", room);

    alert("Joined Class: " + room);
};


// Create Peer
function createPeer(){

    peerConnection = new RTCPeerConnection(servers);


    localStream.getTracks().forEach(track=>{
        peerConnection.addTrack(
            track,
            localStream
        );
    });


    peerConnection.ontrack = event => {

        remoteVideo.srcObject = event.streams[0];

    };


    peerConnection.onicecandidate = event=>{

        if(event.candidate){

            socket.emit("signal",{
                room:room,
                signal:{
                    candidate:event.candidate
                }
            });

        }

    };

}


// User Joined
socket.on("user-joined", async ()=>{

    createPeer();


    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);


    socket.emit("signal",{

        room:room,

        signal:{
            offer:offer
        }

    });

});


// Receive Signal
socket.on("signal", async(signal)=>{


    if(!peerConnection){

        createPeer();

    }


    if(signal.offer){

        await peerConnection.setRemoteDescription(
            signal.offer
        );


        const answer =
        await peerConnection.createAnswer();


        await peerConnection.setLocalDescription(
            answer
        );


        socket.emit("signal",{

            room:room,

            signal:{
                answer:answer
            }

        });

    }


    if(signal.answer){

        await peerConnection.setRemoteDescription(
            signal.answer
        );

    }


    if(signal.candidate){

        await peerConnection.addIceCandidate(
            signal.candidate
        );

    }


});


// Mic Button
micBtn.onclick = ()=>{

    let audio =
    localStream.getAudioTracks()[0];

    audio.enabled =
    !audio.enabled;

};


// Camera Button
cameraBtn.onclick = ()=>{

    let video =
    localStream.getVideoTracks()[0];

    video.enabled =
    !video.enabled;

};


// Leave
leaveBtn.onclick = ()=>{

    location.reload();

};
