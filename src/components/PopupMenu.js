import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const PopupMenu = ({
  menuContext,
  setMenuContext,
  closedNodes,
  setClosedNodes,
  setFocusedNode,
  focusedNode
}) => {
  const handleClose = () => setMenuContext({ visible: false });
  return (
    <Menu
      id="simple-menu"
      anchorEl={menuContext.anchorEl}
      keepMounted
      open={menuContext.visible}
      onClose={handleClose}
    >
      {!closedNodes.includes(menuContext.nodeId) && (
        <MenuItem
          onClick={() => {
            setClosedNodes([...closedNodes, menuContext.nodeId]);
            handleClose();
          }}
        >
          Close
        </MenuItem>
      )}
      {focusedNode !== menuContext.nodeId && (
        <MenuItem
          onClick={() => {
            setFocusedNode( menuContext.nodeId)
            handleClose();
          }}
        >
          Focus on
        </MenuItem>
      )}
      {closedNodes.includes(menuContext.nodeId) && (
        <MenuItem
          onClick={() => {
            setClosedNodes([
              ...closedNodes.filter(n => n !== menuContext.nodeId)
            ]);
            handleClose();
          }}
        >
          Open
        </MenuItem>
      )}
      {focusedNode === menuContext.nodeId && (
        <MenuItem
          onClick={() => {
            setFocusedNode("");
            handleClose();
          }}
        >
          Unfocus
        </MenuItem>
      )}
    </Menu>
  );
};

export default PopupMenu;
