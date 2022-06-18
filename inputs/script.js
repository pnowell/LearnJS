import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { V2 } from '/LearnJS/common/v2.js';

const handleRadius = 3;
const handleRadiusSqr = handleRadius * handleRadius;

let canvas;
let ctx;
let ticks;
let verts = [];
let triplets = [];
let dragging = null;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  let ticksInput = document.getElementById('ticks');
  ticks = ticksInput.value;
  ticksInput.addEventListener('input', function(e) {
    ticks = e.target.value;
  });

  optimizeCanvasScale(canvas);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);

  // Set the initial placement of things.
  let width = canvas.originalWidth;
  let height = canvas.originalHeight;
  let topLeft = new V2(width * 0.1, height * 0.1);
  width -= 2 * topLeft.x;
  height -= 2 * topLeft.y;

  verts[0] = topLeft.plus(new V2(0*width/4, 1*height/3));
  verts[1] = topLeft.plus(new V2(1*width/4, 2*height/3));
  verts[2] = topLeft.plus(new V2(2*width/4, 1*height/3));
  verts[3] = topLeft.plus(new V2(3*width/4, 2*height/3));
  verts[4] = topLeft.plus(new V2(4*width/4, 1*height/3));
  triplets[0] = [0, 1, 2];
  triplets[1] = [1, 2, 3];
  triplets[2] = [2, 3, 4];

  startUpdateLoop(onUpdate);
});

function onMouseDown(e) {
  let pos = new V2(ctx.getMousePos(e));
  for (let i = 0; i < verts.length; i++) {
    if (V2.distanceSqr(pos, verts[i]) < handleRadiusSqr) {
      dragging = verts[i];
      break;
    }
  }
}

function onMouseUp(e) {
  dragging = null;
}

function onMouseMove(e) {
  if (dragging === null) {
    return;
  }

  let pos = ctx.getMousePos(e);
  dragging.x = pos.x;
  dragging.y = pos.y;
}

function onUpdate(dt) {
  // Draw the particles
  ctx.clearOptimized();

  ctx.beginPath();

  for (let i = 0; i < verts.length; i++) {
    let a = verts[i];
    ctx.moveTo(a.x + handleRadius, a.y);
    ctx.arc(a.x, a.y, handleRadius, 0, Math.PI * 2);
  }

  for (let i = 0; i < triplets.length; i++) {
    let t = triplets[i];

    let a = verts[t[0]];
    let b = verts[t[1]];
    let c = verts[t[2]];

    for (let j = 0; j <= ticks; j++) {
      let param = j / ticks;

      let p1 = V2.interpolate(b, a, param);
      let p2 = V2.interpolate(b, c, 1 - param);

      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
  }

  ctx.stroke();

  return true;
}