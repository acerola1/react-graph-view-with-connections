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
import LaunchIcon from '@material-ui/icons/Launch';
import Property from "./Property";
import DialogForReconfigure from "./DialogForReconfigure";
import DialogForHeal from "./DialogForHeal"
import DialogForScale from "./DialogForScale";
import DialogForUpgrade from "./DialogForUpgrade";
import ReactJson from "react-json-view";
import DialogForEvents from "./DialogForEvents";

const useStyles = makeStyles(theme =>
  createStyles({
    paper: {
      zIndex: 1,
      position: "absolute",
      height: "100%",
      right: 5,
      top: 0,
      width: "450px",
      display: "flex",
      flexDirection: "column",
      overflow: "auto"
    },
    title: {
      textAlign: "center"
    },
    properties: {
      margin: "20px",
      flex: "1 1"
    },
    buttonContainer: {
      margin: "20px",
      padding: "10px",
      textAlign: "right",
      display: "flex"
    },
    button: {
      marginRight: "10px",
    }
  })
);

const SidePanel = ({ selectedId, model, panelVisible, setPanelVisible }) => {
  const classes = useStyles();
  const selected = selectedId && model[selectedId];

  const connectedTo = selectedId && model[selectedId].connectedTo;

  const [reconfigureDialogOpen, setReconfigureDialogOpen] = React.useState(false)
  const [healDialogOpen, setHealDialogOpen] = React.useState(false)
  const [scaleDialogOpen, setScaleDialogOpen] = React.useState(false)
  const [upgradeDialogOpen, setUpgradeDialogOpen] = React.useState(false)
  const [eventsDialogOpen, setEventsDialogOpen] = React.useState(false)

  const handleAttributesDialogClickOpen = () => { setReconfigureDialogOpen(true); };
  const handleHealDialogClickOpen = () => { setHealDialogOpen(true); };
  const handleScaleDialogClickOpen = () => { setScaleDialogOpen(true); };
  const handleUpgradeDialogClickOpen = () => { setUpgradeDialogOpen(true); };

  const handleEventsDialogClickOpen = () => { setEventsDialogOpen(true); };

  const getAttributesJson = node => {
    return node ? node.attributesJson : {}
  }

  const propertiesView = () => {
    if (!selected) {
      return (
        <Paper elevation={4} className={classes.paper}>
        </Paper>
      )
    } else return (
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
            {selected.longName}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Property name="Type" value={selected.type} />
        {selected.attributes &&
          Object.keys(selected.attributes).map(key => (
            <Property name={key} value={selected.attributes[key]} />
          ))}
        {selected.state && <Property name={"State"} value={selected.state} />}
        {(selected.healUrl || selected.scaleUrl || selected.reconfigureUrl || selected.upgradeUrl) && <div className={classes.buttonContainer}>
          {selected.healUrl && (
            <div className={classes.button}>
              <Button variant="contained" color="primary" size="medium" onClick={handleHealDialogClickOpen}>
                Heal
              </Button>
            </div>
          )}
          {selected.scaleUrl && (
            <div className={classes.button}>
              <Button variant="contained" color="primary" size="medium" onClick={handleScaleDialogClickOpen}>
                Scale
              </Button>
            </div>
          )}
          {selected.reconfigureUrl && (
            <div className={classes.button}>
              <Button variant="contained" color="primary" size="medium" onClick={handleAttributesDialogClickOpen}>
                Reconfigure
              </Button>
            </div>
          )}
          {selected.upgradeUrl && (
            <div className={classes.button}>
              <Button variant="contained" color="primary" size="medium" onClick={handleUpgradeDialogClickOpen}>
                Upgrade
              </Button>
            </div>
          )}

        </div>}
        {selected && selected.dashboardUrl && (
          <Grid
            style={{ marginTop: "15px", marginBottom: "15px" }}
            item
            xs={12}
          >
            <Link target="_blank" href={selected.dashboardUrl}>
              <span style={{verticalAlign: "super"}}>Kubernetes Dashboard</span> <LaunchIcon />
            </Link>
          </Grid>
        )}
        {selected && selected.events && (
          <Grid
            style={{ marginTop: "15px", marginBottom: "15px" }}
            item
            xs={12}
          >
            <Link style={{cursor: 'pointer'}} target="#" onClick={handleEventsDialogClickOpen}>
              <span style={{verticalAlign: "super"}}>Events</span> <LaunchIcon />
            </Link>
          </Grid>
        )}

        {(connectedTo &&  connectedTo.length > 0) && (
          <>
            <Grid item xs={12}>
              <Typography
                variant="caption"
                color="textSecondary"
                align="left"
                component="p"
              >
                {"Connected to"}
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
                  {model[id].longName}
                </Typography>
              </Grid>
            ))}
          </>
        )}
        {selected.attributesJson && (
          <>
            <Grid item xs={12}>
              <Typography
                variant="caption"
                color="textSecondary"
                align="left"
                component="p"
              >
                {"Attributes"}
              </Typography>
            </Grid>
            <Grid item xs={12}>

              <ReactJson
                src={selected.attributesJson}
                name={false}
                enableClipboard={true}
                displayObjectSize={false}
                displayDataTypes={false}
                collapsed={1}
                style={{
                  fontFamily: "sanserif",
                  fontSize: 12,
                  letterSpacing: "1px",
                  padding: 24,
                  minHeight: 280
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
    <DialogForReconfigure open={reconfigureDialogOpen} setOpen={setReconfigureDialogOpen} node={selected}/>
    <DialogForHeal open={healDialogOpen} setOpen={setHealDialogOpen} healUrl={selected.healUrl}/>
    <DialogForScale open={scaleDialogOpen} setOpen={setScaleDialogOpen} node={selected}/>
    <DialogForUpgrade open={upgradeDialogOpen} setOpen={setUpgradeDialogOpen} currentVersion={selected.version} versionList={selected.versions} upgradeUrl={selected.upgradeUrl}/>
    <DialogForEvents open={eventsDialogOpen} setOpen={setEventsDialogOpen} node={selected}/>
  </Paper>
    )
  }

  return (
    <Slide direction="left" in={panelVisible} mountOnEnter unmountOnExit>
      {propertiesView()}
    </Slide>
  );
};

export default SidePanel;
