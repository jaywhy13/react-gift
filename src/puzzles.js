import images from "./images";

const PUZZLES = [
  {
    sentence: 0,
    word: 3,
    solved: false,
    pictures: [
      images.TROPICAL_ISLAND,
      images.SLICE_OF_CHOCOLATE_CAKE,
      images.SAMURAI,
      images.PLATE_AND_UTENSILS
    ]
  }
];

export const getPuzzle = (sentence, word) =>
  PUZZLES.find(puzzle => puzzle.sentence === sentence && puzzle.word === word);

export const isPuzzle = (sentence, word) =>
  getPuzzle(sentence, word) !== undefined;
