const socket = io('http://localhost:3000');
const localVideo = document.getElementById('local-video');

let localStream;
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

async function startLocalVideo() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error("Error accessing media devices:", error);
        alert("Camera or Microphone permission denied!");
    }
}

function joinRoom(roomId) {
    socket.emit('join-room', roomId, socket.id, loggedInUserName);
}

let isAudioMuted = false;
document.getElementById('mic-btn').addEventListener('click', () => {
    const audioTrack = localStream.getAudioTracks()[0];
    isAudioMuted = !isAudioMuted;
    audioTrack.enabled = !isAudioMuted;
    document.getElementById('mic-btn').innerText = isAudioMuted ? "Unmute Mic" : "Mute Mic";
});

let isCameraStopped = false;
document.getElementById('camera-btn').addEventListener('click', () => {
    const videoTrack = localStream.getVideoTracks()[0];
    isCameraStopped = !isCameraStopped;
    videoTrack.enabled = !isCameraStopped;
    document.getElementById('camera-btn').innerText = isCameraStopped ? "Start Camera" : "Stop Camera";
});

document.getElementById('screen-share-btn').addEventListener('click', async () => {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        localVideo.srcObject = screenStream;

        screenTrack.onended = () => {
            localVideo.srcObject = localStream;
            screenStream.getTracks().forEach(track => track.stop());
        };
    } catch (error) {
        console.error("Error sharing screen:", error);
    }
});

const recordBtn = document.getElementById('record-btn');
recordBtn.addEventListener('click', () => {
    if (!isRecording) {
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(localStream, { mimeType: 'video/webm; codecs=vp9' });
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'music-class-recording.webm';
            a.click();
        };
        mediaRecorder.start();
        isRecording = true;
        recordBtn.innerText = "⏹ Stop Recording";
    } else {
        mediaRecorder.stop();
        isRecording = false;
        recordBtn.innerText = "⏺ Start Recording";
    }
});
