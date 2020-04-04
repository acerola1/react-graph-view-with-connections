import React from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TreeContainer from "./Components/TreeContainer";
import { makeStyles, createStyles } from "@material-ui/core/styles";

import "./styles.css";

const useStyles = makeStyles(theme =>
  createStyles({
    app: {
      margin: "0px"
    }
  })
);

export default function App() {
  const classes = useStyles();
  const [connVisible, setConnVisible] = React.useState(true);
  return (
    <div className={classes.app}>
      <FormControlLabel
        control={
          <Switch
            checked={connVisible}
            onChange={event => setConnVisible(event.target.checked)}
            color="primary"
            name="checkedB"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        }
        label="Show Connections"
      />
      <TreeContainer connVisible={connVisible} />
    </div>
  );
}
