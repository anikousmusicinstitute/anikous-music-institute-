let midi = null;

async function connectMIDI() {
    if (!navigator.requestMIDIAccess) {
        alert("MIDI Not Supported");
        return;
    }

    try {
        midi = await navigator.requestMIDIAccess();
        
        midi.inputs.forEach(input => {
            input.onmidimessage = midiMessage;
        });

        // Also listen for devices connecting/disconnecting dynamically
        midi.onstatechange = (e) => {
            if (e.port.type === "input" && e.port.state === "connected") {
                e.port.onmidimessage = midiMessage;
            }
        };

        alert("🎹 MIDI Connected");
    } catch (err) {
        alert("MIDI Connection Failed");
    }
}

function midiMessage(event) {
    const [status, note, velocity] = event.data;
    const command = status & 0xf0;
    const key = document.querySelector(`[data-note="${note}"]`);

    // Note On (command 144) with velocity > 0
    if (command === 144 && velocity > 0) {
        if (typeof pressKey === "function") {
            pressKey(note, key);
        }
    }
    
    // Note Off (command 128) or Note On with velocity 0
    else if (command === 128 || (command === 144 && velocity === 0)) {
        if (typeof releaseKey === "function") {
            releaseKey(note, key);
        }
    }
}
