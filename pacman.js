const canvas = document.getElementById('pacman');
const context = canvas.getContext('2d');

// Set canvas size explicitly
canvas.width = 600;
canvas.height = 400;

// --- Game Variables ---
const GRID_SIZE = 20; // Size of each grid cell
const PACMAN_RADIUS = 10;
const GHOST_RADIUS = 10;
const BASE_GHOST_SPEED = 3;  // Increased from 2.5
const GHOST_COLORS = ['red', 'pink', 'cyan', 'orange', 'purple'];
let level = 1;

let pacman = {
    x: GRID_SIZE,
    y: GRID_SIZE,
    radius: PACMAN_RADIUS,
    speed: 4,  // Increased from 3.5
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
    // More precise collision detection
    return maze.some(wall => {
        const leftCollision = x + PACMAN_RADIUS > wall.x;
        const rightCollision = x - PACMAN_RADIUS < wall.x + wall.width;
        const topCollision = y + PACMAN_RADIUS > wall.y;
        const bottomCollision = y - PACMAN_RADIUS < wall.y + wall.height;
        
        return leftCollision && rightCollision && topCollision && bottomCollision;
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
    const MIN_SPACING = 45; // Smaller spacing
    const PADDING = PACMAN_RADIUS * 2;

    // Define ghost spawn areas to avoid
    const ghostStartPositions = [
        { x: canvas.width - 50, y: 50 },
        { x: canvas.width - 50, y: canvas.height - 50 },
        { x: 50, y: canvas.height - 50 },
        { x: canvas.width - 100, y: canvas.height - 100 },
        { x: 100, y: canvas.height - 100 }
    ];

    // Border walls
    obstacles.push({ x: 0, y: 0, width: canvas.width, height: 10 });
    obstacles.push({ x: 0, y: 0, width: 10, height: canvas.height });
    obstacles.push({ x: 0, y: canvas.height - 10, width: canvas.width, height: 10 });
    obstacles.push({ x: canvas.width - 10, y: 0, width: 10, height: canvas.height });

    // Generate internal obstacles
    for (let i = 0; i < 30; i++) { // More obstacles
        const x = getRandomInt(40, canvas.width - 100);
        const y = getRandomInt(40, canvas.height - 100);
        const width = getRandomInt(30, 60);   // Smaller sizes
        const height = getRandomInt(30, 60);

        // Check ghost spawn areas
        const isNearGhostSpawn = ghostStartPositions.some(pos => {
            return Math.abs(x - pos.x) < 50 && Math.abs(y - pos.y) < 50;
        });

        // Check Pacman spawn area
        const isNearPacmanSpawn = Math.abs(x - GRID_SIZE) < 50 && Math.abs(y - GRID_SIZE) < 50;

        if (!isNearGhostSpawn && !isNearPacmanSpawn && !obstacles.some(obs => 
            Math.abs(x - obs.x) < MIN_SPACING && Math.abs(y - obs.y) < MIN_SPACING
        )) {
            obstacles.push({ x, y, width, height });
        }
    }

    return obstacles;
}

function generateDots() {
    const newDots = [];
    const dotSpacing = 30;
    const startX = 25;
    const startY = 25;
    const DOT_PADDING = 15; // Minimum distance from obstacles

    for (let y = startY; y < canvas.height - 25; y += dotSpacing) {
        for (let x = startX; x < canvas.width - 25; x += dotSpacing) {
            // More thorough collision check for dots
            if (!maze.some(wall => {
                return x > wall.x - DOT_PADDING && 
                       x < wall.x + wall.width + DOT_PADDING && 
                       y > wall.y - DOT_PADDING && 
                       y < wall.y + wall.height + DOT_PADDING;
            })) {
                newDots.push({ x: x, y: y, radius: 6 });
            }
        }
    }
    return newDots;
}

function findValidPosition() {
    let x, y;
    let attempts = 0;
    
    do {
        x = getRandomInt(50, canvas.width - 50);
        y = getRandomInt(50, canvas.height - 50);
        attempts++;
        
        // Simple collision check
        if (!checkCollision(x, y)) {
            return { x, y };
        }
    } while (attempts < 100);

    // Fallback to corners if no position found
    return { x: canvas.width - 50, y: canvas.height - 50 };
}

function resetGame() {
    gameOver = false;
    maze = generateMaze();
    
    // Reset pacman
    pacman.x = GRID_SIZE;
    pacman.y = GRID_SIZE;
    pacman.direction = null;
    
    // Reset ghosts with fixed positions
    const ghostCount = Math.min(2 + level - 1, 5);
    ghosts = [];
    
    // Place ghosts in different corners
    const positions = [
        { x: canvas.width - 50, y: 50 },              // top right
        { x: canvas.width - 50, y: canvas.height - 50 }, // bottom right
        { x: 50, y: canvas.height - 50 },             // bottom left
        { x: canvas.width - 100, y: canvas.height - 100 }, // near bottom right
        { x: 100, y: canvas.height - 100 }           // near bottom left
    ];
    
    for (let i = 0; i < ghostCount; i++) {
        ghosts.push({
            x: positions[i].x,
            y: positions[i].y,
            radius: GHOST_RADIUS,
            speed: 3,  // Match new BASE_GHOST_SPEED
            direction: ['left', 'right', 'up', 'down'][i % 4],
            color: GHOST_COLORS[i]
        });
    }
    
    dots = generateDots();
}

// --- Drawing Functions ---
function drawPacman() {
    context.save();
    context.translate(pacman.x, pacman.y);
    
    // Set rotation based on direction
    let rotation = 0;
    switch (pacman.direction) {
        case 'up': rotation = -Math.PI/2; break;
        case 'down': rotation = Math.PI/2; break;
        case 'left': rotation = Math.PI; break;
        case 'right': rotation = 0; break;
        default: rotation = 0; // Default facing right
    }
    context.rotate(rotation);
    
    // Draw Pac-Man with mouth
    context.beginPath();
    const mouthAngle = 0.2 * Math.PI;
    context.arc(0, 0, pacman.radius, mouthAngle, 2 * Math.PI - mouthAngle);
    context.lineTo(0, 0);
    context.fillStyle = 'yellow';
    context.fill();
    context.closePath();
    
    context.restore();
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

    // Calculate next position
    switch (pacman.direction) {
        case 'right': nextX = pacman.x + pacman.speed; break;
        case 'left': nextX = pacman.x - pacman.speed; break;
        case 'up': nextY = pacman.y - pacman.speed; break;
        case 'down': nextY = pacman.y + pacman.speed; break;
    }

    // Only move if there's no collision
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
            
            // Check for level complete
            if (dots.length === 0) {
                level++;
                alert(`Level ${level-1} Complete! Get ready for level ${level}`);
                resetGame();
                requestAnimationFrame(update);  // Immediately restart the game loop
                return;
            }
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

    // Draw everything in the correct order (dots before ghosts)
    drawMaze();
    drawDots();    // Draw dots first
    ghosts.forEach(ghost => drawGhost(ghost));  // Then draw ghosts on top
    drawPacman();  // Pac-Man stays on top

    requestAnimationFrame(update);
}

// --- Event Listeners ---
document.addEventListener('keydown', (event) => {
    // Prevent scrolling for arrow keys and space
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
        event.preventDefault();
    }

    if (event.code === 'Space') {
        location.reload();
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