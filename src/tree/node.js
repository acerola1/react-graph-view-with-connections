import PropTypes from "prop-types";
import React from "react";
import { animated } from "react-spring";
import wrapHandlers from "./wrapHandlers";

const propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  keyProp: PropTypes.string.isRequired,
  labelProp: PropTypes.string.isRequired,
  offset: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  circleProps: PropTypes.object.isRequired,
  gProps: PropTypes.object.isRequired,
  textProps: PropTypes.object.isRequired
};

const Node = props => {
  const wrappedCircleProps = wrapHandlers(
    props.circleProps,
    props[props.keyProp]
  );

  const wrappedGProps = wrapHandlers(props.gProps, props[props.keyProp]);

  const wrappedTextProps = wrapHandlers(props.textProps, props[props.keyProp]);
  const { xy, ...rest } = props.transitionProps;
  return (
    <animated.g
      {...wrappedGProps}
      style={{
        transform: xy.interpolate((x, y) => `translate(${y}px, ${x}px)`),
        ...rest
      }}
    >
      <circle {...wrappedCircleProps} r={props.radius} />
      <text {...wrappedTextProps} dx={props.radius + 0.5} dy={props.offset}>
        {props[props.labelProp]}
      </text>
    </animated.g>
  );
};

Node.propTypes = propTypes;
export default Node;
