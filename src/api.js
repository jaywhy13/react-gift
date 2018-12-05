const RAW_SENTENCES = [
  "This is the first sentence",
  "This is the second sentence"
];

const PUZZLES = [
  {
    sentence: 0,
    word: 3,
    solved: false
  }
];

const getPuzzle = (sentence, word) =>
  PUZZLES.find(puzzle => puzzle.sentence === sentence && puzzle.word === word);

const isPuzzle = (sentence, word) => getPuzzle(sentence, word) !== undefined;

const makeWord = (sentence, word, text) => {
  if (isPuzzle(sentence, word)) {
    return {
      text: "???",
      puzzle: true,
      index: word
    };
  }
  return {
    text,
    puzzle: false,
    index: word
  };
};

const makeSentences = sentences => {
  const formattedSentences = [];
  for (let i = 0; i < sentences.length; i += 1) {
    const words = sentences[i].split(" ");
    const formattedSentence = [];
    for (let j = 0; j < words.length; j += 1) {
      formattedSentence.push(makeWord(i, j, words[j]));
    }
    console.log(formattedSentence);
    formattedSentences.push(formattedSentence);
  }
  return formattedSentences;
};

const SENTENCES = makeSentences(RAW_SENTENCES);
console.log("SENTENCES", SENTENCES);

const isPuzzleSolved = (sentence, word) => {
  const puzzle = getPuzzle(sentence, word);
  if (puzzle) {
    return puzzle.solved;
  }
  return true;
};

let currentSentence = 0;
let currentWord = 0;

const moveToNextWord = () => {
  if (currentSentence < SENTENCES.length) {
    const words = SENTENCES[currentSentence];
    if (currentWord + 1 >= words.length) {
      currentSentence += 1;
      currentWord = 0;
    } else {
      currentWord += 1;
    }
  }
};

const getSentences = () => {
  const sentences = [];
  for (let i = 0; i <= currentSentence; i += 1) {
    if (i < currentSentence) {
      sentences.push(SENTENCES[i]);
    } else {
      sentences.push(SENTENCES[i].slice(0, currentWord + 1));
    }
  }
  console.log("Starting sentences", sentences);
  return sentences;
};

const getNextWord = () => {
  console.log("Getting next word");
  if (
    isPuzzle(currentSentence, currentWord) &&
    !isPuzzleSolved(currentSentence, currentWord)
  ) {
    return null;
  }
  const word = makeWord(SENTENCES[currentSentence][currentWord]);
  moveToNextWord();
  return word;
};

export { makeWord, getNextWord, getSentences };
