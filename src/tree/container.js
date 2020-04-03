import PropTypes from "prop-types";
import React from "react";
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

export default class Container extends React.PureComponent {
  render() {
    return (
      <svg
        {...this.props.svgProps}
        height={this.props.height}
        width={this.props.width}
      >
        {this.props.children}
        {this.props.links.map(link => (
          <Link
            key={link.target.data[this.props.keyProp]}
            keyProp={this.props.keyProp}
            pathFunc={this.props.pathFunc}
            source={link.source}
            target={link.target}
            x1={link.source.x}
            x2={link.target.x}
            y1={link.source.y}
            y2={link.target.y}
            pathProps={{
              ...this.props.pathProps,
              ...link.target.data.pathProps
            }}
          />
        ))}
        {this.props.connections.map(connection => (
          <Connection
            key={`c_${connection.source.data[this.props.keyProp]}${
              connection.target.data[this.props.keyProp]
            }`}
            connection={connection}
          />
        ))}
        {this.props.nodes.map(node => (
          <Node
            key={node.data[this.props.keyProp]}
            {...node.data}
            keyProp={this.props.keyProp}
            labelProp={this.props.labelProp}
            offset={this.props.nodeOffset}
            radius={this.props.nodeRadius}
            x={node.x}
            y={node.y}
            circleProps={{
              ...this.props.circleProps,
              ...node.data.circleProps
            }}
            gProps={{ ...this.props.gProps, ...node.data.gProps }}
            textProps={{ ...this.props.textProps, ...node.data.textProps }}
          />
        ))}
      </svg>
    );
  }
}

Container.propTypes = propTypes;
