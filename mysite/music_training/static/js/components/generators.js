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


// Hard Version
// Generates a measure of random 16th notes

export function hardRandomizer(notes) {
    notes = (notes > 15) ? 15 : notes;

    const note = { time: 0, note: "C4", velocity: 0.9 };
    let noteClone = Object.assign({}, note);
    let timeGroup = [];
    let noteGroup = [];
    let time = "";
    let random4th = 0;
    let random16th = 0;

    for (let i = 0; i < notes; i++) {
        do {
            random4th = Math.floor(Math.random() * 4);
            random16th = Math.floor(Math.random() * 4);
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

// Medium Version
// Generates a measure of random 8th notes

export function mediumRandomizer(notes) {
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
export function randomizerExtender(notes, measures, hasRepeat=true) {
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