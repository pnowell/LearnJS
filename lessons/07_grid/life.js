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
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y].alive) {
        for (let i = x - 1; i <= x + 1; i++) {
          for (let j = y - 1; j <= y + 1; j++) {
            if (i == x && j == y) continue;
            let iWrap = i;
            let jWrap = j;
            if (iWrap < 0) iWrap += grid.length;
            if (iWrap >= grid.length) iWrap -= grid.length;
            if (jWrap < 0) jWrap += grid[iWrap].length;
            if (jWrap >= grid[iWrap].length) jWrap -= grid[iWrap].length;
            sums[iWrap][jWrap] += 1;
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