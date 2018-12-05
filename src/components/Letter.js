import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Letter extends Component {
  render() {
    const { sentences } = this.props;
    return (
      <div>
        The letter
        {sentences.map(sentence => (
          <div className="sentence">
            {sentence.map(word => (
              <span className="word">{word.text}</span>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

Letter.defaultProps = {
  sentences: []
};
Letter.propTypes = {
  sentences: PropTypes.arrayOf(PropTypes.array)
};
