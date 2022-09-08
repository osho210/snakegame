import React from "react";
import { Direction } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowUp,
  faArrowDown,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const ManipulationPanel = ({ onChange }) => {
  const onUp = () => {
    onChange(Direction.up);
  };
  const onRigth = () => {
    onChange(Direction.right);
  };
  const onLeft = () => {
    onChange(Direction.left);
  };
  const onDown = () => {
    onChange(Direction.down);
  };

  return (
    <div className="manipulation-panel">
      <button className="manipulation-btn btn btn-left" onClick={onLeft}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <div>
        <button className="manipulation-btn btn btn-up" onClick={onUp}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button className="manipulation-btn btn btn-down" onClick={onDown}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
      <button className="manipulation-btn btn btn-right" onClick={onRigth}>
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default ManipulationPanel;
