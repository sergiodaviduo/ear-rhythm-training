//ripple effect: https://codepen.io/daless14/pen/DqXMvK

var synth = new Tone.Synth().toDestination()
const now = Tone.now()
const reverb = new Tone.Reverb({
    decay: 4,
    wet: 0.2,
    preDelay: 0.25,
});

await reverb.generate();      // Load the reverb

const effect = new Tone.FeedbackDelay(`${Math.floor(2 / 2)}n`, 1 / 2);
effect.wet.value = 0.2;

synth.set({
    voice0: {
        oscillator: {
          type: "triangle",
        },
    volume: -30,
    envelope: { attack: 0.005, release: 0.05, sustain: 1, },
    },
    voice1: {
        volume: -20,
        envelope: { attack: 0.005, release: 0.05, sustain: 1, },
    },
});

effect.connect(reverb);
reverb.connect(Tone.Destination);

Tone.Transport.bpm.value = 150

Tone.start()

const AMinorScale = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

let currentNote = 0;

function tonejsLoop() {
    const loopA = new Tone.Loop(time => {
        if (currentNote == 7) {
            currentNote = 0;
        }
        synth.triggerAttackRelease(AMinorScale[currentNote]+'4', '8n', time)
        currentNote++;
    }, "4n").start(0);
}

function note_randomizer(notes) {
    let note = { time: 0, note: "C4", velocity: 0.9 }
    let noteGroup = []
    let random4th = 0
    let random16th = 0

    for (let i = 0; i < notes; i++) {
        do {
            random4th = Math.floor(Math.random() * 3)
            random16th = Math.floor(Math.random() * 3)
            note.time = "0:" + random4th + ":" + random16th
        } while (noteGroup.includes(note))
        noteGroup.push()
    }

    return noteGroup
}

function static_notes() {
    let notes = [
        { time: 0, note: "C3", velocity: 0.9 },
        { time: "0:2", note: "G3", velocity: 0.5 },
        { time: "0:3:1", note: "C4", velocity: 0.5 },
        { time: "0:3:3", note: "C4", velocity: 0.5 }
    ]
    return notes
}

function tonejsPart() {
    const synth = new Tone.Synth().toDestination();
    // use an array of objects as long as the object has a "time" attribute
    const part = new Tone.Part(((time, value) => {
            // the value is an object which contains both the note and the velocity
            synth.triggerAttackRelease(value.note, "16n", time, value.velocity);
        }), static_notes()).start(0);

    //without this, can't start loop again after stopping
    part.loop = true;
}

tonejsPart()

async function waitForInput() {
    Tone.start()
    let ready = await Tone.start()
    console.log('audio is ready')
}

document.getElementById("play-button").addEventListener("click", event => {
    waitForInput()
    Tone.Transport.toggle()
 });

