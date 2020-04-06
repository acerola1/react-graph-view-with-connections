import React from "react";

const Connection = ({ connection }) => {
  return (
    <line
      x1={connection.source.y}
      y1={connection.source.x}
      x2={connection.target.y}
      y2={connection.target.x}
      className={"connection" + (connection.hovered ? " hovered" : "")}
    />
  );
};

export default Connection;
