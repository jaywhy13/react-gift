import React, { Component } from "react";

export default class Word extends Component {
  render() {
    const { index, children, onClick } = this.props;
    return (
      <span
        className="word"
        key={index}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      >
        {children}
      </span>
    );
  }
}
