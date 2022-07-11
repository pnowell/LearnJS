export { findMountainTop };

// for (var i = ?; i ...; i++)

function findMountainTop(heights) {
  for(var i = 1; i < heights.length - 1; i++) {
    if (heights[i - 1] < heights[i] && heights[i + 1] < heights[i])
      return i;
  }
  return -1;
}