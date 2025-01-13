import { randomizerExtender } from './generators.js';
import { fourByFour } from './instruments.js';
import { menu, playGame, settings, showScoreSubmitMenu, endOfSong, calibrateIntro } from '../navigation/menu.js';
import { setupControls, inputClose, inputOpen, noteRelease, noteTrigger } from '../components/controls.js';
import { STATIC_LIBRARY } from "../constants/notes.js";
import * as Tone from 'tone';

const QUARTER_NOTES = STATIC_LIBRARY[2];

// import party from "party-js";


/* let party = require("party-js");
let Tone = require("tone");
let animate = require("animate.css")*/

//import party from 'party-js';
//import Tone from 'tone';
//import animate from 'animate.js';

function startMetronome() {
    let metronome = fourByFour();

    return metronome;
}

// This starts the main song track session

function answerTrack(game, songLength=4, song=randomizerExtender(songLength, 5)) {
    game.instrument = new Tone.Synth();
    let synth = game.instrument;
    let cpuAnimations = document.getElementById('cpu-duck');
    let scoreResult = document.getElementById("scoreResult");

    let triggerNum = 0;
    let delay = game.delay;
    let currentTime = 0;

    game.notesInMeasure = 5;

    synth.toDestination();

    let part = new Tone.Part(((time, value) => {
        synth.triggerAttackRelease(value.note, "16n", time, value.velocity, 2);

        if (synth && value.velocity) {
            // first we get the current time in milliseconds
            currentTime = +new Date();

            // Add note to answer sheet
            game.addNote(currentTime,85, 70, 30);

            // plays animation of cpu
            noteTrigger(delay, cpuAnimations, value.velocity);
            noteRelease(delay+50, cpuAnimations, value.velocity);
        }

        triggerNum++;
    }), song).start("2m");

    //callback functions in-between every other measure
    Tone.Transport.scheduleRepeat((time) => {
        if ( score > game.notesInMeasure * 7 ) {
            party.confetti(document.getElementById("score"), {
                count: party.variation.range(20, 40),
            });
            scoreResult.innerHTML = "You got " + score + " out of " + (game.notesInMeasure * 8) +"!!";
            score = 0;
        }
        
    }, String(songLength+3)+"m", "0m");

    // at end of song
    Tone.Transport.schedule(function(time){
        endOfSong();
        synth.dispose();
        part.dispose();
        Tone.Transport.stop();
        console.log(Tone.Transport.state + " after end of song automatically");
        game.togglePlay();
        game.clearNotes();
    }, String(songLength+2)+":0:0");

    return part;
}

function calibrateOnly(game) {
    game.instrument = new Tone.Synth();
    game.answerTrack = QUARTER_NOTES;
    let tempTempo = game.tempo;
    let song = game.answerTrack;
    let songLength = 2;
    let synth = game.instrument;
    let cpuAnimations = document.getElementById('cpu-duck');
;
    let tempDelay = game.delay;
    game.delay = 0;
    game.tempo = 120;
    let currentTime = 0;

    game.notesInMeasure = 5;

    synth.toDestination();

    let part = new Tone.Part(((time, value) => {
        synth.triggerAttackRelease(value.note, "16n", time, 0);

        // first we get the current time in milliseconds
        currentTime = +new Date();

        // Add note to answer sheet
        console.log("added note");
        game.addNote(currentTime,85, 70, 30, 0);

        // plays animation of cpu
        noteTrigger(0, cpuAnimations, value.velocity);
        noteRelease(50, cpuAnimations, value.velocity);

    }), song).start("2m");

    // at end of song
    Tone.Transport.schedule(function(time){
        endOfSong();
        synth.dispose();
        part.dispose();
        Tone.Transport.stop();
        console.log("Average time: " + game.calibratedDiffAvg());
        console.log("Answer notes: " + game.getWindowKeyNotes());
        console.log("Player notes: " + game.playerNotes);
        game.togglePlay();
        game.clearNotes();
        game.playerNotes = [];
        game.delay = tempDelay;
        game.tempo = tempTempo;
    }, String(songLength+2)+":0:0");

    return part;
}

