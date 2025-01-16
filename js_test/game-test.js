import { assert, expect, test, vi } from 'vitest'
import { Game } from '../src/components/game.js';

const Spy = vi.fn(() => (new Game));
new Spy();

// Object has correct defaults when constructed
test('Game constructor returns expected defaults', () => {
    const Construction = Spy.mock.results[0].value;

    expect(Construction).toEqual({
        _score: 0,
        _totalSongNotes: 0,
        _isPlaying: false,
        _tempo: 120,
        _delay: 150,
        _firstRun: true,
        _scored: false,
        
        _windowKeys: [],
        _playerNotes: []
    });
});

// Can set score, tempo, and delay, and retrieve their set value
test('Changing score, tempo, delay', () => {
    const Mock = Spy.mock.results[0].value;

    Mock.score = 1;
    Mock.tempo = 2;
    Mock.delay = 3;

    expect(Mock).toEqual({
        _score: 1,
        _isPlaying: false,
        _inputWindowO: 0,
        _inputWindowC: 0,
        _tempo: 2,
        _delay: 3
    });

    expect(Mock.score).to.equal(1);
    expect(Mock.tempo).to.equal(2);
    expect(Mock.delay).to.equal(3);
});

// Can set answerTrack, clickTrack, and instrument, and retrieve their set value
test('Changing answerTrack, clickTrack, instrument', () => {
    new Spy();
    const Mock = Spy.mock.results[1].value;

    Mock.answerTrack = 1;
    Mock.clickTrack = 2;
    Mock.instrument = 3;

    expect(Mock).toEqual({
        _score: 0,
        _isPlaying: false,
        _inputWindowO: 0,
        _inputWindowC: 0,
        _tempo: 100,
        _delay: 100,
        _answerTrack: 1,
        _clickTrack: 2,
        _instrument: 3
    });

    expect(Mock.answerTrack).to.equal(1);
    expect(Mock.clickTrack).to.equal(2);
    expect(Mock.instrument).to.equal(3);
});

// Can set notesInMeasure, inputWindowO, and inputWindowC, and retrieve their set value
test('Changing notesInMeasure, inputWindowO, inputWindowC', () => {
    new Spy();
    const Mock = Spy.mock.results[2].value;

    Mock.notesInMeasure = 1;
    Mock.inputWindowO = 2;
    Mock.inputWindowC = 3;

    expect(Mock).toEqual({
        _score: 0,
        _isPlaying: false,
        _inputWindowO: 2,
        _inputWindowC: 3,
        _notesInMeasure: 1,
        _tempo: 100,
        _delay: 100
    });

    expect(Mock.notesInMeasure).to.equal(1);
    expect(Mock.inputWindowO).to.equal(2);
    expect(Mock.inputWindowC).to.equal(3);
});

// togglePlay() changes play state of Game object
test('togglePlay()', () => {
    new Spy();
    const Mock = Spy.mock.results[3].value;
    Mock.togglePlay();

    expect(Mock).toEqual({
        _score: 0,
        _isPlaying: true,
        _inputWindowO: 0,
        _inputWindowC: 0,
        _tempo: 100,
        _delay: 100
    });

    expect(Mock.isPlaying).to.equal(true);

    Mock.togglePlay();

    expect(Mock).toEqual({
        _score: 0,
        _isPlaying: false,
        _inputWindowO: 0,
        _inputWindowC: 0,
        _tempo: 100,
        _delay: 100
    });

    expect(Mock.isPlaying).to.equal(false);
});