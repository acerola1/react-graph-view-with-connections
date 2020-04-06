import PropTypes from "prop-types";
import React from "react";
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

  return (
    <g
      {...wrappedGProps}
      style={{
        transform: `translate(${props.y}px, ${props.x}px)`
      }}
    >
      <circle {...wrappedCircleProps} r={props.radius} />
      <text {...wrappedTextProps} dx={props.radius + 0.5} dy={props.offset}>
        {props[props.labelProp]}
      </text>
    </g>
  );
};

Node.propTypes = propTypes;
export default Node;
