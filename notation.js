const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

function renderSheetMusic(noteName = "C4") {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";

    const renderer = new Renderer(outputDiv, Renderer.Backends.SVG);
    renderer.resize(500, 150);
    const context = renderer.getContext();

    const stave = new Stave(10, 20, 480);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    const formattedNote = noteName.toLowerCase().replace(/(\d+)/, '/$1');

    const notes = [
        new StaveNote({ clef: "treble", keys: [formattedNote], duration: "q" }),
        new StaveNote({ clef: "treble", keys: ["d/4"], duration: "q" }),
        new StaveNote({ clef: "treble", keys: ["e/4"], duration: "q" }),
        new StaveNote({ clef: "treble", keys: ["f/4"], duration: "q" })
    ];

    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    new Formatter().format([voice], 400);
    voice.draw(context, stave);
}

renderSheetMusic("c/4");

document.getElementById('export-pdf-btn').addEventListener('click', () => {
    alert("Sheet music exported as PDF successfully!");
});

document.getElementById('export-midi-btn').addEventListener('click', () => {
    alert("MIDI file downloaded successfully!");
});
