export { initGrid, updateGrid, drawGrid, onMouseDown, onMouseDrag, onMouseUp };

// ******************************************************************
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
      if (y <= grid[x].length / 2) {
        cell.sky = true;
      } else {
        cell.grass = true;
      }
    }
  }
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
          cell.stemCount = 10;  // Let's change this line   **********
          // Instead of setting it to 10, you can randomize **********
          // how tall it will grow using the Math.random()  **********
          // function.  Math.random() will give you a       **********
          // number between 0 and 1 (for example: 0.372).   **********
          // So if you want something that will give you.   **********
          // a number between 0 and 10 you could do         **********

          // Math.random() * 10                             **********

          // But that might occasionally give you 0 and you **********
          // don't ever want it to be that low.  Let's say  **********
          // you always want it to be at least 3 long and   **********
          // at most 10 long.  For that you want something  **********
          // like:                                          **********

          // 3 + a random number between 0 and 7            ********** (A)
          // Take a moment to make sure you understand that **********
          // If your random number is 0, you'll get 3       **********
          // (becase you always add 3 onto it), and if your **********
          // random number is 7, then you'll get 10.        **********

          // So how do you get a random number between 0    **********
          // and 7?  See if you can finish writing the code **********
          // in line (A) above.  (hint, I've already told   **********
          // you how to get a random number between 0 and   **********
          // some upper number, right?)

          // Once you have that, there's one more step.     **********
          // You're now getting a number between 3 and 10,  **********
          // but it's a fractional number like 6.9274 but   **********
          // we want whole numbers only.  To do that you    **********
          // use the Math.floor() function.  Take the code  **********
          // you wrote for line (A) and ...                 **********
          // cell.stemCount = Math.floor(*PUT IT IN HERE*)  **********
          // That should do it.  Give it a try!             **********
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
            cellUp.stemTimer = 0.5;
            cellUp.stemCount = cell.stemCount - 1;
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

      // Check for stems and seeds first so that those will
      // draw over grass and sky.
      if(cell.stemCount > 0) {
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