import * as Tone from 'tone';

export class Game {
    constructor(tempo=100, delay=100) {
        this._score = 0;
        this._isPlaying = false;
        this._inputWindowO = 0;
        this._inputWindowC = 0;
        this._tempo = tempo;
        this._delay = delay;
        this._firstRun = true;
        this._scored = false;
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
        let tempoRatio = this._tempo / tempo;

        this._tempo = tempo;
        Tone.Transport.bpm.value = tempo;

        this.inputWindowO = Math.round( this.inputWindowO * tempoRatio );
        this.inputWindowC = Math.round( this.inputWindowO * tempoRatio );
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

    set didScore(scored) {
        this._scored = scored;
    }
}