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

Tone.Transport.bpm.value = 120

Tone.start()

const AMinorScale = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const AllNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

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

// creates a number of notes within one measure at random rhythmic times, all the same pitch
// can be up to 15 notes, as division in Tone.js only goes to 16ths
// returns an array understood by Tone.js
//example array returned with four notes requested:
//[
//    { time: "0:0:0", note: "C4", velocity: 0.9 },
//    { time: "0:2:0", note: "C4", velocity: 0.9 },
//    { time: "0:3:1", note: "C4", velocity: 0.9 },
//    { time: "0:3:3", note: "C4", velocity: 0.9 }
//]
function noteRandomizer(notes) {
    if (notes > 15) {
        notes = 15
    }

    const note = { time: 0, note: "C4", velocity: 0.9 }
    let noteClone = Object.assign({}, note)
    let timeGroup = []
    let noteGroup = []
    let time = ""
    let random4th = 0
    let random16th = 0

    for (let i = 0; i < notes; i++) {
        do {
            random4th = Math.floor(Math.random() * 4)
            random16th = Math.floor(Math.random() * 4)
            time = "0:" + random4th + ":" + random16th

        } while (timeGroup.includes(time))
        timeGroup.push(time)
    }

    timeGroup.sort()

    for (time in timeGroup) {
        noteClone.time = timeGroup[time]
        noteGroup.push(noteClone)
        noteClone = {...note}
    }

    return noteGroup
}

// extends the randomizer to make long strings of random notes
function randomizerExtender(notes, measures) {
    let noteGroup = []
    let currGroup = 0
    let currNote = 0
    let time = ""

    for (let i = 0; i < measures; i++) {
        currGroup = noteRandomizer(notes)
        for (const note in currGroup) {
            currNote = {...currGroup[note]}
            currNote.time = currNote.time.replace('0:', i+':')
            noteGroup.push(currNote)
        }
    }
    console.log(noteGroup)
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

    let part = new Tone.Part(((time, value) => {
        // the value is an object which contains both the note and the velocity
        synth.triggerAttackRelease(value.note, "16n", time, value.velocity, 1);
    }), randomizerExtender(7,16)).start(0);

    //part.loop = true;
}

function tonejsDrums() {
    const kickDrum = new Tone.MembraneSynth({
        volume: 4
    }).toDestination();

    const kickPart = new Tone.Part(function(time) {
        kickDrum.triggerAttackRelease('C1', '8n', time)
    }, [{ time: '0:0' },{ time: '0:1' },{ time: '0:2' },{ time: '0:3' }]).start(0);

    kickPart.loop = true;
}

tonejsPart()
tonejsDrums()

async function waitForInput() {
    Tone.start()
    let ready = await Tone.start()
    console.log('audio is ready')
}
console.log(Tone.Transport.state)
document.getElementById("play-button").addEventListener("click", event => {
    console.log(Tone.Transport.state)
    waitForInput()
    Tone.Transport.toggle()
 });

