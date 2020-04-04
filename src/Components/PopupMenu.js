import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const PopupMenu = ({
  menuContext,
  setMenuContext,
  closedNodes,
  setClosedNodes
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
    </Menu>
  );
};

export default PopupMenu;
