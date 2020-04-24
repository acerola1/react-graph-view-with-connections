import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

const DialogForEvents = ({ open, setOpen, node }) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} maxWidth={'xl'} fullWidth={true} onClose={handleClose}>
        <DialogTitle>Events</DialogTitle>
        <DialogContent dividers={true}>
          { node && node.events && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "15%" }}>Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {node.events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell component="th" scope="row" >
                      {event.id}
                    </TableCell>
                    <TableCell>{event.Type}</TableCell>
                    <TableCell>{event.Reason}</TableCell>
                    <TableCell>{event.Message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          )}
          </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogForEvents;