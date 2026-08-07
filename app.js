document.getElementById('join-room-btn').addEventListener('click', () => {
    const roomId = document.getElementById('room-input').value.trim();
    
    if (roomId === "") {
        alert("Please enter a valid Room ID!");
        return;
    }

    document.getElementById('room-section').style.display = 'none';
    document.getElementById('studio-section').style.display = 'flex';

    startLocalVideo();
    joinRoom(roomId);
});
