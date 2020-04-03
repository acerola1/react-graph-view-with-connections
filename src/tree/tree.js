import clone from "clone";
import { easeQuadOut } from "d3-ease";
import { hierarchy, tree } from "d3-hierarchy";
import PropTypes from "prop-types";
import React from "react";
import Animated from "./animated";

const propTypes = {
  data: PropTypes.object.isRequired,
  animated: PropTypes.bool.isRequired,
  children: PropTypes.node,
  duration: PropTypes.number.isRequired,
  easing: PropTypes.func.isRequired,
  steps: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  keyProp: PropTypes.string.isRequired,
  labelProp: PropTypes.string.isRequired,
  getChildren: PropTypes.func.isRequired,
  margins: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  }).isRequired,
  pathFunc: PropTypes.string,
  nodeOffset: PropTypes.number.isRequired,
  nodeRadius: PropTypes.number.isRequired,
  circleProps: PropTypes.object.isRequired,
  gProps: PropTypes.object.isRequired,
  pathProps: PropTypes.object.isRequired,
  svgProps: PropTypes.object.isRequired,
  textProps: PropTypes.object.isRequired
};

const defaultProps = {
  animated: false,
  duration: 500,
  easing: easeQuadOut,
  getChildren: n => n.children,
  steps: 20,
  keyProp: "name",
  labelProp: "name",
  margins: {
    bottom: 10,
    left: 20,
    right: 150,
    top: 10
  },
  nodeOffset: 3.5,
  nodeRadius: 5,
  circleProps: {},
  gProps: {},
  pathProps: {},
  svgProps: {},
  textProps: {}
};

export default class Tree extends React.PureComponent {
  render() {
    const contentWidth =
      this.props.width - this.props.margins.left - this.props.margins.right;
    const contentHeight =
      this.props.height - this.props.margins.top - this.props.margins.bottom;

    // data is cloned because d3 will mutate the object passed in
    let data = hierarchy(clone(this.props.data), this.props.getChildren);

    let root = tree()
      .separation(() => 1)
      .size([contentHeight, contentWidth])(data);
    let nodes = root.descendants();
    let links = root.links();

    nodes.forEach(node => {
      node.y += this.props.margins.top;
    });

    const nodeMap = {};
    nodes.forEach(node => (nodeMap[node.data.id] = node));
    const createConnections = (node, nodeMap) => {
      return node
        .filter(n => n.data.connectedTo)
        .map(n => {
          return n.data.connectedTo.map(toId => ({
            source: n,
            target: nodeMap[toId]
          }));
        })
        .flat();
    };

    const connections = createConnections(nodes, nodeMap);

    /*[
      { source: nodes[1], target: nodes[6] },
      { source: nodes[3], target: nodes[6] },
      { source: nodes[7], target: nodes[6] },
      { source: nodes[4], target: nodes[6] },
      { source: nodes[9], target: nodes[25] },
      { source: nodes[2], target: nodes[18] },
      { source: nodes[1], target: nodes[20] },
      { source: nodes[14], target: nodes[21] },
      { source: nodes[15], target: nodes[23] },
      { source: nodes[11], target: nodes[2] },
      { source: nodes[13], target: nodes[4] },
      { source: nodes[5], target: nodes[16] }
    ];*/

    return (
      <Animated
        animated={this.props.animated}
        duration={this.props.duration}
        easing={this.props.easing}
        getChildren={this.props.getChildren}
        height={this.props.height}
        keyProp={this.props.keyProp}
        labelProp={this.props.labelProp}
        links={links}
        nodes={nodes}
        connections={connections}
        nodeOffset={this.props.nodeOffset}
        nodeRadius={this.props.nodeRadius}
        pathFunc={this.props.pathFunc}
        steps={this.props.steps}
        width={this.props.width}
        circleProps={this.props.circleProps}
        gProps={{ className: "node", ...this.props.gProps }}
        pathProps={{ className: "link", ...this.props.pathProps }}
        svgProps={this.props.svgProps}
        textProps={this.props.textProps}
      >
        {this.props.children}
      </Animated>
    );
  }
}

Tree.propTypes = propTypes;
Tree.defaultProps = defaultProps;
