import PropTypes from "prop-types";
import React from "react";
import { useTransition } from "react-spring";
import Link from "./link";
import Node from "./node";
import Connection from "./connection";

const propTypes = {
  children: PropTypes.node,
  height: PropTypes.number.isRequired,
  keyProp: PropTypes.string.isRequired,
  labelProp: PropTypes.string.isRequired,
  links: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired,
  nodeClassName: PropTypes.string,
  nodeOffset: PropTypes.number.isRequired,
  nodeRadius: PropTypes.number.isRequired,
  pathFunc: PropTypes.func,
  width: PropTypes.number.isRequired,
  circleProps: PropTypes.object.isRequired,
  gProps: PropTypes.object.isRequired,
  pathProps: PropTypes.object.isRequired,
  svgProps: PropTypes.object.isRequired,
  textProps: PropTypes.object.isRequired
};

const Container = props => {
  const nodeTransition = useTransition(props.nodes, d => d.data.id, {
    from: { opacity: 0 },
    leave: { opacity: 0 },
    enter: ({ x, y }) => ({ xy: [x, y], opacity: 1 }),
    update: ({ x, y }) => ({ xy: [x, y] })
  });

  const connectionTransition = useTransition(
    props.connections,
    d => `c_${d.source.data.id}_${d.target.data.id}`,
    {
      from: { opacity: 0 },
      leave: { opacity: 0 },
      enter: ({ source, target }) => ({
        endpoints: [source.x, source.y, target.x, target.y],
        opacity: 1
      }),
      update: ({ source, target }) => ({
        endpoints: [source.x, source.y, target.x, target.y]
      })
    }
  );

  return (
    <svg {...props.svgProps} height={props.height} width={props.width}>
      {props.children}
      {props.links.map(link => (
        <Link
          key={link.target.data[props.keyProp]}
          keyProp={props.keyProp}
          pathFunc={props.pathFunc}
          source={link.source}
          target={link.target}
          x1={link.source.x}
          x2={link.target.x}
          y1={link.source.y}
          y2={link.target.y}
          pathProps={{
            ...props.pathProps,
            ...link.target.data.pathProps
          }}
        />
      ))}
      {connectionTransition.map(
        ({ item: connection, props: connectionProps, key }) => (
          <Connection
            key={key}
            connectionProps={connectionProps}
            connection={connection}
            nodeMap={props.nodeMap}
          />
        )
      )}
      {nodeTransition.map(({ item: node, props: transitionProps }) => (
        <Node
          key={node.data[props.keyProp]}
          transitionProps={transitionProps}
          {...node.data}
          keyProp={props.keyProp}
          labelProp={props.labelProp}
          offset={props.nodeOffset}
          radius={props.nodeRadius}
          x={node.x}
          y={node.y}
          circleProps={{
            ...props.circleProps,
            ...node.data.circleProps
          }}
          gProps={{ ...props.gProps, ...node.data.gProps }}
          textProps={{ ...props.textProps, ...node.data.textProps }}
        />
      ))}

      {/*props.nodes.map(node => (
        <Node
          key={node.data[props.keyProp]}
          transitionProps={props}
          {...node.data}
          keyProp={props.keyProp}
          labelProp={props.labelProp}
          offset={props.nodeOffset}
          radius={props.nodeRadius}
          x={node.x}
          y={node.y}
          circleProps={{
            ...props.circleProps,
            ...node.data.circleProps
          }}
          gProps={{ ...props.gProps, ...node.data.gProps }}
          textProps={{ ...props.textProps, ...node.data.textProps }}
        />
        ))*/}
    </svg>
  );
};

//Container.propTypes = propTypes;
export default Container;
