// ripple effect: https://codepen.io/daless14/pen/DqXMvK
// caculate note duration and hertz from bpm: http://bradthemad.org/guitar/tempo_explanation.php
// this visual library would be wild with this: https://ptsjs.org/

import { Game } from "./components/game.js";
// import { STATIC_LIBRARY } from "./constants/notes.js";
import { gameRoom } from './components/engine.js';

//const QuarterNoteTest = STATIC_LIBRARY[2];

const GameData = new Game(120, 70);

gameRoom(GameData);

