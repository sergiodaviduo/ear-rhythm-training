export function menu() {

    in_menu();
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

// when "Start Game" is clicked
export function playGame() {

    let all_elements_nl = document.querySelectorAll('*[id]');

    for (let i = 0; i < all_elements_nl.length - 2; i++) {
        all_elements_nl[i].style.display = "none";
    }

    // mark as block
    markAsBlock(document.getElementById("launch-game"));
    markAsBlock(document.getElementById("back-to-menu"));
    
    ////////////////

    /*document.getElementById("calibration").style.display = "none";
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
    document.getElementById("tutorial").style.display = "none";
    document.getElementById("start-game-from-tutorial").style.display = "none";*/
}

export function settings(game) {
    document.getElementById("settings").innerHTML = "<button class=\"centered\">Settings</button>";
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
    document.getElementById("calibrate-delay").style.display = "block";
    document.getElementById("default-settings").style.display = "block";
}

export function showScoreSubmitMenu(game) {

    let all_elements_nl = document.querySelectorAll('*[id]');

    for (let i = 0; i < all_elements_nl.length - 2; i++) {
        all_elements_nl[i].style.display = "none";
    }

    document.getElementById("submit-score").style.display = "block";
    document.getElementById("back-to-menu").style.display = "block";
    document.getElementById("score-display").style.display = "block";
    document.getElementById("id_name").style.display = "block";

    document.getElementById("id_final_score").value = game.score;
    document.getElementById("score-display").innerHTML = game.score;
    document.getElementById("id_final_score").readOnly = true;
    document.getElementById("id_final_score").style.display = "none";
}

export function endOfSong() {
    document.getElementById("play-again").style.display = "block";
    document.getElementById("back-to-menu").style.display = "block";
    document.getElementById("high-score-submission").style.display = "block";
}

export function calibrateIntro() {
    let all_elements_nl = document.querySelectorAll('*[id]');

    for (let i = 0; i < all_elements_nl.length - 2; i++) {
        all_elements_nl[i].style.display = "none";
    }

    document.getElementById("calibration").style.display = "block";
    document.getElementById("calibration-menu").style.display = "block";
    document.getElementById("calibrate-start").style.display = "block";
    document.getElementById("settings").style.display = "block";
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("settings").innerHTML = "<button class=\"centered\">Back</button>";
}

export function calibrate() {
    let all_elements_nl = document.querySelectorAll('*[id]');

    for (let i = 0; i < all_elements_nl.length - 2; i++) {
        all_elements_nl[i].style.display = "block";
    }

    document.getElementById("after-calibration").style.display = "none";
    document.getElementById("calibration-menu").style.display = "none";
    document.getElementById("calibrate-start").style.display = "none";
    document.getElementById("play-button").style.display = "none";
    document.getElementById("score").style.display = "none";
    document.getElementById("settings").style.display = "none";
    document.getElementById("high-scores").style.display = "none";
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("play-again").style.display = "none";
    document.getElementById("high-score-submission").style.display = "none";
    document.getElementById("submit-score").style.display = "none";
    document.getElementById("title").innerHTML = "<h1>Wait 8 beats</h1>";

    document.getElementById("settings-values").style.display = "none";
    document.getElementById("blueSquare").style.display = "none";

    document.getElementById("purpleSquare").style.display = "none";
    document.getElementById("tutorial").style.display = "none";
    document.getElementById("start-game-from-tutorial").style.display = "none";
}

export function tutorial() {
    let all_elements_nl = document.querySelectorAll('*[id]');

    for (let i = 0; i < all_elements_nl.length - 2; i++) {
        all_elements_nl[i].style.display = "none";
    }

    document.getElementById("tutorial").style.display = "block";
    document.getElementById("start-game-from-tutorial").style.display = "block";
}

// This will change the style of all input node & all child nodes as "block"
function markAsBlock (node) {
    const children = node.getElementsByTagName("*");

    console.log("current node: "+node.id);
    node.style.display = "block";
    console.log("before if statement 1");
    if (!node.childNodes.length) {
        console.log("reached last child");
        return;
    }
    console.log("before for loop");
    console.log(children);
    for (let child of children) {
        console.log("entering function child: "+child.id, children[0].id);
        markAsBlock(child);
    }
}