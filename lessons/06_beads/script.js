import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { V2 } from '/LearnJS/common/v2.js';
import { Circle } from '/LearnJS/common/circle.js';
import { Bead } from './bead.js';
import {
  maxBeads,
  maxBeadsPerSecond,
  initializePegs,
  createPeg,
  shouldDeletePeg,
  createBead,
  updateBead,
  collideBead
} from
'./swing.js';
// './pachinko.js';
// './blackhole.js';

let canvas;
let ctx;
let beads = [];
let pegs = [];
let dragging = null;
let mouseMoved = false;
let beadSpawnTime = 0;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  optimizeCanvasScale(canvas);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  // Create initial pegs
  pegs = initializePegs();

  startUpdateLoop(onUpdate);
});

function onUpdate(dt) {
  // Draw the particles
  ctx.clearOptimized();

  // Spawn beads
  beadSpawnTime += dt;
  let maxBeadsValue = maxBeads();
  let maxBeadsPerSecondValue = maxBeadsPerSecond();
  if (beads.length < maxBeadsValue) {
    let spawnCount = Math.floor(beadSpawnTime * maxBeadsPerSecondValue);
    beadSpawnTime -= spawnCount * (1 / maxBeadsPerSecondValue);

    spawnCount = Math.min(spawnCount, maxBeadsValue - beads.length);
    for (let i = 0; i < spawnCount; i++) {
      beads.push(createBead());
    }
  }

  // Update beads
  for (let i = beads.length - 1; i >= 0; i--) {
    let b = beads[i];
    if (updateBead(b, dt, pegs)) {
      beads.splice(i, 1);
      continue;
    }

    // Collide against all pegs
    for (let j = 0; j < pegs.length; j++) {
      let collision = b.circle.collisionWith(pegs[j]);
      if (collision === null) {
        continue;
      }
      if (collideBead(b, pegs[j], collision)) {
        beads.splice(i, 1);
        break;
      }
    }
  }

  // Draw eveything
  ctx.beginPath();
  for (let i = 0; i < pegs.length; i++) {
    drawCircle(pegs[i]);
  }
  for (let i = 0; i < beads.length; i++) {
    drawCircle(beads[i].circle);
  }
  ctx.stroke();

  return true;
}

function onMouseDown(e) {
  mouseMoved = false;
  let pegIndex = findPegIndex(e);
  dragging = pegIndex >= 0 ? pegs[pegIndex] : null;
}

function onMouseUp(e) {
  dragging = null;
  if (!mouseMoved) {
    let pegIndex = findPegIndex(e);
    if (pegIndex >= 0) {
      if (shouldDeletePeg(pegs[pegIndex])) {
        pegs.splice(pegIndex, 1);
      }
    } else {
      let peg = createPeg(ctx.getMousePos(e));
      if (peg !== null) {
        pegs.push(peg);
      }
    }
  }
}

function onMouseMove(e) {
  mouseMoved = true;
  if (dragging === null) {
    return;
  }

  let pos = ctx.getMousePos(e);
  dragging.center.x = pos.x;
  dragging.center.y = pos.y;
}

function findPegIndex(e) {
  let pos = new V2(ctx.getMousePos(e));
  for (let i = 0; i < pegs.length; i++) {
    if (V2.distanceSqr(pos, pegs[i].center) < pegs[i].radius * pegs[i].radius) {
      return i;
    }
  }
  return -1;
}

function drawCircle(circle) {
  ctx.moveTo(circle.center.x + circle.radius, circle.center.y);
  ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, Math.PI * 2);
}