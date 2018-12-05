import React, { Component } from "react";

import Letter from "./Letter";
import "./App.css";

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
        <div className="container">
          <Letter sentences={sentences} title={"This is the title"} />
        </div>
        <div className="controls">
          <button
            onClick={() => this.goToNextWord()}
            disabled={this.state.puzzle}
          >
            Next Word
          </button>
        </div>
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
