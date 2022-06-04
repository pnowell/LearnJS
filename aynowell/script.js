import { onDocReady, onUpdate, optimizeCanvasScale } from '/LearnJS/common/common.js';

let canvas;
let everReoptimized = false;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  optimizeCanvasScale(canvas);
  onUpdate(update);
});

function update(dt) {
  let ctx = canvas.getContext('2d');

  ctx.clearOptimized();

  ctx.save();
  ctx.resetTransform();
  ctx.font = "20px sans-serif";
  ctx.fillText("dt = " + dt.toFixed(2) + " ms", 5, 25);
  ctx.fillText("canvas.width = " + canvas.width, 5, 50);
  ctx.fillText("canvas.height = " + canvas.height, 5, 75);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(50, 50, 40, 0, Math.PI * 2, true); // Outer circle
  ctx.moveTo(80, 50);
  ctx.arc(50, 50, 30, 0, Math.PI, false);  // Mouth (clockwise)
  ctx.moveTo(40, 35);
  ctx.arc(35, 35, 5, 0, Math.PI * 2, true);  // Left eye
  ctx.moveTo(70, 35);
  ctx.arc(65, 35, 5, 0, Math.PI * 2, true);  // Right eye
  ctx.stroke();

  return true;
}