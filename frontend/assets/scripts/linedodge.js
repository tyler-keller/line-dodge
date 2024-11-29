const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreboardHighScore = document.getElementById('current-highscore');
const scoreboardRound = document.getElementById('current-round');
const scoreboardLines = document.getElementById('current-lines');
const scoreboardScore = document.getElementById('current-score');
const scoreboardLives = document.getElementById('current-lives');
const staminaBar = document.getElementById('stamina-fill');

let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
scoreboardHighScore.textContent = highScore;

let redDot = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 2 };
let keys = {};
let lines = [];
let score = 0;
let lives = 3;
let round = 1;
let maxRounds = 6; // +1 than playable rounds for end game logic
let linesPerRound = 20;
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
    4: 'red',
    5: 'violet',
}
let isFlashing = false; // Tracks if the red dot is flashing

// Stamina properties
let stamina = 100; // Max stamina
const staminaDepletionRate = 66; // Per second when sprinting
const staminaRegenRate = 33; // Per second when not sprinting
let canSprint = true;

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;

    // Trigger iframe action on spacebar press
    if (key === ' ' && !iframeCooldown) {
        activateIframes();
    }
});

document.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

const iframeBar = document.getElementById('iframe-fill');
const iframeTimer = document.getElementById('iframe-timer');

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

function update() {
    let moveSpeed = redDot.speed;

    // Sprint logic
    if (keys['shift'] && canSprint && stamina > 0) {
        moveSpeed *= 2;
        stamina -= staminaDepletionRate / 60; // Deplete stamina (adjust for frame rate)
        if (stamina <= 0) {
            stamina = 0;
            canSprint = false; // Prevent sprinting if out of stamina
        }
    } else {
        stamina += staminaRegenRate / 60; // Regenerate stamina
        if (stamina >= 100) {
            stamina = 100;
            canSprint = true; // Allow sprinting again when stamina is full
        }
    }

    // Update stamina bar
    staminaBar.style.width = `${stamina}%`;

    if (keys['w'] || keys['arrowup']) redDot.y -= moveSpeed;
    if (keys['s'] || keys['arrowdown']) redDot.y += moveSpeed;
    if (keys['a'] || keys['arrowleft']) redDot.x -= moveSpeed;
    if (keys['d'] || keys['arrowright']) redDot.x += moveSpeed;

    redDot.x = Math.max(redDot.radius, Math.min(canvas.width - redDot.radius, redDot.x));
    redDot.y = Math.max(redDot.radius, Math.min(canvas.height - redDot.radius, redDot.y));

    for (let i = lines.length - 1; i >= 0; i--) {
        let line = lines[i];
        line.x += line.dx;
        line.y += line.dy;

        if ((line.dx > 0 && line.x > canvas.width) || (line.dx < 0 && line.x + line.width < 0) ||
            (line.dy > 0 && line.y > canvas.height) || (line.dy < 0 && line.y + line.height < 0)) {
            lines.splice(i, 1);
            score = score + 10 * round;
            scoreboardScore.textContent = score;
        }

        // Collision detection (skipped if invincible)
        if (!isInvincible && 
            redDot.x + redDot.radius > line.x && redDot.x - redDot.radius < line.x + line.width &&
            redDot.y + redDot.radius > line.y && redDot.y - redDot.radius < line.y + line.height) {
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

    while (lines.length < maxLinesOnScreen) {
        linesLeft -= 1;
        scoreboardLines.textContent = linesLeft;
        spawnLine();
    }

    if (linesLeft == 0 && round <= maxRounds) {
        if (round == maxRounds) {
            gameOver();
        }

        round++;
        linesPerRound = linesPerRound * 2;
        linesLeft = linesPerRound;
        lineSpeedMultiplier += 0.05;
        scoreboardRound.textContent = round;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw redDot with a special effect during iframes or flashing
    if (!isFlashing || Math.floor(performance.now() / 100) % 2 === 0) {
        ctx.fillStyle = isInvincible ? 'rgba(255, 0, 0, 0.5)' : 'red';
        ctx.beginPath();
        ctx.arc(redDot.x, redDot.y, redDot.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = roundColor[round];
    for (let line of lines) {
        ctx.fillRect(line.x, line.y, line.width, line.height);
    }
}

function spawnLine() {
    const side = Math.floor(Math.random() * 4); // 0 = top, 1 = right, 2 = bottom, 3 = left
    const speed = (Math.random() * 1 + 3) * lineSpeedMultiplier;
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
            var x = canvas.width;
            var y = Math.floor(Math.random() * canvas.width);

            line = { x: x, y: y, width: width, height: height, dx: speed, dy: 0 };
            break;
    }

    lines.push(line);
}

function gameOver() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    alert('Game Over! Your score: ' + score);
    resetGame();
}

function resetGame() {
    location.reload();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

setInterval(() => {
    if (lines.length < 3) {
        spawnLine();
    }
}, 1000);
loop();