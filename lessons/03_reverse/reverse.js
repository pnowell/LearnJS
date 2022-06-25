export { reverse };

function reverse(letters) {
  // Letters is an array of letters that we got from the input on the page.
  // We create an empty array to store the backwards list of letters.
  var backwardsLetters = [];

  // Loop over the array of letters
  for (var i = letters.length - 1; i >= 0; i--) {
    backwardsLetters.push(letters[i]);
  }

  // Return the backwards list of letters.
  return backwardsLetters;
}