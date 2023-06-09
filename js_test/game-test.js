import { assert, expect, test, vi } from 'vitest'
import { Game } from '../src/components/game.js';

const Spy = vi.fn(() => (new Game));
const Mock = new Spy();

// Object has correct defaults when constructed
test('Game constructor returns expected defaults', () => {
    const Construction = Spy.mock.results[0].value;

    expect(Construction).toEqual({
        _score: 0,
        isPlaying: false,
        _inputWindowO: 0,
        _inputWindowC: 0,
        _tempo: 100,
        _delay: 100
    });

});

// Can set score, tempo, and delay, and retrieve their set value
test('Changing score, tempo, delay', () => {
    const Construction = Spy.mock.results[0].value;

    Construction.score = 1;
    Construction.tempo = 2;
    Construction.delay = 3;

    expect(Construction).toEqual({
        _score: 1,
        isPlaying: false,
        _inputWindowO: 0,
        _inputWindowC: 0,
        _tempo: 2,
        _delay: 3
    });

});

// Can set answerTrack, clickTrack, and instrument, and retrieve their set value
test('Changing answerTrack, clickTrack, instrument', () => {
    const Mock = new Spy();
    const Construction = Spy.mock.results[1].value;

    Construction.answerTrack = 1;
    Construction.clickTrack = 2;
    Construction.instrument = 3;

    expect(Construction).toEqual({
        _score: 0,
        isPlaying: false,
        _inputWindowO: 0,
        _inputWindowC: 0,
        _tempo: 100,
        _delay: 100,
        _answerTrack: 1,
        _clickTrack: 2,
        _instrument: 3
    });
});

// Can set notesInMeasure, inputWindowO, and inputWindowC, and retrieve their set value
test('Changing notesInMeasure, inputWindowO, inputWindowC', () => {
    const Mock = new Spy();
    const Construction = Spy.mock.results[2].value;

    Construction.notesInMeasure = 1;
    Construction.inputWindowO = 2;
    Construction.inputWindowC = 3;

    expect(Construction).toEqual({
        _score: 0,
        isPlaying: false,
        _inputWindowO: 2,
        _inputWindowC: 3,
        _notesInMeasure: 1,
        _tempo: 100,
        _delay: 100
    });
});