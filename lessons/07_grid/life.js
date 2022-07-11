export { initGrid, updateGrid, drawGrid, onMouseDown, onMouseDrag, onMouseUp };

function initGrid(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      grid[x][y].alive = false;
    }
  }
}

function updateGrid(grid, dt) {
  let sums = [];
  for (let x = 0; x < grid.length; x++) {
    sums[x] = [];
    for (let y = 0; y < grid[x].length; y++) {
      sums[x][y] = 0;
    }
  }
  for (let x = 0; x < grid.length; x++) {
    let xMin = Math.max(0, x - 1);
    let xMax = Math.min(grid.length - 1, x + 1);
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y].alive) {
        let yMin = Math.max(0, y - 1);
        let yMax = Math.min(grid[x].length - 1, y + 1);
        for (let i = xMin; i <= xMax; i++) {
          for (let j = yMin; j <= yMax; j++) {
            if (i == x && j == y) continue;
            sums[i][j] += 1;
          }
        }
      }
    }
  }
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let alive = grid[x][y].alive;
      if (sums[x][y] == 3) {
        grid[x][y].alive = true;
      } else if (sums[x][y] != 2) {
        grid[x][y].alive = false;
      }
    }
  }
}

function drawGrid(grid, ctx) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y].alive) {
        ctx.fillRect(x * 10 + 1, y * 10 + 1, 8, 8);
      }
    }
  }
}

function onMouseDown(grid, x, y) {
  let newValue = !grid[x][y].alive;
  grid[x][y].alive = newValue;
  return newValue;
}

function onMouseDrag(grid, x, y, mouseContext) {
  grid[x][y].alive = mouseContext;
}

function onMouseUp(grid, x, y, mouseContext) {
}