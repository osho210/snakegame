import React from "react";
import Button from "./components/Button";
import Field from "./components/Field";
import ManipulationPanel from "./components/ManipulationPanel";
import Navigation from "./components/Navigation";
import useSnakeGame from "./hooks/useSnakeGame";

//state一覧
function App() {
  const {
    body,
    difficulty,
    fields,
    status,
    start,
    stop,
    reload,
    updateDirection,
    updateDifficulty,
  } = useSnakeGame();

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
          onChangeDifficulty={updateDifficulty}
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
          onStart={start}
          onStop={stop}
          onRestart={reload}
        />
        {/* 操作用ボタン */}
        <ManipulationPanel onChange={updateDirection} />
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
//App.jsは画面を表示するためだけのファイル。ロジックを別に分けてあげる方がよりファイルに
