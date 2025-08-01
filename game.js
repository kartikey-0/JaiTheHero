const player = document.getElementById('hero');
const heroImg = player.querySelector('img'); // Get image inside #hero
let left = 100;
const BOTTOM_GROUND = 50;
let bottom = BOTTOM_GROUND;
let isJumping = false;
const gravity = 1.5;
let velocityY = 0;

const getScreenWidth = () => window.innerWidth - player.offsetWidth;

let moveLeft = false, moveRight = false;

// Track current direction (1: right, -1: left)
let currentDirection = 1;

function jump() {
  if (isJumping) return;
  isJumping = true;
  velocityY = 20;

  function animateJump() {
    velocityY -= gravity;
    bottom += velocityY;
    if (bottom <= BOTTOM_GROUND) {
      bottom = BOTTOM_GROUND;
      isJumping = false;
      player.style.bottom = bottom + 'px';
      return;
    }
    player.style.bottom = bottom + 'px';
    requestAnimationFrame(animateJump);
  }
  animateJump();
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'arrowleft' || key === 'a') {
    moveLeft = true;
    faceLeft(); // Flip image left
  }
  if (key === 'arrowright' || key === 'd') {
    moveRight = true;
    faceRight(); // Flip image right
  }
  if (key === 'arrowup' || key === 'w' || key === ' ') jump();
});

document.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'arrowleft' || key === 'a') moveLeft = false;
  if (key === 'arrowright' || key === 'd') moveRight = false;
});

function gameLoop() {
  if (moveLeft) {
    left = Math.max(0, left - 7);
    player.style.left = left + 'px';
  }
  if (moveRight) {
    left = Math.min(getScreenWidth(), left + 7);
    player.style.left = left + 'px';
  }
  requestAnimationFrame(gameLoop);
}

// Add these helper functions to flip the hero image
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

// Initialize position and facing direction
player.style.left = left + 'px';
player.style.bottom = bottom + 'px';
faceRight(); // Initially facing right
gameLoop();


//blur effect adjust
if (moveLeft || moveRight) {
  // Make the blur bigger if needed!
  heroImg.style.filter = "blur(0.5px)";
} else {
  heroImg.style.filter = "none";
}
