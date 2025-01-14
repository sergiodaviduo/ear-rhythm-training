// ripple effect: https://codepen.io/daless14/pen/DqXMvK
// caculate note duration and hertz from bpm: http://bradthemad.org/guitar/tempo_explanation.php
// this visual library would be wild with this: https://ptsjs.org/

import { Game } from "./components/game.js";

import { gameRoom } from './components/engine.js';

const GameData = new Game(120, 150);

gameRoom(GameData);

