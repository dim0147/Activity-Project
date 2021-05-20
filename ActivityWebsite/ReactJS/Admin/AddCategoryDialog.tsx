import React from 'react';
import axios from 'axios';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import InputFile from './InputFile';


export default function FormDialog() {
    const [open, setOpen] = React.useState<boolean>(true);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [headerImg, setImg] = React.useState('');

    const setImgHandle = (imgs: any) => {
        if (imgs.length === 0) return
        setImg(imgs[0]);
    }

    const handleCreate = () => {

        const formData = new FormData();

        formData.append('name', title);
        formData.append('description', description);
        formData.append('img', headerImg);

        axios.post('/api/category/add', formData)
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create new category</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {/*To subscribe to this website, please enter your email address here. We will send updates*/}
                        {/*occasionally.*/}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        onChange={(e: any) => setTitle(e.target.value)}
                    />

                    <TextareaAutosize rowsMin={5} placeholder="Description" onChange={(e: any) => setDescription(e.target.value)} />;


                    <InputFile
                        files={[headerImg]}
                        setFiles={setImgHandle}
                        header="Header Image"
                        title="+ Drag and drop header image here, or click to select image"
                    />


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={handleCreate} color="primary">
                        Create
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}