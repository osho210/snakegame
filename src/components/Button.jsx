import React from "react";
import { GameStatus } from "../constants";   //objectプロパティでバグ防止

const Button = ({ status, onStart, onRestart, onStop }) => {
  return (
    <div className="button">
      {status === GameStatus.gameover && (
        <button className="btn btn-gameover" onClick={onRestart}>
          gameover
        </button>
      )}
      {status === GameStatus.init && (
        <button className="btn btn-init" onClick={onStart}>
          start
        </button>
      )}
      {status === GameStatus.suspended && (
        <button className="btn btn-suspended" onClick={onStart}>
          start
        </button>
      )}
      {status === GameStatus.playing && (
        <button className="btn btn-playing" onClick={onStop}>
          stop
        </button>
      )}
      {/* {console.log(status)} */}
    </div>
  );
};

export default Button;
