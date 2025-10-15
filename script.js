// ====== Pac-Man Game Script ======

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 560; // 28x20px cells
canvas.height = 620;

const cellSize = 20;
let gameStarted = false;

// Maze layout: 0 = empty, 1 = wall, 2 = pellet
const maze = [
  // Simplified small example: 28x31 array (fill as needed)
  // 0 = path, 1 = wall, 2 = pellet
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,1,0,0,0,0,0,0,0,0,1,2,1,1,2,1,0,0,0,0,0,0,0,0,1,2,1],
  [1,2,1,0,1,1,1,1,1,1,0,1,2,1,1,2,1,0,1,1,1,1,1,1,0,1,2,1],
  [1,2,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,2,1],
  [1,2,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,0,2,1],
  [1,2,1,0,0,0,1,1,0,0,0,2,2,2,2,0,0,1,0,1,1,0,0,0,1,0,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Pac-Man
let pacman = {
  x: 1,
  y: 1,
  dir: { x: 0, y: 0 },
  nextDir: { x: 0, y: 0 },
};

// Ghosts
let ghosts = [
  { x: 13, y: 5, color: "red", dir: {x:0,y:1} },
  { x: 14, y: 5, color: "pink", dir: {x:0,y:-1} },
];

// Score
let score = 0;

// ====== Functions ======
function drawMaze() {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(col*cellSize, row*cellSize, cellSize, cellSize);
      } else if (maze[row][col] === 2) {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(col*cellSize+cellSize/2, row*cellSize+cellSize/2, 3, 0, Math.PI*2);
        ctx.fill();
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(col*cellSize, row*cellSize, cellSize, cellSize);
      }
    }
  }
}

function drawPacman() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(
    pacman.x*cellSize + cellSize/2,
    pacman.y*cellSize + cellSize/2,
    cellSize/2 - 2,
    0,
    Math.PI*2
  );
  ctx.fill();
}

function drawGhosts() {
  ghosts.forEach(g => {
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(
      g.x*cellSize + cellSize/2,
      g.y*cellSize + cellSize/2,
      cellSize/2 - 2,
      0,
      Math.PI*2
    );
    ctx.fill();
  });
}

function movePacman() {
  let nextX = pacman.x + pacman.nextDir.x;
  let nextY = pacman.y + pacman.nextDir.y;
  if (maze[nextY] && maze[nextY][nextX] !== 1) {
    pacman.dir = { ...pacman.nextDir };
  }
  let newX = pacman.x + pacman.dir.x;
  let newY = pacman.y + pacman.dir.y;
  if (maze[newY] && maze[newY][newX] !== 1) {
    pacman.x = newX;
    pacman.y = newY;
  }

  // Eat pellet
  if (maze[pacman.y][pacman.x] === 2) {
    maze[pacman.y][pacman.x] = 0;
    score += 10;
  }
}

function moveGhosts() {
  ghosts.forEach(g => {
    // Simple random move
    let dirs = [
      {x:0,y:-1}, {x:0,y:1}, {x:-1,y:0}, {x:1,y:0}
    ];
    let valid = dirs.filter(d => maze[g.y+d.y] && maze[g.y+d.y][g.x+d.x] !== 1);
    g.dir = valid[Math.floor(Math.random()*valid.length)];
    g.x += g.dir.x;
    g.y += g.dir.y;
  });
}

function checkCollision() {
  for (let g of ghosts) {
    if (g.x === pacman.x && g.y === pacman.y) {
      gameStarted = false;
      alert("Game Over! Score: " + score);
    }
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

function gameLoop() {
  if (!gameStarted) return;
  movePacman();
  moveGhosts();
  checkCollision();
  drawMaze();
  drawPacman();
  drawGhosts();
  drawScore();
  requestAnimationFrame(gameLoop);
}

// ====== Controls ======
document.addEventListener("keydown", e => {
  if (!gameStarted) return;
  switch(e.key) {
    case "ArrowUp": pacman.nextDir = {x:0,y:-1}; break;
    case "ArrowDown": pacman.nextDir = {x:0,y:1}; break;
    case "ArrowLeft": pacman.nextDir = {x:-1,y:0}; break;
    case "ArrowRight": pacman.nextDir = {x:1,y:0}; break;
  }
});

// ====== Start Button ======
document.getElementById("startBtn").addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    pacman = { x:1, y:1, dir:{x:0,y:0}, nextDir:{x:0,y:0} };
    ghosts = [
      { x: 13, y: 5, color: "red", dir: {x:0,y:1} },
      { x: 14, y: 5, color: "pink", dir: {x:0,y:-1} },
    ];
    score = 0;
    gameLoop();
  }
});
