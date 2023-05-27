// ripple effect: https://codepen.io/daless14/pen/DqXMvK
// caculate note duration and hertz from bpm: http://bradthemad.org/guitar/tempo_explanation.php
// this visual library would be wild with this: https://ptsjs.org/

import { Game } from "./components/game.js";
import { STATIC_LIBRARY } from "./constants/notes.js";
import { metronome } from "./components/instruments.js";
import { mediumRandomizer, hardRandomizer, randomizerExtender } from "./components/generators.js";

const GameInstance = new Game();

const QuarterNoteTest = STATIC_LIBRARY[2];

let noteWindow = 0;

let openTime = 0;
let closeTime = 0;

GameInstance.tempo = 150;
GameInstance.delay = 100;
GameInstance.notesInMeasure = 5;

let delaySlider = document.getElementById("delay");
let tempoSlider = document.getElementById("tempo");
let scoreBoard = document.getElementById("score");
let scoreResult = document.getElementById("scoreResult");

document.getElementById('liveDelay').innerHTML = GameInstance.delay;
document.getElementById('liveTempo').innerHTML = GameInstance.tempo;
delaySlider.value = GameInstance.delay;
tempoSlider.value = GameInstance.tempo;

function tonejsPart(delay, notesInMeasure, song=randomizerExtender(GameInstance.notesInMeasure, 16), open=30, close=90) {
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

    }), song).start("2m");

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
let mainSong = tonejsPart(GameInstance.delay, GameInstance.notesInMeasure);
let click = metronome();

let firstRun = true;

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

function inputClose(milisec) {
    console.log("close");

    closeTime = +new Date();

    closeTime += milisec;
}

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
        Tone.Transport.bpm.value = GameInstance.tempo;
        mainSong = tonejsPart(GameInstance.delay, GameInstance.notesInMeasure);
        click = metronome();
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

        console.log("Input recorded after ", keyDownTime - openTime);

        if (keyDownTime >= openTime && keyDownTime <= closeTime) {
            GameInstance.score++;
            scoreBoard.innerHTML = "Score: " + GameInstance.score;
            console.log(GameInstance.score);
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
    GameInstance.delay = delaySlider.value;
    document.getElementById('liveDelay').innerHTML = GameInstance.delay;
})

tempoSlider.addEventListener('change', function() { 
    GameInstance.tempo = tempoSlider.value;
    document.getElementById('liveTempo').innerHTML = GameInstance.tempo ;
})