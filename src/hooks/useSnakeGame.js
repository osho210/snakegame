import { useCallback, useEffect, useState } from "react";

//変数の呼び出し
import {
  defaultInterval,
  defaultDifficulty,
  initalPosition,
  initiaValues,
  Delta,
  Difficulty,
  Direction,
  DirectionKeyCodemap,
  GameStatus,
  OppositeDirection,
} from "../constants";

//関数の呼び出し
import {
  initFileds,
  isCollision,
  isEatingMyself,
  getFoodPosition,
} from "../utils";

// なぜnull？
let timer = undefined;

//timer削除の処理
const unsubscribe = () => {
  if (!timer) {
    return;
  }
  //もしtimerの処理が継続されている場合処理を中断させる
  clearInterval(timer);
};

const useSnakeGame = () => {
  const [fields, setFields] = useState(initiaValues);
  const [body, setBody] = useState([]);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  const [tick, setTick] = useState(0);

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

  const start = () => {
    //status状態のprops処理の実行
    setStatus(GameStatus.playing);
  };

  //onStop関数が実行されていない
  const stop = () => {
    setStatus(GameStatus.suspended);
  };

  const reload = () => {
    //難易度に応じて画面遷移時間の変更
    timer = setInterval(() => {
      setTick((tick) => tick + 1);
    }, defaultInterval);
    setDirection(Direction.up); //この処理で方向を変更(今回は上方向への移動)
    setStatus(GameStatus.init); //playingなどのゲームの状況を初期化
    setBody([initalPosition]); //スネークのポジションを中央に戻す
    setFields(initFileds(fields.length, initalPosition)); //スネークの位置情報を取得
  };

  //方向変換のための変数 onClickで関数の呼び出し、オブジェクトの変更を実施する
  const updateDirection = useCallback(
    (newDirection) => {
      //playing以外の場合は処理を実行しない
      if (status !== GameStatus.playing) {
        //スネークが移動している間しか処理は実行されない
        return;
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
  const updateDifficulty = useCallback(
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
    [status]
  );

  //keyboardの値を取得
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodemap[e.keyCode];
      if (!newDirection) {
        return;
      }
      updateDirection(newDirection);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [updateDirection]);

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
    setFields(fields);
    return true;
  };

  return {
    body,
    difficulty,
    fields,
    status,
    start,
    stop,
    reload,
    updateDirection,
    updateDifficulty,
  };
};

export default useSnakeGame;
