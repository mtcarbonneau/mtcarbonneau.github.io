const canvas = document.getElementById('pacman');
const context = canvas.getContext('2d');

// Set canvas size explicitly
canvas.width = 600;
canvas.height = 400;

// --- Game Variables ---
const GRID_SIZE = 20; // Size of each grid cell
const PACMAN_RADIUS = 10;
const GHOST_RADIUS = 10;

let pacman = {
    x: GRID_SIZE,
    y: GRID_SIZE,
    radius: PACMAN_RADIUS,
    speed: 3,
    direction: null // 'up', 'down', 'left', 'right'
};

let ghosts = [
    { x: 200, y: 200, radius: GHOST_RADIUS, speed: 1.5, direction: 'left', color: 'red' },
    { x: 400, y: 300, radius: GHOST_RADIUS, speed: 1.5, direction: 'up', color: 'pink' }
];

let maze = [];
let dots = [];
let gameOver = false;

// --- Helper Functions ---
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkCollision(x, y) {
    return maze.some(wall => {
        return x + PACMAN_RADIUS > wall.x &&
               x - PACMAN_RADIUS < wall.x + wall.width &&
               y + PACMAN_RADIUS > wall.y &&
               y - PACMAN_RADIUS < wall.y + wall.height;
    });
}

function checkGhostCollision() {
    return ghosts.some(ghost => {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        return Math.sqrt(dx * dx + dy * dy) < pacman.radius + ghost.radius;
    });
}

// --- Game Initialization ---
function generateMaze() {
    const obstacles = [];

    // Border walls
    obstacles.push({ x: 0, y: 0, width: canvas.width, height: 10 });
    obstacles.push({ x: 0, y: 0, width: 10, height: canvas.height });
    obstacles.push({ x: 0, y: canvas.height - 10, width: canvas.width, height: 10 });
    obstacles.push({ x: canvas.width - 10, y: 0, width: 10, height: canvas.height });

    // Random internal obstacles
    for (let i = 0; i < 8; i++) {
        const x = getRandomInt(50, canvas.width - 150);
        const y = getRandomInt(50, canvas.height - 150);
        const width = getRandomInt(50, 100);
        const height = getRandomInt(50, 100);
        obstacles.push({ x: x, y: y, width: width, height: height });
    }

    return obstacles;
}

function generateDots() {
    const newDots = [];
    const dotSpacing = 30;
    const startX = 25;
    const startY = 25;

    for (let y = startY; y < canvas.height - 25; y += dotSpacing) {
        for (let x = startX; x < canvas.width - 25; x += dotSpacing) {
            if (!checkCollision(x, y)) {
                newDots.push({ x: x, y: y, radius: 3 });
            }
        }
    }
    return newDots;
}

function resetGame() {
    gameOver = false;
    maze = generateMaze();
    pacman.x = GRID_SIZE;
    pacman.y = GRID_SIZE;
    pacman.direction = null;
    ghosts = [
        { x: 100, y: 100, radius: GHOST_RADIUS, speed: 1.5, direction: 'left', color: 'red' },
        { x: 500, y: 300, radius: GHOST_RADIUS, speed: 1.5, direction: 'up', color: 'pink' }
    ];
    dots = generateDots();
}

// --- Drawing Functions ---
function drawPacman() {
    context.beginPath();
    const mouthAngle = 0.2 * Math.PI;
    context.arc(pacman.x, pacman.y, pacman.radius, mouthAngle, 2 * Math.PI - mouthAngle);
    context.lineTo(pacman.x, pacman.y);
    context.fillStyle = 'yellow';
    context.fill();
    context.closePath();
}

function drawGhost(ghost) {
    context.beginPath();
    context.arc(ghost.x, ghost.y, ghost.radius, Math.PI, 0);
    context.lineTo(ghost.x + ghost.radius, ghost.y + ghost.radius);
    context.lineTo(ghost.x - ghost.radius, ghost.y + ghost.radius);
    context.fillStyle = ghost.color;
    context.fill();
    context.closePath();

    // Eyes
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(ghost.x - 5, ghost.y - 3, 4, 0, 2 * Math.PI);
    context.arc(ghost.x + 5, ghost.y - 3, 4, 0, 2 * Math.PI);
    context.fill();
}

function drawMaze() {
    context.fillStyle = 'blue';
    maze.forEach(wall => {
        context.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function drawDots() {
    context.fillStyle = 'pink';
    dots.forEach(dot => {
        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    });
}

// --- Movement Functions ---
function movePacman() {
    if (!pacman.direction) return;

    let nextX = pacman.x;
    let nextY = pacman.y;

    switch (pacman.direction) {
        case 'right': nextX += pacman.speed; break;
        case 'left': nextX -= pacman.speed; break;
        case 'up': nextY -= pacman.speed; break;
        case 'down': nextY += pacman.speed; break;
    }

    if (!checkCollision(nextX, nextY)) {
        pacman.x = nextX;
        pacman.y = nextY;
    }
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        let nextX = ghost.x;
        let nextY = ghost.y;

        switch (ghost.direction) {
            case 'right': nextX += ghost.speed; break;
            case 'left': nextX -= ghost.speed; break;
            case 'up': nextY -= ghost.speed; break;
            case 'down': nextY += ghost.speed; break;
        }

        if (checkCollision(nextX, nextY)) {
            const directions = ['right', 'left', 'up', 'down'];
            ghost.direction = directions[Math.floor(Math.random() * directions.length)];
        } else {
            ghost.x = nextX;
            ghost.y = nextY;
        }
    });
}

// --- Main Game Loop ---
function update() {
    if (gameOver) return;

    movePacman();
    moveGhosts();

    // Dot collision
    for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        const dx = pacman.x - dot.x;
        const dy = pacman.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < pacman.radius + dot.radius) {
            dots.splice(i, 1);
        }
    }

    // Ghost collision
    if (checkGhostCollision()) {
        gameOver = true;
        alert('Game Over! Press Space to play again');
        return;
    }

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw everything
    drawMaze();
    drawPacman();
    ghosts.forEach(ghost => drawGhost(ghost));
    drawDots();

    requestAnimationFrame(update);
}

// --- Event Listeners ---
document.addEventListener('keydown', (event) => {
    if (gameOver && event.code === 'Space') {
        resetGame();
        update();
        return;
    }

    if (gameOver) return;

    switch (event.code) {
        case 'ArrowRight': pacman.direction = 'right'; break;
        case 'ArrowLeft': pacman.direction = 'left'; break;
        case 'ArrowUp': pacman.direction = 'up'; break;
        case 'ArrowDown': pacman.direction = 'down'; break;
    }
});

// --- Initialize Game ---
resetGame();
update();
