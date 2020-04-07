import React from "react";
import Tree from "../tree/tree";
import Card from "@material-ui/core/Card";
import axios from "axios";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import sample from "../sample3.json";
import SidePanel from "./SidePanel";
import PopupMenu from "./PopupMenu";

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      height: "100%",
      display: "flex",
      width: "100%"
    },
    treeContainer: {
      height: "calc(100vh - 60px)",
      overflow: "auto",
      width: "100%"
    }
  })
);

const TreeContainer = ({ connVisible }) => {
  const classes = useStyles();
  const [model, setModel] = React.useState();
  const [selectedId, setSelectedId] = React.useState();
  const [hoverId, setHoverId] = React.useState();
  const [panelVisible, setPanelVisible] = React.useState(false);
  const [menuContext, setMenuContext] = React.useState({
    visible: false,
    nodeId: undefined,
    anchorEl: undefined
  });
  const [closedNodes, setClosedNodes] = React.useState([]);
  const [data, setData] = React.useState();

  // initial load
  React.useEffect(() => {
    let initialData = "";
    axios
      .get("/data")
      .then(function(response) {
        if (typeof response.data === "object") {
          initialData = response.data;
        } else {
          return Promise.reject();
        }
      })
      .catch(() => (initialData = sample))
      .then(() => {
        setData(addDummyRoot(initialData));
      });
  }, []);
  // model creation
  React.useEffect(() => {
    data && setModel(getData(data));
  }, [selectedId, hoverId, closedNodes, data]);

  const addDummyRoot = initialData => {
    const children = [];
    Object.entries(initialData).forEach(([key, value]) => {
      if (!value.parent) {
        value.parent = "dummy-root";
        initialData[key] = value;
        children.push(key);
      }
    });

    const dummyRoot = {
      id: "dummy-root",
      name: "dummy-root",
      type: "dummy-root",
      children
    };
    initialData["dummy-root"] = dummyRoot;

    return initialData;
  };

  const getData = data => {
    const root = data["dummy-root"];
    //const root = sample["f43a4844-2cad-4071-815c-34b48d1664de"];
    return fillNode(root);
  };

  const fillNode = node => {
    let newNode = {
      name: node.name,
      id: node.id,
      type: node.type,
      connectedTo: node.connectedTo,
      circleProps: { style: { fill: getColorByType(node.type) } }
    };
    let className = "node";
    if (selectedId && selectedId === node.id) {
      className = className + " selected";
    }
    if (hoverId && hoverId === node.id) {
      className = className + " hovered";
    }
    newNode.gProps = {
      className
    };
    if (!closedNodes.includes(node.id) && node.children) {
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

  const createConnections = (data, hoverNodeId) => {
    const nodes = Object.values(data);
    return nodes
      .filter(n => n.connectedTo)
      .map(n => {
        return n.connectedTo.map(toId => {
          const hovered = hoverNodeId === n.id || hoverNodeId === toId;
          return { source: n.id, target: toId, hovered };
        });
      })
      .flat();
  };

  return (
    <div className={classes.root}>
      <div className={classes.treeContainer}>
        <Card>
          {model && (
            <Tree
              connections={createConnections(
                sample,
                hoverId ? hoverId : selectedId
              )}
              data={model}
              nodeRadius={9}
              labelProp={"name"}
              dummyNodeId={"dummy-root"}
              keyProp="id"
              margins={{ top: 20, bottom: 10, left: 20, right: 200 }}
              nodeHeight={40}
              nodeWidth={130}
              height={600}
              width={1200}
              connVisible={connVisible}
              gProps={{
                onClick: (e, node) => {
                  e.stopPropagation();
                  setSelectedId(node);
                  setPanelVisible(true);
                },
                onContextMenu: (e, node) => {
                  e.preventDefault();
                  setMenuContext({
                    visible: true,
                    anchorEl: e.currentTarget,
                    nodeId: node
                  });
                },
                onMouseOver: (e, node) => {
                  setHoverId(node);
                },
                onMouseOut: (e, node) => {
                  e.stopPropagation();
                  setHoverId();
                }
              }}
              textProps={{ x: -20, y: 20 }}
              svgProps={{
                onClick: e => {
                  //setSelectedId(undefined);
                  setPanelVisible(false);
                }
              }}
              steps={30}
            />
          )}
        </Card>
      </div>
      <SidePanel
        setPanelVisible={setPanelVisible}
        panelVisible={panelVisible}
        selectedId={selectedId}
        model={sample}
      />
      {menuContext.visible && (
        <PopupMenu
          menuContext={menuContext}
          setMenuContext={setMenuContext}
          closedNodes={closedNodes}
          setClosedNodes={setClosedNodes}
        />
      )}
    </div>
  );
};

export default TreeContainer;
