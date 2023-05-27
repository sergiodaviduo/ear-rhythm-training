// ripple effect: https://codepen.io/daless14/pen/DqXMvK
// caculate note duration and hertz from bpm: http://bradthemad.org/guitar/tempo_explanation.php
// this visual library would be wild with this: https://ptsjs.org/

import { STATIC_LIBRARY } from "./constants/notes";

const QuarterNoteTest = STATIC_LIBRARY[2];

let synth = new Tone.Synth().toDestination();

const BPM = 150;

let tempo = BPM;

const reverb = new Tone.Reverb({
    decay: 4,
    wet: 0.2,
    preDelay: 0.0,
});

reverb.generate();      // Load the reverb

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

Tone.Transport.bpm.value = tempo;

Tone.start();

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

let score = 0;

let noteWindow = 0;

let openTime = 0;
let closeTime = 0;

let delay = 480;

let delaySlider = document.getElementById("delay");

let tempoSlider = document.getElementById("tempo");

let scoreBoard = document.getElementById("score");

let scoreResult = document.getElementById("scoreResult");

let notesInMeasure = 5;

document.getElementById('liveDelay').innerHTML = delay;

document.getElementById('liveTempo').innerHTML = tempo;

function tonejsPart(delay, notesInMeasure, song=randomizerExtender(notesInMeasure, 16), open=30, close=90) {
    const synth = new Tone.Synth().toDestination();
    // use an array of objects as long as the object has a "time" attribute

    let triggerNum = 0;

    let leftPaw = document.getElementById('paw-left');

    let rightPaw = document.getElementById('paw-right');

    // triggerNum % 2
    let paws = [leftPaw, rightPaw];

    let part = new Tone.Part(((time, value) => {
        synth.triggerAttackRelease(value.note, "16n", time, value.velocity, 2);

        if (synth) {
            noteTrigger(delay, paws[ 0 ], value.velocity);
            noteRelease(delay+50, paws[ 0 ], value.velocity);
        }

        // when synth is playing with no volume, so input check can be run
        if (synth && value.velocity == 0) {
            inputOpen(delay-open);
            inputClose(delay+close);
        }

        triggerNum++;

    }), QuarterNoteTest).start("2m");

    //callback functions in-between every other measure
    Tone.Transport.scheduleRepeat((time) => {
        if ( score > notesInMeasure * 7 ) {
            party.confetti(scoreBoard, {
                count: party.variation.range(20, 40),
            });
            scoreResult.innerHTML = "You got " + score + " out of " + (notesInMeasure * 8) +"!!";
            score = 0;
        }

    }, "19m", "0m");

    return part;
}

// metronome
function tonejsDrums() {
    const kickDrum = new Tone.MembraneSynth({
        volume: 4
    }).toDestination();

    const kickPart = new Tone.Part(function(time) {
        kickDrum.triggerAttackRelease('C1', '8n', time);
    }, [{ time: '0:0' },{ time: '0:1' },{ time: '0:2' },{ time: '0:3' }]).start(0);

    kickPart.loop = true;

    return kickPart;
}


async function waitForInput() {
    let ready = await Tone.start();
}

// when note is played, "move" paw down 
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
    console.log("open");

    openTime = +new Date();

    openTime += milisec;
}

/*
return new Promise((resolve) => {
    setTimeout(() => {
        console.log("open");
        noteWindow = 1;

        openTime = +new Date();

        resolve(1);
    }, milisec);
});
*/

function inputClose(milisec) {
    console.log("close");

    closeTime = +new Date();

    closeTime += milisec;
}

/*
return new Promise((resolve) => {
    setTimeout(() => {
        console.log("close");
        noteWindow = 0;

        closeTime = +new Date();

        resolve(0);
    }, milisec);
});
*/

function waitForNote(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}

let mainSong = tonejsPart(delay, notesInMeasure);
let click = tonejsDrums();

let firstRun = true;

document.getElementById("play-button").addEventListener("click", event => {
    if (Tone.Transport.state !== "started") {
        console.log("-- new session --\n\n")
    }

    waitForInput();

    if (mainSong.disposed && !firstRun) {
        Tone.Transport.bpm.value = tempo;
        mainSong = tonejsPart(delay, notesInMeasure);
        click = tonejsDrums();
    }

    Tone.Transport.toggle();
    console.log(Tone.Transport.state);

    if (!mainSong.disposed && !firstRun && Tone.Transport.state === "stopped") {
        mainSong.dispose();
        click.dispose();
        document.getElementById('paw-left').style.backgroundPositionX = '0px';
        score = 0;
    }

    firstRun = false;
 });


document.addEventListener('keydown', (event) => {
    let accuracy = 0;

    let keyDownTime = 0;

    if (event.key === ' ') {
        document.getElementById('blueSquare').style.backgroundColor = 'green';

        keyDownTime = +new Date();

        console.log("Time between actual input and window open: ", keyDownTime - openTime);

        if (keyDownTime >= openTime && keyDownTime <= closeTime) {
            score++;
            scoreBoard.innerHTML = "Score: " + score;
            console.log(score);
            document.getElementById("score").classList.add("scored");
            return new Promise((resolve) => {
                setTimeout(() => {
                    scoreBoard.classList.remove("scored");
                    resolve(0);
                }, 90);
            });
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === ' ') {
        document.getElementById('blueSquare').style.backgroundColor = 'blue';
    }
});

delaySlider.addEventListener('change', function() { 
    delay = delaySlider.value;
    document.getElementById('liveDelay').innerHTML = delay;
})

tempoSlider.addEventListener('change', function() { 
    tempo = tempoSlider.value;
    document.getElementById('liveTempo').innerHTML = tempo;
})