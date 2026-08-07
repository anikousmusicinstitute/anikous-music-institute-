// VexFlow Setup
const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

function renderSheetMusic(noteName = "c/4") {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; // Clear previous render

    // Create an SVG renderer and attach it to the DIV element.
    const renderer = new Renderer(outputDiv, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 150);
    const context = renderer.getContext();

    // Create a stave of width 400 at position 10, 20
    const stave = new Stave(10, 20, 480);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw
    stave.setContext(context).draw();

    // Format note name for VexFlow (e.g., "C4" -> "c/4")
    const formattedNote = noteName.toLowerCase().replace(/(\d+)/, '/$1');

    // Create notes for the stave
    const notes = [
        new StaveNote({ clef: "treble", keys: [formattedNote], duration: "q" }),
        new StaveNote({ clef: "treble", keys: ["d/4"], duration: "q" }),
        new StaveNote({ clef: "treble", keys: ["e/4"], duration: "q" }),
        new StaveNote({ clef: "treble", keys: ["f/4"], duration: "q" })
    ];

    // Create a voice in 4/4 and add above notes
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    // Format and justify the notes to 400 pixels.
    new Formatter().format([voice], 400);

    // Render voices
    voice.draw(context, stave);
}

// Initial render
renderSheetMusic("c/4");

// Export Mockups
document.getElementById('export-pdf-btn').addEventListener('click', () => {
    alert("Sheet music exported as PDF successfully!");
});

document.getElementById('export-midi-btn').addEventListener('click', () => {
    alert("MIDI file downloaded successfully!");
});
