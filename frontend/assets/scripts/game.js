import { GAME_STATES, ROUND_COLORS, CONFIG } from './constants.js';
import { StateManager } from './stateManager.js';
import { Player } from './player.js';
import { LineManager } from './lineManager.js';

const canvas = document.getElementById('gameCanvas');
const gameContainer = document.getElementById('game');
const ctx = canvas.getContext('2d');
const mainMenu = document.getElementById('main-menu');
const pauseOverlay = document.getElementById('pause-overlay');
const staminaBar = document.getElementById('stamina-fill');

const stateManager = new StateManager(GAME_STATES.MAIN_MENU, {
    [GAME_STATES.MAIN_MENU]: () => {
        mainMenu.style.display = 'block';
        gameContainer.style.display = 'none';
        pauseOverlay.style.display = 'none';
    },
    [GAME_STATES.PLAYING]: () => {
        mainMenu.style.display = 'none';
        gameContainer.style.display = 'block';
        pauseOverlay.style.display = 'none';
        requestAnimationFrame(loop);
    },
    [GAME_STATES.PAUSED]: () => {
        mainMenu.style.display = 'none';
        pauseOverlay.style.display = 'block';
    },
});

const player = new Player(canvas.width / 2, canvas.height / 2, 8, CONFIG.PLAYER_SPEED);
const lineManager = new LineManager(canvas);

let lastTime = 0;
let round = 1;

function update(deltaTime) {
    player.move(keys, deltaTime, canvas, {
        depletion: CONFIG.STAMINA_DEPLETION_RATE,
        regeneration: CONFIG.STAMINA_REGEN_RATE,
    });
    lineManager.updateLines(deltaTime);
    staminaBar.style.width = `${player.stamina}%`;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ROUND_COLORS[round - 1];
    lineManager.drawLines(ctx, ROUND_COLORS[round - 1]);
}

function loop(timestamp) {
    if (stateManager.getState() !== GAME_STATES.PLAYING) return;

    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(loop);
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').onclick = () => stateManager.updateState(GAME_STATES.PLAYING);
    document.getElementById('pause-button').onclick = () => stateManager.updateState(GAME_STATES.PAUSED);
});
