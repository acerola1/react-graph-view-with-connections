import React from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import TreeContainer from "./components/TreeContainer";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Refresh from '@material-ui/icons/Refresh';
import axios from "axios";
import sample from "./sample4.json";
import Config from "./config"
import RequestUtils from "./components/RequestUtils"

import "./styles.css";
import { Button, IconButton } from "@material-ui/core";

const useStyles = makeStyles(theme =>
  createStyles({
    app: {
      margin: "0px"
    },
    controls: {
      marginBottom: "10px",
      display: 'flex'
    },
    refresh: {
      marginRight: '10px'
    },
    search: {
      verticalAlign: 'unset'
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
  })
);

export default function App() {
  const classes = useStyles();
  const [connVisible, setConnVisible] = React.useState(true);
  const [animateConnections, setAnimateConnections] = React.useState(false);
  const [useCache, setUseCache] = React.useState(false);
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [resultIds, setResultIds] = React.useState([]);

  const loadData = () => {
    let initialData = "";
    const dataPath = useCache ? "/other" : "/data"
    const dataUrl = RequestUtils.getBackendServerUrl(dataPath)
    console.log('Requesting ' + dataUrl)
    setLoading(true)
    console.time()
    axios
      .get(dataUrl)
      .then(function(response) {
        if (typeof response.data === "object") {
          initialData = response.data;
        } else {
          return Promise.reject();
        }
      })
      .catch(() => (initialData = JSON.parse(JSON.stringify(sample))))
      .then(() => {
        console.timeEnd()
        setData(addDummyRoot(initialData));
        setLoading(false)
      });
  }

  const addDummyRoot = initialData => {
    const cleanseConnectedTo = node => {
      if (!node.connectedTo) {
        node.connectedTo = []
      } else {
        let connections = new Set(node.connectedTo)
        connections.delete(node.id)
        connections = Array.from(connections)
        connections.sort()
        node.connectedTo = connections
      }
    }

    const children = [];
    Object.entries(initialData).forEach(([key, value]) => {
      if (!value.parent) {
        value.parent = "dummy-root";
        initialData[key] = value;
        children.push(key);
      }
      cleanseConnectedTo(value)
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

  // initial load
  React.useEffect(() => {
    loadData();
  }, [useCache]);

  const onSearchTermChange = event => {
    const term = event.target.value;
    setSearchTerm(term);
    const ids = term.length === 0 ? [] : Object.values(data).filter(
      node => node.longName && node.longName.toUpperCase().includes(term.toUpperCase())
      ).map(n => n.id);
    setResultIds(ids);
  };

  return (
    <div className={classes.app}>
      <div className={classes.controls}>
        <div className={classes.wrapper}>
          <IconButton
            className={classes.refresh}
            variant="contained"
            color="primary"
            onClick={event => loadData()}
            disabled={loading}
          >
            <Refresh/>
          </IconButton>
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
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
          label="Show All Connections"
        />
        <FormControlLabel control={
          <Switch
            checked={animateConnections}
            onChange={event => setAnimateConnections(event.target.checked)}
            color="primary"
            name="animatedConnections"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
          }
          label="Animate connections"
        />
        <FormControlLabel control={
          <Switch
            checked={useCache}
            onChange={event => setUseCache(event.target.checked)}
            color="primary"
            name="useCache"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
          }
          label="Use cache"
        />
        <FormControl >
          <InputLabel htmlFor="k8s.search">Search</InputLabel>
          <Input
            id="k8s-search"
            onChange={onSearchTermChange}
            value={searchTerm}
            style={{backgroundColor: resultIds.length === 0 && searchTerm.length > 0 ? 'pink' : 'unset'}}
            endAdornment={
              <InputAdornment position="end">
                <span >
                  {searchTerm.length > 0 && resultIds.length}
                </span>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
      <TreeContainer
        connVisible={connVisible}
        animateConnections={animateConnections}
        data={data}
        resultIds={resultIds}
      />
    </div>
  );
}
