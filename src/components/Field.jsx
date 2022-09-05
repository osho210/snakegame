import React from "react";

const Field = ({ fields }) => {
  return (
    <div className="field">
      {
        //fillの引数で値を初期化してmapで値を格納している
        //mapにkeyを設定していないためwarningの発生
        fields.map((row) => {
          return row.map((column) => {
            return <div className={`dots ${column}`}></div>;
          });
        })
      }
    </div>
  );
};

export default Field;
