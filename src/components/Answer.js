import React, { Component } from "react";

import classNames from "classnames";

import PropTypes from "prop-types";

import "./Answer.css";

export default class Answer extends Component {
  render() {
    const { answer, onClick, correct, incorrect } = this.props;
    const letters = [];
    for (let index = 0; index < answer.length; index++) {
      const letter = answer[index] || "";
      letters.push(
        <span className="answer-letter" onClick={() => onClick(letter, index)}>
          {letter}
        </span>
      );
    }
    return (
      <div
        className={classNames("answer", {
          correct,
          incorrect
        })}
      >
        {letters}
      </div>
    );
  }
}

Answer.propTypes = {
  answer: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
  correct: PropTypes.bool,
  incorrect: PropTypes.bool
};
