// Constants for game states
const GAME_STATES = {
    MAIN_MENU: 'MAIN_MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    END_GAME: 'END_GAME',
    END_ROUND: 'END_ROUND',
};

// power ups
const POWER_UPS = [
    {
        name: 'Extra Life',
        effect: (updater) => {
            updater.updateLives(lives + 1); // Increment lives
        },
    },
    {
        name: 'Increased Stamina',
        effect: (updater) => {
            updater.updateStamina(staminaDepletionRate - 10); // Increase stamina
        },
    },
    {
        name: 'Speed Boost',
        effect: (updater) => {
            updater.updateSpeed(player.speed * 1.2); // Increase player speed
        },
    },
];


let currentState = GAME_STATES.MAIN_MENU; // Start at main menu

// DOM Elements
const mainMenu = document.getElementById('main-menu');
const gameContainer = document.getElementById('game');
const canvas = document.getElementById('gameCanvas');
const pauseOverlay = document.getElementById('pause-overlay');
const ctx = canvas.getContext('2d');

const scoreboardHighScore = document.getElementById('current-highscore');
const menuHighScore = document.getElementById('past-highscore');
const scoreboardRound = document.getElementById('current-round');
const scoreboardLines = document.getElementById('current-lines');
const scoreboardScore = document.getElementById('current-score');
const scoreboardLives = document.getElementById('current-lives');
const staminaBar = document.getElementById('stamina-fill');
const iframeBar = document.getElementById('iframe-fill');
const iframeTimer = document.getElementById('iframe-timer');
const homeBtn = document.getElementById("home-button");
const powerUpMenu = document.getElementById('power-up-menu');
const powerUpOptions = document.getElementById('power-up-options');

//Gameplay Variables
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
console.log(`LOG: highscore from localstorage pull: ${highScore}`)
scoreboardHighScore.textContent = highScore;
menuHighScore.textContent = highScore;

let player = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 150 };
let keys = {};
let lines = [];
let score = 0;
let lives = 3;
let round = 1;
let maxRounds = 6; // +1 than playable rounds for end game logic; hacky ik... ...
let linesPerRound = 5;
let linesLeft = linesPerRound;
let lineSpeedMultiplier = 1;
let maxLinesOnScreen = 5;
let isInvincible = false; // Tracks if the player has iframes
let iframeCooldown = false; // Tracks if the ability is on cooldown
const iframeDuration = 750; // Duration of iframes in milliseconds
const iframeCooldownTime = 3000; // Cooldown time in milliseconds
let roundColor = {
    1: 'white',
    2: 'yellow',
    3: 'orange',
    4: 'orangered',
    5: 'violet',
    6: 'violet',
}
let isFlashing = false; // Tracks if the red dot is flashing
let pauseTime = 0; // time when the game was paused

// Stamina properties
let stamina = 66; // Max stamina
let staminaDepletionRate = 66; // Per second when sprinting
const staminaRegenRate = 33; // Per second when not sprinting
let canSprint = true;

//home button
homeBtn.onclick = function() {
    location.reload();
}

function init() {
    // set up initial state
    updateState(GAME_STATES.MAIN_MENU);

    // add event listeners for controls
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        keys[key] = true;

        if (key === 'escape') {
            if (currentState === GAME_STATES.PLAYING) {
                updateState(GAME_STATES.PAUSED);
            } else if (currentState === GAME_STATES.PAUSED) {
                updateState(GAME_STATES.PLAYING);
            }
        }

        // trigger iframe action on spacebar press
        if (key === ' ' && !iframeCooldown) {
            activateIframes();
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    // add event listener for the main menu button
    document.querySelector('#main-menu button:first-child').addEventListener('click', startGame);
}

function resetGame() {
    player = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 150 };
    lines = [];
    score = 0;
    lives = 3;
    round = 1;
    linesPerRound = 20;
    linesLeft = linesPerRound;
    lineSpeedMultiplier = 1;

    scoreboardScore.textContent = score;
    scoreboardLives.textContent = lives;
    scoreboardRound.textContent = round;
    scoreboardLines.textContent = linesLeft;

    clearCanvas();
}

