// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tile size
const tileSize = 30;

// Maze layout: 0 = empty, 1 = wall, 2 = dot
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,1,2,2,1],
    [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Pac-Man
let pacman = { x: 1, y: 1, dx: 0, dy: 0 };

// Ghosts
let ghosts = [
    { x: 18, y: 1, color: 'red', dx: 0, dy: 0 },
    { x: 18, y: 3, color: 'pink', dx: 0, dy: 0 }
];

// Score
let score = 0;

// Handle keyboard input
document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp') { pacman.dx = 0; pacman.dy = -1; }
    if(e.key === 'ArrowDown') { pacman.dx = 0; pacman.dy = 1; }
    if(e.key === 'ArrowLeft') { pacman.dx = -1; pacman.dy = 0; }
    if(e.key === 'ArrowRight') { pacman.dx = 1; pacman.dy = 0; }
});

// Move Pac-Man
function movePacman() {
    let newX = pacman.x + pacman.dx;
    let newY = pacman.y + pacman.dy;
    if(maze[newY][newX] !== 1) {
        pacman.x = newX;
        pacman.y = newY;
    }
    if(maze[pacman.y][pacman.x] === 2) {
        maze[pacman.y][pacman.x] = 0;
        score += 10;
    }
}

// Move ghosts randomly
function moveGhosts() {
    ghosts.forEach(ghost => {
        if(Math.random() < 0.1) {
            let directions = [
                {dx:0, dy:-1},
                {dx:0, dy:1},
                {dx:-1, dy:0},
                {dx:1, dy:0}
            ];
            let dir = directions[Math.floor(Math.random()*directions.length)];
            ghost.dx = dir.dx;
            ghost.dy = dir.dy;
        }
        let newX = ghost.x + ghost.dx;
        let newY = ghost.y + ghost.dy;
        if(maze[newY][newX] !== 1) {
            ghost.x = newX;
            ghost.y = newY;
        } else {
            ghost.dx = 0;
            ghost.dy = 0;
        }
    });
}

// Draw maze
function drawMaze() {
    for(let y=0; y<maze.length; y++) {
        for(let x=0; x<maze[y].length; x++) {
            if(maze[y][x] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
            } else if(maze[y][x] === 2) {
                ctx.fillStyle = 'yellow';
                ctx.beginPath();
                ctx.arc(x*tileSize + tileSize/2, y*tileSize + tileSize/2, 5, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }
}

// Draw Pac-Man
function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x*tileSize + tileSize/2, pacman.y*tileSize + tileSize/2, tileSize/2-2, 0, Math.PI*2);
    ctx.fill();
}

// Draw ghosts
function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x*tileSize + tileSize/2, ghost.y*tileSize + tileSize/2, tileSize/2-2, 0, Math.PI*2);
        ctx.fill();
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawMaze();
    movePacman();
    moveGhosts();
    drawPacman();
    drawGhosts();

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, canvas.height - 10);

    // Check collision with ghosts
    ghosts.forEach(ghost => {
        if(ghost.x === pacman.x && ghost.y === pacman.y) {
            alert('Game Over! Your score: ' + score);
            pacman.x = 1; pacman.y = 1;
            score = 0;
            // Reset dots
            for(let y=0;y<maze.length;y++){
                for(let x=0;x<maze[y].length;x++){
                    if(maze[y][x]===0 && !(y===1 && x===1)) maze[y][x]=2;
                }
            }
        }
    });

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
