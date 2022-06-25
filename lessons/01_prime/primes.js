export { findPrimes };

function findPrimes() {
  // Make an empty array, and we can add to it as we find prime numbers.
  var primes = [];

  // Go through all the numbers from 2 to 100 and figure out if each one is prime
  for (var number = 2; number < 100; number++) {
    // Start out saying that it's prime, until we find some way to divide it
    // If we find a number that divides it evenly, then we'll set isPrime to false
    var isPrime = true;
    // Make another loop to check if number can be divided by any smaller value
    for (var x = 2; x < number; x++) {
      // If number is divisible by x...
      if (number % x === 0) {
        // We know this number isn't prime (since we found something that can evenly divide it),
        // so set isPrime to false and break out of this loop (the loop that's looking for a divisor)
        isPrime = false;
        break;
      }
    }

    // We're outside of the loop. isPrime let's us know if the number is prime.
    if (isPrime) {
      // Add number to our primes array
      primes.push(number);
    }
  }

  // Return the primes array and it'll get drawn and check your results.
  return primes;
}