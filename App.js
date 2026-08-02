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
    alert("Camera / Microphone Permission Denied");
  }
}

startCamera();
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
        console.log("Connection State:", peerConnection.connectionState);
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log("ICE State:", peerConnection.iceConnectionState);
    };
}
// User Joined
socket.on("user-joined", async (id) => {

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


// Receive Signal
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

    }

    else if (signal.answer) {

        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(signal.answer)
        );

    }

    else if (signal.candidate) {

        try {
            await peerConnection.addIceCandidate(
                new RTCIceCandidate(signal.candidate)
            );
        } catch (err) {
            console.error("ICE Error:", err);
        }

    }

});
// ======================
// USER JOINED
// ======================
socket.on("user-joined", async () => {

    if (!peerConnection) {
        createPeer();
    }

    try {

        const offer = await peerConnection.createOffer();

        await peerConnection.setLocalDescription(offer);

        socket.emit("signal", {
            room: room,
            signal: {
                offer: offer
            }
        });

    } catch (err) {
        console.error(err);
    }

});


// ======================
// RECEIVE SIGNAL
// ======================
socket.on("signal", async (data) => {

    const signal = data.signal;

    if (!peerConnection) {
        createPeer();
    }

    try {

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

        }

        else if (signal.answer) {

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(signal.answer)
            );

        }

        else if (signal.candidate) {

            await peerConnection.addIceCandidate(
                new RTCIceCandidate(signal.candidate)
            );

        }

    } catch (err) {
        console.error("Signal Error:", err);
    }

});
// ======================
// MIC BUTTON
// ======================
micBtn.onclick = () => {

    if (!localStream) return;

    const audioTrack = localStream.getAudioTracks()[0];

    audioTrack.enabled = !audioTrack.enabled;

    micBtn.innerText = audioTrack.enabled ? "🎤 Mic On" : "🔇 Mic Off";

};


// ======================
// CAMERA BUTTON
// ======================
cameraBtn.onclick = () => {

    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];

    videoTrack.enabled = !videoTrack.enabled;

    cameraBtn.innerText = videoTrack.enabled ? "📷 Camera On" : "🚫 Camera Off";

};


// ======================
// LEAVE BUTTON
// ======================
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
<div class="video-container">

    <video
        id="localVideo"
        autoplay
        playsinline
        muted>
    </video>

    <video
        id="remoteVideo"
        autoplay
        playsinline>
    </video>

</div>

<div class="controls">

    <input
        type="text"
        id="roomId"
        placeholder="Enter Class ID">

    <button id="joinBtn">
        Join Class
    </button>

    <button id="micBtn">
        🎤 Mic
    </button>

    <button id="cameraBtn">
        📷 Camera
    </button>

    <button id="leaveBtn">
        ❌ Leave
    </button>

</div>

<script src="/socket.io/socket.io.js"></script>
<script src="App.js"></script>
const express = require("express");
const app = express();

const http = require("http").createServer(app);

const { Server } = require("socket.io");

const io = new Server(http, {
    cors: {
        origin: "*"
    }
});

app.use(express.static(__dirname));

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("join-room", (room) => {

        socket.join(room);

        console.log(`${socket.id} joined ${room}`);

        socket.to(room).emit("user-joined", socket.id);

    });

    socket.on("signal", (data) => {

        socket.to(data.room).emit("signal", {
            signal: data.signal,
            sender: socket.id
        });

    });

    socket.on("disconnect", () => {

        console.log("User Disconnected:", socket.id);

    });

});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});

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

        try {
            await peerConnection.addIceCandidate(
                new RTCIceCandidate(signal.candidate)
            );
        } catch (err) {
            console.error(err);
        }
    }
});

// Join Button
joinBtn.onclick = () => {

    room = roomInput.value.trim();

    if (!room) {
        alert("Enter Class ID");
        return;
    }

    socket.emit("join-room", room);

    alert("Joined: " + room);
};

// Mic
micBtn.onclick = () => {
    if (localStream) {
        const track = localStream.getAudioTracks()[0];
        track.enabled = !track.enabled;
    }
};

// Camera
cameraBtn.onclick = () => {
    if (localStream) {
        const track = localStream.getVideoTracks()[0];
        track.enabled = !track.enabled;
    }
};

// Leave
leaveBtn.onclick = () => {
    if (peerConnection) peerConnection.close();

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }

    socket.disconnect();
    location.reload();
};
