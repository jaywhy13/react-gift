import React, { Component } from "react";

import Letter from "./Letter";
import "./App.css";

import { getSentences, getWordAfter } from "../api";
import { getPuzzle, isPuzzle, isPuzzleSolved } from "../puzzles";
import Puzzle from "./Puzzle";

class App extends Component {
  state = {
    sentences: [],
    choices: [],
    selectedChoices: [],
    puzzle: null,
    currentSentence: 0,
    currentWord: 0,
    answer: ""
  };

  componentDidMount() {
    const { currentSentence, currentWord } = this.state;
    this.setState({ sentences: getSentences(currentSentence, currentWord) });
  }

  render() {
    const { sentences, puzzle, choices, selectedChoices, answer } = this.state;
    return (
      <div className="App">
        <div className="container">
          <Letter sentences={sentences} title={"This is the title"} />
        </div>
        <div className="controls">
          <button
            onClick={() => this.goToNextWord()}
            disabled={this.state.puzzle}
          >
            Next Word
          </button>
        </div>
        {puzzle ? (
          <Puzzle
            onChoiceSelected={this.onChoiceSelected.bind(this)}
            choices={choices}
            selectedChoices={selectedChoices}
            pictures={puzzle.pictures}
            answerLength={answer.length}
          />
        ) : (
          ""
        )}
      </div>
    );
  }

  onChoiceSelected(choice) {
    console.log("Adding selected choice", choice);
    this.setState({
      selectedChoices: [...this.state.selectedChoices, choice],
      choices: this.generateChoices(this.state.answer)
    });
  }

  generateChoices(text) {
    return text.split("").map((letter, index) => ({
      letter,
      index
    }));
  }

  goToNextWord() {
    // Get the next word
    const { currentSentence, currentWord } = this.state;
    const nextWord = getWordAfter(currentSentence, currentWord);
    console.log("Next word is", nextWord);
    if (!nextWord) {
      return;
    }

    const puzzle = getPuzzle(nextWord.sentence, nextWord.index);
    console.log("puzzle = ", puzzle);
    if (puzzle && !isPuzzleSolved(nextWord.sentence, nextWord.index)) {
      const choices = this.generateChoices(nextWord.text);
      this.setState({
        puzzle,
        choices,
        selectedChoices: [],
        answer: nextWord.text
      });
      return;
    } else {
      this.setState({
        puzzle: null
      });
    }

    const sentences = getSentences(nextWord.sentence, nextWord.index);
    const lastSentence = sentences[sentences.length - 1];
    console.log("Updating state", sentences, lastSentence);
    this.setState({
      sentences,
      puzzle: null,
      currentSentence: nextWord.sentence,
      currentWord: nextWord.index
    });
  }
}

export default App;
