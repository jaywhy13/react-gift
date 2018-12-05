import React, { Component } from "react";
import "./Sentence.css";

import PropTypes from "prop-types";

export default class Sentence extends Component {
  render() {
    const { sentence } = this.props;
    return (
      <div className="sentence">
        {sentence.map(word => (
          <span className="word">{word.text}</span>
        ))}
      </div>
    );
  }
}

Sentence.propTypes = {
  sentence: PropTypes.arrayOf(PropTypes.object).isRequired
};