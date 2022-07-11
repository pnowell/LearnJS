import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { findMountainTop } from './mountain.js';

let canvas;
let ctx;
let heights;
let mountainTop;

let padding = 10;
let drawSize = 400 - 2 * padding;

const minRandLength = 10;
const maxRandLength = 20;
const diffRandLength = maxRandLength - minRandLength;
const minRandHeight = 1;
const maxRandHeight = 3;
const diffRandHeight = maxRandHeight - minRandHeight;
const minRandStart = 5;
const maxRandStart = 10;
const diffRandStart = maxRandStart - minRandStart;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  let redoButton = document.getElementById('redo');
  redoButton.addEventListener('click', function(e) {
    redo();
  });

  optimizeCanvasScale(canvas);

  redo();

  startUpdateLoop(onUpdate);
});

function redo() {
  heights = [];

  let upLength = Math.round(diffRandLength * Math.random() + minRandLength);
  let downLength = Math.round(diffRandLength * Math.random() + minRandLength);
  let i = 0;
  heights[0] = diffRandStart * Math.random() + minRandStart;
  while (i < upLength) {
    i++;
    heights[i] = heights[i-1] + (diffRandHeight * Math.random() + minRandHeight);
  }
  while (i < upLength + downLength) {
    i++;
    heights[i] = heights[i-1] - (diffRandHeight * Math.random() + minRandHeight);
  }

  mountainTop = findMountainTop(heights);
}

function onUpdate(dt) {
  // Draw the particles
  ctx.clearOptimized();

  let sectionWidth = drawSize / (heights.length - 1);
  let minHeight = 0;
  let maxHeight = 0;
  for (let i = 0; i < heights.length; i++) {
    minHeight = Math.min(minHeight, heights[i]);
    maxHeight = Math.max(maxHeight, heights[i]);
  }
  let displayMult = drawSize / (maxHeight - minHeight);

  ctx.fillStyle = '#ddddff';
  ctx.fillRect(
    (mountainTop - 0.5) * sectionWidth + padding,
    padding * 0.5,
    sectionWidth,
    drawSize + padding * 0,5);

  ctx.beginPath();
  let firstPoint = true;
  for (let i = 0; i < heights.length; i++) {
    let x = sectionWidth * i + padding;
    let y = drawSize - (heights[i] - minHeight) * displayMult + padding;
    if (firstPoint) {
      ctx.moveTo(x, y);
      firstPoint = false;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  return true;
}