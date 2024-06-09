export function menu() {

    const menu_items = ["play-button", "Settings", "High-Scores"];

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
                document.getElementById("Settings").style.backgroundColor = unselected;
                document.getElementById("High-Scores").style.backgroundColor = unselected;
                break;
            case "Settings":
                document.getElementById("play-button").style.backgroundColor = unselected;
                document.getElementById("Settings").style.backgroundColor = selected;
                document.getElementById("High-Scores").style.backgroundColor = unselected;
                break;
            case "High-Scores":
                document.getElementById("play-button").style.backgroundColor = unselected;
                document.getElementById("Settings").style.backgroundColor = unselected;
                document.getElementById("High-Scores").style.backgroundColor = selected;
                break;
        }
    
    });



    
}

// export { menu };