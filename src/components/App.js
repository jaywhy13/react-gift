import React, { Component } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Letter from "./Letter";
import "./App.css";
import randomLetter from "random-letter";
import shuffle from "shuffle-array";
import classNames from "classnames";

import { Modal, Grid, Row, Col, Button } from "react-bootstrap";

import { getSentences, getWordAfter } from "../api";
import { getPuzzle, isPuzzle } from "../puzzles";
import Puzzle from "./Puzzle";
import Word from "./Word";

import { getObject, saveObject } from "../storage";

const TOTAL_CHOICES = 12;
const SAVED_STATE_KEY = "react-gift-state";
const MAX_HINTS = 3;
const SECONDS_BEFORE_REPLENISHING_HINTS = 30;
const INTERVAL_TO_CHECK_HINTS = 5;

const DEFAULT_STATE = {
  // Navigation
  sentences: [],
  currentSentence: 0,
  currentWord: 0,

  // Puzzle
  puzzle: null,
  solvedPuzzles: [],

  // hints
  lastHint: null,
  hintsUsed: 0,

  // Misc
  resetModalVisible: false
};

class App extends Component {
  state = {
    ...DEFAULT_STATE
  };

  componentDidMount() {
    const serializedState = getObject(SAVED_STATE_KEY);
    console.log("Serialized state", serializedState);
    if (serializedState !== null) {
      this.setState({
        ...DEFAULT_STATE,
        ...serializedState
      });
    } else {
      const { currentSentence, currentWord } = this.state;
      this.setState({
        ...DEFAULT_STATE,
        sentences: getSentences(currentSentence, currentWord)
      });
    }

    setInterval(() => this.replenishHints(), 1000 * INTERVAL_TO_CHECK_HINTS);
  }

  saveState() {
    saveObject(SAVED_STATE_KEY, this.state);
  }

