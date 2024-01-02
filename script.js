const canvas = document.getElementById('canvas');
const generateButton = document.getElementById('generate');
const trunkRadius = document.querySelector('.trunk-radius');
const trunkRadiusSlider = document.querySelector('.trunk-radius-slider');
const ctx = canvas.getContext('2d');
ctx.canvas.width = 700;
ctx.canvas.height = 700;
let rootX = canvas.width / 2;
let rootY = canvas.height;
let leanRight = 0.3;
let leanLeft = -0.3;
let radius = 20;
let length = 200;
let branchDepthStart = 0;
let maxBranchDepth = 15;
let leafSize = 3;

trunkRadius.textContent = radius;
trunkRadiusSlider.value = radius;
trunkRadiusSlider.addEventListener('input', (e) => {
  trunkRadius.textContent = e.target.value;
  radius = e.target.value;
})

// Function to clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

generateButton.addEventListener('click', () => {
  clearCanvas();
  growBranch(rootX, rootY, length, 0, branchDepthStart, radius);
})

setTimeout(() => {
  growBranch(rootX, rootY, length, 0, branchDepthStart, radius);
}, 500);

function random(num) { return Math.floor(Math.random() * num) }

function animateGrowBranch(startX, startY, length, lean, branchDepth, radius ) {
  // exit condition
  if (branchDepth >= maxBranchDepth || length < 0 || radius <= 0) {
    return
  }

  // Loop that will draw the circles until the branch is finished
  for (let i = 0; i <= length; i++) {

    // 1 or 0 or -1px deviation of the growth direction
    let Xdeviation = random(3) - 1;
    Xdeviation += lean;
    let newX = startX += Xdeviation;

    // making a new Y coordinate
    // (so the branch grows upward)
    // 1 in 3 chance that the branch will not grow up on this iteration 
    let newY = (random(3) > 0) ? startY : --startY;

    drawCircle(ctx, newX, newY, radius, 'white', 'black', false);
    
    // Adds Leaves 
    // 1 in 20 chance to grow a leaf
    if (!random(20)) {
      let color = (random(2)) ? 'lightgreen' : 'green';
      drawCircle(ctx, startX, startY, leafSize, color, 'black', false);
    }
  }


  // Setting up new variables for recursion (new branch)
  
  let newBranchDepth = branchDepth + 1;
  let newRadius = (radius < 5) ? radius - 0.2 : radius - 3;
  let newLength = (length < 100) ? length - random(10) : length - random(100);



  // Making a 1/3 chance that the branch will devide into 1 side only;
  if (random(3)) {
    animateGrowBranch(startX, startY, newLength, leanLeft, newBranchDepth, newRadius );
    animateGrowBranch(startX, startY, newLength, leanRight, newBranchDepth, newRadius );
  }
  else {
    // Choosing which side the branch will go
    if (random(2)) {
      animateGrowBranch(startX, startY, newLength, leanRight, newBranchDepth, newRadius );
    } else {
      animateGrowBranch(startX, startY, newLength, leanLeft, newBranchDepth, newRadius );
    }
  }
}


function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.lineWidth = strokeWidth
  ctx.strokeStyle = stroke
  ctx.stroke()
}

function growBranch(startX, startY, length, lean, branchDepth, radius) {
  // Call the animation function with requestAnimationFrame
  function animate() {
    animateGrowBranch(startX, startY, length, lean, branchDepth, radius);
  }

  // Call requestAnimationFrame to start the animation loop
  requestAnimationFrame(animate);
}
