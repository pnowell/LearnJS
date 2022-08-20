export {
  randomIntInRange, randomListIndex
};

function randomIntInRange(low, high) {
  return Math.floor(low + Math.random() * (high - low));
}

function randomListIndex(list) {
  return randomIntInRange(0, list.length);
}