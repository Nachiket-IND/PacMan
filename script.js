// ===== PAC-MAN GAME =====

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 24;
const rows = 20;
const cols = 21;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

// Maze layout (0 = wall, 1 = path)
const maze = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0],
  [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
  [0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

let pacman = { x: 1, y: 1, dx: 1, dy: 0 };
let ghosts = [
  { x: 10, y: 6, color: "red" },
  { x: 15, y: 10, color: "pink" }
];
let score = 0;
let running = false;

// Create dots
let dots = [];
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    if (maze[y][x] === 1) dots.push({ x, y, eaten: false });
  }
}

// Draw maze
function drawMaze() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 0) {
        ctx.fillStyle = "#0033cc";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}

// Draw Pac-Man
function drawPacman() {
  ctx.beginPath();
  ctx.arc(
    pacman.x * tileSize + tileSize / 2,
    pacman.y * tileSize + tileSize / 2,
    tileSize / 2 - 2,
    0.2 * Math.PI,
    1.8 * Math.PI
  );
  ctx.lineTo(pacman.x * tileSize + tileSize / 2, pacman.y * tileSize + tileSize / 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
}

// Draw ghosts
function drawGhosts() {
  ghosts.forEach(g => {
    ctx.beginPath();
    ctx.arc(
      g.x * tileSize + tileSize / 2,
      g.y * tileSize + tileSize / 2,
      tileSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = g.color;
    ctx.fill();
  });
}

// Draw dots
function drawDots() {
  ctx.fillStyle = "white";
  dots.forEach(dot => {
    if (!dot.eaten) {
      ctx.beginPath();
      ctx.arc(
        dot.x * tileSize + tileSize / 2,
        dot.y * tileSize + tileSize / 2,
        3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  });
}

// Move Pac-Man
function movePacman() {
  let nextX = pacman.x + pacman.dx;
  let nextY = pacman.y + pacman.dy;

  if (maze[nextY][nextX] !== 0) {
    pacman.x = nextX;
    pacman.y = nextY;
  }

  dots.forEach(dot => {
    if (!dot.eaten && dot.x === pacman.x && dot.y === pacman.y) {
      dot.eaten = true;
      score += 10;
      document.getElementById("score").textContent = score;
    }
  });
}

// Move ghosts
function moveGhosts() {
  ghosts.forEach(g => {
    const dir = Math.floor(Math.random() * 4);
    const moves = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];
    const move = moves[dir];
    const nx = g.x + move.dx;
    const ny = g.y + move.dy;
    if (maze[ny][nx] !== 0) {
      g.x = nx;
      g.y = ny;
    }

    if (g.x === pacman.x && g.y === pacman.y) {
      running = false;
      alert("💀 Game Over! Final Score: " + score);
    }
  });
}

// Game loop
function gameLoop() {
  if (!running) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawDots();
  movePacman();
  moveGhosts();
  drawPacman();
  drawGhosts();
  setTimeout(gameLoop, 250); // slower & smoother
}

// Keyboard control
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") { pacman.dx = 0; pacman.dy = -1; }
  if (e.key === "ArrowDown") { pacman.dx = 0; pacman.dy = 1; }
  if (e.key === "ArrowLeft") { pacman.dx = -1; pacman.dy = 0; }
  if (e.key === "ArrowRight") { pacman.dx = 1; pacman.dy = 0; }
});

// Start & Stop buttons
document.getElementById("startBtn").addEventListener("click", () => {
  running = true;
  gameLoop();
});
document.getElementById("stopBtn").addEventListener("click", () => {
  running = false;
});
