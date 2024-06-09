// ripple effect: https://codepen.io/daless14/pen/DqXMvK
// caculate note duration and hertz from bpm: http://bradthemad.org/guitar/tempo_explanation.php
// this visual library would be wild with this: https://ptsjs.org/

import { Game } from "./components/game.js";
import { STATIC_LIBRARY } from "./constants/notes.js";
import { fourByFour } from "./components/instruments.js";
import { gameEngine, startGame } from './components/engine.js';

const QuarterNoteTest = STATIC_LIBRARY[2];

const GameData = new Game(150, 100);

let engine = gameEngine(GameData);
let metronome = fourByFour();

startGame(engine, metronome, GameData);

