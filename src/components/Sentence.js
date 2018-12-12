import React, { Component } from "react";
import "./Sentence.css";

import PropTypes from "prop-types";
import Word from "./Word";

export default class Sentence extends Component {
  render() {
    const { sentence, punctuation } = this.props;
    return (
      <div className="sentence">
        {sentence.map((word, index) => (
          <Word index={index} key={index}>
            {word.text}
          </Word>
        ))}
        {punctuation}
      </div>
    );
  }
}

Sentence.propTypes = {
  sentence: PropTypes.arrayOf(PropTypes.object).isRequired
};
