import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Letter extends Component {
  static propTypes = {
    words: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    return <div>this.props.words.map(word => {<span>{word.text}</span>});</div>;
  }
}
