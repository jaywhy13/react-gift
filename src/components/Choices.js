import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Choices extends Component {
  render() {
    const { choices } = this.props;
    const letters = choices.split("");
    return (
      <div className="choices">
        {letters.map(letter => (
          <span className="choice">{letter}</span>
        ))}
      </div>
    );
  }
}

Choices.propTypes = {
  choices: PropTypes.instanceOf(PropTypes.string).isRequired
};
