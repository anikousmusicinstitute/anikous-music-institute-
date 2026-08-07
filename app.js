document.getElementById('join-room-btn').addEventListener('click', () => {
    const roomId = document.getElementById('room-input').value.trim();
    
    if (roomId === "") {
        alert("Please enter a valid Room ID!");
        return;
    }

    // Hide Room Section and Show Studio Section
    document.getElementById('room-section').style.display = 'none';
    document.getElementById('studio-section').style.display = 'block';

    // Start Local Camera & Connect to Room
    startLocalVideo();
    joinRoom(roomId);
});
