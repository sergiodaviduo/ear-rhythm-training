(function () {
    'use strict';

    class Game {
        constructor(tempo=100, delay=100) {
            this._score = 0;
            this._isPlaying = false;
            this._inputWindowO = 0;
            this._inputWindowC = 0;
            this._tempo = tempo;
            this._delay = delay;
        }

        get score() {
            return this._score;
        }

        get tempo() {
            return this._tempo;
        }

        get delay() {
            return this._delay;
        }

        get inputWindowO() {
            return this._inputWindowO;
        }

        get inputWindowC() {
            return this._inputWindowC;
        }

        get notesInMeasure() {
            return this._notesInMeasure;
        }

        get isPlaying() {
            return this._isPlaying;
        }

        set score(score) {
            this._score = score;
        }

        set tempo(tempo) {
            this._tempo = tempo;
        }

        set delay(delay) {
            this._delay = delay;
        }

        togglePlay() {
            if (this._isPlaying) {
                this._isPlaying = false;
            } else {
                this._isPlaying = true;
            }
        }

        set answerTrack(track) {
            this._answerTrack = track;
        }

        set clickTrack(track) {
            this._clickTrack = track;
        }

        set instrument(instrument) {
            this._instrument = instrument;
        }

        set notesInMeasure(notes) {
            this._notesInMeasure = notes;
        }

        set inputWindowO(milliseconds) {
            this._inputWindowO = milliseconds;
        }

        set inputWindowC(milliseconds) {
            this._inputWindowC = milliseconds;
        }
    }

    function fourByFour() {
        const kickDrum = new Tone.MembraneSynth({
            volume: 4
        }).toDestination();

        const kickPart = new Tone.Part(function(time) {
            kickDrum.triggerAttackRelease('C1', '8n', time);
        }, [{ time: '0:0' },{ time: '0:1' },{ time: '0:2' },{ time: '0:3' }]).start(0);

        kickPart.loop = true;

        return kickPart;
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


    // Medium Version
    // Generates a measure of random 8th notes

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

    // extends a randomizer to make long strings of random notes
    //     notes (int)      ->  how many notes in each phrase (within one 4/4 measure long by default)
    //     measures (int)   ->  How many total measures the randomizer will run
    //     hasSpace (bool)  ->  whether to include rests in-between every other phrase for user input
    function randomizerExtender(measures, notes, hasRepeat=true) {
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
            setTimeout(() => { resolve(''); }, milisec);
        })
    }


    // previous default input window is open = 30, close = 90
    function gameEngine(game, synth=new Tone.Synth(), song=randomizerExtender(16, 5), open=90, close=130) {
        delay = game.delay;
        //this will eventually be randomized and linked between functions
        game.notesInMeasure = 5;
        synth.toDestination();
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
        await Tone.start();
    }

    function startGame(song, metronome, game) {
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
                console.log("-- new session --\n\n");
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
        });
        
        tempoSlider.addEventListener('change', function() { 
            game.tempo = tempoSlider.value;
            document.getElementById('liveTempo').innerHTML = game.tempo ;
        });
    }

    // ripple effect: https://codepen.io/daless14/pen/DqXMvK
    // caculate note duration and hertz from bpm: http://bradthemad.org/guitar/tempo_explanation.php
    // this visual library would be wild with this: https://ptsjs.org/


    const GameData = new Game(150, 100);

    let engine = gameEngine(GameData);
    let metronome = fourByFour();

    startGame(engine, metronome, GameData);

})();