export function gameRoom(game) {
    menu();

    let delaySlider = document.getElementById("delay");
    let tempoSlider = document.getElementById("tempo");
    let calibrateMenu = document.getElementById("calibrate-delay");
    let calibrateMenuStart = document.getElementById("calibrate-start");

    document.getElementById('liveDelay').innerHTML = game.delay;
    document.getElementById('liveTempo').innerHTML = game.tempo;
    delaySlider.value = game.delay;
    tempoSlider.value = game.tempo;
    
    setupControls(game);
    
    // setup delay slider
    delaySlider.addEventListener('change', function() { 
        game.delay = Number(delaySlider.value);
        console.log("delay set to: ", game.delay);
        document.getElementById('liveDelay').innerHTML = game.delay;
    })

    // calibrate button
    calibrateMenu.addEventListener("click", event => {
        calibrateIntro();
    })

    calibrateMenuStart.addEventListener("click", async () => {
        if (game.firstRun) {
            await Tone.start();
            game.firstRun = false;
        }
        
        playGame(); //turn this into a menu object at some point, just for the logic, since this just changes the menu

        game.answerTrack = calibrateOnly(game);

        startGame(game);
    })
    
    // setup tempo slider
    tempoSlider.addEventListener('change', function() { 
        game.tempo = Number(tempoSlider.value);
        document.getElementById('liveTempo').innerHTML = game.tempo;
    })

    // Play from menu button
    document.getElementById("play-button").addEventListener("click", async () => {
        if (game.firstRun) {
            await Tone.start();
            game.firstRun = false;
        }
        
        playGame(); //turn this into a menu object at some point, just for the logic, since this just changes the menu

        game.answerTrack = answerTrack(game);

        startGame(game);
     });

    // Play again button
    document.getElementById("play-again").addEventListener("click", event => {
        stopGame(game);
        game.answerTrack = answerTrack(game);
        startGame(game);
        document.getElementById("play-again").style.display = "none";
    })

    // Back to menu (while in game)
    document.getElementById("back-to-menu").addEventListener("click", event => {
        menu();
        if (game.answerTrack) {
            stopGame(game);
        }
        document.getElementById("settings").innerHTML = "<button class=\"centered\">Settings</button>";
    })

    // Submit Score Menu
     document.getElementById("high-score-submission").addEventListener("click", event => {
        showScoreSubmitMenu(game);
        if (game.answerTrack) {
            stopGame(game);
        }
    })

    document.getElementById("settings").addEventListener("click", event => {
        settings(game);
        document.getElementById("settings").innerHTML = "<button class=\"centered\">Settings</button>";
    })

    // set to default
    document.getElementById("default-settings").addEventListener("click", event => {
        game.tempo = 100;
        game.delay = 100;
        document.getElementById('liveTempo').innerHTML = game.tempo;
        document.getElementById('tempo').value = game.tempo;
        document.getElementById('liveDelay').innerHTML = game.delay;
        document.getElementById('delay').value = game.delay;
    })
}


// Starts or stops all songs / gameplay
function startGame(game) {
    game.score = 0;
    game.togglePlay();

    Tone.Transport.bpm.value = game.tempo;

    console.log(game.answerTrack);

    console.log("delay: ",game.delay);

    game.clickTrack= startMetronome();

    /*if (game.firstRun == true) {
        console.log("first run");
        Tone.start();
        game.firstRun = false;
    }*/

    if (Tone.Transport.state !== "started") {
        console.log("-- new session --\n\n")
    }

    if (game.answerTrack.disposed && !game.firstRun) {
        Tone.Transport.bpm.value = game.tempo;
        console.log("restarting mainTrack");
        game.answerTrack = answerTrack(game);
    }

    Tone.Transport.toggle();
    console.log(Tone.Transport.state);

    if (!game.answerTrack.disposed && !game.firstRun && Tone.Transport.state === "stopped") {

        game.answerTrack.dispose();
        document.getElementById('paw-left').style.backgroundPositionX = '0px';
        game.score = 0;
    }

    return []
}

function stopGame(game) {
    game.answerTrack.dispose();
    game.clickTrack.dispose();
    game.instrument.dispose();
    Tone.Transport.stop();
    game.score = 0;
    console.log(Tone.Transport.state + " after stopping game");
}