import clone from "clone";
import { easeQuadOut } from "d3-ease";
import { hierarchy, tree } from "d3-hierarchy";
import PropTypes from "prop-types";
import React from "react";
import Container from "./container";

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
  keyProp: "id",
  labelProp: "shortName",
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
    /*
    const contentWidth =
      this.props.width - this.props.margins.left - this.props.margins.right;
    const contentHeight =
      this.props.height - this.props.margins.top - this.props.margins.bottom;
    */

    // data is cloned because d3 will mutate the object passed in
    let data = hierarchy(clone(this.props.data), this.props.getChildren);

    let root = tree()
      .separation(() => 1)
      .nodeSize([this.props.nodeHeight, this.props.nodeWidth])(data);
    let nodes = root.descendants();
    let links = root.links();
    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;

    nodes.forEach(node => {
      node.y += this.props.margins.top;
      node.x += this.props.margins.left;
      maxX = Math.max(maxX, node.x);
      maxY = Math.max(maxY, node.y);
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
    });

    console.log(minX, minY, maxX, maxY);

    const nodeMap = {};
    nodes.forEach(node => (nodeMap[node.data.id] = node));
    const height = Math.max(this.props.height, maxX - minX);   

    return (
      <Container
        animated={this.props.animated}
        viewBox={`${this.props.nodeWidth -20} 
          ${minX -this.props.nodeHeight / 2} 
          ${maxY} 
          ${Math.max(maxX - minX +this.props.nodeHeight * 1.5, height) + 20}`}
        getChildren={this.props.getChildren}
        height={height}
        keyProp={this.props.keyProp}
        labelProp={this.props.labelProp}
        links={links.filter(l => l.source.data.id !== this.props.dummyNodeId)}
        nodes={nodes}
        connections={this.props.connections
          .filter(c => nodeMap[c.source] && nodeMap[c.target])
          .map(c => {
            c.source = nodeMap[c.source];
            c.target = nodeMap[c.target];
            return c;
          })}
        nodeOffset={this.props.nodeOffset}
        nodeRadius={this.props.nodeRadius}
        pathFunc={this.props.pathFunc}
        steps={this.props.steps}
        circleProps={this.props.circleProps}
        gProps={{ className: "node", ...this.props.gProps }}
        pathProps={{ className: "link", ...this.props.pathProps }}
        svgProps={this.props.svgProps}
        textProps={this.props.textProps}
        nodeMap={nodeMap}
        connVisible={this.props.connVisible}
      >
        {this.props.children}
      </Container>
    );
  }
}

Tree.propTypes = propTypes;
Tree.defaultProps = defaultProps;
