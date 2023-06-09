import { assert, expect, test, vi } from 'vitest'
import { Game } from '../src/components/game.js';

const Spy = vi.fn(() => (new Game));
const Mock = new Spy();

// object has correct defaults when constructed
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