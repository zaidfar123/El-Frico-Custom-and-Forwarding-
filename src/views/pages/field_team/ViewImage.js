import React, { useState } from 'react';
import { Grid, DialogTitle, DialogContent, IconButton, DialogActions, Dialog, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardMedia, Card, Tooltip } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import System_Images from "./Images";
import utilsJS from "utilsJS"

// import "./style.css";
export default function ViewImage({ open, handleClose, IMAGES_LIST, title, ROW_DETAILS }) {

    const theme = useTheme();
    const [opacity, setOpacity] = useState(1)

    const printImages = () =>{
        let model = [];
        IMAGES_LIST.map((image, i) =>{
            model.push(image.source);
        })
        utilsJS.printImages(ROW_DETAILS,model)
    }

    return (
        <React.Fragment >
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
                style={{ opacity: opacity }}
            >
                <DialogTitle style={{
                    background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                    padding: "6px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <Typography variant="h4" style={{color : "white"}}>
                        {title}
                    </Typography>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <Tooltip title="Print all Documents">
                            <IconButton aria-label="delete" size="small" onClick={()=>printImages()}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke={"white"} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                                    <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                                </svg>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Close">
                            <IconButton aria-label="delete" size="small" onClick={handleClose}>
                                <CloseIcon fontSize="small" style={{color : "white"}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </DialogTitle>
                <DialogContent style={{ marginTop: "12px" }}>
                    <System_Images images={IMAGES_LIST} setOpacity={setOpacity} ROW_DETAILS={ROW_DETAILS} />
                </DialogContent>

            </Dialog>
        </React.Fragment>
    );
}