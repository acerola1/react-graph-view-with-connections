import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";
import { Typography, TextField, CircularProgress } from '@material-ui/core';
import RequestUtils from './RequestUtils';

const DialogForScale = ({open, setOpen, node}) => {
  const getReplicas = node => {
    if (node && node.attributesJson && node.attributesJson.Replicas) {
      return node.attributesJson.Replicas
    }
    return 0
  }

  const [ errorMessage, setErrorMessage ] = React.useState();
  const [ scaleLevel, setScaleLevel ] = React.useState(0);
  const [requestInProgress, setRequestInProgress] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleValueChange = (e) => {
    let value = e.target.value
    if (value <= 0) {
      value = 1
    }
    setScaleLevel(value)
  }

  const handleHeal = () => {
      const data = { name: node.longName, count: parseInt(scaleLevel) }
      const scaleRequestUrl = RequestUtils.getBackendServerUrl(node.scaleUrl);

      setRequestInProgress(true)
      axios
        .post(scaleRequestUrl, data)
        .then(() => {
          setOpen(false);
        })
        .catch((err) => {
          setErrorMessage(`Request to ${scaleRequestUrl} failed: ` + err)
        })
        .then( () => setRequestInProgress(false) );
  };

  React.useEffect(() => {
    setScaleLevel(getReplicas(node))
  }, [node])

  React.useEffect(() => {
    setErrorMessage()
  }, [open])

  return (
    <div>
      <Dialog open={open} maxWidth={'sm'} fullWidth={true} onClose={handleClose}>
        <DialogTitle>Scale</DialogTitle>
        <DialogContent dividers={true}>
          <TextField
            autoFocus
            margin="dense"
            id="scaleLevel"
            label="Scale level"
            type="number"
            fullWidth
            value={scaleLevel}
            onChange={handleValueChange}
          />
          { errorMessage && <Typography component="span">Error in processing: {errorMessage}</Typography> }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
          <Button onClick={handleHeal} color="primary">Scale</Button>
          {requestInProgress && <CircularProgress size={24} />}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogForScale;