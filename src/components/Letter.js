import React, { Component } from "react";
import PropTypes from "prop-types";

import Sentence from "./Sentence";

export default class Letter extends Component {
  render() {
    const { sentences, title, punctuation } = this.props;
    return (
      <div className="letter">
        <div className="title">
          <h1>{title}</h1>
        </div>
        {sentences.map((sentence, index) => (
          <Sentence
            sentence={sentence}
            key={index}
            punctuation={index === sentences.length - 1 ? punctuation : null}
          />
        ))}
      </div>
    );
  }
}

Letter.defaultProps = {
  sentences: []
};
Letter.propTypes = {
  title: PropTypes.string.isRequired,
  sentences: PropTypes.arrayOf(PropTypes.array)
};
