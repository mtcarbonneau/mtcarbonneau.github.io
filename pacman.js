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

function drawPacman() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(pacman.x, pacman.y, pacman.radius, 0.2 * Math.PI, 1.8 * Math.PI);
    context.lineTo(pacman.x, pacman.y);
    context.fillStyle = 'yellow';
    context.fill();
    context.closePath();
}

function movePacman() {
    switch (pacman.direction) {
        case 'right':
            pacman.x += pacman.speed;
            if (pacman.x + pacman.radius > canvas.width) pacman.x = pacman.radius;
            break;
        case 'left':
            pacman.x -= pacman.speed;
            if (pacman.x - pacman.radius < 0) pacman.x = canvas.width - pacman.radius;
            break;
        case 'up':
            pacman.y -= pacman.speed;
            if (pacman.y - pacman.radius < 0) pacman.y = canvas.height - pacman.radius;
            break;
        case 'down':
            pacman.y += pacman.speed;
            if (pacman.y + pacman.radius > canvas.height) pacman.y = pacman.radius;
            break;
    }
}

function updateGame() {
    movePacman();
    drawPacman();
    requestAnimationFrame(updateGame);
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
