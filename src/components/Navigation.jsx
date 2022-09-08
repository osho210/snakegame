import React from "react";
import { defaultDifficulty, Difficulty } from "../constants";

const Navigation = ({
  length,
  difficulty = defaultDifficulty, //初期難易度に3を格納
  onChangeDifficulty,
}) => {
  const upVisibilty = difficulty < Difficulty.length ? "" : "is-hidden"; //難易度数だけ変更が可能に
  const downVisibilty = difficulty > 1 ? "" : "is-hidden";
  const onUpDifficulty = () => onChangeDifficulty(difficulty + 1);
  const onDownDifficulty = () => onChangeDifficulty(difficulty - 1);

  return (
    <div className="navigation">
      <div className="navigation-item">
        <span className="nabigation-label">Length:</span>
        <div className="nabigation-item-number-container">
          <div className="num-board">{length}</div>
        </div>
      </div>
      <div className="navigation-item">
        <div className="nabigation-label">Difficulty:</div>
        <div className="nabigation-item-number-container">
          <div className="num-board">{difficulty}</div>
        </div>
      </div>
      <div className="difficulty-button-container">
        {/* 難易度上昇ボタン */}
        <div
          className={`difficulty-button difficulty-up ${upVisibilty}`}
          onClick={onUpDifficulty}
        ></div>
        {/* 難易度低下ボタン */}
        <div
          className={`difficulty-button difficulty-down ${downVisibilty}`}
          onClick={onDownDifficulty}
        ></div>
      </div>
    </div>
  );
};

export default Navigation;

//マジックナンバーを避ける設計を行うと保守性の高いプログラムを書くことができる
