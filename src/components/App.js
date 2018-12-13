import React, { Component } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Letter from "./Letter";
import "./App.css";
import randomLetter from "random-letter";
import shuffle from "shuffle-array";

import { Modal, Grid, Row, Col, Button } from "react-bootstrap";

import { getSentences, getWordAfter } from "../api";
import { getPuzzle, isPuzzle } from "../puzzles";
import Puzzle from "./Puzzle";
import Word from "./Word";

import { getObject, saveObject } from "../storage";

const TOTAL_CHOICES = 12;
const SAVED_STATE_KEY = "react-gift-state";

const DEFAULT_STATE = {
  // Navigation
  sentences: [],
  currentSentence: 0,
  currentWord: 0,

  // Puzzle
  puzzle: null,
  solvedPuzzles: []
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
        <Grid>
          <Row>
            <Col>
              <div className="container">
                {this.renderLetter()}
                {this.renderPuzzle()}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="controls">
                <Button
                  onClick={() => this.goToNextWord()}
                  disabled={puzzle && !this.isPuzzleSolved(puzzle)}
                >
                  Next Word
                </Button>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }

  renderLetter() {
    const { sentences } = this.state;
    return (
      <Letter
        sentences={sentences}
        title={"This is the title"}
        punctuation={this.renderPunctuation()}
      />
    );
  }

  renderPunctuation() {
    const { puzzle } = this.state;
    if (puzzle && !this.isPuzzleSolved(puzzle)) {
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

  onChoiceSelected(choice) {
    const { puzzle } = this.state;

    const updatedChoices = [...puzzle.selectedChoices];
    for (let index = 0; index < updatedChoices.length; index++) {
      const element = updatedChoices[index];
      if (element === undefined || element === null) {
        updatedChoices[index] = choice;
        break;
      }
    }

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
            solvedPuzzles: [puzzle, ...solvedPuzzles]
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

  isPuzzleSolved({ word, sentence }) {
    const { solvedPuzzles } = this.state;
    return (
      solvedPuzzles.find(
        puzzle => sentence === puzzle.sentence && word === puzzle.word
      ) !== undefined
    );
  }

  goToNextWord() {
    // Get the next word
    const { currentSentence, currentWord } = this.state;
    const nextWord = getWordAfter(currentSentence, currentWord);
    if (!nextWord) {
      return;
    }

    const puzzle = getPuzzle(nextWord.sentence, nextWord.index);
    if (puzzle && !this.isPuzzleSolved(puzzle)) {
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
