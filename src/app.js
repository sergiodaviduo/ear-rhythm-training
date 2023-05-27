// ripple effect: https://codepen.io/daless14/pen/DqXMvK
// caculate note duration and hertz from bpm: http://bradthemad.org/guitar/tempo_explanation.php
// this visual library would be wild with this: https://ptsjs.org/

import { Game } from "./components/game";
import { STATIC_LIBRARY } from "./constants/notes";
import { startKeyboard } from "./components/instruments";

const GameInstance = new Game();

const QuarterNoteTest = STATIC_LIBRARY[2];

let noteWindow = 0;

let openTime = 0;
let closeTime = 0;

GameInstance.tempo = 150;
GameInstance.delay = 480;
GameInstance.instrument = startKeyboard(GameInstance.tempo);
GameInstance.notesInMeasure = 5;

let delaySlider = document.getElementById("delay");
let tempoSlider = document.getElementById("tempo");
let scoreBoard = document.getElementById("score");
let scoreResult = document.getElementById("scoreResult");

document.getElementById('liveDelay').innerHTML = GameInstance.delay;

document.getElementById('liveTempo').innerHTML = GameInstance.tempo;

// scale I think?
let currentNote = 0;

function tonejsLoop() {
    const loopA = new Tone.Loop(time => {
        if (currentNote === 7) {
            currentNote = 0;
        }
        GameInstance.instrument.triggerAttackRelease(AMinorScale[currentNote]+'4', '16n', time);
        currentNote++;
    }, "16n").start(0);
}

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
        if ( GameInstance.score > notesInMeasure * 7 ) {
            party.confetti(scoreBoard, {
                count: party.variation.range(20, 40),
            });
            scoreResult.innerHTML = "You got " + GameInstance.score + " out of " + (notesInMeasure * 8) +"!!";
            GameInstance.score = 0;
        }

    }, "19m", "0m");

    return part;
}

// mainsong and click must be accessible by input
let mainSong = tonejsPart(delay, notesInMeasure);
let click = tonejsDrums();

let firstRun = true;

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

async function waitForInput() {
    let ready = await Tone.start();
}

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
        GameInstance.score = 0;
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