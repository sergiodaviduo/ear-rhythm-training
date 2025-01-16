import { assert, expect, test, vi } from 'vitest'
import { Game } from '../src/components/game.js';

const Spy = vi.fn(() => (new Game));

// Object has correct defaults when constructed
test('Game constructor returns expected defaults', () => {
    new Spy();
    const Construction = Spy.mock.results[0].value;

    expect(Construction).toEqual({
        _score: 0,
        _totalSongNotes: 0,
        _notesInMeasure: 0,
        _tempo: 120,
        _delay: 150,
        _isPlaying: false,
        _firstRun: true,
        _didScore: false,

        _instrument: null,
        _clickTrack: null,
        _answerTrack: null,
        _windowKeys: [],
        _playerNotes: []
    });
});

// Class getters work as expected
test('Class getters work as expected', () => {
    new Spy();
    const Mock = Spy.mock.results[1].value;

    expect(Mock.score).to.equal(0);
    expect(Mock.totalSongNotes).to.equal(0);
    expect(Mock.notesInMeasure).to.equal(0);
    expect(Mock.tempo).to.equal(120);
    expect(Mock.delay).to.equal(150);
    expect(Mock.firstRun).to.equal(true);
    expect(Mock.didScore).to.equal(false);
    expect(Mock.instrument).toBeNull();
    expect(Mock.clickTrack).toBeNull();
    expect(Mock.answerTrack).toBeNull();
    expect(Mock.playerNotes).toHaveLength(0);
    expect(Mock.playerNotes).toBeTypeOf('object');
    expect(Mock.windowKeys).toHaveLength(0);
    expect(Mock.windowKeys).toBeTypeOf('object');
});

// Class setters work as expected
test('Class setters work as expected', () => {
    new Spy();
    const Mock = Spy.mock.results[2].value;

    Mock.score += 100;
    Mock.totalSongNotes = 80;
    Mock.notesInMeasure = 5;
    Mock.tempo += 20;
    Mock.delay = 200;
    Mock.firstRun = false,
    Mock.didScore = true,
    Mock.instrument = {test1:"test1"};
    Mock.clickTrack = {test2:"test2"};
    Mock.answerTrack = {test3:"test3"};
    Mock.playerNotes = [5,6,7,8];

    expect(Mock).toEqual({
        _score: 100,
        _totalSongNotes: 80,
        _notesInMeasure: 5,
        _tempo: 140,
        _delay: 200,
        _isPlaying: false,
        _firstRun: false,
        _didScore: true,

        _instrument: {test1:"test1"},
        _clickTrack: {test2:"test2"},
        _answerTrack: {test3:"test3"},
        _windowKeys: [],
        _playerNotes: [5,6,7,8]
    });
});

// togglePlay() changes play state of Game object
test('togglePlay()', () => {
    new Spy();
    const Mock = Spy.mock.results[3].value;
    Mock.togglePlay();

    expect(Mock).toEqual({
        _score: 0,
        _totalSongNotes: 0,
        _notesInMeasure: 0,
        _tempo: 120,
        _delay: 150,
        _isPlaying: true,
        _firstRun: true,
        _didScore: false,

        _instrument: null,
        _clickTrack: null,
        _answerTrack: null,
        _windowKeys: [],
        _playerNotes: []
    });

    expect(Mock.isPlaying).to.equal(true);

    Mock.togglePlay();

    expect(Mock).toEqual({
        _score: 0,
        _totalSongNotes: 0,
        _notesInMeasure: 0,
        _tempo: 120,
        _delay: 150,
        _isPlaying: false,
        _firstRun: true,
        _didScore: false,

        _instrument: null,
        _clickTrack: null,
        _answerTrack: null,
        _windowKeys: [],
        _playerNotes: []
    });

    expect(Mock.isPlaying).to.equal(false);
});