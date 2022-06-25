import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { reverse } from './reverse.js';

let canvas;
let ctx;
let inputText = "";
let reversedText = "";

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  let inputTextElement = document.getElementById('inputText');
  inputText = inputTextElement.value;
  reversedText = reverseWrapper(inputText);
  inputTextElement.addEventListener('input', function(e) {
    inputText = e.target.value;
    reversedText = reverseWrapper(inputText);
  });

  optimizeCanvasScale(canvas);

  startUpdateLoop(onUpdate);
});

function onUpdate(dt) {
  // Draw the particles
  ctx.clearOptimized();

  let fontSize = 30;
  ctx.font = fontSize + "px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  ctx.fillText(reversedText, 200, 200);

  return true;
}

function reverseWrapper(text) {
  return reverse(text.split('')).join('');
}