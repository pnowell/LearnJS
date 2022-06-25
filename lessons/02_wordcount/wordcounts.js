export { wordCounts };

// This function takes an array of words and returns an array of word length counts
// For example if there are 3 1-letter words, 5 2-letter words, 10 3-letter words
// and 1 4-letter word, it would return the array [0, 3, 5, 10, 1]
function wordCounts(wordList) {
  // Find out how long the longest word is.

  // Start out saying the longest word we've seen so far is zero letters long
  // (because we haven't looks at any words yet)
  var longestLength = 0;

  // Then loop over all the words to look for anything longer than the current
  // record.
  for (var i = 0; i < wordList.length; i++) {
    // The word you're checking right now is wordList[i] and you want to know how
    // long it is.  You can do that with wordList[i].length.  That gives you the
    // length of the word stored in wordList[i].
    var wordLength = wordList[i].length;

    // You need to see if that word length is longer than our current record.
    // If it is, set the record to the current word length.
    if (wordLength > longestLength) {
      longestLength = wordLength;
      console.log(wordList[i]);
    }
  }

  // Make an array long enough to count all the different word lengths.
  // We'll need to make it go up to longestLength which is why we do "<="
  // rather than just "<".
  var counts = [];
  for (var i = 0; i <= longestLength; i++) {
    // Add a zero to the counts array
    counts.push(0);
  }

  // Now we need to loop over all the words in wordList again and add up
  // the different word lengths we see along the way.
  for (var i = 0; i < wordList.length; i++) {
    // Remember how we get the length of the current word?
    var wordLength =  wordList[i].length;

    if (wordLength === longestLength) {
      console.log(wordList[i]);
    }


    // Now we need to make sure that spot in the "counts" array gets one more
    // added to it
    counts[wordLength]++;
  }
  console.dir(counts);
  // Now we're all done building the counts array, and we can return it.
  return counts;
}