// State Transition Function
function updateState(newState) {
    currentState = newState;

    switch (currentState) {
        case GAME_STATES.MAIN_MENU:
            mainMenu.style.display = 'block';
            gameContainer.style.display = 'none';
            break;

        case GAME_STATES.PLAYING:
            mainMenu.style.display = 'none';
            gameContainer.style.display = 'block';
            pauseOverlay.style.display = 'none';
            if (pauseTime) {
                lastTime += performance.now() - pauseTime;
                pauseTime = 0;
            }
            if (lastTime === 0) {
                startGameplay();
            } else {
                requestAnimationFrame(loop);
            }
            break;
        
        case GAME_STATES.PAUSED:
            console.log('Game paused!');
            mainMenu.style.display = 'none';
            pauseOverlay.style.display = 'block';
            pauseTime = performance.now(); // record when the game was paused
            break;
    }
}


// Countdown Function
function startCountdown(callback) {
    let countdown = 3; // Start from 3
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.fillStyle = 'white'; // Set text color
    ctx.font = '128px "Pixelify Sans"'; // Set font and size
    ctx.textAlign = 'center'; // Center align text
    ctx.textBaseline = 'middle'; // Middle align text

    function drawCountdown() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctx.fillText(countdown, canvas.width / 2, canvas.height / 2); // Draw countdown number

        if (countdown > 0) {
            countdown--; // Decrement countdown
            setTimeout(drawCountdown, 1000); // Call again after 1 second
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas after countdown
            callback(); // Start the game
        }
    }

    drawCountdown();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startGame() {
    clearCanvas();
    updateState(GAME_STATES.PLAYING);
}

function showMainMenu() {
    clearCanvas();
    updateState(GAME_STATES.MAIN_MENU);
}

function startGameplay() {
    console.log('Game started!');
    resetGame();
    startCountdown(() => {
        lastTime = performance.now();
        requestAnimationFrame(loop);
    });
}

function gameOver() {
    currentState = GAME_STATES.END_GAME;
    lastTime = 0;

    // Show modal
    const endGameModal = document.getElementById('end-game-modal');
    const endGameMessage = document.getElementById('end-game-message');
    const endGameScore = document.getElementById('end-game-score');
    const endGameHighscore = document.getElementById('end-game-highscore');
    const mainMenuButton = document.getElementById('main-menu-button');
    const playAgainButton = document.getElementById('play-again-button');

    // Set modal content
    endGameMessage.textContent = round === maxRounds ? 'You Won!' : 'Game Over';
    endGameScore.textContent = `Your score: ${score}`;
    if (round === maxRounds) {
        score *= 69;
        endGameScore.textContent += ` (69x multiplier applied! Final Score: ${score})`;
    }

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        menuHighScore.textContent = highScore;
        endGameHighscore.textContent = 'New High Score!';
    } else {
        endGameHighscore.textContent = `High Score: ${highScore}`;
    }

    endGameModal.style.display = 'flex';

    // Button handlers
    mainMenuButton.onclick = () => {
        endGameModal.style.display = 'none';
        showMainMenu();
    };

    playAgainButton.onclick = () => {
        endGameModal.style.display = 'none';
        startGame();
    };
}

function activateIframes() {
    isInvincible = true;
    iframeCooldown = true;

    // Temporarily set invincibility
    setTimeout(() => {
        isInvincible = false;
    }, iframeDuration);

    // Start cooldown and update cooldown bar
    let cooldownTimeLeft = iframeCooldownTime / 1000; // Convert to seconds
    iframeBar.style.transform = 'scaleX(1)'; // Full bar
    iframeTimer.textContent = cooldownTimeLeft.toFixed(1); // Initial time

    const cooldownInterval = setInterval(() => {
        cooldownTimeLeft -= 0.1; // Decrease by 0.1s
        if (cooldownTimeLeft <= 0) {
            clearInterval(cooldownInterval);
            iframeCooldown = false; // Cooldown complete
            iframeBar.style.transform = 'scaleX(0)'; // Empty bar
            iframeTimer.textContent = '';
        } else {
            iframeBar.style.transform = `scaleX(${cooldownTimeLeft / (iframeCooldownTime / 1000)})`;
            iframeTimer.textContent = cooldownTimeLeft.toFixed(1);
        }
    }, 100);
}

