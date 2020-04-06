import React from "react";
import { animated } from "react-spring";

const Connection = ({ connection, connectionProps }) => {
  const { endpoints, ...rest } = connectionProps;
  return (
    <animated.line
      style={{ ...rest }}
      x1={endpoints.interpolate((x1, y1, x2, y2) => y1)}
      y1={endpoints.interpolate((x1, y1, x2, y2) => x1)}
      x2={endpoints.interpolate((x1, y1, x2, y2) => y2)}
      y2={endpoints.interpolate((x1, y1, x2, y2) => x2)}
      className={"connection" + (connection.hovered ? " hovered" : "")}
    />
  );
};

export default Connection;
