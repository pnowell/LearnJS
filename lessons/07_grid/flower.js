export { initGrid, updateGrid, drawGrid, onMouseDown, onMouseDrag, onMouseUp };

function initGrid(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let cell = grid[x][y];
      cell.grass = false;
      cell.sky = false;
      cell.seed = false;

      if (y <= grid[x].length / 2) {
        cell.sky = true;
      } else {
        cell.grass = true;
      }
    }
  }
}

function updateGrid(grid, dt) {
}

function drawGrid(grid, ctx) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let cell = grid[x][y];
      if (cell.seed) {
        ctx.fillStyle = '#8c5f31';
        ctx.fillRect(x * 10, y * 10, 10, 10);
      } else if (cell.grass) {
        ctx.fillStyle = 'green';
        ctx.fillRect(x * 10, y * 10, 10, 10);
      } else if (cell.sky) {
        ctx.fillStyle = '#0ad1d1';
        ctx.fillRect(x * 10, y * 10, 10, 10);
      }
    }
  }
}

function onMouseDown(grid, x, y) {
  let cell = grid[x][y];
  if (cell.grass) {
    cell.seed = true;
  }
  return null;
}

function onMouseDrag(grid, x, y, mouseContext) {
}

function onMouseUp(grid, x, y, mouseContext) {
}