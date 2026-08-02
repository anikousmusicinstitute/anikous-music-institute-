const socket = io();

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const joinBtn = document.getElementById("joinBtn");
const roomInput = document.getElementById("roomId");

let localStream;

async function startCamera() {

    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    localVideo.srcObject = localStream;
}

startCamera();

joinBtn.addEventListener("click", () => {

    const room = roomInput.value.trim();

    if (!room) {
        alert("Enter Class ID");
        return;
    }

    socket.emit("join-room", room);

    alert("Joined: " + room);

});
