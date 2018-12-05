import React, { Component } from "react";

import Letter from "./Letter";

import { getSentences, getNextWord } from "../api";

class App extends Component {
  state = {
    sentences: []
  };

  componentDidMount() {
    this.setState({ sentences: getSentences() });
  }

  render() {
    const { sentences } = this.state;
    return (
      <div className="App">
        <Letter sentences={sentences} />

        <button
          onClick={() => this.goToNextWord()}
          disabled={this.state.puzzle}
        >
          Next
        </button>
      </div>
    );
  }

  goToNextWord() {
    getNextWord();
    this.setState({
      sentences: getSentences()
    });
  }
}

export default App;
