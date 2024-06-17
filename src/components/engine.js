import { randomizerExtender } from './generators.js';
import { fourByFour } from './instruments.js';
import { menu, playGame } from '../navigation/menu.js';
import { setupControls } from '../components/controls.js';

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

function inputOpen(delay, openTime) {
    console.log("open");
    openTime = +new Date();
    openTime += delay;
    
    return openTime;
}

function inputClose(delay, closeTime) {
    console.log("close");
    closeTime = +new Date();
    closeTime += delay;

    return closeTime;
}

function waitForNote(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}

function startMetronome() {
    let metronome = fourByFour();

    return metronome;
}

// This starts the main song track session
// previous default input window is open = 30 (ms before), close = 90 (ms after)
function answerTrack(game, synth=game.instrument, songLength=4, song=randomizerExtender(songLength, 5), open=90, close=130) {


    delay = game.delay;
    //this will eventually be randomized and linked between functions
    game.notesInMeasure = 5;
    synth.toDestination();
    let triggerNum = 0;
    let leftPaw = document.getElementById('paw-left');
    let rightPaw = document.getElementById('paw-right');
    let scoreResult = document.getElementById("scoreResult");

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
            game.inputWindowO = inputOpen(delay-open, game.inputWindowO);
            game.inputWindowC = inputClose(delay+close, game.inputWindowC);
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
        //document.getElementById("play-again").click();
        document.getElementById("play-again").style.display = "block";
        document.getElementById("back-to-menu").style.display = "block";
        synth.dispose();
        part.dispose();
        Tone.Transport.stop();
        console.log(Tone.Transport.state + " after end of song automatically");
        game.togglePlay();
    }, String(songLength+2)+":0:0");

    return part;
}

export function gameRoom(game) {
    menu();

    let trackList = [];

    let delaySlider = document.getElementById("delay");
    let tempoSlider = document.getElementById("tempo");
    document.getElementById('liveDelay').innerHTML = game.delay;
    document.getElementById('liveTempo').innerHTML = game.tempo;
    delaySlider.value = game.delay;
    tempoSlider.value = game.tempo;
    
    setupControls(game);
    
    delaySlider.addEventListener('change', function() { 
        game.delay = delaySlider.value;
        document.getElementById('liveDelay').innerHTML = game.delay;
    })
    
    tempoSlider.addEventListener('change', function() { 
        game.tempo = tempoSlider.value;
        document.getElementById('liveTempo').innerHTML = game.tempo ;
    })

    // Play from menu button
    document.getElementById("play-button").addEventListener("click", async () => {
        if (game.firstRun) {
            await Tone.start();
            game.firstRun = false;
        }
        
        playGame(); //turn this into a menu object at some point, just for the logic, since this just changes the menu

        startGame(game, game.answerTrack);
     });

    // Play again button
    document.getElementById("play-again").addEventListener("click", event => {
        startGame(game, game.answerTrack);
        document.getElementById("play-again").style.display = "none";
    })

    // Back to menu (while in game)
    document.getElementById("back-to-menu").addEventListener("click", event => {
        menu();
 
        stopGame(game.answerTrack, game.clickTrack, game.instrument);
    })
}


// Starts or stops all songs / gameplay
function startGame(game) {
    game.score = 0;
    game.togglePlay();

    game.instrument = new Tone.Synth();

    game.answerTrack = answerTrack(game);

    console.log(game.answerTrack);

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

function stopGame(mainTrack, clickTrack, instrument) {
    mainTrack.dispose();
    clickTrack.dispose();
    instrument.dispose();
    Tone.Transport.stop();
    game.score = 0;
    console.log(Tone.Transport.state + " after exiting game");
}