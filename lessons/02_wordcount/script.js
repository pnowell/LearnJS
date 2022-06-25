import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { wordCounts } from './wordcounts.js';
import text from './aesop.js';

let canvas;
let ctx;

let counts = [];

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  let wordList = text.replace(/[^a-zA-Z\s]/gi, '').trim().toLowerCase().split(/\s+/);
  counts = wordCounts(wordList);

  optimizeCanvasScale(canvas);
  startUpdateLoop(onUpdate);
});

function onUpdate(dt) {
  ctx.clearOptimized();

  let padding = 20;
  let textPadding = 5;
  let fullWidth = 400 - 2 * padding;
  let fullHeight = 400 - 2 * padding;
  let maxCount = 0;
  let barWidth = fullWidth / counts.length;

  let fontSize = 10;
  ctx.font = fontSize + "px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  for (let i = 0; i < counts.length; i++) {
    if (maxCount < counts[i]) {
      maxCount = counts[i];
    }
  }

  for (let i = 0; i < counts.length; i++) {
    let x = i * barWidth + padding;
    let height = fullHeight * counts[i] / maxCount;
    let y = 400 - padding - height;
    ctx.beginPath();
    ctx.rect(x, y, barWidth, height);
    ctx.stroke();

    ctx.fillText(counts[i], x + barWidth / 2, y - textPadding);
    ctx.fillText(i, x + barWidth / 2, 400 - padding + fontSize + textPadding)
  }

  return true;
}