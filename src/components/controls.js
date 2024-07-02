import { s } from "vitest/dist/types-198fd1d9.js";

export function setupControls(game) {
    // spacebar

    let leftPaw = document.getElementById('u-paw-left');

    let scoredInWindow = false;

    let inWindow = false;

    document.addEventListener('keydown', (event) => {
        //let accuracy = 0;
    
        let keyDownTime = 0;
    
        if (event.key === ' ') {
            event.preventDefault();

            noteTrigger(0, leftPaw, true);

            document.getElementById('blueSquare').style.backgroundColor = 'green';
    
            keyDownTime = +new Date();
    
            console.log("Input recorded after ", keyDownTime - game.inputWindowO);
    
            if (keyDownTime >= game.inputWindowO && keyDownTime <= game.inputWindowC && !game.didScore) {
                game.didScore = true;
                game.score++;

                //scoredInWindow = true;
                document.getElementById("score").innerHTML = "Score: " + game.score;
                console.log(game.score);
                console.log("hiiiii"+game.inputWindowC);
                document.getElementById("score").classList.add("scored");

                return new Promise((resolve) => {
                    setTimeout(() => {
                        document.getElementById("score").classList.remove("scored");
                        game.didScore = false;
                        resolve(0);
                    }, game.inputWindowC - +new Date());
                });
            } else if (keyDownTime >= game.inputWindowO && keyDownTime <= game.inputWindowC && game.didScore) {
                console.log("already scored :(");
            }

            // this doesn't work as is, I need to make a promise that will execute right at the end of the input window to reset the
            // didScore property
            /*if (+new Date() > game.inputWindowC) {
                game.didScore = false;
            }*/
        }
    });
    
    document.addEventListener('keyup', (event) => {
        
        if (event.key === ' ') {
            document.getElementById('blueSquare').style.backgroundColor = 'blue';
            noteRelease(0, leftPaw, true);
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
                document.getElementById("score").innerHTML = "Score: " + game.score;
                console.log(game.score);
                document.getElementById("score").classList.add("scored");
                return new Promise((resolve) => {
                    setTimeout(() => {
                        document.getElementById("score").classList.remove("scored");
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
        setTimeout(() => { resolve('') }, milisec);
    })
}

export { waitForNote, inputClose, inputOpen, noteRelease, noteTrigger }