import React, { Component } from "react";

import Choices from "./Choices";

export default class Puzzle extends Component {
  render() {
    const { pictures, choices } = this.props;
    return (
      <div className="puzzle">
        <div className="pictures">
          <div className="row">
            <div className="col">
              <img src={pictures[0]} alt="" />
            </div>
            <div className="col">
              <img src={pictures[1]} alt="" />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <img src={pictures[2]} alt="" />
            </div>
            <div className="col">
              <img src={pictures[3]} alt="" />
            </div>
          </div>
        </div>
        <div className="answer">your answer goes here</div>
        <div className="letters">
          <Choices choices={choices} />
        </div>
      </div>
    );
  }
}
