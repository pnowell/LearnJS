export { findMountainTopsAndValleys };

// This currently finds all the moutain tops and pushes them into the topsAndValleys array.
// You need to find all the valleys in the for loop below and push them into the array as well.
function findMountainTopsAndValleys(heights) {
  var startTime = performance.now();
  for (var p = 0; p < 10; p++) {
    var topsAndValleys = [];
    for(var i = 1; i < heights.length - 1; i++) {
      if (heights[i - 1] < heights[i] && heights[i + 1] < heights[i]) {
        topsAndValleys.push(i);
      }
      if (heights[i - 1 ] > heights[i] && heights[i + 1] > heights[i]) {
        topsAndValleys.push(i);
      }
    }
  }
  console.log("Time taken = " + (performance.now() - startTime));
  return topsAndValleys;
}