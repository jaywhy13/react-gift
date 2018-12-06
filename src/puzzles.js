import images from "./images";

const PUZZLES = [
  {
    sentence: 0,
    word: 3,
    solved: false,
    pictures: [images.SAMURAI, images.SAMURAI, images.SAMURAI, images.SAMURAI]
  }
];

export const getPuzzle = (sentence, word) =>
  PUZZLES.find(puzzle => puzzle.sentence === sentence && puzzle.word === word);

export const isPuzzle = (sentence, word) =>
  getPuzzle(sentence, word) !== undefined;

export const isPuzzleSolved = (sentence, word) => {
  const puzzle = getPuzzle(sentence, word);
  if (puzzle) {
    return puzzle.solved;
  }
  return true;
};
