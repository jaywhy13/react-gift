import React, { Component } from "react";
import PropTypes from "prop-types";

import Sentence from "./Sentence";

export default class Letter extends Component {
  render() {
    const { sentences, title } = this.props;
    return (
      <div className="letter">
        <div className="title">
          <h1>{title}</h1>
        </div>
        {sentences.map(sentence => (
          <Sentence sentence={sentence} />
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
