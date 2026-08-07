const socket = io('http://localhost:3000');
const videoGrid = document.getElementById('video-grid');
const localVideo = document.getElementById('local-video');

let localStream;
let peerConnections = {};

// 1. Get Camera & Mic Access
async function startLocalVideo() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error("Error accessing media devices:", error);
        alert("Camera or Microphone permission denied!");
    }
}

// 2. Join Room Logic
function joinRoom(roomId) {
    socket.emit('join-room', roomId, socket.id);

    socket.on('user-connected', (userId) => {
        console.log("New user connected:", userId);
        // இங்கு WebRTC Peer Connection உருவாக்கப்படும் (Simple Peer அல்லது Native WebRTC)
    });
}

// 3. Media Controls (Mic, Camera, Screen Share)
let isAudioMuted = false;
function toggleMic() {
    const audioTrack = localStream.getAudioTracks()[0];
    isAudioMuted = !isAudioMuted;
    audioTrack.enabled = !isAudioMuted;
    document.getElementById('mic-btn').innerText = isAudioMuted ? "Unmute Mic" : "Mute Mic";
}

let isCameraStopped = false;
function toggleCamera() {
    const videoTrack = localStream.getVideoTracks()[0];
    isCameraStopped = !isCameraStopped;
    videoTrack.enabled = !isCameraStopped;
    document.getElementById('camera-btn').innerText = isCameraStopped ? "Start Camera" : "Stop Camera";
}

async function shareScreen() {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        // Replace video track with screen track
        const sender = localStream.getVideoTracks()[0];
        localVideo.srcObject = screenStream;

        screenTrack.onended = () => {
            localVideo.srcObject = localStream; // Revert back to camera when screen share stops
            screenStream.getTracks().forEach(track => track.stop());
        };
    } catch (error) {
        console.error("Error sharing screen:", error);
    }
}

// Event Listeners for Controls
document.getElementById('mic-btn').addEventListener('click', toggleMic);
document.getElementById('camera-btn').addEventListener('click', toggleCamera);
document.getElementById('screen-share-btn').addEventListener('click', shareScreen);
