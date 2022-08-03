import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { V2 } from '/LearnJS/common/v2.js';

let canvas;
let ctx;
let moduleSelect;
let updateSpeedSlider;
let grid;
let runToggle;
let gridRows = 40;
let gridCols = 40;
let gridCellHeight = 10;
let gridCellWidth = 10;
let running = false;
let runOnce = false;
let dragging = false;
let mouseContext = null;
let mod = null;
let dtAcc = 0;
let minDtAcc = 0;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  document.getElementById('resetButton')
      .addEventListener('click', resetGrid);
  runToggle = document.getElementById('runToggle');
  runToggle.addEventListener('click', toggleRunState);
  document.getElementById('stepButton')
      .addEventListener('click', updateOnce);
  moduleSelect = document.getElementById('moduleSelect');
  moduleSelect.addEventListener('change', loadSelectedModule);
  updateSpeedSlider = document.getElementById('updateSpeedSlider');
  updateSpeedSlider.addEventListener('change', refreshMinDtAcc)
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);

  optimizeCanvasScale(canvas);
  resetGrid();
  refreshMinDtAcc();
  startUpdateLoop(onUpdate);
  loadSelectedModule();
});

async function loadSelectedModule() {
  // First set mod to null to stop updates / etc
  mod = null;

  let options = moduleSelect.options;
  let moduleName = './' + options[options.selectedIndex].value;

  // Then trigger the load of the module and set it to mod
  mod = await import(moduleName);

  // Reset things now that we have the new module loaded
  resetGrid();
  running = false;
  dragging = false;
  mouseContext = null;
  refreshRunToggle();
}

function onUpdate(dt) {
  if (mod === null) {
    return true;
  }

  if (running) {
    dtAcc += dt;
    if (dtAcc >= minDtAcc || runOnce) {
      if (runOnce) {
        dtAcc = minDtAcc;
      }
      mod.updateGrid(grid, dtAcc);
      dtAcc = 0;
      if (runOnce) {
        runOnce = false;
        running = false;
        refreshRunToggle();
      }
    }
  }

  ctx.clearOptimized();
  ctx.fillStyle = '#000';
  mod.drawGrid(grid, ctx);

  return true;
}

function resetGrid() {
  if (mod === null) {
    return;
  }

  grid = [];
  for (let x = 0; x < gridCols; x++) {
    grid[x] = [];
    for (let y = 0; y < gridRows; y++) {
      grid[x][y] = {};
    }
  }
  mod.initGrid(grid);
  running = false;
  runOnce = false;
  refreshRunToggle();
}

function toggleRunState(e) {
  running = !running;
  runOnce = false;
  dtAcc = 0;
  refreshRunToggle();
}

function refreshRunToggle() {
  runToggle.textContent = running ? 'Pause' : 'Run';
}

function refreshMinDtAcc() {
  minDtAcc = 1.5 / updateSpeedSlider.value;
}

function updateOnce() {
  runOnce = true;
  running = true;
  refreshRunToggle();
}

function onMouseDown(e) {
  if (mod === null) {
    return;
  }
  dragging = true;
  let pos = new V2(ctx.getMousePos(e));
  let x = Math.floor(pos.x / gridCellWidth);
  let y = Math.floor(pos.y / gridCellHeight);
  if (0 <= x && x < grid.length && 0 <= y && y < grid[0].length) {
    mouseContext = mod.onMouseDown(grid, x, y);
  }
}

function onMouseMove(e) {
  if (mod === null || !dragging) {
    return;
  }
  let pos = new V2(ctx.getMousePos(e));
  let x = Math.floor(pos.x / gridCellWidth);
  let y = Math.floor(pos.y / gridCellHeight);
  if (0 <= x && x < grid.length && 0 <= y && y < grid[0].length) {
    mod.onMouseDrag(grid, x, y, mouseContext);
  }
}

function onMouseUp(e) {
  if (mod === null) {
    return;
  }
  dragging = false;
  let pos = new V2(ctx.getMousePos(e));
  let x = Math.floor(pos.x / gridCellWidth);
  let y = Math.floor(pos.y / gridCellHeight);
  if (0 <= x && x < grid.length && 0 <= y && y < grid[0].length) {
    mod.onMouseUp(grid, x, y, mouseContext);
  }
}