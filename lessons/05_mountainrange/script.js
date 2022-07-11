import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { findMountainTopsAndValleys } from './mountainrange.js';

let canvas;
let ctx;
let heights;
let topsAndValleys;

let padding = 10;
let drawSize = 400 - 2 * padding;

const minRandLength = 8;
const maxRandLength = 25;
const diffRandLength = maxRandLength - minRandLength;
const minRandHeight = 1;
const maxRandHeight = 9;
const diffRandHeight = maxRandHeight - minRandHeight;
const minRandPeaks = 3;
const maxRandPeaks = 6;
const diffRandPeaks = maxRandPeaks - minRandPeaks;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  // The various height array populators.
  document.getElementById('emptyBtn')
    .addEventListener('click', emptyHeights);
  document.getElementById('oneHeightBtn')
    .addEventListener('click', oneHeightHeights);
  document.getElementById('slantUpBtn')
    .addEventListener('click', slantUpHeights);
  document.getElementById('slantDownBtn')
    .addEventListener('click', slantDownHeights);
  document.getElementById('oneMountainBtn')
      .addEventListener('click', oneMountainHeights);
  document.getElementById('mountainRangeBtn')
    .addEventListener('click', mountainRangeRandHeights);

  optimizeCanvasScale(canvas);

  mountainRangeRandHeights();

  startUpdateLoop(onUpdate);
});

function emptyHeights() {
  heights = [0];
  topsAndValleys = findMountainTopsAndValleys(heights);
}

function oneHeightHeights() {
  heights = [0];
  topsAndValleys = findMountainTopsAndValleys(heights);
}

function slantUpHeights() {
  heights = [0];
  pushSlantUp(heights);
  topsAndValleys = findMountainTopsAndValleys(heights);
}

function slantDownHeights() {
  heights = [0];
  pushSlantDown(heights);
  topsAndValleys = findMountainTopsAndValleys(heights);
}

function oneMountainHeights() {
  mountainRangeHeights(1);
}

function mountainRangeRandHeights() {
  mountainRangeHeights(Math.floor(diffRandPeaks * Math.random() + minRandPeaks));
}

function pushStartHeight(heights) {
  heights.push(diffRandStart * Math.random() + minRandStart);
}

function pushSlantUp(heights) {
  let upLength = Math.round(diffRandLength * Math.random() + minRandLength);
  let base = heights.length - 1;
  let i = 0;

  while (i < upLength) {
    i++;
    heights[base+i] = heights[base+i-1] + (diffRandHeight * Math.random() + minRandHeight);
  }

  base += i;
}

function pushSlantDown(heights) {
  let downLength = Math.round(diffRandLength * Math.random() + minRandLength);
  let base = heights.length - 1;
  let i = 0;

  while (i < downLength) {
    i++;
    heights[base+i] = heights[base+i-1] - (diffRandHeight * Math.random() + minRandHeight);
  }

  base += i;
}

function mountainRangeHeights(peaks) {
  heights = [0];

  for (let p = 0; p < peaks; p++) {
    pushSlantUp(heights);
    pushSlantDown(heights);
  }

  topsAndValleys = findMountainTopsAndValleys(heights);
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
  for (let i = 0; i < topsAndValleys.length; i++) {
    ctx.fillRect(
      (topsAndValleys[i] - 0.5) * sectionWidth + padding,
      padding * 0.5,
      sectionWidth,
      drawSize + padding * 0,5);
  }

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