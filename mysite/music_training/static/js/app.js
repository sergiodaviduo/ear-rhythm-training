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

        // This track defines what notes are correct
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

    function menu() {

        in_menu();

        const menu_items = ["play-button", "settings", "high-scores"];

        const selected = "blue";
        const unselected =  "black";

        let menu_choice = -1;

        document.addEventListener('keydown', (event) => {
            //let accuracy = 0;

            if (document.getElementById("play-button").style.display != "none") {
                if (event.key === 'ArrowDown') {
                    menu_choice++;
                }

                if (event.key === 'ArrowUp') {
                    menu_choice--;
                }
            }

            if (menu_choice < 0) {
                menu_choice = 2;
            }
        
            if (menu_choice > 2) {
                menu_choice = 0;
            }
        
            switch (menu_items[menu_choice]) {
                case "play-button":
                    document.getElementById("play-button").style.backgroundColor = selected;
                    document.getElementById("settings").style.backgroundColor = unselected;
                    document.getElementById("high-scores").style.backgroundColor = unselected;
                    break;
                case "Settings":
                    document.getElementById("play-button").style.backgroundColor = unselected;
                    document.getElementById("settings").style.backgroundColor = selected;
                    document.getElementById("high-scores").style.backgroundColor = unselected;
                    break;
                case "high-scores":
                    document.getElementById("play-button").style.backgroundColor = unselected;
                    document.getElementById("settings").style.backgroundColor = unselected;
                    document.getElementById("high-scores").style.backgroundColor = selected;
                    break;
            }
        
        });
        
    }

    // hide everything except menu objects
    // When page loads, all elements of game load initially. This hides the game objects so only the menu appears.

    function in_menu(){
        let all_elements_nl = document.querySelectorAll('*[id]');

        for (let i = 0; i < all_elements_nl.length - 2; i++) {
            all_elements_nl[i].style.display = "none";
        }

        document.getElementById("play-button").style.display = "block";
        document.getElementById("settings").style.display = "block";
        document.getElementById("high-scores").style.display = "block";
        document.getElementById("main-menu").style.display = "block";
        document.getElementById("title").style.display = "block";

    }

    function playGame() {

        let all_elements_nl = document.querySelectorAll('*[id]');

        for (let i = 0; i < all_elements_nl.length - 2; i++) {
            all_elements_nl[i].style.display = "block";
        }

        document.getElementById("play-button").style.display = "none";
        document.getElementById("settings").style.display = "none";
        document.getElementById("high-scores").style.display = "none";
        document.getElementById("main-menu").style.display = "none";
        document.getElementById("play-again").style.display = "none";
        document.getElementById("title").style.display = "none";
    }

    // export { menu }

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


    // This starts the main song track session
    // previous default input window is open = 30 (ms before), close = 90 (ms after)
    function gameEngine(game, synth=new Tone.Synth(), songLength=4, song=randomizerExtender(songLength, 5), open=90, close=130) {
        fourByFour();

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
        await Tone.Transport.toggle();
    }

    function gameRoom(game) {
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

        // Play again button
        document.getElementById("play-again").addEventListener("click", event => {
            toggleGame(game, engine);
            document.getElementById("play-again").style.display = "none";
        });

        // Back to menu
        document.getElementById("back-to-menu").addEventListener("click", event => {
            menu();
            if (game.isPlaying) {
                toggleGame(game, engine);
            }
        });
    }


    // Stops all songs, or starts all songs
    function toggleGame(game, engine) {
        game.togglePlay();

        if (Tone.Transport.state !== "started") {
            console.log("-- new session --\n\n");
        }

        if (game.isPlaying) ;
        

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

    // ripple effect: https://codepen.io/daless14/pen/DqXMvK
    // caculate note duration and hertz from bpm: http://bradthemad.org/guitar/tempo_explanation.php
    // this visual library would be wild with this: https://ptsjs.org/


    const GameData = new Game(150, 100);

    gameRoom(GameData);

})();
