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

// addNote() adds the expected note to windowKeys
test('addNote() adds the expected note to windowKeys', () => {
    new Spy();
    const Mock1 = Spy.mock.results[4].value;

    Mock1.addNote(1000000, 80, 60, 40);

    expect(Mock1.windowKeys).toHaveLength(1);
    expect(Mock1.windowKeys[0]).toContain(
        {
            nOpen: 1002070,
            gOpen: 1002090,
            pOpen: 1002110,
            note: 1002150,
            pClose: 1002190,
            gClose: 1002210,
            nClose: 1002230,
            scored: 0
        }
    );

    new Spy();

    const currentTime = +new Date();
    const Mock2 = Spy.mock.results[5].value;

    Mock2.addNote(currentTime, 80, 60, 40);

    expect(Mock2.windowKeys[0]).toContain(
        {
            nOpen: currentTime + 2070,
            gOpen: currentTime + 2090,
            pOpen: currentTime + 2110,
            note: currentTime + 2150,
            pClose: currentTime + 2190,
            gClose: currentTime + 2210,
            nClose: currentTime + 2230,
            scored: 0
        }
    );
});