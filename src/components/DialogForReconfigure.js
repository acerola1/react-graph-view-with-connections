import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextareaAutosize, Typography } from '@material-ui/core';
import axios from "axios";
import RequestUtils from './RequestUtils';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

const DialogForReconfigure = ({open, setOpen, node}) => {
  const [ currentAttributesJson, setCurrentAttributesJson] = React.useState();
  const [ errorMessage, setErrorMessage ] = React.useState();

  const handleClose = () => {
    setOpen(false);
  };

  const handleReconfigure = () => {
    try {
      const attributesObject = JSON.parse(currentAttributesJson)
      const reconfigureRequestUrl = RequestUtils.getBackendServerUrl(node.reconfigureUrl)

      axios
        .post(reconfigureRequestUrl, attributesObject)
        .then(() => {
          setOpen(false);
        })
        .catch((err) => {
          setErrorMessage(`Request to ${reconfigureRequestUrl} failed: ` + err)
        });
    } catch (err) {
      setErrorMessage("" + err)
      return
    }
  };

  const handleTextChange = (value) => {
    setCurrentAttributesJson(value)
  }

  React.useEffect(() => {
    let data = node ? JSON.stringify(node.attributesJson, null, 2) : ""
    setCurrentAttributesJson(data)
  }, [node])

  React.useEffect(() => {
    setErrorMessage()
  }, [open])

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        maxWidth={'lg'}
        fullWidth={true}
        ref={null}
      >
        <DialogTitle>Entitiy attributes</DialogTitle>
        <DialogContent dividers={true}>
        <AceEditor
                mode="json"
                theme="github"
                fontSize={14}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                highlightActiveLine={true}
                onChange={handleTextChange}
                showPrintMargin={true}
                width="100%"
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                  }}
                value={currentAttributesJson}
              />
          { errorMessage && <Typography>Error in processing: {errorMessage}</Typography> }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
          <Button onClick={handleReconfigure} color="primary">Reconfigure</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogForReconfigure;