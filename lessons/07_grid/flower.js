import { randomIntInRange } from '/LearnJS/common/utils.js';

export { initGrid, updateGrid, drawGrid, onMouseDown, onMouseDrag, onMouseUp };


function initGrid(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let cell = grid[x][y];
      cell.grass = false;
      cell.sky = false;
      cell.seedTimer = -1;
      cell.stemTimer = -1;
      cell.stemCount = 0;
      cell.flowerTimer = -1;
      cell.flowerCount = 0;
      if (y <= grid[x].length / 2) {
        cell.sky = true;
      } else {
        cell.grass = true;
      }
    }
  }
}

function randomIntInRange(low, high) {
  return Math.floor(low + Math.random() * (high + 0.999 - low));
}

function updateGrid(grid, dt) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let cell = grid[x][y];
      // Check to see if a seed timer is running
      if(cell.seedTimer > 0) {
        // Decrement the seed timer
        cell.seedTimer -= dt;

        // If the seed timer expired just now
        if (cell.seedTimer <= 0) {
          // Start a stem growing at this cell
          cell.stemTimer = 0.5;
          cell.stemCount = randomIntInRange(10,15);
        }
      }
      // Check to see if a stem timer is running
      if(cell.stemTimer > 0 && cell.stemCount > 1) {
        // Decrement the stem timer
        cell.stemTimer -= dt;

        // If the seed timer expired just now
        if (cell.stemTimer <= 0) {
          // Start a stem growing one cell above this one
          // (if we're not already at the top of the screen)
          if (y > 0) {
            let cellUp = grid[x][y-1];
            if(cell.stemCount == 2) {
              cellUp.flowerTimer = 1
              cellUp.flowerCount = randomIntInRange(3,5);
            } else {
              cellUp.stemTimer = 0.5;
              cellUp.stemCount = cell.stemCount - 1;
            }
          }
        }
      }

      // Check to see if a flower timer is running
      if(cell.flowerTimer > 0 && cell.flowerCount > 1) {
        cell.flowerTimer -= dt;
        // Decrement the flower timer.
        if (cell.flowerTimer <= 0) {
          // Expand up (if there's room in the grid)
          if (y > 0) {
            let cellUp = grid[x][y-1];
            cellUp.flowerTimer = 0.5;
            cellUp.flowerCount = cell.flowerCount - 1;
          }
          // Expand left
          if (x > 0) {
            let cellLeft = grid[x-1][y];
            cellLeft.flowerTimer = 0.5;
            cellLeft.flowerCount = cell.flowerCount - 1;
          }
          // Expand right
          if (x+1 < grid.length) {
            let cellRight = grid[x+1][y];
            cellRight.flowerTimer = 0.5;
            cellRight.flowerCount = cell.flowerCount - 1;
          }
          // Expand down
          if (y+1 < grid[x].length) {
            let cellDown = grid[x][y+1];
            cellDown.flowerTimer = 0.5;
            cellDown.flowerCount = cell.flowerCount - 1;
          }
        }
      }
    }
  }
}

function drawGrid(grid, ctx) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let cell = grid[x][y];

      // Check for flowers first, then stems, seeds and
      // grass and sky last.
      if (cell.flowerCount > 0) {
        ctx.fillStyle = '#d20430';
        ctx.fillRect(x * 10, y * 10, 10, 10);
      } else if (cell.stemCount > 0) {
        ctx.fillStyle = '#41dc82';
        ctx.fillRect(x * 10, y * 10, 10, 10);
      } else if (cell.seedTimer > 0) {
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
    // Start a seed timer
    cell.seedTimer = 3;
  }
  return null;
}

function onMouseDrag(grid, x, y, mouseContext) {
}

function onMouseUp(grid, x, y, mouseContext) {
}