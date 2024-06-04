import * as React from 'react';
import { Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button, DialogContentText } from '@mui/material';
import "./style.css";
import scannerImage from "assets/images/scanner.gif";
import FailedImage from "assets/images/failed.gif";
import DotLoader from "ui-component/dot-loader"

export default function OCR_Loader({ open, handleClose, isLoading }) {
    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"xs"}
                open={open}
                onClose={handleClose}
            >
                {/* <DialogTitle>Choose Field</DialogTitle> */}
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div className="loading-dialog">
                            {isLoading ?
                                <>
                                    <img src={scannerImage} />
                                    <p>Please wait, while we are scanning the snippet.</p>
                                    <div className="stage">
                                        <DotLoader />
                                    </div>
                                </>
                                :
                                <>
                                    <img src={FailedImage} />
                                    <p>Sorry, can't scan the snippet</p>
                                </>
                            }
                        </div>
                    </DialogContentText>
                </DialogContent>
                {!isLoading && <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>}
            </Dialog>
        </React.Fragment>
    );
}