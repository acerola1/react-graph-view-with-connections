import React from "react";

const Connection = ({ connection, nodeMap }) => {
  const c = connection;
  return (
    <line
      x1={nodeMap[c.source].y}
      y1={nodeMap[c.source].x}
      x2={nodeMap[c.target].y}
      y2={nodeMap[c.target].x}
      className={"connection" + (connection.hovered ? " hovered" : "")}
    />
  );
};

export default Connection;
