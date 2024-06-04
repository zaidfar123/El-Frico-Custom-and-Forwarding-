import React, { useState, useEffect } from 'react';
import { Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button, IconButton, Typography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import AddIcon from "assets/images/add.png";
import EditIcon from "assets/images/edit.png";
import FilterIcon from "assets/images/filter.png";
import CloseIcon from '@mui/icons-material/Close';
import widget from 'menu-items/widget';

export default function CustomDialog({Icon, open, handleClose, title, children, fullWidth, maxWidth, isAction = false,handleSubmit , submitTitle, disabled = false, isReset = false, handleReset }) {

    const theme = useTheme();

    const getIcon =()=>{
        
        if(Icon === "add"){
            return AddIcon;
        }
        else if(Icon === "edit"){
            return EditIcon;
        }
        else{
            return FilterIcon
        }
    }

    return (
        <React.Fragment>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
            >
                <DialogTitle style={{
                    padding: "8px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center"
                }}>
                    <div style={titlteStyle}>
                        <img src={getIcon()} style={{ width: "45px", height: "45px" }}></img>
                        <Typography variant="h4" style={{ color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}>{title}</Typography>
                    </div>
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent style={{ padding: "0px 0px" }}>
                    <DialogContent>
                        {children}
                    </DialogContent>
                </DialogContent>
                {isAction && <DialogActions>
                    <>
                        <Button onClick={isReset ? handleReset : handleClose}>{isReset ? "Reset Filters" : "Close"}</Button>
                        <Button
                            variant='contained'
                            color="secondary"
                            onClick={isReset ? handleClose : handleSubmit}
                            style={{color: 'white'}}
                            disabled={disabled}
                        >
                            {submitTitle}
                        </Button>
                    </>
                </DialogActions>}
            </Dialog>
        </React.Fragment>
    );
}

const titlteStyle = {
    display: "flex",
    gap: "6px",
    alignItems: "center",
}