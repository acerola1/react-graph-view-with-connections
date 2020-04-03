import React from "react";
import Tree from "../tree/tree";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import sample from "../sample2.json";
import SidePanel from "./SidePanel";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      height: "100%",
      display: "flex",
      width: "100%"
    }
  })
);

const TreeContainer = () => {
  const classes = useStyles();
  const [selectedId, setSelectedId] = React.useState();

  const getData = () => {
    const root = sample["f43a4844-2cad-4071-815c-34b48d1664de"];
    return fillNode(root);
  };

  const fillNode = node => {
    let newNode = {
      name: node.name,
      id: node.Id,
      type: node.type,
      connectedTo: node.connectedTo,
      circleProps: { style: { fill: getColorByType(node.type) } }
    };
    if (node.children) {
      newNode.children = node.children.map(childKey =>
        fillNode(sample[childKey])
      );
    }
    return newNode;
  };

  const colors = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600"
  ];

  const colors2 = [
    "#183693",
    "#3d48a0",
    "#585cae",
    "#7070bb",
    "#8885c8",
    "#9e9ad6",
    "#b5b0e4",
    "#cbc7f1",
    "#e2deff"
  ];

  const types = [
    "Namespace",
    "Ingress",
    "Group",
    "Service",
    "Deployment",
    "ReplicaSet",
    "StatefulSet",
    "Pod",
    "Container"
  ];

  const getColorByType = type => {
    const index = types.indexOf(type);
    return index === -1 ? "orange" : colors[index];
  };

  return (
    <div className={classes.root}>
      <Tree
        data={getData()}
        nodeRadius={9}
        labelProp={"type"}
        keyProp="id"
        margins={{ top: 20, bottom: 10, left: 20, right: 200 }}
        height={600}
        width={1200}
        gProps={{
          className: "node",
          onClick: (e, node) => {
            e.stopPropagation();
            setSelectedId(node);
          }
        }}
        textProps={{ x: -20, y: 20 }}
        svgProps={{ onClick: () => setSelectedId(undefined) }}
        steps={30}
      />
      <SidePanel selectedId={selectedId} model={sample} />
    </div>
  );
};

export default TreeContainer;
