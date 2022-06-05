import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';

let canvas;
let ctx;
let ticks = 10;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  let ticksInput = document.getElementById('ticks');
  ticksInput.addEventListener('input', function(e) {
    ticks = e.target.value;
  });

  optimizeCanvasScale(canvas);
  startUpdateLoop(onUpdate);
});

function onUpdate(dt) {
  // Draw the particles
  ctx.clearOptimized();

  let width = canvas.originalWidth;
  let height = canvas.originalHeight;
  let originX = width * 0.1;
  let originY = height * 0.1;
  width -= 2 * originX;
  height -= 2 * originY;

  ctx.beginPath();
  for (let i = 0; i <= ticks; i++) {
    let param = i / ticks;

    let y = (1 - param) * height + originY;
    ctx.moveTo(originX, y);

    let x = param * width + originX;
    ctx.lineTo(x, originY);
  }
  ctx.stroke();

  return true;
}