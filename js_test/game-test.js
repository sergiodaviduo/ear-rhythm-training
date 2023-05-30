import { assert, expect, test, vi } from 'vitest'
import { Game } from '../src/components/game.js';

// Defaults
test.only('Game constructor returns expected defaults', () => {
    const Spy = vi.fn(() => (new Game));

    expect(Spy.mock.results[0].value).toEqual({
        _score: 0,
        isPlaying: false,
        _inputWindowO: 0,
        _inputWindowC: 0,
        _tempo: 100,
        _delay: 100
    });

});