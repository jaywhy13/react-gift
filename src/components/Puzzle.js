import React, { Component } from "react";

import PropTypes from "prop-types";

import "./Puzzle.css";

import Choices from "./Choices";
import Answer from "./Answer";

export default class Puzzle extends Component {
  renderAnswer() {
    const {
      selectedChoices,
      onChoiceDeselected,
      correct,
      incorrect
    } = this.props;
    const answer = selectedChoices.map(choice => (choice ? choice.letter : ""));
    return (
      <div className="answer">
        <Answer
          answer={answer}
          correct={correct}
          incorrect={incorrect}
          onClick={(letter, index) => {
            if (letter) onChoiceDeselected(selectedChoices[index]);
          }}
        />
      </div>
    );
  }

  render() {
    const {
      pictures,
      choices,
      selectedChoices,
      onChoiceSelected,
      onClosePuzzle
    } = this.props;
    return (
      <div className="puzzle">
        <span onClick={() => onClosePuzzle()}>Close</span>
        <div className="pictures">
          <div className="row">
            <div className="col">
              <img src={pictures[0]} alt="" />
            </div>
            <div className="col">
              <img src={pictures[1]} alt="" />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <img src={pictures[2]} alt="" />
            </div>
            <div className="col">
              <img src={pictures[3]} alt="" />
            </div>
          </div>
        </div>
        {this.renderAnswer()}
        <div className="letters">
          <Choices
            choices={choices}
            onChoiceSelected={onChoiceSelected}
            selectedChoices={selectedChoices}
          />
        </div>
      </div>
    );
  }
}

Puzzle.propTypes = {
  onChoiceSelected: PropTypes.func.isRequired,
  onChoiceDeselected: PropTypes.func.isRequired,
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      letter: PropTypes.string.isRequired,
      disabled: PropTypes.bool.isRequired
    })
  ).isRequired,
  selectedChoices: PropTypes.arrayOf(
    PropTypes.shape({
      letter: PropTypes.string.isRequired,
      disabled: PropTypes.bool.isRequired
    })
  ).isRequired,
  pictures: PropTypes.arrayOf(PropTypes.string).isRequired
};
