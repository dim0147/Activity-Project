import React, {useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBars({ type, message, position, time }) {

    const [open, setOpen] = useState(true);

    function handleClose(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={time ?? 2000}
            onClose={handleClose}
            anchorOrigin={position ?? {
                vertical: 'bottom',
                horizontal: 'right',
            }}
        >
            <Alert onClose={handleClose} severity={type}>
                {message}
            </Alert>
        </Snackbar>   
    )
}