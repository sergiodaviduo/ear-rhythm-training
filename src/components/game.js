class Game {
    constructor() {
        this.score = 0;
        this.isPlaying = false;
    }

    get score() {
        return this.score;
    }

    set tempo(tempo) {
        this.tempo = tempo;
    }

    set delay(delay) {
        this.delay = delay;
    }

    togglePlay() {
        if (this.isPlaying) {
            this.isPlaying = false;
        } else {
            this.isPlaying = true;
        }
    }

    set answerTrack(track) {
        this.answerTrack = track;
    }

    set clickTrack(track) {
        this.clickTrack = track;
    }

    set instrument(instrument) {
        this.instrument = instrument;
    }

    set notesInMeausre(notes) {
        this.notesInMeausre = notes;
    }
}

export class Game{};