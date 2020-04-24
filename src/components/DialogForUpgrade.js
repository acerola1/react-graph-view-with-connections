import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";
import { Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import RequestUtils from './RequestUtils';

const DialogForUpgrade = ({open, setOpen, currentVersion, versionList, upgradeUrl}) => {
  const [ errorMessage, setErrorMessage ] = React.useState();
  const [ selectedVersion, setSelectedVersion ] = React.useState();

  const handleClose = () => {
    setOpen(false);
  };

  const handleVersionChange = (e) => {
    setSelectedVersion(e.target.value)
  }

  const handleUpgrade = () => {
    const data = { version: selectedVersion }
    const upgradeRequestUrl = RequestUtils.getBackendServerUrl(upgradeUrl)

    axios
      .post(upgradeRequestUrl, data)
      .then(() => {
        setOpen(false);
      })
      .catch((err) => {
        setErrorMessage(`Request to ${upgradeRequestUrl} failed: ` + err)
      });
  };

  React.useEffect(() => {
    if (!currentVersion) {
      setSelectedVersion("")
    } else {
      setSelectedVersion(currentVersion)
    }
  }, [currentVersion])

  React.useEffect(() => {
    setErrorMessage()
  }, [open])

  return (
    <div>
      <Dialog open={open} maxWidth={'sm'} fullWidth={true} onClose={handleClose}>
        <DialogTitle>Upgrade</DialogTitle>
        <DialogContent dividers={true}>
        <FormControl>
        <InputLabel id="version-select-label">Version</InputLabel>
        <Select
          labelId="version-select-label"
          id="version-select"
          value={selectedVersion}
          onChange={handleVersionChange}
        >
          { (versionList ? versionList: []).map( (item) => { return <MenuItem value={item}>{item}</MenuItem>})}
        </Select>
      </FormControl>
          { errorMessage && <Typography component="span">Error in processing: {errorMessage}</Typography> }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
          <Button onClick={handleUpgrade} color="primary">Upgrade</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogForUpgrade;