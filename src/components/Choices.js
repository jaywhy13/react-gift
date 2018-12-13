import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./Choices.css";
import { Col } from "react-bootstrap";

export default class Choices extends Component {
  handleChoiceSelected(choice) {
    const { onChoiceSelected, disabled } = this.props;
    if (!this.isChoiceSelected(choice) || disabled) {
      onChoiceSelected(choice);
    }
  }

  isChoiceSelected(choice) {
    const { selectedChoices } = this.props;
    return (
      selectedChoices.find(
        otherChoice =>
          otherChoice &&
          otherChoice.index === choice.index &&
          otherChoice.letter === choice.letter
      ) !== undefined
    );
  }

  render() {
    const { choices } = this.props;
    const firstRow = choices.slice(0, 6);
    const lastRow = choices.slice(6);
    return (
      <div className="choices">
        <Col xs={12}>
          {firstRow.map(({ letter, index }) => (
            <div
              key={index}
              onClick={() => this.handleChoiceSelected({ letter, index })}
              className={classNames("choice", {
                disabled: this.isChoiceSelected({ letter, index })
              })}
            >
              {letter}
            </div>
          ))}
        </Col>
        <Col xs={12}>
          {lastRow.map(({ letter, index }) => (
            <div
              key={index}
              onClick={() => this.handleChoiceSelected({ letter, index })}
              className={classNames("choice", {
                disabled: this.isChoiceSelected({ letter, index })
              })}
            >
              {letter}
            </div>
          ))}
        </Col>
      </div>
    );
  }
}

Choices.propTypes = {
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      letter: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedChoices: PropTypes.arrayOf(
    PropTypes.shape({
      letter: PropTypes.string.isRequired
    })
  ).isRequired,

  onChoiceSelected: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};
