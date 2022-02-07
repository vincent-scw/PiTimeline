import React from "react";

export const ActionPanel: React.FC = () => {
  const create = () => {

  }

  return (
    <div className="panel left-dockbg">
      <p className="panel-block dock-img-block">
        <a onClick={create}>Create</a>
      </p>
      <p className="panel-block dock-img-block"></p>
    </div>
  );
}