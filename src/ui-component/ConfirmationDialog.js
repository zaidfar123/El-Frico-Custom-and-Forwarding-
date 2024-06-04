import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';


export default function ConfirmationDialog(
    {
        open = false,
        titie = "",
        content = "",
        discardTitle = "",
        confirmTitle = "",
        onDiscard,
        onConfirm,
        loading
    }
) {

    return (
        <React.Fragment>
            <Dialog
                open={open}
                // onClose={onDiscard}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {titie}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDiscard}>{discardTitle}</Button>
                    <LoadingButton
                        size="small"
                        color="primary"
                        onClick={onConfirm}
                        loading={loading}
                        //   loadingPosition="start"
                        //   startIcon={<SaveIcon />}
                        variant="contained"
                    >
                        <span>{confirmTitle}</span>
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
