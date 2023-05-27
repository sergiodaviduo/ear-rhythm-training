export class Game {
    constructor() {
        this._score = 0;
        this.isPlaying = false;
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

    set score(score) {
        this._score = score;
    }

    set tempo(tempo) {
        this._tempo = tempo;
    }

    set delay(delay) {
        this._delay = delay;
    }

    togglePlay() {
        if (this.isPlaying) {
            this.isPlaying = false;
        } else {
            this.isPlaying = true;
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

    set notesInMeausre(notes) {
        this._notesInMeausre = notes;
    }
}