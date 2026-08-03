// --- Video Call Integration ---

function startVideo() {
    const box = document.getElementById("videoBox");
    const meet = document.getElementById("meet");
    const btn = document.getElementById("videoBtn");

    if (!meet || !box || !btn) return;

    if (!meet.src || meet.src === window.location.href) {
        const room = "PianoLiveProClass";
        meet.src = `https://meet.jit.si/${room}`;
        meet.style.display = "block";
        box.style.height = "400px";
        box.style.transition = "height 0.3s ease";
        
        btn.textContent = "❌ Close Video";
        btn.classList.add("active");
    } else {
        meet.src = "";
        meet.style.display = "none";
        box.style.height = "0";
        
        btn.textContent = "🎥 Video Call";
        btn.classList.remove("active");
    }
}

// --- Lifecycle & Mobile Event Handlers ---

window.addEventListener("beforeunload", () => {
    const meet = document.getElementById("meet");
    if (meet) {
        meet.src = "";
    }
});

// Prevent accidental zoom and double-tap behaviors on mobile devices
document.addEventListener("gesturestart", (e) => {
    e.preventDefault();
}, { passive: false });

document.addEventListener("dblclick", (e) => {
    e.preventDefault();
}, { passive: false });
