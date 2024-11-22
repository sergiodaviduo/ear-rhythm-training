export function menu() {

    in_menu();

    /*const menu_items = ["play-button", "settings", "high-scores"];

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
    
    });*/
    
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

export function playGame() {

    let all_elements_nl = document.querySelectorAll('*[id]');

    for (let i = 0; i < all_elements_nl.length - 2; i++) {
        all_elements_nl[i].style.display = "block";
    }

    document.getElementById("play-button").style.display = "none";
    document.getElementById("settings").style.display = "none";
    document.getElementById("high-scores").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("play-again").style.display = "none";
    document.getElementById("high-score-submission").style.display = "none";
    document.getElementById("submit-score").style.display = "none";
    document.getElementById("title").style.display = "none";

    document.getElementById("settings-values").style.display = "none";
    document.getElementById("blueSquare").style.display = "none";

    document.getElementById("purpleSquare").style.display = "none";

}

export function settings(game) {

    console.log("opened settings");

    let all_elements_nl = document.querySelectorAll('*[id]');

    for (let i = 0; i < all_elements_nl.length; i++) {
        all_elements_nl[i].style.display = "none";
    }


    document.getElementById('liveTempo').innerHTML = game.tempo;
    document.getElementById('liveTempo').value = game.tempo;

    document.getElementById("back-to-menu").style.display = "block";
    document.getElementById("settings-values").style.display = "block";
    document.getElementById("delay").style.display = "block";
    document.getElementById("tempo").style.display = "block";
    document.getElementById("liveTempo").style.display = "block";
    document.getElementById("liveDelay").style.display = "block";
    document.getElementById("default-settings").style.display = "block";
}

export function showScoreSubmitMenu() {

    let all_elements_nl = document.querySelectorAll('*[id]');

    for (let i = 0; i < all_elements_nl.length - 2; i++) {
        all_elements_nl[i].style.display = "none";
    }

    document.getElementById("submit-score").style.display = "block";
    document.getElementById("back-to-menu").style.display = "block";
    document.getElementById("id_final_score").style.display = "block";
    document.getElementById("id_name").style.display = "block";
}

export function endOfSong() {
    document.getElementById("play-again").style.display = "block";
    document.getElementById("back-to-menu").style.display = "block";
    document.getElementById("high-score-submission").style.display = "block";
}