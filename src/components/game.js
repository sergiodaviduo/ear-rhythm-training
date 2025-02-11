import * as Tone from 'tone';

export class Game {
    constructor(tempo=120, delay=150) {
        this._score = 0;
        this._totalSongNotes = 0;
        this._notesInMeasure = 0;
        this._tempo = tempo;
        this._delay = delay;
        this._isPlaying = false;
        this._didScore = false;
        this._firstRun = true;

        this._instrument = null;
        this._clickTrack = null;
        this._answerTrack = null;
        this._windowKeys = [];
        this._playerNotes = [];
    }

    get firstRun() {
        return this._firstRun;
    }

    get score() {
        return this._score;
    }

    get totalSongNotes() {
        return this._totalSongNotes;
    }

    get tempo() {
        return this._tempo;
    }

    get delay() {
        return this._delay;
    }

    get answerTrack() {
        return this._answerTrack;
    }

    get clickTrack() {
        return this._clickTrack;
    }

    get instrument() {
        return this._instrument;
    }

    get playerNotes() {
        return this._playerNotes;
    }

    get windowKeys() {
        return this._windowKeys;
    }

    get notesInMeasure() {
        return this._notesInMeasure;
    }

    get isPlaying() {
        return this._isPlaying;
    }

    get didScore() {
        return this._didScore;
    }

    set firstRun(firstRun) {
        this._firstRun = firstRun;
    }

    set score(score) {
        this._score = score;
    }

    set totalSongNotes(totalSongNotes) {
        this._totalSongNotes = totalSongNotes;
    }

    set tempo(tempo) {
        this._tempo = tempo;
    }

    set delay(delay) {
        this._delay = delay;
    }

    set answerTrack(track) {
        this._answerTrack = track;
    }

    set clickTrack(track) {
        this._clickTrack = track;
    }

    set instrument(instrument) {
        this._instrument = instrument;
    }

    set playerNotes(playerNotes) {
        this._playerNotes = playerNotes;
    }

    addPlayerNote(note) {
        this._playerNotes.push(note);
    }

    // make array of all diffs with player and answer notes
    calibratedDiffAvg() {
        let i = 0;
        // stores an int variable in array for each difference between player note, and answer note

        let playerDiffs = [];
        let currentDiff = 0;
        this._playerNotes.forEach((playerNote) => {
            currentDiff = playerNote - this._windowKeys[i].note;
            playerDiffs.push(currentDiff);
            console.log("Pushed note diff: ",currentDiff);
            console.log("   Player note: ",playerNote);
            console.log("   Correct note: ",this._windowKeys[i].note);
            i++;
        });
    
        // calculate average diff
        let total = 0;
        playerDiffs.forEach((noteDiff) => {
            total += noteDiff;
        });
        let avg = total / playerDiffs.length;
        return avg;
    }

    set notesInMeasure(notes) {
        this._notesInMeasure = notes;
    }

    addNote(currentTime, normWindow, greatWindow, perfWindow, signature=1) {
        let measure = this.measureToMillis() * signature;
        let normalOpen = this._delay-normWindow + measure + currentTime;
        let normalClose = this._delay+normWindow + measure + currentTime;
        let greatOpen = this._delay-greatWindow + measure + currentTime;
        let greatClose = this._delay+greatWindow + measure + currentTime;
        let perfectOpen = this._delay-perfWindow + measure + currentTime;
        let perfectClose = this._delay+perfWindow + measure + currentTime;
        let currentNote = measure + currentTime + this._delay;

        this._windowKeys.push(
            {
                nOpen: normalOpen,
                gOpen: greatOpen,
                pOpen: perfectOpen,
                note: currentNote,
                pClose: perfectClose,
                gClose: greatClose,
                nClose: normalClose,
                scored: 0
            }
        );
    }

    clearNotes() {
        this._windowKeys = [];
        this._playerNotes = [];
    }

    // return array of just the correct note timings
    getWindowKeyNotes() {
        let noteKeys = [];
        this._windowKeys.forEach((key) => {
            noteKeys.push(key.note);
        });

        return noteKeys;
    }

    set didScore(didScore) {
        this._didScore = didScore;
    }

    togglePlay() {
        if (this._isPlaying) {
            this._isPlaying = false;
        } else {
            this._isPlaying = true;
        }
    }

    measureToMillis() {
        let measureInMillis = (60000 / this._tempo) * 4;

        return measureInMillis;
    }
}