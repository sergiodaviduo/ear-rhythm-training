import { assert, expect, test, vi } from 'vitest'
import { gameEngine } from '../src/components/engine.js'
import { Game } from '../src/components/game.js';

// 
test('Math.sqrt()', () => {
    expect(Math.sqrt(4)).toBe(2)
    expect(Math.sqrt(144)).toBe(12)
    expect(Math.sqrt(2)).toBe(Math.SQRT2)
  })