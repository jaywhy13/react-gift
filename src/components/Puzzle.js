import React, { Component } from "react";

import PropTypes from "prop-types";

import "./Puzzle.css";

import Choices from "./Choices";
import Answer from "./Answer";

export default class Puzzle extends Component {
  render() {
    const {
      pictures,
      choices,
      selectedChoices,
      onChoiceSelected,
      answerLength
    } = this.props;
    return (
      <div className="puzzle">
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
        <div className="answer">
          <Answer selectedChoices={selectedChoices} length={answerLength} />
        </div>
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
  pictures: PropTypes.arrayOf(PropTypes.string).isRequired,
  answerLength: PropTypes.number.isRequired
};
