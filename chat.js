const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const studentListElement = document.getElementById('student-list');
const studentCountElement = document.getElementById('student-count');

function sendMessage() {
    const message = chatInput.value.trim();
    if (message === "") return;

    socket.emit('send-message', {
        roomId: document.getElementById('room-input').value.trim(),
        name: loggedInUserName,
        message: message
    });
    chatInput.value = "";
}

socket.on('receive-message', (data) => {
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = "8px";
    msgDiv.innerHTML = `<strong>${data.name}:</strong> ${data.message}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

document.getElementById('raise-hand-btn').addEventListener('click', () => {
    const roomId = document.getElementById('room-input').value.trim();
    socket.emit('raise-hand', { roomId, name: loggedInUserName });
});

socket.on('user-raised-hand', (data) => {
    alert(`✋ ${data.name} has raised their hand!`);
});

socket.on('update-student-list', (students) => {
    studentListElement.innerHTML = "";
    studentCountElement.innerText = students.length;
    students.forEach(student => {
        const li = document.createElement('li');
        li.style.padding = "5px 0";
        li.style.borderBottom = "1px solid #333";
        li.innerText = student.name;
        studentListElement.appendChild(li);
    });
});

document.getElementById('send-chat-btn').addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
