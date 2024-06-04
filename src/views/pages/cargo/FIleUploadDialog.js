import React, { useState } from 'react';
import { Grid, DialogTitle, DialogContent, IconButton, DialogActions, Dialog, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardMedia, Card, Tooltip } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import utilsJS from "utilsJS"
import CustomFileUploader from "ui-component/FileUploader"
import AxiosServices from "service"
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';

// import "./style.css";
export default function FIleUploadDialog({ open, handleClose, userID, ocrID }) {

    const theme = useTheme();
    const [file, setFile] = useState([]);
    const [error, setError] = useState({});
    const dispatch = useDispatch();


    const handleUpload = () => {

        if (file.length === 0) {
            setError({ file: "THis is a required field." })
        }
        else {
            UploadDocuments()
        }
    }

    const UploadDocuments = () => {

        const formdata = new FormData();
        formdata.append("OCRID", ocrID);
        formdata.append("UserID", userID);
        formdata.append("Module", 2);
        Array.from(file).map((item) => {
            formdata.append("file", item);
        })

        AxiosServices.insertOther_File(formdata).then(data => {
            const { message } = data?.data

            if (message === "Uploaded Successfully.") {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Document(s) uploaded successfully",
                        variant: 'alert',
                        alert: {
                            color: "success"
                        },
                        close: true
                    })
                );
                setFile([])
                handleClose()
            }
            else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: message,
                        variant: 'alert',
                        alert: {
                            color: "error"
                        },
                        close: true
                    })
                );
            }
        })
            .catch(e => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Something went wrong",
                        variant: 'alert',
                        alert: {
                            color: "error"
                        },
                        close: true
                    })
                );
                console.error(e);
            });
    }


    return (
        <React.Fragment >
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
            >
                <DialogTitle style={{
                    background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                    padding: "6px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <Typography variant="h4" style={{ color: "white" }}>
                        Upload Cargo Document
                    </Typography>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <Tooltip title="Close">
                            <IconButton aria-label="delete" size="small" onClick={handleClose}>
                                <CloseIcon fontSize="small" style={{ color: "white" }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </DialogTitle>
                <DialogContent style={{ marginTop: "12px" }}>
                    <Grid container spacing={3}>
                        <CustomFileUploader file={file} setFile={setFile} setError={setError} error={error} />
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" onClick={handleUpload}>Upload Documents</Button>
                        </Grid>
                    </Grid >
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}