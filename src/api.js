const RAW_SENTENCES = [
  "This is the first sentence",
  "This is the second sentence"
];

const makeWord = (sentence, word, text) => ({ text, index: word, sentence });

const makeSentences = sentences => {
  const formattedSentences = [];
  for (let i = 0; i < sentences.length; i += 1) {
    const words = sentences[i].split(" ");
    const formattedSentence = [];
    for (let j = 0; j < words.length; j += 1) {
      formattedSentence.push(makeWord(i, j, words[j]));
    }
    formattedSentences.push(formattedSentence);
  }
  return formattedSentences;
};

const SENTENCES = makeSentences(RAW_SENTENCES);

export const getWordAfter = (currentSentence, currentWord) => {
  if (currentSentence < SENTENCES.length) {
    const words = SENTENCES[currentSentence];
    if (currentWord + 1 >= words.length) {
      return SENTENCES[currentSentence + 1][0];
    }
    return SENTENCES[currentSentence][currentWord + 1];
  }
  return null;
};

const getSentences = (currentSentence, currentWord) => {
  const sentences = [];
  for (let i = 0; i <= currentSentence; i += 1) {
    if (i < currentSentence) {
      sentences.push(SENTENCES[i]);
    } else {
      sentences.push(SENTENCES[i].slice(0, currentWord + 1));
    }
  }
  return sentences;
};

export { makeWord, getSentences };
