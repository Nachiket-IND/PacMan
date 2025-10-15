// ====== Full Pac-Man Game with Power Pellets ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 28*20;
canvas.height = 31*20;
const cellSize = 20;

let gameStarted = false;
let animationId = null;

// ===== Maze Layout =====
// 0 = path, 1 = wall, 2 = pellet, 3 = power-pellet
const maze = [
  // simplified maze with some power pellets at corners
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,3,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,1,0,0,0,0,0,0,0,0,1,2,1,1,2,1,0,0,0,0,0,0,0,0,1,2,1],
  [1,2,1,0,1,1,1,1,1,1,0,1,2,1,1,2,1,0,1,1,1,1,1,1,0,1,2,1],
  [1,2,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,2,1],
  [1,2,1,0,1,0,1,1,0,1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,0,2,1],
  [1,2,1,0,0,0,1,1,0,0,0,2,2,2,2,0,0,1,0,1,1,0,0,0,1,0,2,1],
  [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Pac-Man
let pacman = { x:1, y:1, dir:{x:0,y:0}, nextDir:{x:0,y:0} };

// Ghosts
let ghosts = [
  { x:13, y:5, color:"red", dir:{x:0,y:1}, frightened:false },
  { x:14, y:5, color:"pink", dir:{x:0,y:-1}, frightened:false },
  { x:13, y:6, color:"cyan", dir:{x:1,y:0}, frightened:false },
  { x:14, y:6, color:"orange", dir:{x:-1,y:0}, frightened:false }
];

// Score
let score = 0;
const scoreDisplay = document.getElementById("score");

// Pac-Man mouth animation
let pacmanMouth = 0;
let mouthOpening = true;

// ===== Functions =====
function drawMaze() {
  for(let row=0; row<maze.length; row++){
    for(let col=0; col<maze[row].length; col++){
      if(maze[row][col]===1){
        ctx.fillStyle="blue";
        ctx.fillRect(col*cellSize,row*cellSize,cellSize,cellSize);
      } else if(maze[row][col]===2){
        ctx.fillStyle="yellow";
        ctx.beginPath();
        ctx.arc(col*cellSize+cellSize/2,row*cellSize+cellSize/2,3,0,Math.PI*2);
        ctx.fill();
      } else if(maze[row][col]===3){
        ctx.fillStyle="white";
        ctx.beginPath();
        ctx.arc(col*cellSize+cellSize/2,row*cellSize+cellSize/2,6,0,Math.PI*2);
        ctx.fill();
      } else {
        ctx.fillStyle="black";
        ctx.fillRect(col*cellSize,row*cellSize,cellSize,cellSize);
      }
    }
  }
}

function animatePacmanMouth() {
  if(mouthOpening) pacmanMouth += 0.05;
  else pacmanMouth -= 0.05;
  if(pacmanMouth >=1) mouthOpening=false;
  if(pacmanMouth <=0) mouthOpening=true;
}

function drawPacman() {
  ctx.fillStyle = "yellow";
  let angle = 0;
  if(pacman.dir.x === 1) angle=0;
  else if(pacman.dir.x===-1) angle=Math.PI;
  else if(pacman.dir.y===-1) angle=-Math.PI/2;
  else if(pacman.dir.y===1) angle=Math.PI/2;

  const startAngle = angle + 0.25*Math.PI*pacmanMouth;
  const endAngle = angle + 2*Math.PI - 0.25*Math.PI*pacmanMouth;

  ctx.beginPath();
  ctx.moveTo(pacman.x*cellSize+cellSize/2, pacman.y*cellSize+cellSize/2);
  ctx.arc(pacman.x*cellSize+cellSize/2, pacman.y*cellSize+cellSize/2, cellSize/2-2, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
}

// Ghost Eyes
function drawGhostEyes(g) {
  const eyeRadius = 3;
  const dx = pacman.x - g.x;
  const dy = pacman.y - g.y;
  const angle = Math.atan2(dy, dx);

  const leftEyeX = g.x*cellSize + cellSize/3 + Math.cos(angle)*2;
  const leftEyeY = g.y*cellSize + cellSize/3 + Math.sin(angle)*2;
  const rightEyeX = g.x*cellSize + 2*cellSize/3 + Math.cos(angle)*2;
  const rightEyeY = g.y*cellSize + cellSize/3 + Math.sin(angle)*2;

  ctx.fillStyle="white";
  ctx.beginPath();
  ctx.arc(leftEyeX,leftEyeY,eyeRadius,0,Math.PI*2);
  ctx.arc(rightEyeX,rightEyeY,eyeRadius,0,Math.PI*2);
  ctx.fill();

  ctx.fillStyle="black";
  const pupilRadius = 1.5;
  const pupilOffset = 1.5;
  ctx.beginPath();
  ctx.arc(leftEyeX + Math.cos(angle)*pupilOffset, leftEyeY + Math.sin(angle)*pupilOffset, pupilRadius,0,Math.PI*2);
  ctx.arc(rightEyeX + Math.cos(angle)*pupilOffset, rightEyeY + Math.sin(angle)*pupilOffset, pupilRadius,0,Math.PI*2);
  ctx.fill();
}

// Draw Ghosts
function drawGhosts() {
  ghosts.forEach(g=>{
    const x=g.x*cellSize;
    const y=g.y*cellSize;
    const r = cellSize/2-2;

    ctx.fillStyle = g.frightened ? "blue" : g.color;
    ctx.beginPath();
    ctx.arc(x+r, y+r, r, Math.PI, 0, false);

    const waveCount = 4;
    const waveWidth = cellSize / waveCount;
    for(let i=0;i<waveCount;i++){
      ctx.quadraticCurveTo(
        x + i*waveWidth + waveWidth/2,
        y + cellSize + ((i%2===0)?-r/2:r/2),
        x + (i+1)*waveWidth,
        y + cellSize
      );
    }
    ctx.closePath();
    ctx.fill();

    drawGhostEyes(g);
  });
}

// Move Pac-Man
function movePacman(){
  let nextX = pacman.x + pacman.nextDir.x;
  let nextY = pacman.y + pacman.nextDir.y;
  if(maze[nextY] && maze[nextY][nextX]!==1) pacman.dir={...pacman.nextDir};

  let newX = pacman.x + pacman.dir.x;
  let newY = pacman.y + pacman.dir.y;
  if(maze[newY] && maze[newY][newX]!==1){
    pacman.x=newX;
    pacman.y=newY;
  }

  // Pellets
  if(maze[pacman.y][pacman.x]===2){
    maze[pacman.y][pacman.x]=0;
    score+=10;
  } else if(maze[pacman.y][pacman.x]===3){
    maze[pacman.y][pacman.x]=0;
    score+=50;
    ghosts.forEach(g=>g.frightened=true);
    setTimeout(()=>ghosts.forEach(g=>g.frightened=false),8000);
  }

  scoreDisplay.textContent=score;
}

// Move Ghosts
function moveGhosts(){
  ghosts.forEach(g=>{
    const dirs=[{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];
    const valid = dirs.filter(d=>{
      return maze[g.y+d.y] && maze[g.y+d.y][g.x+d.x]!==1;
    });
    if(valid.length>0){
      g.dir = valid[Math.floor(Math.random()*valid.length)];
      g.x+=g.dir.x;
      g.y+=g.dir.y;
    }
  });
}

// Check collision
function checkCollision(){
  ghosts.forEach(g=>{
    if(g.x===pacman.x && g.y===pacman.y){
      if(g.frightened){
        g.x=13; g.y=5; g.frightened=false;
        score+=200;
      } else {
        stopGame();
        alert("Game Over! Score: "+score);
      }
    }
  });
}

// Game Loop
function gameLoop(){
  if(!gameStarted) return;
  movePacman();
  moveGhosts();
  checkCollision();
  drawMaze();
  animatePacmanMouth();
  drawPacman();
  drawGhosts();
  animationId=requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener("keydown", e=>{
  if(!gameStarted) return;
  switch(e.key){
    case "ArrowUp": pacman.nextDir={x:0,y:-1}; break;
    case "ArrowDown": pacman.nextDir={x:0,y:1}; break;
    case "ArrowLeft": pacman.nextDir={x:-1,y:0}; break;
    case "ArrowRight": pacman.nextDir={x:1,y:0}; break;
  }
});

// Start/Stop Buttons
document.getElementById("startBtn").addEventListener("click", ()=>{
  if(!gameStarted){
    gameStarted=true;
    pacman={x:1,y:1,dir:{x:0,y:0},nextDir:{x:0,y:0}};
    ghosts=[
      {x:13,y:5,color:"red",dir:{x:0,y:1},frightened:false},
      {x:14,y:5,color:"pink",dir:{x:0,y:-1},frightened:false},
      {x:13,y:6,color:"cyan",dir:{x:1,y:0},frightened:false},
      {x:14,y:6,color:"orange",dir:{x:-1,y:0},frightened:false}
    ];
    score=0;
    scoreDisplay.textContent=score;
    gameLoop();
  }
});

document.getElementById("stopBtn").addEventListener("click", stopGame);

function stopGame(){
  gameStarted=false;
  if(animationId) cancelAnimationFrame(animationId);
}
