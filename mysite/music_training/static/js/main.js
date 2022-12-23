// ripple effect: https://codepen.io/daless14/pen/DqXMvK
// caculate note duration and hertz from bpm: http://bradthemad.org/guitar/tempo_explanation.php
// this visual library would be wild with this: https://ptsjs.org/

let synth = new Tone.Synth().toDestination();

const BPM = 120;

const reverb = new Tone.Reverb({
    decay: 4,
    wet: 0.2,
    preDelay: 0.0,
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

Tone.Transport.bpm.value = BPM;

Tone.start();

const AMinorScale = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const AllNotes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FourOnTheFloorTest = [
   { time: "0:0:0", note: "C4", velocity: 0.9 },
   { time: "0:1:0", note: "C4", velocity: 0.9 },
   { time: "0:2:0", note: "C4", velocity: 0.9 },
   { time: "0:3:0", note: "C4", velocity: 0.9 },
   { time: "1:0:0", note: "C4", velocity: 0.0 },
   { time: "1:1:0", note: "C4", velocity: 0.0 },
   { time: "1:2:0", note: "C4", velocity: 0.0 },
   { time: "1:3:0", note: "C4", velocity: 0.0 }
];

const StaticNotes = [
    { time: 0, note: "C3", velocity: 0.9 },
    { time: "0:2", note: "G3", velocity: 0.5 },
    { time: "0:3:1", note: "C4", velocity: 0.5 },
    { time: "0:3:3", note: "C4", velocity: 0.5 }
];

let currentNote = 0;

function tonejsLoop() {
    const loopA = new Tone.Loop(time => {
        if (currentNote === 7) {
            currentNote = 0;
        }
        synth.triggerAttackRelease(AMinorScale[currentNote]+'4', '16n', time);
        currentNote++;
    }, "16n").start(0);
}

// creates a number of notes within one measure at random rhythmic times, all the same pitch
// can produce up to 15 notes, as division in Tone.js only goes to 16ths
// returns an array understood by Tone.js
//example array returned with four notes requested:
//[
//    { time: "0:0:0", note: "C4", velocity: 0.9 },
//    { time: "0:2:0", note: "C4", velocity: 0.9 },
//    { time: "0:3:1", note: "C4", velocity: 0.9 },
//    { time: "0:3:3", note: "C4", velocity: 0.9 }
//]
function hardRandomizer(notes) {
    notes = (notes > 15) ? 15 : notes;

    const note = { time: 0, note: "C4", velocity: 0.9 };
    let noteClone = Object.assign({}, note);
    let timeGroup = [];
    let noteGroup = [];
    let time = "";
    let random4th = 0;
    let random16th = 0;

    for (let i = 0; i < notes; i++) {
        do {
            random4th = Math.floor(Math.random() * 4);
            random16th = Math.floor(Math.random() * 4);
            time = "0:" + random4th + ":" + random16th;

        } while (timeGroup.includes(time));
        timeGroup.push(time);
    }

    timeGroup.sort();

    for (time in timeGroup) {
        noteClone.time = timeGroup[time];
        noteGroup.push(noteClone);
        noteClone = {...note};
    }

    return noteGroup;
}

function mediumRandomizer(notes) {
    notes = (notes > 15) ? 15 : notes;

    const note = { time: 0, note: "C4", velocity: 0.9 };
    let noteClone = Object.assign({}, note);
    let timeGroup = [];
    let noteGroup = [];
    let time = "";
    let random4th = 0;
    let random16th = 0;

    let medium = [0, 2];

    for (let i = 0; i < notes; i++) {
        do {
            random4th = Math.floor(Math.random() * 4);
            random16th = medium[Math.floor(Math.random() * 2)];
            time = "0:" + random4th + ":" + random16th;
        } while (timeGroup.includes(time));
        timeGroup.push(time);
    }

    timeGroup.sort();

    for (time in timeGroup) {
        noteClone.time = timeGroup[time];
        noteGroup.push(noteClone);
        noteClone = {...note};
    }

    return noteGroup;
}

// extends the randomizer to make long strings of random notes
//     notes (int)      ->  how many notes in each phrase (within one 4/4 measure long by default)
//     measures (int)   ->  How many total measures the randomizer will run
//     hasSpace (bool)  ->  whether to include rests in-between every other phrase for user input
function randomizerExtender(notes, measures, hasRepeat=true) {
    let noteGroup = [];
    let currGroup = 0;
    let lastGroup = 0;
    let currNote = 0;

    for (let i = 0; i < measures; i++) {
        currGroup = mediumRandomizer(notes);
        for (const note in currGroup) {
            if (i % 2 !== 0 && hasRepeat)  {
                currNote = {...lastGroup[note]};

                currNote.time = currNote.time.replace('0:', i+':');
                currNote.velocity = 0;
                noteGroup.push(currNote);
            } else {
                currNote = {...currGroup[note]};
                currNote.time = currNote.time.replace('0:', i+':');
                noteGroup.push(currNote);
            }
        }
        lastGroup = currGroup;
    }
    console.log(noteGroup);
    return noteGroup;
}

let score = 0;

let noteWindow = 0;

let openTime = 0;
let closeTime = 0;

function tonejsPart() {
    const synth = new Tone.Synth().toDestination();
    // use an array of objects as long as the object has a "time" attribute

    let triggerNum = 0;

    let leftPaw = document.getElementById('paw-left');

    let rightPaw = document.getElementById('paw-right');

    let paws = [leftPaw, rightPaw];

    let part = new Tone.Part(((time, value) => {
        synth.triggerAttackRelease(value.note, "16n", time, value.velocity, 2);

        if (synth) {
            noteTrigger(410, paws[ triggerNum % 2 ], value.velocity);
            noteRelease(460, paws[ triggerNum % 2 ], value.velocity);
        }

        if (synth && value.velocity == 0) {
            inputOpen(410);
            inputClose(550);
        }

        triggerNum++;

    }), randomizerExtender(5, 16)).start(0);

    //callback functions in-between every other measure
    Tone.Transport.scheduleRepeat((time) => {
        //some visual focus to signal input?
    }, "2m", "1m");
}

function tonejsDrums() {
    const kickDrum = new Tone.MembraneSynth({
        volume: 4
    }).toDestination();

    const kickPart = new Tone.Part(function(time) {
        kickDrum.triggerAttackRelease('C1', '8n', time);
    }, [{ time: '0:0' },{ time: '0:1' },{ time: '0:2' },{ time: '0:3' }]).start(0);

    kickPart.loop = true;
}

tonejsPart();
tonejsDrums();

async function waitForInput() {
    let ready = await Tone.start();
}

async function noteTrigger(milisec, paw, volume) {
    await waitForNote(milisec);

    if (volume) {
        paw.style.backgroundPositionX = '-800px';
    }
}

async function noteRelease(milisec, paw, volume) {
    await waitForNote(milisec);

    if (volume) {
        paw.style.backgroundPositionX = '0px';
    }
}

function inputOpen(milisec) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("open");
            noteWindow = 1;

            openTime = +new Date();

            resolve(1);
        }, milisec);
    });
}

function inputClose(milisec) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("close");
            noteWindow = 0;

            closeTime = +new Date();

            resolve(0);
        }, milisec);
    });
}

function waitForNote(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}

document.getElementById("play-button").addEventListener("click", event => {
    if (Tone.Transport.state !== "started") {
        console.log("-- new session --\n\n")
    }

    waitForInput();
    Tone.Transport.toggle();
    console.log(Tone.Transport.state);
 });


document.addEventListener('keydown', (event) => {
    let accuracy = 0;

    if (event.key === ' ') {
        document.getElementById('blueSquare').style.backgroundColor = 'green';

        console.log("Time between input and window open: ", +new Date() - openTime);

        if (noteWindow === 1) {
            score++;
            document.getElementById("score").innerHTML = "Score: " + score;
            console.log(score);
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === ' ') {
        document.getElementById('blueSquare').style.backgroundColor = 'blue';
    }
});
