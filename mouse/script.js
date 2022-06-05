import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';

const gravity = -50;
let canvas;
let ctx;
let particles = [];

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  optimizeCanvasScale(canvas);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  startUpdateLoop(onUpdate);
});

let mouseIsDown = false;
function onMouseDown(e) {
  mouseIsDown = true;
}

function onMouseUp(e) {
  mouseIsDown = false;
}

function onMouseMove(e) {
  if (mouseIsDown) {
    particles.push({
      pos: ctx.getMousePos(e),
      vel: {x: 0, y: 0},
      startTime: performance.now()
    });
  }
}

function onUpdate(dt) {
  // Update particles
  let time = performance.now();
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    if (time - p.startTime > 5000) {
      particles.splice(i, 1);
      continue;
    }

    p.vel.y += dt * gravity;
    p.pos.y -= dt * p.vel.y;
  }

  // Draw the particles
  ctx.clearOptimized();

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    ctx.fillRect(p.pos.x, p.pos.y, 1, 1);
  }

  return true;
}