export { initGrid, updateGrid, drawGrid, onMouseDown, onMouseDrag, onMouseUp };

// ******************************************************************
// Today we're adding a new phase to the plant growth.  Once the stem
// finishes growing, we'll start a flower at that spot.
// ******************************************************************

function initGrid(grid) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      let cell = grid[x][y];
      cell.grass = false;
      cell.sky = false;
      cell.seedTimer = -1;
      cell.stemTimer = -1;
      cell.stemCount = 0;
      // Add a flowerTimer (set to -1) and                  **********
      // a flowerCount (set to 0)                           **********
      if (y <= grid[x].length / 2) {
        cell.sky = true;
      } else {
        cell.grass = true;
      }
    }
  }
}

function randomNumberPicker(low, high) {
  return Math.floor(low + Math.random() * (high - low));
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
          cell.stemCount = randomNumberPicker(5,10);
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

            // Here is where we're about to add a new stem  **********
            // block.                                       **********
            // How could we check to see if this is the     **********
            // last stem block to be added?  The last one   **********
            // will have a stemCount of 1, right?           **********
            // Add an if statement to check "if the new     **********
            // stem block would be the last one".  Then     **********
            // inside that we want to place the first       **********
            // flower block instead.                        **********

            // Inside the if statement set a flowerTimer    **********
            // and a flowerCount.                           **********
            // Remember to set flowerCount to a random      **********
            // number in some range (for example 2 to 5).   **********

            // Then you can put these lines in the "else"   **********
            // block of that if statement.                  **********
            cellUp.stemTimer = 0.5;
            cellUp.stemCount = cell.stemCount - 1;

          }
        }
      }

      // Now we need to check flowerTimer and flowerCount   **********
      // (similar to how we checked stemTimer and stemCount **********
      // above).  Replace "false" below with the condition  **********
      // to check if cell is a flower block that we need to **********
      // update.                                            **********
      if (false) {
        // Decrement the flower timer.                      **********

        // If the flower timer expired (again replace the   **********
        // false with the correct condition).               **********
        if (false) {
          // If the cell above this one is still inside the **********
          // grid, set the flowerTimer and flowerCount      **********
          // (remember we want flowerCount to be one less   **********
          // in the new block).                             **********

          // If the cell to the left of this one is still   **********
          // inside the grid, set the flowerTimer and       **********
          // flowerCount.  (Hint: the cell to the left is   **********
          // grid[x-1][y])                                  **********

          // If the cell to the right of this one is still  **********
          // inside the grid, set the flowerTimer and       **********
          // flowerCount.  (Hint: how do you check to see   **********
          // if "x+1" is still inside the grid?  Remember   **********
          // how to get the length of the grid?             **********

          // If the cell below this one is still inside the **********
          // grid, set the flowerTimer and flowerCount.     **********
          // Hint: If the cell above this one is            **********
          // grid[x][y-1], then what do you think the cell  **********
          // _below_ this one is?                           **********
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
      // Check if we should draw this as a flower.          **********
      if (false) {
        // Set the fillStyle to some flower color and draw  **********
        // the rectangle.                                   **********
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