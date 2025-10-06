const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');

// Game variables
let playerX = canvas.width / 2 - 15;
let roadWidth = 200;
let roadX = (canvas.width - roadWidth) / 2;
let score = 0;
let gameSpeed = 5;
let obstacles = [];
let gameRunning = false;
let animationId;

// Player car
const player = {
    width: 30,
    height: 50,
    speed: 7
};

// Draw road
function drawRoad() {
    ctx.fillStyle = '#333';
    ctx.fillRect(roadX, 0, roadWidth, canvas.height);
    
    // Road markings
    ctx.fillStyle = '#fff';
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.fillRect(canvas.width / 2 - 2, y, 4, 20);
    }
}

// Draw player car
function drawPlayer() {
    ctx.fillStyle = '#f00';
    ctx.fillRect(playerX, canvas.height - 80, player.width, player.height);
}

// Create obstacles
function createObstacle() {
    const width = Math.random() * 50 + 30;
    const x = roadX + Math.random() * (roadWidth - width);
    
    obstacles.push({
        x: x,
        y: -50,
        width: width,
        height: 30,
        speed: gameSpeed
    });
}

// Draw obstacles
function drawObstacles() {
    ctx.fillStyle = '#00f';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Move obstacles
function moveObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacle.speed;
    });
    
    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
}

// Check collisions
function checkCollision() {
    for (const obstacle of obstacles) {
        if (
            playerX < obstacle.x + obstacle.width &&
            playerX + player.width > obstacle.x &&
            canvas.height - 80 < obstacle.y + obstacle.height &&
            canvas.height - 80 + player.height > obstacle.y
        ) {
            return true;
        }
    }
    return false;
}

// Update score
function updateScore() {
    score++;
    scoreDisplay.textContent = score;
    
    // Increase difficulty
    if (score % 50 === 0) {
        gameSpeed += 0.5;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawRoad();
    drawPlayer();
    drawObstacles();
    moveObstacles();
    
    if (checkCollision()) {
        endGame();
        return;
    }
    
    animationId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    score = 0;
    gameSpeed = 5;
    obstacles = [];
    scoreDisplay.textContent = score;
    startBtn.textContent = "Restart Game";
    
    // Create obstacles periodically
    setInterval(() => {
        if (gameRunning) createObstacle();
    }, 1500);
    
    gameLoop();
}

// End game
function endGame() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#f00';
    ctx.font = '30px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px "Courier New"';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

// Event listeners
startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    if (e.key === 'ArrowLeft' && playerX > roadX) {
        playerX -= player.speed;
    } else if (e.key === 'ArrowRight' && playerX + player.width < roadX + roadWidth) {
        playerX += player.speed;
    }
});
