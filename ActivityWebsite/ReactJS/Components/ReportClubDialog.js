import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import SendIcon from '@material-ui/icons/Send';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import { reportClub } from '../API/Club';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectComponent: {
        minWidth: 220,
    },

    otherReasonTextField: {
        'margin': '10px',
        '& .MuiTextField-root': {
            margin: theme.spacing(1)
        },
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

    loadingIcon: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));

export default function ClubReportDialog({ ClubId, ClubName }) {
    const classes = useStyles();

    const listReasons = [
        'This club is fake',
        'Tricker other peoples',
        'Asking for sale',
        'Other'
    ];

    const [open, setOpen] = React.useState(true);
    const [reason, setReason] = React.useState(listReasons[0]);
    const [otherReasonVal, setOtherReasonVal] = React.useState('');

    const [loading, setLoading] = React.useState(false);
    const [errorOtherReason, setErrorOtherReason] = React.useState(false);
    const [errorServer, setErrorServer] = React.useState(false);
    const [successServer, setSuccessServer] = React.useState(false);

    const handleSubmitReason = () => {
        setErrorServer('');
        setSuccessServer('');
        const reasonValue = reason !== 'Other' ? reason : otherReasonVal;
        if (!reasonValue) {
            setErrorOtherReason(true);
            return;
        }
        setLoading(true);

        reportClub(ClubId, reasonValue, (err, response) => {
            setLoading(false);
            if (err) {

                if (err.response.data.error && Array.isArray(err.response.data.errors)) {
                    return setErrorServer(err.response.data.errors.join('\n'));
                }
                return setErrorServer("Error while create your report");
            }
            return setSuccessServer("Create report success!");
        });
    };

    const handleChange = (event) => {
        setReason(event.target.value);
    };

    return (
        <div>

            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Report "${ClubName}" club?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        If you see this club have violet our terms & condition. Please let
                        us know by reporting this club.
                    </DialogContentText>

                    {errorServer &&
                        <Alert severity="error">{errorServer}</Alert>
                    }

                    {successServer && 
                        <Alert severity="success">{successServer}</Alert>
                    }
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Reason</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            classes={{ root: classes.selectComponent }}
                            id="demo-simple-select"
                            value={reason}
                            onChange={handleChange}
                        >
                            {listReasons.map((reason, i) => <MenuItem key={i} value={reason}>{reason}</MenuItem>)}
                        </Select>
                    </FormControl>
                    {reason === 'Other' &&
                        <form className={classes.otherReasonTextField} noValidate autoComplete="off">
                            <div>
                                <TextField
                                    id="outlined-multiline-static"
                                    error={errorOtherReason && !otherReasonVal ? true : false}
                                    label='Reason'
                                    placeholder="Enter reason"
                                    fullWidth={true}
                                    multiline
                                    rows={4}
                                    value={otherReasonVal}
                                    onChange={e => setOtherReasonVal(e.target.value)}
                                    variant="outlined"
                                    helperText={'Please enter reason'}
                                />
                            </div>
                        </form>
                    }


                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Close
                     </Button>
                    {loading ?
                        <div className={classes.loadingIcon}>
                            <CircularProgress />
                        </div>
                        :
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={handleSubmitReason}
                            endIcon={<SendIcon />}
                        >
                            Send
                        </Button>}

                </DialogActions>
            </Dialog>
        </div>
    );
}