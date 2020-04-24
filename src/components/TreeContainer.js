import React from "react";
import Tree from "../tree/tree";
import Card from "@material-ui/core/Card";
import { makeStyles, createStyles } from "@material-ui/core/styles";

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

const TreeContainer = ({ connVisible, animateConnections, data, resultIds, useCache }) => {
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
  const [focusedNode, setFocusedNode] = React.useState("");

  /*React.useEffect(() => {
    setData(addRemoveDummyForFocused(data, focusedNode));
  }, [focusedNode]);*/

  // model creation
  React.useEffect(() => {
    data && setModel(getData(data));
  }, [selectedId, hoverId, closedNodes, data, focusedNode, resultIds]);

  const legendEntries = (types) => {
    Object.entries(types)
  }

  const getData = data => {
    const root = focusedNode ? data[focusedNode] : data["dummy-root"];
    //const root = sample["f43a4844-2cad-4071-815c-34b48d1664de"];
    const tree = fillNode(root);
    return !focusedNode
      ?
        tree
      : {
          id: "dummy-root",
          name: "dummy-root",
          type: "dummy-root",
          children: [tree]
        };
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
    if (resultIds.includes(node.id)) {
      className = className + " searched";
    }
    newNode.gProps = {
      className
    };
    newNode.letters = getLetterByType(node.type);
    newNode.closed = closedNodes.includes(node.id) ? true : false;
    newNode.focused = focusedNode === node.id ? true : false;
    newNode.state = node.state;
    if (!closedNodes.includes(node.id) && node.children) {
      newNode.children = node.children.map(childKey =>
        fillNode(data[childKey])
      );
    }
    return newNode;
  };

  // Generated with https://color.hailpixel.com/#F5E1E0,E9C4BE,E6C3B3,DDCF98,B8D47D,B6CB62,66BF40,349D36,32955B,25646F,231C54,391339,D3E0A3,C4E9BE,D1F0DF,F2E1D9
  //const colors = "F5E1E0,E9C4BE,E6C3B3,DDCF98,B8D47D,B6CB62,66BF40,349D36,32955B,25646F,231C54,391339,D3E0A3,C4E9BE,D1F0DF,F2E1D9".split(',').map(s => "#" + s);

  //http://tristen.ca/hcl-picker/#/hlc/6/1/000000/BD677B
  const colors = "#000000,#DCEE6D,#66E0A7,#54BFD4,#A391C0,#BD677B".split(",");

  const types = [
    {name:"Container", color: 4, letters: "C"},
    {name:"CR", color: 2, letters: "CR"},
    {name:"CRD", color: 3, letters: "CRD"},
    {name:"DaemonSet", color: 5, letters: "DS"},
    {name:"Deployment", color: 5, letters: "D"},
    {name:"Group", color: 3, letters: "G"},
    {name:"Ingress", color: 5, letters: "In"},
    {name:"Namespace", color: 1, letters: "Ns"},
    {name:"PersistentVolume", color: 4, letters: "PV"},
    {name:"Pod", color: 4, letters: "P"},
    {name:"Release", color: 1, letters: "HR"},
    {name:"ReplicaSet", color: 5, letters: "RS"},
    {name:"Service", color: 5, letters: "S"},
    {name:"StatefulSet", color: 5, letters: "SS"},
    {name:"Job", color: 4, letters: "J"},
    {name:"PersistentVolumeClaim", color: 4, letters: "PVC"},
    {name:"Event", color: 3, letters: "E"},
  ];

  const getColorByType = typeName => {
    const type = types.find(t => t.name === typeName);
    return !type ? "orange" : colors[type.color];
  };

  const getLetterByType = typeName => {
    const type = types.find(t => t.name === typeName);
    return !type ? "??" : type.letters;
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

  const toggleNodeClose = (id) => {
    if (closedNodes.includes(id)) {
      setClosedNodes([
        ...closedNodes.filter(n => n !== id)
      ]);
    } else {
      setClosedNodes([...closedNodes, id]);
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.treeContainer + " " + (animateConnections ? "animated" : "")}>
        <Card>

          {model && (
            <Tree
              connections={createConnections(
                data,
                hoverId ? hoverId : selectedId
              )}
              data={model}
              nodeRadius={9}
              labelProp={"name"}
              dummyNodeId={"dummy-root"}
              keyProp="id"
              margins={{ top: 20, bottom: 10, left: 200, right: 200 }}
              nodeHeight={25}
              nodeWidth={200}
              height={600}
              width={1200}
              connVisible={connVisible}
              gProps={{
                onClick: (e, node) => {
                  e.stopPropagation();
                  setSelectedId(node);
                  setPanelVisible(true);
                },
                onDoubleClick: (e, node) => toggleNodeClose(node),
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
              textProps={{ x: -0, y: 0 }}
              svgProps={{
                onClick: e => {
                  setSelectedId(undefined);
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
        model={data}
      />
      {menuContext.visible && (
        <PopupMenu
          menuContext={menuContext}
          setMenuContext={setMenuContext}
          closedNodes={closedNodes}
          setClosedNodes={setClosedNodes}
          focusedNode={focusedNode}
          setFocusedNode={setFocusedNode}
        />
      )}
    </div>
  );
};

export default TreeContainer;

