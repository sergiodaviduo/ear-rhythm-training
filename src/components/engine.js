import { randomizerExtender } from './generators.js';
import { metronome } from './instruments.js';
import { menu, playGame, settings, showScoreSubmitMenu, endOfSong, calibrateIntro, calibrate, tutorial } from '../navigation/menu.js';
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

// This starts the main song track session

function answerTrack(game, songLength=4, song=randomizerExtender(songLength, 5)) {
    game.instrument = new Tone.Synth();
    let synth = game.instrument;
    let cpuAnimations = document.getElementById("cpu-duck");
    let eightNoteInMillis = game.measureToMillis() / 8;
    console.log("milliseconds in an 8th note: "+eightNoteInMillis);

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
            if(eightNoteInMillis < 200) {
                noteTrigger(delay-50, cpuAnimations, value.velocity);
                noteRelease(delay-20, cpuAnimations, value.velocity);
            } else {
                noteTrigger(delay, cpuAnimations, value.velocity);
                noteRelease(delay+50, cpuAnimations, value.velocity);
            }
        }

        triggerNum++;
    }), song).start("2m");

    //callback functions in-between every other measure
    /*Tone.Transport.scheduleRepeat((time) => {
        if ( score > game.notesInMeasure * 7 ) {
            party.confetti(document.getElementById("score"), {
                count: party.variation.range(20, 40),
            });
            scoreResult.innerHTML = "You got " + score + " out of " + (game.notesInMeasure * 8) +"!!";
            score = 0;
        }
        
    }, String(songLength+3)+"m", "0m");*/

    // at end of song
    Tone.Transport.schedule(function(time){
        endOfSong();
        synth.dispose();
        part.dispose();
        console.log(Tone.Transport.state + " after end of song automatically");
        game.togglePlay();
        game.clearNotes();
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }, String(songLength+2)+":0:0");

    return part;
}

function calibrateOnly(game) {
    calibrate();

    let songLength = 2;
    let currentTime = 0;
    let tempTempo = game.tempo;

    game.instrument = new Tone.Synth();
    let synth = game.instrument;
    game.answerTrack = QUARTER_NOTES;
    let song = game.answerTrack;
    game.totalSongNotes = 8;
    game.delay = 0;
    game.tempo = 120;
    Tone.Transport.bpm.value = game.tempo;

    game.notesInMeasure = 5;

    synth.toDestination();

    let part = new Tone.Part(((time, value) => {
        synth.triggerAttackRelease(value.note, "16n", time, 0);

        // first we get the current time in milliseconds
        currentTime = +new Date();

        // Add note to answer sheet
        game.addNote(currentTime,85, 70, 30, 0);
        document.getElementById("title").innerHTML = "<h1>Tap 8 times to the beat</h1>";
    }), song).start("2m");

    // after calibration
    Tone.Transport.schedule(function(time){
        console.log("plauer notes: ");
        let newDelay = Math.floor(game.calibratedDiffAvg());
        synth.dispose();
        part.dispose();
        console.log("Average time: " + game.calibratedDiffAvg());
        console.log("Answer notes: " + game.getWindowKeyNotes());
        console.log("Player notes: " + game.playerNotes);
        document.getElementById("calibrate-notes").innerHTML = "";
        if (newDelay < 80) {
            document.getElementById("found-delay").innerHTML = newDelay+" milliseconds";
            document.getElementById("calibrate-notes").innerHTML = `
            <h2>Notes may have been missed, or you have significant input delay.</h2>
            <h2>Try calibration again, or go back to settings to set manually.</h2>
            `;
            game.delay = 150;
            document.getElementById('liveDelay').innerHTML = game.delay;
            document.getElementById('delay').value = game.delay;
        } else {
            document.getElementById("found-delay").innerHTML = newDelay+" milliseconds";
            game.delay = newDelay;
            document.getElementById('liveDelay').innerHTML = game.delay;
            document.getElementById('delay').value = game.delay;
        }
        
        document.getElementById("after-calibration").style.display = "block";
        document.getElementById("title").style.display = "none";
        game.togglePlay();
        game.clearNotes();
        game.playerNotes = [];
        game.tempo = tempTempo;
        Tone.Transport.bpm.value = game.tempo;
        game.totalSongNotes = 0;
        Tone.Transport.stop();
        Tone.Transport.cancel();
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
        document.getElementById('liveDelay').innerHTML = game.delay;
        console.log("delay set to: ", game.delay);
    });

    // calibration
    calibrateMenu.addEventListener("click", event => {
        calibrateIntro();
    });

    calibrateMenuStart.addEventListener("click", async () => {
        if (game.firstRun) {
            await Tone.start();
            game.firstRun = false;
        }
        
        game.answerTrack = calibrateOnly(game);

        startGame(game);
    });

    document.getElementById("calibration-redo").addEventListener("click", async () => {
        if (game.firstRun) {
            await Tone.start();
            game.firstRun = false;
        }
        
        game.answerTrack = calibrateOnly(game);

        startGame(game);
    });

    document.getElementById("calibration-to-settings").addEventListener("click", event => {
        settings(game);
    });
    
    // setup tempo slider
    tempoSlider.addEventListener('change', function() { 
        game.tempo = Number(tempoSlider.value);
        Tone.Transport.bpm.value = game.tempo;
        document.getElementById('liveTempo').innerHTML = game.tempo;
    });

    // Play from menu button
    document.getElementById("play-button").addEventListener("click", async () => {
        if (game.firstRun) {
            await Tone.start();
            game.firstRun = false;

            tutorial()

            return;
        } else {
            playGame(); //turn this into a menu object at some point, just for the logic, since this just changes the menu

            game.answerTrack = answerTrack(game);

            startGame(game);
        }
    });

    // Play again button
    document.getElementById("play-again").addEventListener("click", event => {
        stopGame(game);
        game.answerTrack = answerTrack(game);
        startGame(game);
        document.getElementById("play-again").style.display = "none";
    });

    // Play from tutorial
    document.getElementById("start-game-from-tutorial").addEventListener("click", async () => {
        playGame(); //turn this into a menu object at some point, just for the logic, since this just changes the menu

        game.answerTrack = answerTrack(game);

        startGame(game);
    });

    // Back to menu (while in game)
    document.getElementById("back-to-menu").addEventListener("click", event => {
        menu();
        if (game.answerTrack) {
            stopGame(game);
        }
        
        document.getElementById("settings").innerHTML = "<button class=\"centered\">Settings</button>";
        let defaultTitle = `<h1 class="centered">~ Rhythm Training ~</h1>
                <h3 class="centered">Simon says, but with randomly generated notes</h3> 
                <br>
                <br>`

        document.getElementById("title").innerHTML = defaultTitle;
    });

    // Submit Score Menu
     document.getElementById("high-score-submission").addEventListener("click", event => {
        showScoreSubmitMenu(game);
        if (game.answerTrack) {
            stopGame(game);
        }
    });

    document.getElementById("settings").addEventListener("click", event => {
        settings(game);
    });

    

    // set to default
    document.getElementById("default-settings").addEventListener("click", event => {
        game.tempo = 120;
        Tone.Transport.bpm.value = game.tempo;
        game.delay = 150;
        document.getElementById('liveTempo').innerHTML = game.tempo;
        document.getElementById('tempo').value = game.tempo;
        document.getElementById('liveDelay').innerHTML = game.delay;
        document.getElementById('delay').value = game.delay;
    });
}

