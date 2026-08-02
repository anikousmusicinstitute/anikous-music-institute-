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
