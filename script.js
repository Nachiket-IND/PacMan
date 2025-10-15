// === PACMAN GAME === //

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.width = 700;
canvas.height = 500;
document.body.style.textAlign = "center";
document.body.style.background = "black";

// --- Game state ---
let gameRunning = false;
let score = 0;
let pacmanSpeed = 2;
let ghostSpeed = 1.5;

// --- Maze layout (1 = wall, 0 = dot, 2 = empty path) ---
const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const tileSize = 35;
const rows = maze.length;
const cols = maze[0].length;

// --- PacMan object ---
const pacman = {
  x: tileSize + tileSize / 2,
  y: tileSize + tileSize / 2,
  radius: tileSize / 2 - 4,
  dx: 0,
  dy: 0,
  color: "yellow"
};

// --- Ghosts ---
const ghosts = [
  {x: 10*tileSize + 15, y: 1.5*tileSize, color: "red"},
  {x: 11*tileSize + 15, y: 5.5*tileSize, color: "pink"},
  {x: 3*tileSize + 15, y: 5.5*tileSize, color: "cyan"},
  {x: 7*tileSize + 15, y: 3.5*tileSize, color: "orange"}
];

// --- Draw Maze ---
function drawMaze() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (maze[r][c] === 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
        if (maze[r][c] === 0) {
          ctx.beginPath();
          ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 4, 0, 2*Math.PI);
          ctx.fillStyle = "yellow";
          ctx.fill();
        }
      }
    }
  }
}

// --- Draw PacMan ---
function drawPacMan() {
  ctx.beginPath();
  ctx.arc(pacman.x, pacman.y, pacman.radius, 0.25*Math.PI, 1.75*Math.PI, false);
  ctx.lineTo(pacman.x, pacman.y);
  ctx.fillStyle = pacman.color;
  ctx.fill();
}

// --- Draw Ghosts ---
function drawGhosts() {
  ghosts.forEach(g => {
    ctx.beginPath();
    ctx.arc(g.x, g.y, pacman.radius - 2, Math.PI, 0);
    ctx.lineTo(g.x + pacman.radius - 2, g.y + pacman.radius - 2);
    ctx.lineTo(g.x - pacman.radius + 2, g.y + pacman.radius - 2);
    ctx.closePath();
    ctx.fillStyle = g.color;
    ctx.fill();
  });
}

// --- Movement logic ---
function movePacMan() {
  const newX = pacman.x + pacman.dx;
  const newY = pacman.y + pacman.dy;

  if (!collidesWithWall(newX, newY)) {
    pacman.x = newX;
    pacman.y = newY;

    const row = Math.floor(pacman.y / tileSize);
    const col = Math.floor(pacman.x / tileSize);

    if (maze[row] && maze[row][col] === 0) {
      maze[row][col] = 2;
      score += 10;
      document.getElementById("score").innerText = score;
    }
  }
}

function collidesWithWall(x, y) {
  const row = Math.floor(y / tileSize);
  const col = Math.floor(x / tileSize);
  return maze[row] && maze[row][col] === 1;
}

// --- Ghost AI (simple random) ---
function moveGhosts() {
  ghosts.forEach(g => {
    const dir = Math.floor(Math.random() * 4);
    const move = [
      {dx: 0, dy: -ghostSpeed},
      {dx: 0, dy: ghostSpeed},
      {dx: -ghostSpeed, dy: 0},
      {dx: ghostSpeed, dy: 0}
    ][dir];
    const newX = g.x + move.dx;
    const newY = g.y + move.dy;
    if (!collidesWithWall(newX, newY)) {
      g.x = newX;
      g.y = newY;
    }
    // Collision check
    const dist = Math.hypot(g.x - pacman.x, g.y - pacman.y);
    if (dist < pacman.radius) {
      gameRunning = false;
      alert("👻 Game Over! Final Score: " + score);
    }
  });
}

// --- Key Controls ---
document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp": pacman.dx = 0; pacman.dy = -pacmanSpeed; break;
    case "ArrowDown": pacman.dx = 0; pacman.dy = pacmanSpeed; break;
    case "ArrowLeft": pacman.dx = -pacmanSpeed; pacman.dy = 0; break;
    case "ArrowRight": pacman.dx = pacmanSpeed; pacman.dy = 0; break;
  }
});

// --- Game Loop ---
function gameLoop() {
  if (gameRunning) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    movePacMan();
    moveGhosts();
    drawPacMan();
    drawGhosts();
  }
  requestAnimationFrame(gameLoop);
}

// --- Buttons & Score ---
const controlPanel = document.createElement("div");
controlPanel.innerHTML = `
  <button id="startBtn" style="background:yellow;padding:10px 20px;margin:10px;">Start</button>
  <button id="stopBtn" style="background:orange;padding:10px 20px;margin:10px;">Stop</button>
  <h2 style="color:white;">Score: <span id="score">0</span></h2>
`;
document.body.prepend(controlPanel);

document.getElementById("startBtn").onclick = () => { 
  if (!gameRunning) {
    gameRunning = true; 
    gameLoop(); 
  }
};
document.getElementById("stopBtn").onclick = () => { gameRunning = false; };

// --- Initial draw ---
drawMaze();
drawPacMan();
drawGhosts();
