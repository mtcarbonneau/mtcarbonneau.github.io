const canvas = document.getElementById('pacman');
const context = canvas.getContext('2d');

// Game variables
let pacman = {
    x: 50,
    y: 50,
    radius: 15,
    speed: 5,
    direction: 'right'
};

let ghosts = [
    { x: 100, y: 100, radius: 15, speed: 3, direction: 'left', color: 'red' },
    { x: 200, y: 200, radius: 15, speed: 3, direction: 'up', color: 'pink' }
];

let maze = [
    { x: 50, y: 50, width: 500, height: 10 },
    { x: 50, y: 50, width: 10, height: 300 },
    { x: 50, y: 340, width: 500, height: 10 },
    { x: 540, y: 50, width: 10, height: 300 },
    // Add more maze walls here
];

let gameOver = false;

function drawPacman() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(pacman.x, pacman.y, pacman.radius, 0.2 * Math.PI, 1.8 * Math.PI);
    context.lineTo(pacman.x, pacman.y);
    context.fillStyle = 'yellow';
    context.fill();
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        context.beginPath();
        context.arc(ghost.x, ghost.y, ghost.radius, 0, 2 * Math.PI);
        context.fillStyle = ghost.color;
        context.fill();
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
    });
}

function drawMaze() {
    maze.forEach(wall => {
        context.fillStyle = 'blue';
        context.fillRect(wall.x, wall.y, wall.width, wall.height);
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function movePacman() {
    let nextX = pacman.x;
    let nextY = pacman.y;

    switch (pacman.direction) {
        case 'right':
            nextX += pacman.speed;
            break;
        case 'left':
            nextX -= pacman.speed;
            break;
        case 'up':
            nextY -= pacman.speed;
            break;
        case 'down':
            nextY += pacman.speed;
            break;
    }

    if (!isCollidingWithMaze(nextX, nextY) && !isOutOfBounds(nextX, nextY)) {
        pacman.x = nextX;
        pacman.y = nextY;
    }
}

function isCollidingWithMaze(x, y) {
    return maze.some(wall => {
        return x + pacman.radius > wall.x &&
               x - pacman.radius < wall.x + wall.width &&
               y + pacman.radius > wall.y &&
               y - pacman.radius < wall.y + wall.height;
    });
}

function isOutOfBounds(x, y) {
    return x - pacman.radius < 0 || x + pacman.radius > canvas.width ||
           y - pacman.radius < 0 || y + pacman.radius > canvas.height;
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        switch (ghost.direction) {
            case 'right':
                ghost.x += ghost.speed;
                if (ghost.x + ghost.radius > canvas.width || isCollidingWithMaze(ghost.x + ghost.speed, ghost.y)) ghost.direction = 'left';
                break;
            case 'left':
                ghost.x -= ghost.speed;
                if (ghost.x - ghost.radius < 0 || isCollidingWithMaze(ghost.x - ghost.speed, ghost.y)) ghost.direction = 'right';
                break;
            case 'up':
                ghost.y -= ghost.speed;
                if (ghost.y - ghost.radius < 0 || isCollidingWithMaze(ghost.x, ghost.y - ghost.speed)) ghost.direction = 'down';
                break;
            case 'down':
                ghost.y += ghost.speed;
                if (ghost.y + ghost.radius > canvas.height || isCollidingWithMaze(ghost.x, ghost.y + ghost.speed)) ghost.direction = 'up';
                break;
        }
    });
}

function checkCollisionWithGhosts() {
    return ghosts.some(ghost => {
        const dx = pacman.x - ghost.x;
        const dy = pacman.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < pacman.radius + ghost.radius;
    });
}

function updateGame() {
    if (!gameOver) {
        movePacman();
        moveGhosts();
        drawMaze();
        drawPacman();
        drawGhosts();
        if (checkCollisionWithGhosts()) {
            gameOver = true;
            alert('Game Over!');
        } else {
            requestAnimationFrame(updateGame);
        }
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            pacman.direction = 'right';
            break;
        case 'ArrowLeft':
            pacman.direction = 'left';
            break;
        case 'ArrowUp':
            pacman.direction = 'up';
            break;
        case 'ArrowDown':
            pacman.direction = 'down';
            break;
    }
});

updateGame();
