import { initFileds } from "../utils";

//フィールドの大きさ
export const fieldSize = 35;
//最初の基準位置
export const initalPosition = { x: 17, y: 17 };
//スネークの位置取得(第1引数がフィル―ドサイズ、第2引数がスネークの位置)
export const initiaValues = initFileds(fieldSize, initalPosition);
//初期移動速度
export const defaultInterval = 100;
//初期難易度
export const defaultDifficulty = 3;

export const Difficulty = [1000, 500, 100, 50, 10];

//play状態のstatus
export const GameStatus = Object.freeze({
  //オブジェクトの凍結(変更不可の固定)保守性の向上に一役
  init: "init",
  playing: "playing",
  suspended: "suspended",
  gameover: "gameover",
});

//snakeの方向
export const Direction = Object.freeze({
  up: "up",
  right: "right",
  left: "left",
  down: "down",
});

//反対方向のマッピング(自分食べの防止)
export const OppositeDirection = Object.freeze({
  up: "down",
  left: "right",
  right: "left",
  douwn: "up",
});

//座標の変化量
export const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
});

//キーボードの値を取得
export const DirectionKeyCodemap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
});
