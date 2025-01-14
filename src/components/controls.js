import 'animate.css';

export function setupControls(game) {
    // spacebar

    let duck = document.getElementById('player-duck');
    
    document.addEventListener('keydown', (event) => {
        //let accuracy = 0;
    
        let keyDownTime = 0;
        let score = document.getElementById("score");
        let scoreWindow = document.getElementById("score-window");
        let scoreLocation = score.getBoundingClientRect();
        let scoreFlashText = 'Good!';
        let scoreFlashColor = 'white';

        if (event.key === ' ') { event.preventDefault(); };
    
        if (event.key === ' ' && !event.repeat || event.key === 'p' && !event.repeat) {

            noteTrigger(0, duck, true);

            document.getElementById('blueSquare').style.backgroundColor = 'green';
    
            keyDownTime = +new Date();
            game.didScore = false;
            console.log("Input recorded on: ", keyDownTime);
            
            if (game.playerNotes.length < game.totalSongNotes+1) {
                game.addPlayerNote(keyDownTime);
            }

            // when scored
            // need to add logic to prevent scoring multiple points in the same window again
            for (const noteKey in game.windowKeys) {
                if ( keyDownTime >= game.windowKeys[noteKey].nOpen && keyDownTime <= game.windowKeys[noteKey].nClose && !game.windowKeys[noteKey].scored ) {
                    game.didScore = true;
                    game.windowKeys[noteKey].scored = 1;

                    // check for great score window
                    if ( keyDownTime >= game.windowKeys[noteKey].pOpen && keyDownTime <= game.windowKeys[noteKey].pClose ) {
                        game.score = game.score + 150;
                        scoreFlashText = "Perfect!!";
                        scoreFlashColor = "yellow";
                    } else if ( keyDownTime >= game.windowKeys[noteKey].gOpen && keyDownTime <= game.windowKeys[noteKey].gClose ) {
                        game.score = game.score + 125;
                        scoreFlashText = "Great!";
                        scoreFlashColor = "white";
                    } else {
                        game.score = game.score + 100;
                        scoreFlashText = "Good!";
                        scoreFlashColor = "white";
                    }

                    // show animation when scored
                    // -------------------------
                    let scoreFlash = document.createElement("h1");

                    scoreFlash.classList.add("score-window");

                    let angle = (Math.random()*35)+25;
                    let xOffset = (Math.random()*41)+31;
                    let yOffset = (Math.random()*15)+5;
                    //((Math.random)*40)+20;
                    scoreFlash.style.top = String(scoreLocation.y - yOffset) + "px";
                    scoreFlash.style.left = String(scoreLocation.x - xOffset) + "px";
                    scoreFlash.style.color = scoreFlashColor;
                    scoreFlash.innerHTML = scoreFlashText;
                    scoreFlash.style.transform = "rotate(-"+angle+"deg)";
                    document.body.insertBefore(scoreFlash, score);

                    setTimeout(() => {
                        scoreFlash.remove();
                    }, 1500);

                    // -------------------------

                    score.innerHTML = "Score: " + game.score;
                    score.classList.add("scored");
                    
                    console.log("   ++ Scored! New score: ",game.score);

                    let noteDiff = (game.windowKeys[noteKey].note - keyDownTime) * (-1);

                    console.log("   Millis off:         ",noteDiff);

                    setTimeout(() => {
                        score.classList.remove("scored");
                    }, 90);

                    return;
                } else if (keyDownTime >= game.windowKeys[noteKey].nOpen && keyDownTime <= game.windowKeys[noteKey].nClose && game.windowKeys[noteKey].scored) {
                    game.score = game.score - 5;
                    score.innerHTML = "Score: " + game.score;
                    console.log("-- Already scored...... Score: ",game.score);
                    score.classList.add("scored");
                    console.log("   Millis off:         ",game.windowKeys[noteKey].note - keyDownTime);

                    setTimeout(() => {
                        score.classList.remove("scored");
                    }, 90);
                }
            }

            if (!game.didScore) {
                game.score = game.score - 5;
                score.innerHTML = "Score: " + game.score;
                console.log("-- Missed...... Score: ",game.score);
                score.classList.add("scored");
    
                setTimeout(() => {
                    score.classList.remove("scored");
                }, 90);
            }
        }
    });
    
    document.addEventListener('keyup', (event) => {   
        if (event.key === ' ' || event.key === 'p') {
            document.getElementById('blueSquare').style.backgroundColor = 'blue';
            noteRelease(0, duck, true);
        }
    });

    // "m" key
     
    
    
    document.addEventListener('keyup', (event) => {
        if (event.key === 'm') {
            document.getElementById('blueSquare').style.backgroundColor = 'blue';
        }
    });
}

// when note is played, duck takes a squat
async function noteTrigger(milisec, subject, volume) {
    await waitForNote(milisec);

    if (volume) {
        subject.style.backgroundImage = "url('../static/images/duck-squat.png')";

        subject.style.marginTop = '38px';
    }

}

// After note release, duck sits up
async function noteRelease(milisec, subject, volume) {
    await waitForNote(milisec);

    if (volume) {
        subject.style.backgroundImage = "url('../static/images/duck.png')";

        subject.style.marginTop = '8px';
    }
}

function inputOpen(open) {
    return new Promise((resolve) => {
        setTimeout(function(){
            console.log("open:                ", open);
            resolve(0);
        },open);
    });
}

function inputClose(close) {
    return new Promise((resolve) => {
        setTimeout(function(){
            console.log("close:               ", close);
            resolve(0);
        },close);
    });
}

function waitForNote(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}

export { waitForNote, inputClose, inputOpen, noteRelease, noteTrigger }