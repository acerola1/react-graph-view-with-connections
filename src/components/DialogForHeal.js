import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import axios from "axios";
import { Typography } from '@material-ui/core';

const DialogForHeal = ({open, setOpen, healUrl}) => {
  const [ errorMessage, setErrorMessage ] = React.useState();

  const handleClose = () => {
    setOpen(false);
  };

  const handleHeal = () => {
      axios
        .post(healUrl)
        .then(() => {
          setOpen(false);
        })
        .catch((err) => {
          setErrorMessage("" + err)
        });
  };

  React.useEffect(() => {
    setErrorMessage()
  }, [open])

  return (
    <div>
      <Dialog open={open} maxWidth={'sm'} fullWidth={true} onClose={handleClose}>
        <DialogTitle>Heal</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText id="alert-dialog-description">
            Submit heal request?
            { errorMessage && <Typography>Error in processing: {errorMessage}</Typography> }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
          <Button onClick={handleHeal} color="primary">Heal</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogForHeal;