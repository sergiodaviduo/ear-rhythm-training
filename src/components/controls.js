import 'animate.css';

export function setupControls(game) {
    // spacebar

    let duck = document.getElementById('player-duck');
    
    document.addEventListener('keydown', (event) => {
        //let accuracy = 0;
    
        let keyDownTime = 0;

        if (event.key === ' ') { event.preventDefault(); };
    
        if (event.key === ' ' && !event.repeat || event.key === 'p' && !event.repeat) {

            noteTrigger(0, duck, true);

            document.getElementById('blueSquare').style.backgroundColor = 'green';
    
            keyDownTime = +new Date();

            console.log("Input recorded on: ", keyDownTime);

            // when scored
            console.log("trying loop");
            for (const noteKey in game.windowKeys) {
                if ( keyDownTime >= game.windowKeys[noteKey].open && keyDownTime <= game.windowKeys[noteKey].close && !game.didScore ) {
                    game.didScore = true;
                    game.score = game.score + 100;
    
                    document.getElementById("score").innerHTML = "Score: " + game.score;
                    console.log(game.score);
                    console.log("hiiiii "+game.windowKeys[noteKey].close);
                    document.getElementById("score").classList.add("scored");
    
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            document.getElementById("score").classList.remove("scored");
                            resolve(0);
                        }, game.windowKeys[noteKey].close - +new Date());
                    });
                }
            }

            if (!game.didScore) {
                game.score = game.score - 5;
                document.getElementById("score").innerHTML = "Score: " + game.score;
                console.log(game.score);
                document.getElementById("score").classList.add("scored");
    
                return new Promise((resolve) => {
                    setTimeout(() => {
                        document.getElementById("score").classList.remove("scored");
                        resolve(0);
                    }, +new Date() + 200);
                });
            }
            game.didScore = false;
            /*if ( keyDownTime >= game.inputWindowO && keyDownTime <= game.inputWindowC && !game.didScore ) {
                game.didScore = true;
                game.score++;

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
            }*/
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
        },open);
    });
}

function inputClose(close) {
    return new Promise((resolve) => {
        setTimeout(function(){
            console.log("close:               ", close);
        },close);
    });
}

function waitForNote(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}

export { waitForNote, inputClose, inputOpen, noteRelease, noteTrigger }