import React from "react";

const Connection = ({ connection }) => {
  const c = connection;
  return (
    <line
      x1={c.source.y}
      y1={c.source.x}
      x2={c.target.y}
      y2={c.target.x}
      stroke="gray"
      strokeDasharray="2 2"
    />
  );
};

export default Connection;
