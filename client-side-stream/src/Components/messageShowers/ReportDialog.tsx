import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { reportDialogInterface } from '../../Functions/interfaces';

function ReportDialog({ submitReport, closeFunc }:reportDialogInterface) {
    const [open, setOpen] = useState(true);
    const [text, setText] = useState("")

    const handleClose = () => {
        setOpen(false);
        closeFunc(false)
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}>

                <DialogTitle>Report</DialogTitle>
                <DialogContent>
                    <DialogContentText>If you found any ilegal content from the video or live you can report here.
                        we will review it and remove it.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        onChange={(e) => setText(e.target.value)}
                        id="name"
                        name="email"
                        label="Reason for report"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => {
                        setOpen(false)
                        submitReport(text)
                    }} type="submit">Report</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default React.memo(ReportDialog)