function startFlashing() {
    isFlashing = true;
    let flashDuration = 1000; // Total flashing time in milliseconds
    let flashInterval = 100; // Flash every 100ms
    let flashes = flashDuration / flashInterval;
    let flashCount = 0;

    const flashIntervalId = setInterval(() => {
        flashCount++;
        isFlashing = !isFlashing; // Toggle visibility
        if (flashCount >= flashes) {
            clearInterval(flashIntervalId); // Stop flashing after the duration
            isFlashing = false; // Ensure visibility is restored
        }
    }, flashInterval);
}

let lastTime = 0;

function update(deltaTime) {
    let moveSpeed = player.speed * deltaTime; // adjust speed by delta time

    // sprint logic
    if (keys['shift'] && canSprint && stamina > 0) {
        moveSpeed *= 2;
        stamina -= (staminaDepletionRate * deltaTime); // adjust stamina depletion
        if (stamina <= 0) {
            stamina = 0;
            canSprint = false; // prevent sprinting if out of stamina
        }
    } else {
        stamina += (staminaRegenRate * deltaTime); // adjust stamina regeneration
        if (stamina >= 100) {
            stamina = 100;
            canSprint = true; // allow sprinting again when stamina is full
        }
    }

    // update stamina bar
    staminaBar.style.width = `${stamina}%`;

    if (keys['w'] || keys['arrowup']) player.y -= moveSpeed;
    if (keys['s'] || keys['arrowdown']) player.y += moveSpeed;
    if (keys['a'] || keys['arrowleft']) player.x -= moveSpeed;
    if (keys['d'] || keys['arrowright']) player.x += moveSpeed;

    // keep the player within bounds
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

    // update lines
    for (let i = lines.length - 1; i >= 0; i--) {
        let line = lines[i];
        line.x += line.dx * deltaTime; // adjust line movement by delta time
        line.y += line.dy * deltaTime;

        // remove lines that leave the screen and update score
        if ((line.dx > 0 && line.x > canvas.width) || (line.dx < 0 && line.x + line.width < 0) ||
            (line.dy > 0 && line.y > canvas.height) || (line.dy < 0 && line.y + line.height < 0)) {
            lines.splice(i, 1);
            score = score + 10 * round;
            scoreboardScore.textContent = score;
        }

        // collision detection (skipped if invincible)
        if (!isInvincible &&
            player.x + player.radius > line.x && player.x - player.radius < line.x + line.width &&
            player.y + player.radius > line.y && player.y - player.radius < line.y + line.height) {
            lines.splice(i, 1);
            lives -= 1;
            scoreboardLives.textContent = lives;
            if (lives <= 0) {
                gameOver();
                return;
            }
            startFlashing();
        }
    }

    // spawn new lines if needed
    while (lines.length < maxLinesOnScreen) {
        linesLeft -= 1;
        scoreboardLines.textContent = linesLeft;
        spawnLine();
    }

    // handle round progression
    if (linesLeft == 0 && round <= maxRounds) {
        if (round === maxRounds) {
            gameOver();
            return;
        }
    
        // Trigger endRound to allow selecting power-ups
        endRound();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.style.borderColor = roundColor[round];

    // Draw player with a special effect during iframes or flashing
    if (!isFlashing || Math.floor(performance.now() / 100) % 2 === 0) {
        ctx.fillStyle = roundColor[round];
        ctx.globalAlpha = isInvincible ? 0.3 : 1.0;
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1.0;

    ctx.fillStyle = roundColor[round];
    for (let line of lines) {
        ctx.fillRect(line.x, line.y, line.width, line.height);
    }
}

function spawnLine() {
    const side = Math.floor(Math.random() * 4); // 0 = top, 1 = right, 2 = bottom, 3 = left
    const speed = (Math.random() * 50 + 150) * lineSpeedMultiplier;
    let line = { x: 0, y: 0, width: 0, height: 0, dx: 0, dy: 0 };

    switch (side) {
        case 0: // Top
            var width = Math.floor(Math.random() * canvas.width);
            var height = 20;
            var x = Math.floor(Math.random() * canvas.width);
            var y = 0;

            line = { x: x, y: y, width: width, height: height, dx: 0, dy: speed };
            break;
        case 1: // Right
            var width = 20;
            var height = Math.floor(Math.random() * canvas.width);
            var x = canvas.width;
            var y = Math.floor(Math.random() * canvas.width);

            line = { x: x, y: y, width: width, height: height, dx: -speed, dy: 0 };
            break;
        case 2: // Bottom
            var width = Math.floor(Math.random() * canvas.width);
            var height = 20;
            var x = Math.floor(Math.random() * canvas.width);
            var y = canvas.height;

            line = { x: x, y: y, width: width, height: height, dx: 0, dy: -speed };
            break;
        case 3: // Left
            var width = 20;
            var height = Math.floor(Math.random() * canvas.width);
            var x = 0;
            var y = Math.floor(Math.random() * canvas.width);

            line = { x: x, y: y, width: width, height: height, dx: speed, dy: 0 };
            break;
    }

    lines.push(line);
}


function loop(timestamp) {
    if (currentState !== GAME_STATES.PLAYING) return; // stop if not playing

    let deltaTime = (timestamp - lastTime) / 1000; // calculate time difference
    lastTime = timestamp;

    update(deltaTime); // update game logic
    draw(); // draw on canvas

    requestAnimationFrame(loop); // continue the loop
}

function endRound() {
    currentState = GAME_STATES.END_ROUND;
    console.log("End round triggered, displaying power-up options.");
    
    powerUpOptions.innerHTML = ''; // Clear previous options

    POWER_UPS.forEach((powerUp, index) => {
        const button = document.createElement('button');
        button.textContent = powerUp.name;
        console.log(`Creating button for power-up: ${powerUp.name}`);
        button.onclick = () => {
            console.log(`Power-up selected: ${powerUp.name}`);
            applyPowerUp(index);
            powerUpMenu.classList.add('hidden');
            startNewRound();
        };
        powerUpOptions.appendChild(button);
    });

    powerUpMenu.classList.remove('hidden');
    console.log("Power-up menu should now be visible.");
}

function applyPowerUp(index) {
    const selectedPowerUp = POWER_UPS[index];
    if (selectedPowerUp && selectedPowerUp.effect) {
        // Apply the effect, passing in references to the actual variables
        selectedPowerUp.effect({
            updateLives: (value) => { lives = value; },
            updateStamina: (value) => { staminaDepletionRate = value; },
            updateSpeed: (value) => { player.speed = value; },
        });

        // Update UI elements after applying the power-up
        scoreboardLives.textContent = lives;

        console.log(`Power-up applied: ${selectedPowerUp.name}`);
        console.log(`Lives: ${lives}, Stamina Depletion: ${staminaDepletionRate}, Speed: ${player.speed}`);
    }
}


function startNewRound() {
    currentState = GAME_STATES.PLAYING;

    // Reset round-specific variables
    round += 1; // Increment round
    linesPerRound = linesPerRound * 2;
    linesLeft = linesPerRound;
    lineSpeedMultiplier += 0.05;

    scoreboardRound.textContent = round;

    // Restart gameplay
    requestAnimationFrame(loop);
    console.log(`Starting Round ${round}`);
}

init();