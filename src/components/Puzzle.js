import React, { Component } from "react";

import PropTypes from "prop-types";

import "./Puzzle.css";

import classNames from "classnames";

import Choices from "./Choices";
import Answer from "./Answer";
import { Grid, Row, Col } from "react-bootstrap";

export default class Puzzle extends Component {
  state = {
    zoomedImage: null
  };
  renderAnswer() {
    const {
      selectedChoices,
      onChoiceDeselected,
      correct,
      incorrect
    } = this.props;
    const answer = selectedChoices.map(choice => (choice ? choice.letter : ""));
    return (
      <div className="user-answer">
        <Answer
          answer={answer}
          correct={correct}
          incorrect={incorrect}
          onClick={(letter, index) => {
            if (letter) onChoiceDeselected(selectedChoices[index]);
          }}
        />
      </div>
    );
  }

  renderPicture(index, zoomed = false) {
    const { pictures } = this.props;
    return (
      <Col lg={zoomed ? 12 : 6}>
        <div
          className={classNames("picture", { zoomed })}
          style={{
            minHeight: "500px"
          }}
        >
          <img
            src={pictures[index]}
            alt="Pic 0"
            onClick={() => (zoomed ? this.zoomOut() : this.zoomImage(index))}
          />
        </div>
      </Col>
    );
  }

  zoomImage(index) {
    this.setState({
      zoomedImage: index
    });
  }

  zoomOut() {
    this.setState({
      zoomedImage: null
    });
  }

  renderPictures() {
    const { pictures } = this.props;
    const { zoomedImage } = this.state;
    if (zoomedImage !== null) {
      return (
        <div className="pictures">
          <Row>{this.renderPicture(zoomedImage, true)}</Row>
        </div>
      );
    }
    return (
      <div className="pictures">
        <Row>
          {this.renderPicture(0)}
          {this.renderPicture(1)}
        </Row>
        <Row>
          {this.renderPicture(2)}
          {this.renderPicture(3)}
        </Row>
      </div>
    );
  }

  renderLetters() {
    const { choices, selectedChoices, onChoiceSelected } = this.props;
    return (
      <div className="letters">
        <Choices
          choices={choices}
          onChoiceSelected={onChoiceSelected}
          selectedChoices={selectedChoices}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="puzzle">
        <Grid>
          <Row>
            <Col>{this.renderPictures()}</Col>
          </Row>
          <Row>
            <Col>{this.renderAnswer()}</Col>
          </Row>
          <Row>
            <Col>{this.renderLetters()}</Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Puzzle.propTypes = {
  onChoiceSelected: PropTypes.func.isRequired,
  onChoiceDeselected: PropTypes.func.isRequired,
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      letter: PropTypes.string.isRequired,
      disabled: PropTypes.bool.isRequired
    })
  ).isRequired,
  selectedChoices: PropTypes.arrayOf(
    PropTypes.shape({
      letter: PropTypes.string.isRequired,
      disabled: PropTypes.bool.isRequired
    })
  ).isRequired,
  pictures: PropTypes.arrayOf(PropTypes.string).isRequired
};
