import React, { useState } from 'react';
import { Grid, DialogTitle, DialogContent, IconButton, DialogActions, Dialog, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

import "./style.css";

export default function ViewImage({ open, handleClose, image, title = "Clearing Image"}) {

    const theme = useTheme();

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"lg"}
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
            >
                <DialogTitle style={{
                    background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                    padding: "6px 24px",
                    display : "flex",
                    justifyContent: "space-between",
                    alignItems : "center"
                }}>
                    <Typography variant="subtitle1" color="primary">
                        {title}
                    </Typography>
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{ padding: "0px 18px" , textAlign: "center"}}>
                    <DialogContent>
                        <img src={image} />
                    </DialogContent>
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions> */}
            </Dialog>
        </React.Fragment>
    );
}