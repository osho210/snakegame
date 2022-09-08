//餌の座標をランダムに作成るする
export const getFoodPosition = (fieldSize, excludes) => {
  while (true) {
    const x = Math.floor(Math.random() * (fieldSize - 1) - 1) + 1;
    const y = Math.floor(Math.random() * (fieldSize - 1) - 1) + 1;
    //配列内に1つでも要素があればtureを返却
    const conflict = excludes.some((item) => item.x === x && item.y === y);
    //snakeに含まれなければ終了
    if (!conflict) {
      return { x, y };
    }
  }
};

export const initFileds = (fieldSize, snake) => {
  const fields = [];
  //ドットを作成するためのfor文(初期化)
  for (let i = 0; i < fieldSize; i++) {
    const cols = new Array(fieldSize).fill("");
    fields.push(cols);
  }
  //スネークの所在地(スネークは2次元配列)
  fields[snake.x][snake.y] = "snake";

  const food = getFoodPosition(fieldSize, [snake]);
  fields[food.y][food.x] = "food";

  //戻り値でスネークの位置を返却
  return fields;
};

//壁への衝突判定
export const isCollision = (fieldSize, position) => {
  if (position.x < 0 || position.y < 0) {
    return true;
  }
  if (position.x > fieldSize - 1 || position.y > fieldSize - 1) {
    return true;
  }
  return false;
};

//自分を食べた場合の処理
export const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === "snake"; //tureが返却される
};
