import './style.css';
import { Game } from './game/Game';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('Root app element not found.');
}

const game = new Game(app);
game.start();
