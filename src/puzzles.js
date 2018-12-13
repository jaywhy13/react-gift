import images from "./images";

const PUZZLES = {
  mature: {
    pictures: [
      images.GOLDEN_GIRLS,
      images.OLD_AGE_HOME,
      images.FIFTY_SHADES,
      images.AMERICAN_PIE
    ]
  }
};

export const getPuzzle = text => PUZZLES[text];

export const isPuzzle = text => getPuzzle(text) !== undefined;
