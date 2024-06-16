export function allControls(game) {
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