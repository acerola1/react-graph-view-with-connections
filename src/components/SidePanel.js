import React from "react";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import Property from "./Property";

const useStyles = makeStyles(theme =>
  createStyles({
    paper: {
      zIndex: 1,
      position: "absolute",
      height: "100%",
      right: 5,
      top: 0,
      width: "350px",
      display: "flex",
      flexDirection: "column"
    },
    title: {
      textAlign: "center"
    },
    properties: {
      margin: "20px",
      flex: "1 1"
    },
    button: {
      margin: "20px",
      textAlign: "right"
    }
  })
);

const SidePanel = ({ selectedId, model, panelVisible, setPanelVisible }) => {
  const classes = useStyles();
  const selected = selectedId && model[selectedId];

  const connectedTo = selectedId && model[selectedId].connectedTo;

  return (
    <Slide direction="left" in={panelVisible} mountOnEnter unmountOnExit>
      <Paper elevation={4} className={classes.paper}>
        <div className={classes.properties}>
          <Grid container spacing={1} justify="flex-end">
            <Grid
              style={{ position: "absolute", top: "-5px", right: "25px" }}
              item
              xs={1}
            >
              <IconButton
                onClick={() => setPanelVisible(false)}
                aria-label="close"
                color="primary"
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid className={classes.title} item xs={12}>
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

            {connectedTo && (
              <>
                <Grid item xs={12}>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    align="left"
                    component="p"
                  >
                    {"Connected to:"}
                  </Typography>
                </Grid>
                {connectedTo.map(id => (
                  <Grid item xs={8}>
                    <Typography
                      variant={"body2"}
                      color={"textPrimary"}
                      component="p"
                      align="left"
                    >
                      {model[id].name}
                    </Typography>
                  </Grid>
                ))}
              </>
            )}
            {selected && selected.dashboardUrl && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid
                  style={{ marginTop: "15px", marginBottom: "15px" }}
                  item
                  xs={12}
                >
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
