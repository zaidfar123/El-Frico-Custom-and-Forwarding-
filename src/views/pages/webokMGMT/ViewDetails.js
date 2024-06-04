import React, { useState } from 'react';
import { Grid, DialogTitle, DialogContent, Collapse, DialogActions, Dialog, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import ViewImage from "./ViewImage";
import CustomDuty from "../setup/Configuration/CustomDuty"
import "./style.css";
import ClearingAgencyForm from "../setup/Configuration/ClearingAgencyForm";
import ApprovalButtons from "../approvals";
import useAuth from 'hooks/useAuth';

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
    fontWeight: 500,
    fontSize: "13px"
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
    fontSize: "11px"
}));
const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light
}));
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    // borderRadius: "6px"
}));
var IMAGE = null;
export default function ViewDetails({ open, handleClose, item }) {

    const theme = useTheme();
    const [openImage, setOpenImage] = useState(false);
    const { user } = useAuth();

    const handleOpen = (img) => {
        IMAGE = img;
        setOpenImage(true)
    }
    const handleCloseImage = () => {
        setOpenImage(false)
    }

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
            >
                <DialogTitle style={{
                    color: "black",
                    background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                    padding: "6px 12px",
                    fontWeight: 400
                }}>Consignment Daily Status Report</DialogTitle>
                <DialogContent style={{ padding: "0px 18px" }}>
                        <SubCard style={{ marginBottom: "6px", marginTop: "12px" }} title="Shipment Details" content={false}>
                            <Grid container spacing={0} sx={{ my: 0 }}>
                                <Grid item xs={12}>
                                    <StyledTableContainer>
                                        <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                            <StyledTableHead>
                                                <TableRow>
                                                    {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                                    <TableCell style={{ minWidth: 130 }} align="left">Shipment Type</TableCell>
                                                    <TableCell style={{ minWidth: 190 }} align="left">Shipment Type Details</TableCell>
                                                    <TableCell style={{ minWidth: 130 }} align="left">Cargo Type</TableCell>
                                                    <TableCell style={{ minWidth: 190 }} align="left">Cargo Type Details</TableCell>
                                                    <TableCell style={{ minWidth: 80 }} align="left">Count</TableCell>
                                                    <TableCell style={{ minWidth: 130 }} align="left">Item Category</TableCell>
                                                    <TableCell style={{ minWidth: 100 }} align="left">Terminal</TableCell>
                                                    <TableCell style={{ minWidth: 100 }} align="left">Collectorate</TableCell>
                                                </TableRow>
                                            </StyledTableHead>
                                            <TableBody>
                                                {item.shippingResponses.length > 0 && item.shippingResponses.map((row, index) => (
                                                    <TableRow hover key={index}>
                                                        {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                                        <TableCell align="left">{row.shipmentTypeName}</TableCell>
                                                        <TableCell align="left">{row.shipmentTypeDetailName}</TableCell>
                                                        <TableCell align="left">{row.cargoTypeName}</TableCell>
                                                        <TableCell align="left">{row.cargoTypeDetailName}</TableCell>
                                                        <TableCell align="left">{row.count}</TableCell>
                                                        <TableCell align="left">{row.itemCategoryName}</TableCell>
                                                        <TableCell align="left">{row.terminalName}</TableCell>
                                                        <TableCell style={{ minWidth: 220 }} align="left">{row.collectorateName}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </StyledTableContainer>
                                </Grid>
                            </Grid>
                        </SubCard>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}