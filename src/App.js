import React, { useState, useEffect, useCallback } from "react";
import Button from "./components/Button";
import Field from "./components/Field";
import ManipulationPanel from "./components/ManipulationPanel";
import Navigation from "./components/Navigation";
import { initFileds, getFoodPosition } from "./utils";

//最初の基準位置
const initalPosition = { x: 17, y: 17 };
//スネークの位置取得(第1引数がフィル―ドサイズ、第2引数がスネークの位置)
const initiaValues = initFileds(35, initalPosition);
//初期移動速度
const defaultInterval = 100;
//初期難易度
const defaultDifficulty = 3;
const Difficulty = [1000, 500, 100, 50, 10];

//play状態のstatus
const GameStatus = Object.freeze({
  //オブジェクトの凍結(変更不可の固定)保守性の向上に一役
  init: "init",
  playing: "playing",
  suspended: "suspended",
  gameover: "gameover",
});

//snakeの方向
const Direction = Object.freeze({
  up: "up",
  right: "right",
  left: "left",
  down: "down",
});

//反対方向のマッピング(自分食べの防止)
const OppositeDirection = Object.freeze({
  up: "down",
  left: "right",
  right: "left",
  douwn: "up",
});

//座標の変化量
const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
});

//キーボードの値を取得
const DirectionKeyCodemap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
});

let timer = undefined;

//timer削除の処理
const unsubscribe = () => {
  if (!timer) {
    return;
  }
  //もしtimerの処理が継続されている場合処理を中断させる
  clearInterval(timer);
};

//state一覧
function App() {
  const [fields, setFields] = useState(initiaValues); //fieldの作成
  const [body, setBody] = useState([]); //位置情報
  const [tick, setTick] = useState(0); //画面描写(描写のためのstate)
  const [status, setStatus] = useState(GameStatus.init); //画面のプレー状態(初期は表示)
  const [direction, setDirection] = useState(Direction.up); //画面の方向の初期化
  const [difficulty, setDifficulty] = useState(defaultDifficulty);

  //スネーク位置の初期化(初期値は中央)
  useEffect(() => {
    setBody([initalPosition]);
    //難易度が変更されるたびに実行される
    const interval = Difficulty[difficulty - 1];
    timer = setInterval(() => {
      //useEffectをrenderの度に使用するための関数
      setTick((tick) => tick + 1);
    }, interval);
    return unsubscribe;
  }, [difficulty]);

  useEffect(() => {
    //positionが未定義 || statusがplaying出ない場合返却
    if (body.length === 0 || status !== GameStatus.playing) {
      return;
    }
    const canContinue = handleMoving();
    if (!canContinue) {
      setStatus(GameStatus.gameover);
    }
    //tickが変更されるたびに表示
  }, [tick]);

  const onStart = () => {
    //status状態のprops処理の実行
    setStatus(GameStatus.playing);
  };

  //onStop関数が実行されていない
  const onStop = () => {
    setStatus(GameStatus.suspended);
  };

  const onRestart = () => {
    //難易度に応じて画面遷移時間の変更
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, defaultInterval);
    setDirection(Direction.up); //この処理で方向を変更(今回は上方向への移動)
    setStatus(GameStatus.init); //playingなどのゲームの状況を初期化
    setBody([initalPosition]); //スネークのポジションを中央に戻す
    setFields(initFileds(35, initalPosition)); //スネークの位置情報を取得
  };

  //方向変換のための変数 onClickで関数の呼び出し、オブジェクトの変更を実施する
  const onChangeDirection = useCallback(
    (newDirection) => {
      //playing以外の場合は処理を実行しない
      if (status !== GameStatus.playing) {
        //スネークが移動している間しか処理は実行されない
        return direction;
      }
      //方向の向きが同じの場合は処理を実行しない
      if (OppositeDirection[direction] === newDirection) {
        return;
      }
      //移動方向のstateを変更する
      setDirection(newDirection);
    },
    [direction, status]
  );

  //難易度の変更・
  const onChangeDifficulty = useCallback(
    (difficulty) => {
      if (status != GameStatus.init) {
        return;
      }
      if (difficulty < 1 || difficulty > difficulty.length) {
        return;
      }
      setDifficulty(difficulty);
    },
    //難易度・プレイ状態が変更された場合に処理が実行される
    [status, difficulty]
  );

  //keyboardの値を取得
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodemap[e.keyCode];
      if (!newDirection) {
        return;
      }
      onChangeDirection(newDirection);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onChangeDirection]);

  //useEffectのコールバックは毎回のレンダリング時に実行される
  //引数が[]の場合は初回のみ実行される
  //第2引数に[]だと初回レンダリングの後に実行される
  //第2引数が[]意外だと値が変更された場合に関数が実行される
  //https://qiita.com/k-penguin-sato/items/9373d87c57da3b74a9e6

  //snakeを動作させるための処理
  const handleMoving = () => {
    const { x, y } = body[0];
    const delta = Delta[direction];
    //start状態のsnakeの位置
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y,
    };

    //引数が2つある場合に処理が実行される(上下左右共通で使用できる)
    if (
      isCollision(fields.length, newPosition) ||
      isEatingMyself(fields, newPosition)
    ) {
      unsubscribe();
      return false;
    }

    const newBody = [...body];
    //foodのフィールドでない場合末尾のsnakeを削除する
    if (fields[newPosition.y][newPosition.x] !== "food") {
      const removingTrack = newBody.pop();
      fields[removingTrack.y][removingTrack.x] = "";
    } else {
      const food = getFoodPosition(fields.length, [...newBody, newPosition]);
      fields[food.y][food.x] = "food";
    }
    fields[newPosition.y][newPosition.x] = "snake";
    //body用の頭に値を追加する
    newBody.unshift(newPosition);
    // 値を反映させる
    setBody(newBody);
    return true;
  };

  const isCollision = (fieldSize, position) => {
    if (position.x < 0 || position.y < 0) {
      return true;
    }
    if (position.x > fieldSize - 1 || position.y > fieldSize - 1) {
      return true;
    }
    return false;
  };

  // 次の値がsnakeかどうかの判定
  const isEatingMyself = (fields, position) => {
    return fields[position.y][position.x] === "snake"; //tureが返却される
  };

  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">snake Game</h1>
        </div>
        {/* ナビゲーションを表示 */}
        <Navigation
          length={body.length}
          difficulty={difficulty}
          onChangeDifficulty={onChangeDifficulty}
        />
        {/* length={length} difficulty={difficulty}  */}
      </header>
      <main className="main">
        {/* 捜査結果が表示される画面 */}
        <Field fields={fields} />
      </main>
      <footer className="footer">
        {/* buttonにpropsを渡してあげる */}
        <Button
          status={status}
          onStart={onStart}
          onStop={onStop}
          onRestart={onRestart}
        />
        {/* 操作用ボタン */}
        <ManipulationPanel onChange={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App;

//render  ... 再描写
// props,stateが変更された場合にレンダリングが走る
//状態を基にビューを表現している。

//関数はReactのトップレベルで宣言する必要がある&&分岐で宣言しない

//押したボタンに応じて異なるボタンのstateを変更する

//4章のuseCalbackの処理の理解ができていない
