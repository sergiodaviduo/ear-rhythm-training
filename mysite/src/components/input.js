async function waitForInput() {
    let ready = await Tone.start();
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

function inputOpen(milisec) {
    console.log("open");

    openTime = +new Date();

    openTime += milisec;
}

/*
return new Promise((resolve) => {
    setTimeout(() => {
        console.log("open");
        noteWindow = 1;

        openTime = +new Date();

        resolve(1);
    }, milisec);
});
*/

function inputClose(milisec) {
    console.log("close");

    closeTime = +new Date();

    closeTime += milisec;
}

/*
return new Promise((resolve) => {
    setTimeout(() => {
        console.log("close");
        noteWindow = 0;

        closeTime = +new Date();

        resolve(0);
    }, milisec);
});
*/

function waitForNote(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
}