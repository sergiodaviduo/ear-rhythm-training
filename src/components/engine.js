import { randomizerExtender } from './generators.js';
import { fourByFour } from './instruments.js';
import { menu } from '../navigation/menu.js';

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


// previous default input window is open = 30, close = 90
export function gameEngine(game, synth=new Tone.Synth(), song=randomizerExtender(16, 5), open=90, close=130) {
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

    }, "19m", "0m");

    return part;
}

async function waitForInput() {
    let ready = await Tone.start();
}

export function startGame(song, metronome, game) {
    menu();
    let firstRun = true;
    let scoreBoard = document.getElementById("score");
    let delaySlider = document.getElementById("delay");
    let tempoSlider = document.getElementById("tempo");
    document.getElementById('liveDelay').innerHTML = game.delay;
    document.getElementById('liveTempo').innerHTML = game.tempo;
    delaySlider.value = game.delay;
    tempoSlider.value = game.tempo;

    document.getElementById("play-button").addEventListener("click", event => {
        game.togglePlay();
        if (Tone.Transport.state !== "started") {
            console.log("-- new session --\n\n")
        }
    
        waitForInput();
    
        if (song.disposed && !firstRun) {
            Tone.Transport.bpm.value = game.tempo;
            song = gameEngine(game);
            metronome = fourByFour();
        }
    
        Tone.Transport.toggle();
        console.log(Tone.Transport.state);
    
        if (!song.disposed && !firstRun && Tone.Transport.state === "stopped") {
            song.dispose();
            metronome.dispose();
            document.getElementById('paw-left').style.backgroundPositionX = '0px';
            game.score = 0;
        }
    
        firstRun = false;
     });
    
     // spacebar

    document.addEventListener('keydown', (event) => {
        //let accuracy = 0;
    
        let keyDownTime = 0;
    
        if (event.key === ' ') {
            event.preventDefault();
            document.getElementById('blueSquare').style.backgroundColor = 'green';
    
            keyDownTime = +new Date();
    
            console.log("Input recorded after ", keyDownTime - game.inputWindowO);
    
            if (keyDownTime >= game.inputWindowO && keyDownTime <= game.inputWindowC) {
                game.score++;
                scoreBoard.innerHTML = "Score: " + game.score;
                console.log(game.score);
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

    // "m" key
     
    document.addEventListener('keydown', (event) => {
        //let accuracy = 0;

        let keyDownTime = 0;
    
        if (event.key === 'm') {
            event.preventDefault();
            document.getElementById('blueSquare').style.backgroundColor = 'green';
    
            keyDownTime = +new Date();
    
            console.log("Input recorded after ", keyDownTime - game.inputWindowO);
    
            if (keyDownTime >= game.inputWindowO && keyDownTime <= game.inputWindowC) {
                game.score++;
                scoreBoard.innerHTML = "Score: " + game.score;
                console.log(game.score);
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
        if (event.key === 'm') {
            document.getElementById('blueSquare').style.backgroundColor = 'blue';
        }
    });
    
    delaySlider.addEventListener('change', function() { 
        game.delay = delaySlider.value;
        document.getElementById('liveDelay').innerHTML = game.delay;
    })
    
    tempoSlider.addEventListener('change', function() { 
        game.tempo = tempoSlider.value;
        document.getElementById('liveTempo').innerHTML = game.tempo ;
    })
}