function gameCountDown(game, i=0) {
    let count = null;
    let animateCountDown = () => {
        let countNode = document.getElementById("count");
        let countClone = countNode.cloneNode(true);
        countClone.style.display = "block";
        countClone.classList.add("count-down-beg");
        countClone.style.top = String(window.screen.height / 2) + "px";
        countClone.style.left = String(window.screen.width / 2) + "px";;
        countClone.addEventListener('animationend', () => {
            countClone.classList.remove("count-down-beg");
            countClone.classList.add("count-down-end");
            countClone.addEventListener('animationend', () => {
                countClone.remove();
            });
        });

        document.getElementById("countdown").appendChild(countClone);
        
        return countClone;
    }
    
    switch(i) {
        case 1:
            count = animateCountDown();
            count.innerHTML = "1";
            break;
        case 3:
            count = animateCountDown();
            count.innerHTML = "2";
            break;
        case 5:
            count = animateCountDown();
            count.innerHTML = "1";
            break;
        case 6:
            count = animateCountDown();
            count.innerHTML = "2";
            break;
        case 7:
            count = animateCountDown();
            count.innerHTML = "3";
            break;
        case 8:
            count = animateCountDown();
            count.innerHTML = "4";
            break;
        case 9:
            break;
        default:
    }
}

// Starts or stops all songs / gameplay
function startGame(game) {
    game.score = 0;
    document.getElementById("score").innerHTML = "Score: " + game.score;
    game.togglePlay();

    Tone.Transport.bpm.value = game.tempo;

    console.log(game.answerTrack);

    console.log("delay: ",game.delay);

    game.clickTrack = metronome(game, gameCountDown);

    /*if (game.firstRun == true) {
        console.log("first run");
        Tone.start();
        game.firstRun = false;
    }*/

    if (Tone.Transport.state !== "started") {
        console.log("-- new session --\n\n")
    }

    /*if (game.answerTrack.disposed && !game.firstRun) {
        Tone.Transport.bpm.value = game.tempo;
        console.log("restarting mainTrack");
        game.answerTrack = answerTrack(game);
    }*/

    Tone.Transport.toggle();
    console.log(Tone.Transport.state);

    /*if (!game.answerTrack.disposed && !game.firstRun && Tone.Transport.state === "stopped") {
        game.answerTrack.dispose();
        //document.getElementById('paw-left').style.backgroundPositionX = '0px';
        game.score = 0;
    }*/

    return [];
}

function stopGame(game) {
    game.answerTrack.dispose();
    game.clickTrack.dispose();
    game.instrument.dispose();
    Tone.Transport.stop();
    game.score = 0;
    document.getElementById("score").innerHTML = "Score: " + game.score;
    console.log(Tone.Transport.state + " after stopping game");
}