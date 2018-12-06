import React, { Component } from "react";

import PropTypes from "prop-types";

export default class Answer extends Component {
  render() {
    const { length, selectedChoices } = this.props;
    const answers = [];
    const numSelectedChoices = selectedChoices.length;
    for (let i = 0; i < length; i += 1) {
      const text = i < numSelectedChoices ? selectedChoices[i].letter : "";
      answers.push(<span className="answer-letter">{text}</span>);
    }
    return <div className="answer">{answers}</div>;
  }
}

Answer.propTypes = {
  length: PropTypes.number.isRequired,
  selectedChoices: PropTypes.arrayOf(
    PropTypes.shape({
      letter: PropTypes.string.isRequired,
      disabled: PropTypes.bool.isRequired
    })
  ).isRequired
};
