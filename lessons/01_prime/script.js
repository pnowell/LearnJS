import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { findPrimes } from './primes.js';

let canvas;
let ctx;
let primes = [];
let solution = [
   2,  3,  5,  7, 11,
  13, 17, 19, 23, 29,
  31, 37, 41, 43, 47,
  53, 59, 61, 67, 71,
  73, 79, 83, 89, 97];

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  optimizeCanvasScale(canvas);
  startUpdateLoop(onUpdate);

  primes = findPrimes();
});

function onUpdate(dt) {
  ctx.clearOptimized();

  let fontSize = 10;
  ctx.font = fontSize + "px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let padding = 20;
  let legendSize = 70;
  let boardSize = 400 - legendSize;
  let boardXOffset = legendSize / 2;
  let gridSize = boardSize / 10;
  let circleRadius = gridSize * 0.8 / 2;
  let offset = gridSize / 2;
  let yTextOffset = -fontSize / 2;
  let number = 1;
  let missingNumbers = false;
  let extraNumbers = false;
  for (let i = 0; i < 10; i++) {
    let y = i * gridSize;
    for (let j = 0; j < 10; j++) {
      let x = j * gridSize + boardXOffset;
      ctx.fillText(number, x + offset, y + offset);
      let inAnswer = primes.includes(number);
      let inSolution = solution.includes(number);
      let draw = inAnswer || inSolution;
      if (draw) {
        if (inAnswer && inSolution) {
          ctx.strokeStyle = 'green';
        } else if (!inAnswer && inSolution) {
          ctx.strokeStyle = 'blue';
          missingNumbers = true;
        } else {
          ctx.strokeStyle = 'red';
          extraNumbers = true;
        }
        ctx.beginPath();
        ctx.arc(x + offset, y + offset, circleRadius, 0, Math.PI * 2, true);
        ctx.stroke();
      }
      number++;
    }
  }

  // Draw legend
  if (!missingNumbers && !extraNumbers) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("WOW!  You got it all completely correct!  Nice job!", 200, 400 - legendSize / 2);
  } else {
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    let x = padding + boardXOffset;
    let y = 400 - legendSize / 2 - padding / 2 - circleRadius / 2;
    if (missingNumbers) {
      ctx.strokeStyle = 'blue';
      ctx.beginPath();
      ctx.arc(x + circleRadius, y, circleRadius, 0, Math.PI * 2, true);
      ctx.stroke();

      ctx.fillText("Primes that your code missed", x + circleRadius + padding, y);
      y += circleRadius + padding;
    }
    if (extraNumbers) {
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.arc(x + circleRadius, y, circleRadius, 0, Math.PI * 2, true);
      ctx.stroke();

      ctx.fillText("Not prime, but your code found them", x + circleRadius + padding, y);
    }
  }

  return true;
}