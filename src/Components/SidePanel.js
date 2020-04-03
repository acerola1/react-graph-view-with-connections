import React from "react";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Property from "./Property";

const useStyles = makeStyles(theme =>
  createStyles({
    paper: {
      zIndex: 1,
      position: "absolute",
      height: "100%",
      right: 5,
      width: "300px",
      display: "flex",
      flexDirection: "column"
    },
    properties: {
      margin: "20px",
      flex: "1 1"
    },
    button: {
      margin: "20px"
    }
  })
);

const SidePanel = ({ selectedId, model }) => {
  const classes = useStyles();
  const selected = selectedId && model[selectedId];

  return (
    <Slide direction="left" in={selectedId} mountOnEnter unmountOnExit>
      <Paper elevation={4} className={classes.paper}>
        <div className={classes.properties}>
          <Grid container spacing={1} justify="flex-end">
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                {selected && selected.name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Property name={"type"} value={selected && selected.type} />
            {selected &&
              selected.attributes &&
              Object.keys(selected.attributes).map(key => (
                <Property name={key} value={selected.attributes[key]} />
              ))}

            {selected && selected.dashboardUrl && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid style={{ marginTop: "15px" }} item xs={12}>
                  <Link href="#">Kubernetes Dashboard</Link>
                </Grid>
              </>
            )}
          </Grid>
        </div>
        <div className={classes.button}>
          {selected && selected.children && (
            <Button variant="contained" color="primary" size="medium">
              Heal
            </Button>
          )}
        </div>
      </Paper>
    </Slide>
  );
};

export default SidePanel;
