import { randomizerExtender } from './generators.js';
import { fourByFour } from './instruments.js';
import { menu, playGame } from '../navigation/menu.js';
import { allControls } from '../components/controls.js';

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


// This starts the main song track session
// previous default input window is open = 30 (ms before), close = 90 (ms after)
function gameEngine(game, synth=new Tone.Synth(), songLength=4, song=randomizerExtender(songLength, 5), open=90, close=130) {
    let metronome = fourByFour();

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
            party.confetti(scoreBoard, {
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
        Tone.Transport.toggle();
        console.log(Tone.Transport.state);
        game.togglePlay();
    }, String(songLength+2)+":0:0");

    return part;
}

async function toggleInput() {
    let ready = await Tone.Transport.toggle();
}

export function gameRoom(game) {
    menu();

    let engine = gameEngine(game);

    let scoreBoard = document.getElementById("score");
    let delaySlider = document.getElementById("delay");
    let tempoSlider = document.getElementById("tempo");
    document.getElementById('liveDelay').innerHTML = game.delay;
    document.getElementById('liveTempo').innerHTML = game.tempo;
    delaySlider.value = game.delay;
    tempoSlider.value = game.tempo;

    document.getElementById("play-button").addEventListener("click", event => {
        playGame(); //turn this into a menu object at some point, just for the logic, since this just changes the menu

        toggleInput();

        toggleGame(game, engine);
     });
    
     allControls(game);
    
    delaySlider.addEventListener('change', function() { 
        game.delay = delaySlider.value;
        document.getElementById('liveDelay').innerHTML = game.delay;
    })
    
    tempoSlider.addEventListener('change', function() { 
        game.tempo = tempoSlider.value;
        document.getElementById('liveTempo').innerHTML = game.tempo ;
    })

    // Play again button
    document.getElementById("play-again").addEventListener("click", event => {
        toggleGame(game, engine);
        document.getElementById("play-again").style.display = "none";
    })

    // Back to menu
    document.getElementById("back-to-menu").addEventListener("click", event => {
        menu();
        if (game.isPlaying) {
            toggleGame(game, engine)
        }
    })
}


// Starts or stops all songs / gameplay
function toggleGame(game, engine) {
    game.togglePlay();

    if (Tone.Transport.state !== "started") {
        console.log("-- new session --\n\n")
    }

    if (game.isPlaying) {
        
    }
    

    if (engine.disposed) {
        game.score = 0;
        document.getElementById("score").innerHTML = "Score: " + game.score;
        Tone.Transport.bpm.value = game.tempo;
        console.log("restarting engine");
        engine = gameEngine(game);
    }

    Tone.Transport.toggle();
    console.log(Tone.Transport.state);

    if (!engine.disposed && Tone.Transport.state === "stopped") {
        engine.dispose();
        document.getElementById('paw-left').style.backgroundPositionX = '0px';
        game.score = 0;
    }
}