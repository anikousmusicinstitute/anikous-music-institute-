class NotationStudio {
  constructor() {
    this.renderer = null;
    this.context = null;
    this.notesQueue = [];
    this.initStaff();
  }

  initStaff() {
    const container = document.getElementById('output-notation');
    container.innerHTML = '';

    const width = container.clientWidth || 600;
    const height = 180;

    const VF = Vex.Flow;
    this.renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    this.renderer.resize(width, height);
    this.context = this.renderer.getContext();

    this.renderEmptyStaff();
  }

  renderEmptyStaff() {
    const VF = Vex.Flow;
    this.context.clear();

    const staveTreble = new VF.Stave(10, 10, 500);
    staveTreble.addClef('treble').addTimeSignature('4/4');
    staveTreble.setContext(this.context).draw();

    const staveBass = new VF.Stave(10, 90, 500);
    staveBass.addClef('bass').addTimeSignature('4/4');
    staveBass.setContext(this.context).draw();

    // Grand staff connector brackets
    const connector = new VF.StaveConnector(staveTreble, staveBass);
    connector.setType(VF.StaveConnector.type.BRACE);
    connector.setContext(this.context).draw();

    const lineConnector = new VF.StaveConnector(staveTreble, staveBass);
    lineConnector.setType(VF.StaveConnector.type.SINGLE_LEFT);
    lineConnector.setContext(this.context).draw();
  }

  addNoteToStaff(midiNote) {
    // Convert MIDI to VexFlow note string (e.g., "c/4", "f#/5")
    const noteNames = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    const octave = Math.floor(midiNote / 12) - 1;
    const name = noteNames[midiNote % 12].replace('#', '#');
    const vexNoteKey = `${name}/${octave}`;

    this.notesQueue.push(vexNoteKey);
    if (this.notesQueue.length > 8) this.notesQueue.shift();

    this.redrawNotes();
  }

  redrawNotes() {
    const VF = Vex.Flow;
    this.renderEmptyStaff();

    if (this.notesQueue.length === 0) return;

    try {
      const notes = this.notesQueue.map(key => new VF.StaveNote({
        clef: key.includes('/4') || key.includes('/5') || key.includes('/6') ? 'treble' : 'bass',
        keys: [key],
        duration: 'q'
      }));

      const voice = new VF.Voice({ num_beats: notes.length, beat_value: 4 });
      voice.addTickables(notes);

      const formatter = new VF.Formatter().joinVoices([voice]);
      formatter.format([voice], 450);

      voice.draw(this.context, new VF.Stave(10, 10, 500));
    } catch (e) {
      console.error("Notation rendering adjustment error:", e);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.notationStudio = new NotationStudio();
});
