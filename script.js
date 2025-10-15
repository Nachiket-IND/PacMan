const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 25;
const rows = 20;
const cols = 28;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

let score = 0;
let gameRunning = false;
let lastTime = 0;
const speed = 180; // lower = faster

// 1 = wall, 0 = dot
const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
  [1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let pacman = { x: 1, y: 1, dx: 1, dy: 0 };
const ghosts = [
  { x: 13, y: 9, color: "red" },
  { x: 14, y: 9, color: "cyan" },
  { x: 13, y: 10, color: "pink" },
  { x: 14, y: 10, color: "orange" }
];

function drawMaze() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = "#1E90FF";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        ctx.beginPath();
        ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
      }
    }
  }
}

function drawPacman() {
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.arc(
    pacman.x * tileSize + tileSize / 2,
    pacman.y * tileSize + tileSize / 2,
    tileSize / 2 - 2,
    0, Math.PI * 2
  );
  ctx.fill();
}

function drawGhosts() {
  ghosts.forEach(g => {
    ctx.beginPath();
    ctx.fillStyle = g.color;
    ctx.arc(
      g.x * tileSize + tileSize / 2,
      g.y * tileSize + tileSize / 2,
      tileSize / 2 - 3,
      0, Math.PI * 2
    );
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
  });
}

function movePacman() {
  const nx = pacman.x + pacman.dx;
  const ny = pacman.y + pacman.dy;
  if (maze[ny][nx] === 0) {
    pacman.x = nx;
    pacman.y = ny;
    score++;
    document.getElementById("score").innerText = score;
  }
}

function moveGhosts() {
  ghosts.forEach(g => {
    const dir = Math.floor(Math.random() * 4);
    let dx = 0, dy = 0;
    if (dir === 0) dx = 1;
    if (dir === 1) dx = -1;
    if (dir === 2) dy = 1;
    if (dir === 3) dy = -1;
    if (maze[g.y + dy][g.x + dx] === 0) {
      g.x += dx;
      g.y += dy;
    }
  });
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") { pacman.dx = 0; pacman.dy = -1; }
  if (e.key === "ArrowDown") { pacman.dx = 0; pacman.dy = 1; }
  if (e.key === "ArrowLeft") { pacman.dx = -1; pacman.dy = 0; }
  if (e.key === "ArrowRight") { pacman.dx = 1; pacman.dy = 0; }
});

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;

  if (delta > speed) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    movePacman();
    moveGhosts();
    drawPacman();
    drawGhosts();

    ghosts.forEach(g => {
      if (g.x === pacman.x && g.y === pacman.y) {
        alert(`💀 Game Over! Final Score: ${score}`);
        resetGame();
      }
    });

    lastTime = timestamp;
  }

  if (gameRunning) requestAnimationFrame(gameLoop);
}

function resetGame() {
  pacman = { x: 1, y: 1, dx: 1, dy: 0 };
  score = 0;
  document.getElementById("score").innerText = score;
  gameRunning = false;
}

document.getElementById("startBtn").onclick = () => {
  if (!gameRunning) {
    gameRunning = true;
    requestAnimationFrame(gameLoop);
  }
};

document.getElementById("stopBtn").onclick = () => {
  gameRunning = false;
};
