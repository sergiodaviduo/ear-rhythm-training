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
    const note = { time: 0, note: "C4", velocity: 0.9 }
    let noteClone = Object.assign({}, note)
    let timeGroup = []
    let noteGroup = []
    let time = ""
    let random4th = 0
    let random16th = 0

    for (let i = 0; i < notes; i++) {
        do {
            random4th = Math.floor(Math.random() * 3)
            random16th = Math.floor(Math.random() * 3)
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

    console.log(noteGroup)
    console.log(timeGroup)

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
            synth.triggerAttackRelease(value.note, "16n", time, value.velocity, 1);
        }), note_randomizer(4)).start(0);

    //without this, can't start loop again after stopping
    part.loop = true;
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

document.getElementById("play-button").addEventListener("click", event => {
    waitForInput()
    Tone.Transport.toggle()
 });

