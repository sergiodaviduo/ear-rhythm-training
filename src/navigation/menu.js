export function menu() {
    alert("hhhh");

    const menu_items = ["play-button", "Settings", "High-Scores"];

    const selected = document.querySelector("#play-button:hover").style;
    const unselected = document.querySelector("#play-button").style;

    let menu_choice = 1;

    let gave_input = false;

    document.addEventListener('keydown', (event) => {
        //let accuracy = 0;

        gave_input = true;

        alert("down");

        if (document.getElementById("play-button").style.display != "none") {
            if (event.key === 'ArrowDown') {
                menu_choice--;
                alert(test);
                console.log("test down");
            }

            if (event.key === 'ArrowUp') {
                menu_choice++;
            }
        }
    });

    if (gave_input) {
        if (menu_choice < 0) {
            menu_choice = 2;
        }
    
        if (menu_choice > 2) {
            menu_choice = 0;
        }
    
        switch (menu_items[menu_choice]) {
            case "play-button":
                document.getElementById("play-button").style = selected;
                document.getElementById("Settings").style = unselected;
                document.getElementById("High-Scores").style = unselected;
                break;
            case "Settings":
                document.getElementById("play-button").style = unselected;
                document.getElementById("Settings").style = selected;
                document.getElementById("High-Scores").style = unselected;
                break;
            case "High-Scores":
                document.getElementById("play-button").style = unselected;
                document.getElementById("Settings").style = unselected;
                document.getElementById("High-Scores").style = selected;
                break;
        }
    } 
}

// export { menu };