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
function createPeer() {

  peerConnection = new RTCPeerConnection(servers);

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("signal", {
        room: room,
        signal: {
          candidate: event.candidate
        }
      });
    }
  };

  peerConnection.onconnectionstatechange = () => {
    console.log("Connection:", peerConnection.connectionState);
  };
}
socket.on("user-joined", async () => {

  if (!peerConnection) {
    createPeer();
  }

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("signal", {
    room: room,
    signal: {
      offer: offer
    }
  });

});

socket.on("signal", async (data) => {

  const signal = data.signal;

  if (!peerConnection) {
    createPeer();
  }

  if (signal.offer) {

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(signal.offer)
    );

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer);

    socket.emit("signal", {
      room: room,
      signal: {
        answer: answer
      }
    });

  } else if (signal.answer) {

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(signal.answer)
    );

  } else if (signal.candidate) {

    await peerConnection.addIceCandidate(
      new RTCIceCandidate(signal.candidate)
    );

  }

});
// Mic Button
micBtn.onclick = () => {
  if (!localStream) return;

  const audioTrack = localStream.getAudioTracks()[0];
  audioTrack.enabled = !audioTrack.enabled;

  micBtn.innerText = audioTrack.enabled ? "🎤 Mic On" : "🔇 Mic Off";
};

// Camera Button
cameraBtn.onclick = () => {
  if (!localStream) return;

  const videoTrack = localStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;

  cameraBtn.innerText = videoTrack.enabled ? "📷 Camera On" : "🚫 Camera Off";
};

// Leave Button
leaveBtn.onclick = () => {

  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }

  socket.disconnect();

  location.reload();
};
