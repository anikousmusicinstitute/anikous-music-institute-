const socket = io();

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

const micBtn = document.getElementById("micBtn");
const cameraBtn = document.getElementById("cameraBtn");
const leaveBtn = document.getElementById("leaveBtn");

let localStream = null;
let peerConnection = null;

const ROOM_ID = "anikous-live-class";

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

        socket.emit("join-room", ROOM_ID);

    } catch (err) {

        console.log(err);
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

                room: ROOM_ID,

                signal: {
                    candidate: event.candidate
                }

            });

        }

    };

}
socket.on("user-joined", async () => {

    if (!peerConnection) {
        createPeer();
    }

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("signal", {
        room: ROOM_ID,
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
            room: ROOM_ID,
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

micBtn.onclick = () => {

    if (!localStream) return;

    const audioTrack = localStream.getAudioTracks()[0];

    audioTrack.enabled = !audioTrack.enabled;

    micBtn.innerText = audioTrack.enabled
        ? "🎤 Mic On"
        : "🔇 Mic Off";

};

cameraBtn.onclick = () => {

    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];

    videoTrack.enabled = !videoTrack.enabled;

    cameraBtn.innerText = videoTrack.enabled
        ? "📷 Camera On"
        : "🚫 Camera Off";

};

leaveBtn.onclick = () => {

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }

    socket.disconnect();

    localStorage.clear();

    window.location.href = "login.html";

};
