import * as Tone from 'tone';

export class Game {
    constructor(tempo=120, delay=45) {
        this._score = 0;
        this._isPlaying = false;
        this._inputWindowO = 0;
        this._inputWindowC = 0;
        this._tempo = tempo;
        this._delay = delay;
        this._firstRun = true;
        this._scored = false;
        
        this._normalWindow = [];
        this._greatWindow = [];
        this._perfectWindow = [];
        this._windowKeys = [];
    }

    get firstRun() {
        return this._firstRun;
    }

    get score() {
        return this._score;
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

    get inputWindowO() {
        return this._inputWindowO;
    }

    get inputWindowC() {
        return this._inputWindowC;
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
        return this._scored;
    }

    set firstRun(firstRun) {
        this._firstRun = firstRun;
    }

    set score(score) {
        this._score = score;
        document.getElementById("score").innerHTML = "Score: " + score;
    }

    set tempo(tempo) {
        this._tempo = tempo;
        Tone.Transport.bpm.value = tempo;
    }

    set delay(delay) {
        this._delay = delay;
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

    set answerTrack(track) {
        this._answerTrack = track;
    }

    set clickTrack(track) {
        this._clickTrack = track;
    }

    set instrument(instrument) {
        this._instrument = instrument;
    }

    set notesInMeasure(notes) {
        this._notesInMeasure = notes;
    }

    set inputWindowO(milliseconds) {
        this._inputWindowO = milliseconds;
    }

    set inputWindowC(milliseconds) {
        this._inputWindowC = milliseconds;
    }

    // create scoring window

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
    }

    set didScore(scored) {
        this._scored = scored;
    }
}