export { initGrid, updateGrid, drawGrid, onMouseDown, onMouseDrag, onMouseUp };
import { Color } from '/LearnJS/common/color.js';

// Omega is sqrt(k / m)
// Gamma is 2 * sqrt(m * k) for a critically damped spring
// We use a different coefficient gamma-over-m to simplify things.
// Again, for a critically damped spring, this would be 2 * sqrt(k / m) = 2 * omega
let omega = 10.0;
let gammaOverM = 0.1;

function initGrid(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let cell = grid[x][y];
      cell.height = 0.0;
      cell.vel = 0.0;
    }
  }
}

function updateGrid(grid, dt) {
  // We only integrate the non-border cells.  Border cells are locked.
  for (let x = 1; x < grid.length - 1; x++) {
    for (let y = 1; y < grid[x].length - 1; y++) {
      let cell = grid[x][y];
      let accel = 0.0;
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (i == x && j == y) continue;
          let disp = cell.height - grid[i][j].height;
          accel += -omega * omega * disp - gammaOverM * cell.vel;
        }
      }
      cell.vel += accel * dt;
    }
  }
  for (let x = 1; x < grid.length - 1; x++) {
    for (let y = 1; y < grid[x].length - 1; y++) {
      let cell = grid[x][y];
      cell.height += dt * cell.vel;
    }
  }
}

function drawGrid(grid, ctx) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let value = (grid[x][y].height + 1) / 2;
      value = Math.max(0, Math.min(value, 1)) * 255;
      let color = new Color(value, value, value);
      ctx.fillStyle = color.hex;
      ctx.fillRect(x * 10 + 1, y * 10 + 1, 8, 8);
    }
  }
}

function onMouseDown(grid, x, y) {
  if (x == 0 || y == 0 || x == grid.length - 1 || y == grid[0].length - 1) {
    return null;
  }
  let cell = grid[x][y];
  cell.height = -1.0;
  cell.vel = 0.0;
  return null;
}

function onMouseDrag(grid, x, y, mouseContext) {
  if (x == 0 || y == 0 || x == grid.length - 1 || y == grid[0].length - 1) {
    return;
  }
  let cell = grid[x][y];
  cell.height = -1.0;
  cell.vel = 0.0;
}

function onMouseUp(grid, x, y, mouseContext) {
}