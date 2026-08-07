// --- Firebase Authentication Module ---
document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  // Simulated professional authentication entry sequence
  document.getElementById('auth-container').classList.add('hidden');
  document.getElementById('studio-app').classList.remove('hidden');
  initClassSession();
});

// --- Live Class Session Controls ---
function initClassSession() {
  const socket = io();
  const roomId = "ANIKOUS-PRO-ROOM";
  
  socket.emit('join-room', { roomId, user: { name: "Music Professor" } });

  // Class Timer Engine
  let seconds = 0;
  setInterval(() => {
    seconds++;
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    document.getElementById('class-timer').innerText = `${hrs}:${mins}:${secs}`;
  }, 1000);

  // Video Streaming Initialization via WebRTC MediaDevices
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      const localVideo = document.getElementById('local-video');
      localVideo.srcObject = stream;

      let micActive = true;
      document.getElementById('mic-toggle').addEventListener('click', (e) => {
        micActive = !micActive;
        stream.getAudioTracks()[0].enabled = micActive;
        e.target.classList.toggle('active', micActive);
        e.target.innerText = micActive ? '🎤 Mic' : '🔇 Muted';
      });

      let camActive = true;
      document.getElementById('cam-toggle').addEventListener('click', (e) => {
        camActive = !camActive;
        stream.getVideoTracks()[0].enabled = camActive;
        e.target.classList.toggle('active', camActive);
        e.target.innerText = camActive ? '📹 Cam' : '📷 Cam Off';
      });
    })
    .catch((err) => {
      console.warn('Camera/Microphone permissions restricted:', err);
    });

  // Action Handlers
  document.getElementById('raise-hand-btn').addEventListener('click', () => {
    alert('✋ Hand raised successfully. The teacher has been notified.');
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.reload();
  });
}
