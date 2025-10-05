const player = document.getElementById('hero');
const heroImg = player.querySelector('img');
const background = document.getElementById('game-background');
const gameArea = document.getElementById('game-area');

// HERO MOVEMENT (as in your previous code)
const BOTTOM_GROUND = 35;
let left = 300;
let bottom = BOTTOM_GROUND;
let isJumping = false;
const gravity = 1.5;
let velocityY = 0;

let moveLeft = false, moveRight = false;
let currentDirection = 1;

let backgroundOffset = 0;
const heroWidth = 64;
const screenWidth = window.innerWidth;
const leftThreshold = 300;
const rightThreshold = screenWidth - leftThreshold - heroWidth;
const bgImageWidth = 1920; // UPDATE with actual bg image width!

function jump() {
  if (isJumping) return;
  isJumping = true; velocityY = 20;
  function animateJump() {
    velocityY -= gravity; bottom += velocityY;
    if (bottom <= BOTTOM_GROUND) {
      bottom = BOTTOM_GROUND; isJumping = false;
      player.style.bottom = bottom + 'px';
      return;
    }
    player.style.bottom = bottom + 'px';
    requestAnimationFrame(animateJump);
  }
  animateJump();
}
function updateBackground() {
  background.style.backgroundPositionX = -(backgroundOffset % bgImageWidth) + 'px';
}
function faceLeft() {
  if (currentDirection !== -1) {
    heroImg.style.transform = "scaleX(-1)";
    currentDirection = -1;
  }
}
function faceRight() {
  if (currentDirection !== 1) {
    heroImg.style.transform = "scaleX(1)";
    currentDirection = 1;
  }
}

// ENEMY LOGIC

// --- Customize your enemy types here:
const enemyTypes = [
  { type: 'goomba', sprite: 'assets/goomba.png', width: 40, height: 80, speed: 4 },
  { type: 'koopa', sprite: 'assets/koopa.png', width: 40, height: 40, speed: 2.5 }
  // Add more enemies here
];

let enemies = [];
const enemySpawnInterval = 800; // ms
let lastEnemySpawn = Date.now();

// SPAWN an enemy offscreen to the right or left (random)
function spawnEnemy() {
  const enemyData = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  const direction = Math.random() > 0.5 ? 1 : -1;
  const x = direction === 1 ? -60 : screenWidth + 20;
  const y = BOTTOM_GROUND+10;

  // Create enemy DOM element
  const enemyElem = document.createElement('div');
  enemyElem.className = `enemy ${enemyData.type}`;
  enemyElem.style.left = x + 'px';
  enemyElem.style.bottom = y + 'px';
  enemyElem.style.backgroundImage = `url('${enemyData.sprite}')`;
  enemyElem.dataset.direction = direction;

  const enemy = {
    type: enemyData.type,
    x, y, width: enemyData.width, height: enemyData.height,
    direction,
    speed: enemyData.speed,
    alive: true,
    elem: enemyElem
  };

  gameArea.appendChild(enemyElem);
  enemies.push(enemy);
}

function moveEnemies() {
  enemies.forEach(enemy => {
    if (!enemy.alive) return;
    enemy.x += enemy.direction * enemy.speed;
    enemy.elem.style.left = enemy.x - backgroundOffset + 'px';
    if (enemy.x < -100 || enemy.x > screenWidth + 100) {
      // Offscreen: respawn enemy
      enemy.elem.remove();
      enemy.alive = false;
    }
  });
  // Remove defeated/offscreen enemies from the array
  enemies = enemies.filter(enemy => enemy.alive);
}

// Collision detection
function checkCollision(heroRect, enemyRect) {
  return !(
    heroRect.right < enemyRect.left ||
    heroRect.left > enemyRect.right ||
    heroRect.bottom < enemyRect.top ||
    heroRect.top > enemyRect.bottom
  );
}

function defeatEnemy(enemy) {
  enemy.alive = false;
  enemy.elem.classList.add('squished');
  setTimeout(() => enemy.elem.remove(), 300);
}

// Enemies and hero collision logic
function handleEnemyCollisions() {
  const heroRect = player.getBoundingClientRect();
  enemies.forEach(enemy => {
    if (!enemy.alive) return;
    const enemyRect = enemy.elem.getBoundingClientRect();
    if (checkCollision(heroRect, enemyRect)) {
      // Check Mario-style 'jump from above'
      const heroBottom = heroRect.bottom;
      const enemyTop = enemyRect.top;
      if (bottom > enemy.y + enemy.height / 1.5 && velocityY < 0) { // Hero is falling and above
        defeatEnemy(enemy);
        velocityY = 14; // Bounce up!
        isJumping = true;
      } else {
        // Player hit from the side? (custom handling)
        // Example: reset game or lose life
        // alert("Ouch!"); // For demo
      }
    }
  });
}

// GAME LOOP
function gameLoop() {
  // --- Hero movement and background scroll
  if (moveRight) {
    if (left < rightThreshold && backgroundOffset >= 0) {
      left = Math.min(rightThreshold, left + 5);
      player.style.left = left + 'px';
    } else {
      backgroundOffset += 5;
      updateBackground();
    }
  }
  if (moveLeft) {
    if (left > leftThreshold) {
      left = Math.max(leftThreshold, left - 5);
      player.style.left = left + 'px';
    } else {
      backgroundOffset = Math.max(0, backgroundOffset - 5);
      updateBackground();
    }
  }

  moveEnemies();
  handleEnemyCollisions();

  // Spawn new enemies at intervals
  if (Date.now() - lastEnemySpawn > enemySpawnInterval) {
    spawnEnemy();
    lastEnemySpawn = Date.now();
  }

  requestAnimationFrame(gameLoop);
}

// Player keyboard controls
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'arrowleft' || key === 'a') { moveLeft = true; faceLeft(); }
  if (key === 'arrowright' || key === 'd') { moveRight = true; faceRight(); }
  if (key === 'arrowup' || key === 'w' || key === ' ') jump();
});
document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'arrowleft' || key === 'a') moveLeft = false;
  if (key === 'arrowright' || key === 'd') moveRight = false;
});

// --- Initialize positions and start the loop
player.style.left = left + 'px';
player.style.bottom = bottom + 'px';
faceRight();
updateBackground();
gameLoop();
///////////////////////////////////////////
