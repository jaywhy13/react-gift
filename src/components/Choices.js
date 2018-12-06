import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./Choices.css";

export default class Choices extends Component {
  handleChoiceSelected(choice) {
    const { onChoiceSelected } = this.props;
    if (!this.isChoiceSelected(choice)) {
      onChoiceSelected(choice);
    }
  }

  isChoiceSelected(choice) {
    const { selectedChoices } = this.props;
    return (
      selectedChoices.find(
        otherChoice =>
          otherChoice.index === choice.index &&
          otherChoice.letter === choice.letter
      ) !== undefined
    );
  }

  render() {
    const { choices } = this.props;
    return (
      <div className="choices">
        {choices.map(({ letter, index }) => (
          <div
            onClick={() => this.handleChoiceSelected({ letter, index })}
            className={classNames("choice", {
              disabled: this.isChoiceSelected({ letter, index })
            })}
          >
            {letter}
          </div>
        ))}
      </div>
    );
  }
}

Choices.propTypes = {
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

  onChoiceSelected: PropTypes.func.isRequired
};
