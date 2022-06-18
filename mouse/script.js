import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { V2 } from '/LearnJS/common/v2.js';

const gravity = new V2(0, 50);
let canvas;
let ctx;
let lastDt;
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
      pos: new V2(ctx.getMousePos(e)),
      vel: new V2(ctx.getMouseMovement(e)).times(10),
      startTime: performance.now()
    });
  }
}

function onUpdate(dt) {
  lastDt = dt;
  // Update particles
  let time = performance.now();
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    if (time - p.startTime > 5000) {
      particles.splice(i, 1);
      continue;
    }

    p.vel.plusEquals(gravity.times(dt));
    p.pos.plusEquals(p.vel.times(dt));
  }

  // Draw the particles
  ctx.clearOptimized();

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    ctx.fillRect(p.pos.x, p.pos.y, 1, 1);
  }

  return true;
}