  renderPuzzle() {
    const { puzzle } = this.state;
    if (!puzzle) return;
    const {
      choices,
      selectedChoices,
      answer,
      correct,
      incorrect,
      visible,
      pictures
    } = puzzle;
    const puzzleElement = (
      <Puzzle
        onChoiceSelected={this.onChoiceSelected.bind(this)}
        onChoiceDeselected={this.onChoiceDeselected.bind(this)}
        onClosePuzzle={this.onClosePuzzle.bind(this)}
        choices={choices}
        selectedChoices={selectedChoices}
        pictures={pictures}
        correct={correct}
        incorrect={incorrect}
        answerLength={answer.length}
      />
    );

    const modal = (
      <Modal show={visible} onHide={() => this.onClosePuzzle()}>
        <Modal.Body>{puzzleElement}</Modal.Body>
        <Modal.Footer>
          <img
            src={"/images/questionssvg-512.png"}
            width="32px"
            alt="Hint"
            className={classNames("hint", { disabled: !this.canGiveHint() })}
            onClick={this.giveHint.bind(this)}
          />
          <Button onClick={this.onClosePuzzle.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
    return modal;
  }

  render() {
    const { puzzle } = this.state;
    return (
      <div className="App">
        {this.renderControls()}
        {this.renderResetModal()}
        <Grid>
          <Row>
            <Col>
              <div className="container">
                {this.renderLetter()}
                {this.renderPuzzle()}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

  canGiveHint() {
    const { hintsUsed } = this.state;
    return hintsUsed < MAX_HINTS;
  }

  replenishHints() {
    console.log("Checking if we should replenish hints");
    const { lastHint } = this.state;
    if (lastHint !== null) {
      const now = new Date();
      const diffInSeconds = (now.getTime() - lastHint) / 1000;
      if (diffInSeconds > SECONDS_BEFORE_REPLENISHING_HINTS) {
        console.log("Replenishing hints");
        this.setState({
          hintsUsed: 0,
          lastHint: null
        });
      }
    }
  }

  giveHint() {
    if (!this.canGiveHint()) return;
    const { puzzle } = this.state;
    if (puzzle) {
      const { choices, answer, selectedChoices } = puzzle;
      if (this.isPuzzleSolved(answer)) {
        return;
      }
      let randomSelectedIndex = parseInt(
        Math.random() * selectedChoices.length
      );
      do {
        randomSelectedIndex = parseInt(Math.random() * selectedChoices.length);
        console.log("Looking for a random index");
      } while (
        selectedChoices[randomSelectedIndex] !== null &&
        selectedChoices[randomSelectedIndex] !== undefined
      );
      if (
        selectedChoices[randomSelectedIndex] === null ||
        selectedChoices[randomSelectedIndex] === undefined
      ) {
        console.log(randomSelectedIndex, "is null");
        const letterAtIndex = answer.charAt(randomSelectedIndex);
        console.log("Will find a choice for", letterAtIndex);
        for (let i = 0; i < choices.length; i++) {
          // Find the first unselected choice that matches
          let candidateChoice = choices[i];
          if (candidateChoice.letter === letterAtIndex) {
            console.log("Gonna select", candidateChoice);
            this.onChoiceSelected(candidateChoice, randomSelectedIndex);
            this.setState(({ hintsUsed }) => {
              return {
                hintsUsed: hintsUsed + 1,
                lastHint: new Date().getTime()
              };
            });
            break;
          } else {
            console.log(
              "Candidate",
              candidateChoice.letter,
              "doesnt match",
              letterAtIndex
            );
          }
        }
      }
    }
  }

  renderResetModal() {
    const { resetModalVisible } = this.state;
    const modal = (
      <Modal show={resetModalVisible} onHide={() => this.hideResetModal()}>
        <Modal.Body>
          <span>Are you sure you want to start over?</span>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.resetState.bind(this)}>Yes</Button>
          <Button onClick={this.hideResetModal.bind(this)}>No</Button>
        </Modal.Footer>
      </Modal>
    );
    return modal;
  }

  renderControls() {
    const { puzzle } = this.state;
    return (
      <div
        className={classNames("controls", {
          disabled: puzzle && !this.isPuzzleSolved(puzzle.answer)
        })}
      >
        <img
          src={"/images/refresh-512.png"}
          width="48px"
          onClick={() => this.showResetModal()}
        />
        <img
          src={"/images/next_arrow-512.png"}
          width="48px"
          onClick={() => this.goToNextWord()}
          disabled={puzzle && !this.isPuzzleSolved(puzzle.answer)}
        />
      </div>
    );
  }

  showResetModal() {
    this.setState({
      resetModalVisible: true
    });
  }

  hideResetModal() {
    this.setState({
      resetModalVisible: false
    });
  }

  renderLetter() {
    const { sentences } = this.state;
    return (
      <Letter
        sentences={sentences}
        title={"Happy Birthday!"}
        punctuation={this.renderPunctuation()}
      />
    );
  }

  renderPunctuation() {
    const { puzzle } = this.state;
    if (puzzle && !this.isPuzzleSolved(puzzle.answer)) {
      return (
        <div className="punctuation">
          <img
            src="/images/4picslogo.png"
            onClick={() => {
              this.openPuzzle();
            }}
          />
        </div>
      );
    }
  }

  onChoiceSelected(choice, placeAtIndex = null) {
    const { puzzle } = this.state;
    if (!puzzle) return;
    if (this.isPuzzleSolved(puzzle.answer)) return;

    const updatedChoices = [...puzzle.selectedChoices];
    let index;
    if (placeAtIndex === null) {
      for (index = 0; index < updatedChoices.length; index++) {
        const element = updatedChoices[index];
        if (element === undefined || element === null) {
          break;
        }
      }
    } else {
      index = placeAtIndex;
    }
    updatedChoices[index] = choice;

    console.log("Updating selectedChoices", updatedChoices);

    this.setState(
      {
        puzzle: {
          ...puzzle,
          selectedChoices: updatedChoices
        }
      },
      () => {
        this.checkAnswer();
      }
    );
  }

  checkAnswer() {
    const { puzzle, solvedPuzzles } = this.state;
    const { answer, selectedChoices } = puzzle;
    const filledSelections = selectedChoices.filter(choice =>
      choice && choice.letter ? true : false
    );
    if (answer.length === filledSelections.length) {
      const userAnswer = selectedChoices.map(choice => choice.letter).join("");
      const correct = userAnswer === answer;
      this.setState({
        puzzle: {
          ...puzzle,
          correct,
          incorrect: !correct
        }
      });
      if (correct) {
        this.setState(
          {
            solvedPuzzles: [answer, ...solvedPuzzles]
          },
          () => {
            this.goToNextWord();
          }
        );
      }
    } else {
      this.setState({
        puzzle: {
          ...puzzle,
          incorrect: false,
          correct: false
        }
      });
    }
  }

  isChoiceSelected(choice) {
    const { puzzle } = this.state;
    if (!puzzle) {
      return false;
    }

    const { selectedChoices } = puzzle;
    return selectedChoices.find(
      otherChoice =>
        otherChoice &&
        otherChoice.letter === choice.letter &&
        otherChoice.index == choice.index
    );
  }

  onChoiceDeselected(choice) {
    const { puzzle } = this.state;
    const { selectedChoices } = puzzle;
    const updatedChoices = selectedChoices.map(otherChoice =>
      otherChoice &&
      otherChoice.letter === choice.letter &&
      otherChoice.index === choice.index
        ? undefined
        : otherChoice
    );
    this.setState(
      { puzzle: { ...puzzle, selectedChoices: updatedChoices } },
      () => {
        this.checkAnswer();
      }
    );
  }

  onClosePuzzle() {
    if (!this.state.puzzle) return;
    const { puzzle } = this.state;
    this.setState(
      {
        puzzle: {
          ...puzzle,
          visible: false
        }
      },
      () => {
        this.saveState();
      }
    );
  }

  openPuzzle() {
    if (!this.state.puzzle) return;
    const { puzzle } = this.state;
    this.setState({
      puzzle: {
        ...puzzle,
        visible: true
      }
    });
  }

  generateChoices(text) {
    const numRandomLetters = TOTAL_CHOICES - text.length;
    const allLetters = text.split("");
    for (let index = 0; index < numRandomLetters; index++) {
      allLetters.push(randomLetter());
    }
    const shuffledLetters = shuffle(allLetters);
    return shuffledLetters.map((letter, index) => ({
      letter: letter.toUpperCase(),
      index
    }));
  }

  isPuzzleSolved(text) {
    const { solvedPuzzles } = this.state;
    return solvedPuzzles.indexOf(text.toUpperCase()) > -1;
  }

  resetState() {
    this.setState(
      {
        ...DEFAULT_STATE,
        sentences: getSentences(0, 0)
      },
      () => {
        this.saveState();
      }
    );
  }

  goToNextWord() {
    // Get the next word
    const { currentSentence, currentWord } = this.state;
    const nextWord = getWordAfter(currentSentence, currentWord);
    if (!nextWord) {
      return;
    }

    const puzzle = getPuzzle(nextWord.text);
    console.log("Next word is ", nextWord.text, "is it a puzzle?", puzzle);
    if (puzzle && !this.isPuzzleSolved(nextWord.text)) {
      const answer = nextWord.text.toUpperCase();
      const choices = this.generateChoices(answer);
      this.setState(
        {
          puzzle: {
            pictures: puzzle.pictures,
            word: puzzle.word,
            sentence: puzzle.sentence,
            choices,
            selectedChoices: new Array(answer.length),
            answer,
            incorrect: false,
            correct: false,
            visible: true
          }
        },
        () => {
          this.saveState();
        }
      );
      return;
    }

    const sentences = getSentences(nextWord.sentence, nextWord.index);
    const lastSentence = sentences[sentences.length - 1];
    this.setState(
      {
        sentences,
        currentSentence: nextWord.sentence,
        currentWord: nextWord.index
      },
      () => {
        this.saveState();
      }
    );
  }
}

export default App;
