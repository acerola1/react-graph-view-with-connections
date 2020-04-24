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
  const WIDTH = 40;
  const leaf = true;
  const wrappedGProps = wrapHandlers(props.gProps, props[props.keyProp]);

  const wrappedTextProps = wrapHandlers(props.textProps, props[props.keyProp]);

  return (
    <g
      {...wrappedGProps}
      style={{
        transform: `translate(${props.y}px, ${props.x}px)`
      }}
    >
      <rect width={WIDTH} height={props.radius *2} x={-WIDTH/2} y={-props.radius} {...wrappedCircleProps} />
      {props.state && <circle r={7} cx={WIDTH/2} cy={-props.radius} fill="red"/>}
      <text textAnchor="middle" dominantBaseline="central" fontSize="10">{props.letters}</text>
      <text
        className={"label"}
        textAnchor={leaf ? "start" : "end"}
        {...wrappedTextProps}
        dx={leaf ? 30 : -30}
        dy={props.radius/2}
      >
        {props[props.labelProp] + (props.closed ? " +" : "") }
      </text>
      {props.focused && <text
        className={"close"}
        textAnchor="start"
        {...wrappedTextProps}
        dx={-35}
        dy={props.radius/2}
      >+</text>}
    </g>
  );
};

Node.propTypes = propTypes;
export default Node;


