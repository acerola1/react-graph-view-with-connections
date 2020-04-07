import React from "react";

const Connection = ({ connection, connVisible }) => {
  return (
    <line
      x1={connection.source.y}
      y1={connection.source.x}
      x2={connection.target.y}
      y2={connection.target.x}
      className={
        "connection" +
        (connVisible ? "" : " hidden") +
        (connection.hovered ? " hovered" : "")
      }
    />
  );
};

export default Connection;
