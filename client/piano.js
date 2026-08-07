class VirtualPianoStudio {
  constructor() {
    this.audioCtx = null;
    this.sustainActive = false;
    this.activeNotes = new Map();
    this.keyLabelsVisible = true;
    this.currentInstrument = 'grand-piano';
    
    this.initAudio();
    this.buildKeyboard();
    this.setupListeners();
    this.setupMIDI();
  }

  initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
  }

  // Calculate frequency for MIDI note number
  noteToFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  playNote(midiNote, velocity = 0.8) {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.activeNotes.has(midiNote)) return;

    const freq = this.noteToFreq(midiNote);
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    // Instrument Tone Customization
    if (this.currentInstrument === 'grand-piano') {
      osc.type = 'triangle';
    } else if (this.currentInstrument === 'synth-lead') {
      osc.type = 'sawtooth';
    } else {
      osc.type = 'sine';
    }

    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    // Dynamic ADSR Envelope
    const now = this.audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(velocity, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    this.activeNotes.set(midiNote, { osc, gainNode });

    // Highlight Key Visually
    const keyEl = document.querySelector(`[data-note="${midiNote}"]`);
    if (keyEl) keyEl.classList.add('active');

    // Trigger Notation Event
    if (window.notationStudio) {
      window.notationStudio.addNoteToStaff(midiNote);
    }
  }

  stopNote(midiNote) {
    if (this.sustainActive) return; // Keep ringing if sustain is down

    if (this.activeNotes.has(midiNote)) {
      const { osc, gainNode } = this.activeNotes.get(midiNote);
      const now = this.audioCtx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      
      setTimeout(() => {
        try { osc.stop(); } catch(e){}
      }, 300);

      this.activeNotes.delete(midiNote);

      const keyEl = document.querySelector(`[data-note="${midiNote}"]`);
      if (keyEl) keyEl.classList.remove('active');
    }
  }

  releaseSustainedNotes() {
    for (let [midiNote] of this.activeNotes) {
      this.stopNoteImmediate(midiNote);
    }
  }

  stopNoteImmediate(midiNote) {
    if (this.activeNotes.has(midiNote)) {
      const { osc } = this.activeNotes.get(midiNote);
      try { osc.stop(); } catch(e){}
      this.activeNotes.delete(midiNote);
      const keyEl = document.querySelector(`[data-note="${midiNote}"]`);
      if (keyEl) keyEl.classList.remove('active');
    }
  }

  buildKeyboard() {
    const container = document.getElementById('virtual-piano');
    container.innerHTML = '';

    // Standard 88-key piano range: MIDI 21 (A0) to 108 (C8)
    // For workspace optimization, render active teaching range: MIDI 36 (C2) to 96 (C7)
    const startNote = 48; // C3
    const endNote = 84;   // C6

    let whiteKeyLeft = 0;

    for (let i = startNote; i <= endNote; i++) {
      const noteName = i % 12;
      const isBlack = [1, 3, 6, 8, 10].includes(noteName);

      const key = document.createElement('div');
      key.className = `key ${isBlack ? 'black' : 'white'}`;
      key.dataset.note = i;

      if (!isBlack) {
        key.style.left = `${whiteKeyLeft}px`;
        whiteKeyLeft += 32;
      } else {
        key.style.left = `${whiteKeyLeft - 10}px`;
      }

      if (this.keyLabelsVisible && !isBlack) {
        key.innerText = this.getNoteName(i);
      }

      key.addEventListener('mousedown', () => this.playNote(i));
      key.addEventListener('mouseup', () => this.stopNote(i));
      key.addEventListener('mouseleave', () => this.stopNote(i));

      container.appendChild(key);
    }
  }

  getNoteName(midiNote) {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    return `${names[midiNote % 12]}${octave}`;
  }

  setupListeners() {
    document.getElementById('instrument-select').addEventListener('change', (e) => {
      this.currentInstrument = e.target.value;
    });

    const sustainBtn = document.getElementById('sustain-btn');
    sustainBtn.addEventListener('click', () => {
      this.sustainActive = !this.sustainActive;
      sustainBtn.innerText = `Sustain: ${this.sustainActive ? 'ON' : 'OFF'}`;
      sustainBtn.style.background = this.sustainActive ? 'var(--success)' : 'var(--accent-color)';
      if (!this.sustainActive) {
        this.releaseSustainedNotes();
      }
    });

    document.getElementById('toggle-labels').addEventListener('click', () => {
      this.keyLabelsVisible = !this.keyLabelsVisible;
      this.buildKeyboard();
    });
  }

  setupMIDI() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        (midiAccess) => {
          for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = (msg) => this.handleMIDIMessage(msg);
          }
        },
        () => console.warn('MIDI hardware access denied or unavailable.')
      );
    }
  }

  handleMIDIMessage(msg) {
    const [command, note, velocity] = msg.data;
    if (command === 144 && velocity > 0) {
      this.playNote(note, velocity / 127);
    } else if (command === 128 || (command === 144 && velocity === 0)) {
      this.stopNote(note);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.pianoStudio = new VirtualPianoStudio();
});
