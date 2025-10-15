const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 30;
canvas.width = 600;  // 20 tiles wide
canvas.height = 450; // 15 tiles tall

// Bigger maze: 0-empty, 1-wall, 2-dot
const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,1,2,2,1],
  [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,1,2,2,1],
  [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,1,2,2,1],
  [1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Pac-Man
let pacman = { x: 1, y: 1, dx: 0, dy: 0 };

// 4 Ghosts
let ghosts = [
  { x: 18, y: 1, color: 'red', dx:0, dy:0 },
  { x: 18, y: 3, color: 'pink', dx:0, dy:0 },
  { x: 18, y: 7, color: 'cyan', dx:0, dy:0 },
  { x: 18, y: 11, color: 'orange', dx:0, dy:0 }
];

let score = 0;

document.addEventListener('keydown', e => {
  if(e.key === 'ArrowUp') { pacman.dx=0; pacman.dy=-1; }
  if(e.key === 'ArrowDown') { pacman.dx=0; pacman.dy=1; }
  if(e.key === 'ArrowLeft') { pacman.dx=-1; pacman.dy=0; }
  if(e.key === 'ArrowRight') { pacman.dx=1; pacman.dy=0; }
});

function movePacman(){
  let newX = pacman.x + pacman.dx;
  let newY = pacman.y + pacman.dy;
  if(maze[newY][newX]!==1){
    pacman.x = newX;
    pacman.y = newY;
  }
  if(maze[pacman.y][pacman.x]===2){
    maze[pacman.y][pacman.x]=0;
    score += 10;
  }
}

function moveGhosts(){
  ghosts.forEach(g => {
    if(Math.random()<0.1){
      let dirs = [{dx:0,dy:-1},{dx:0,dy:1},{dx:-1,dy:0},{dx:1,dy:0}];
      let dir = dirs[Math.floor(Math.random()*dirs.length)];
      g.dx=dir.dx; g.dy=dir.dy;
    }
    let newX=g.x+g.dx, newY=g.y+g.dy;
    if(maze[newY][newX]!==1){ g.x=newX; g.y=newY; }
    else{ g.dx=0; g.dy=0; }
  });
}

function drawMaze(){
  for(let y=0;y<maze.length;y++){
    for(let x=0;x<maze[y].length;x++){
      if(maze[y][x]===1){
        ctx.fillStyle='blue';
        ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize);
      } else if(maze[y][x]===2){
        ctx.fillStyle='yellow';
        ctx.beginPath();
        ctx.arc(x*tileSize+tileSize/2, y*tileSize+tileSize/2, 5,0,Math.PI*2);
        ctx.fill();
      }
    }
  }
}

function drawPacman(){
  ctx.fillStyle='yellow';
  ctx.beginPath();
  ctx.arc(pacman.x*tileSize+tileSize/2, pacman.y*tileSize+tileSize/2, tileSize/2-2,0,Math.PI*2);
  ctx.fill();
}

function drawGhosts(){
  ghosts.forEach(g=>{
    ctx.fillStyle=g.color;
    ctx.beginPath();
    ctx.arc(g.x*tileSize+tileSize/2, g.y*tileSize+tileSize/2, tileSize/2-2,0,Math.PI*2);
    ctx.fill();
  });
}

function gameLoop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawMaze();
  movePacman();
  moveGhosts();
  drawPacman();
  drawGhosts();

  ctx.fillStyle='white';
  ctx.font='20px Arial';
  ctx.fillText('Score: '+score,10,canvas.height-10);

  ghosts.forEach(g=>{
    if(g.x===pacman.x && g.y===pacman.y){
      alert('Game Over! Score: '+score);
      pacman.x=1; pacman.y=1;
      score=0;
      for(let y=0;y<maze.length;y++)
        for(let x=0;x<maze[y].length;x++)
          if(maze[y][x]===0 && !(y===1 && x===1)) maze[y][x]=2;
    }
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();
