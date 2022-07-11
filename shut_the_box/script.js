import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';

let canvas;
let ctx;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  optimizeCanvasScale(canvas);

  let shutTheBox = new ShutTheBox();
  shutTheBox.nextRoll();

  startUpdateLoop(onUpdate);
});

function onUpdate(dt) {
  ctx.clearOptimized();

  return false;
}

class ShutTheBox {
  constructor() {
    this.levers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // The number of different ways diceSum = i can happen
    this.diceSumCount = [0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]
    this.dice = [];
    this.loweredLevers = [];
  }

  get diceSum() {
    return this.dice[0] + this.dice[1];
  }

  nextRoll() {
    this.dice = [
      Math.floor(Math.random() * 6 + 1),
      Math.floor(Math.random() * 6 + 1),
    ];

    console.log("dice = ", this.dice);
    console.log("diceSum = ", this.diceSum);
  }
};