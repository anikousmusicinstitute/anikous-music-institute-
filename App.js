const socket = io();

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const joinBtn = document.getElementById("joinBtn");
const roomInput = document.getElementById("roomId");

const micBtn = document.getElementById("micBtn");
const cameraBtn = document.getElementById("cameraBtn");
const leaveBtn = document.getElementById("leaveBtn");

let localStream = null;
let peerConnection = null;
let room = "";

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302"
      ]
    }
  ]
};

async function startCamera() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    localVideo.srcObject = localStream;
  } catch (err) {
    console.error(err);
    alert("Camera / Microphone permission denied.");
  }
}

startCamera();

joinBtn.onclick = () => {
  room = roomInput.value.trim();

  if (!room) {
    alert("Enter Class ID");
    return;
  }

  socket.emit("join-room", room);
  alert("Joined: " + room);
};
