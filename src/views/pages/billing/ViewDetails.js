import React, { useState } from 'react';
import { Grid, DialogTitle, AppBar, Slide, Toolbar, DialogContent, IconButton, Tooltip, Dialog, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import InvoiceViewer from "./InvoiceViewer";
import CustomDuty from "../setup/Configuration/CustomDuty"
// import "./style.css";
import ClearingAgencyForm from "../setup/Configuration/ClearingAgencyForm";
import ApprovalButtons from "../approvals";
import useAuth from 'hooks/useAuth';
import utilsJS from "utilsJS";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledInputLabel = styled(Typography)(({ theme }) => ({
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

var ITEM = null;
var INDEX_ITEM = 0

export default function ViewDetails({ open, handleClose, item, type, title }) {

    const theme = useTheme();
    const [openInvoice, setOpenInvoice] = useState(false);
    const { user } = useAuth();

    const handleOpen = (row, index) => {
        ITEM = row;
        INDEX_ITEM - index
        setOpenInvoice(true)
    }
    const handleCloseInvoice = () => {
        setOpenInvoice(false)
    }
    const NoRecord = () => {
        return (<Typography style={{ textAlign: 'center', padding: "12px", fontWeight: 500 }}>No record found.</Typography>)
    }

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
                TransitionComponent={Transition}
            >
                <AppBar position="sticky">
                    <Toolbar style={{ justifyContent: "space-between", background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, padding: "8px" }}>
                        <Typography variant="h4">
                           {title}
                        </Typography>

                        <div style={{ display: 'flex', gap: "15px", marginRight: "12px" }}>
                            <Button onClick={handleClose} variant="contained" size="small">Close</Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{ padding: "4px" }}>
                    <SubCard style={{ marginBottom: "6px", padding: "4px" }} title="Billing Details">
                        <Grid container spacing={2} sx={{ my: 0, mt: 0 }}>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">File No</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{item.refNo || "-"}</StyledTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Importer Name</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{item.nameOfImporter || "-"}</StyledTypography>
                            </Grid>
                            {type === "generated" && <><Grid item xs={2}>
                                <StyledInputLabel variant="h6">Bill No</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{item.billNo || "-"}</StyledTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Bill Date</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{item.billDate || "-"}</StyledTypography>
                            </Grid></>}
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Address</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{item.address || "-"}</StyledTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Vessel</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{item.vesselName || "-"}</StyledTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Contents</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{item.contents || "-"}</StyledTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">No of Pkgs</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{item.noOfPkgs || "-"}</StyledTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Container</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{item.container || "-"}</StyledTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Assessed Amount</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{utilsJS.getFormattedAmount(item.import_AssessedValue) || "-"}</StyledTypography>
                            </Grid>
                            {type !== "generated" ? 
                            <>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Total Bill Amount</StyledInputLabel>
                                <StyledTypography variant="subtitle1">{utilsJS.getFormattedAmount(item.totalAmount) || "-"}</StyledTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Total Pay Order Amount</StyledInputLabel>
                                <StyledTypography variant="subtitle1"> {utilsJS.getFormattedAmount(item.totalPaidAmount) || "-"}</StyledTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Remaining Amount</StyledInputLabel>
                                <StyledTypography variant="subtitle1"> {utilsJS.getFormattedAmount(item.remainningBillAmount) || "-"}</StyledTypography>
                            </Grid>
                            </>
                            :
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">Total Bill Amount</StyledInputLabel>
                                <StyledTypography variant="subtitle1"> {utilsJS.getFormattedAmount(item.billTotalAmount) || "-"}</StyledTypography>
                            </Grid>
                            }
                            <Grid item xs={2}>
                                <StyledInputLabel variant="h6">LC No</StyledInputLabel>
                                <StyledTypography variant="subtitle1"> {item.lC_Number || "-"}</StyledTypography>
                            </Grid>

                        </Grid>
                    </SubCard>

                    <SubCard style={{ marginBottom: "6px", marginTop: "6px" }} title="Pay Order Details" content={false}>
                        <Grid container spacing={0} sx={{ my: 0 }}>
                            <Grid item xs={12}>
                                <StyledTableContainer>
                                    <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small">
                                        <StyledTableHead>
                                            <TableRow>
                                                {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                                <TableCell align="left">Pay Order No</TableCell>
                                                {/* <TableCell align="left">Remaining Amount</TableCell> */}
                                                <TableCell align="center">Date</TableCell>
                                                <TableCell align="right">Pay Order Amount</TableCell>
                                            </TableRow>
                                        </StyledTableHead>
                                        <TableBody>
                                            {item.advanceDetails.length > 0 && item.advanceDetails.map((row, index) => (
                                                <TableRow hover key={index}>
                                                    {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                                    <TableCell align="left"><Typography variant="h6">{row.payorderNo || "-"}</Typography></TableCell>
                                                    {/* <TableCell align="left"><Typography variant="h6">{utilsJS.getFormattedAmount(row.remainingAmount)}</Typography></TableCell> */}
                                                    <TableCell align="center"><Typography variant="h6">{row.payorderDate}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="h6">{utilsJS.getFormattedAmount(row.advanceAmount)}</Typography></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {item.advanceDetails.length === 0 && NoRecord()}
                                </StyledTableContainer>
                            </Grid>
                        </Grid>
                    </SubCard>

                   {type !== "generated" && <SubCard style={{ marginBottom: "6px", marginTop: "6px" }} title="Previous Bill Details" content={false}>
                        <Grid container spacing={0} sx={{ my: 0 }}>
                            <Grid item xs={12}>
                                <StyledTableContainer>
                                    <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small">
                                        <StyledTableHead>
                                            <TableRow>
                                                {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                                <TableCell style={{ minWidth: 130 }} align="left">Bill No</TableCell>
                                                {/* <TableCell style={{ minWidth: 190 }} align="left">Total Paid Amount</TableCell>
                                                <TableCell style={{ minWidth: 130 }} align="left">Total Remainning Amount</TableCell> */}
                                                <TableCell style={{ minWidth: 190 }} align="left">Bill Date</TableCell>
                                                <TableCell style={{ minWidth: 130 }} align="right">Total Bill Amount</TableCell>
                                                {/* <TableCell style={{ minWidth: 190 }} align="left">Action</TableCell> */}
                                            </TableRow>
                                        </StyledTableHead>
                                        <TableBody>
                                            {item.oldBillModels.length > 0 && item.oldBillModels.map((row, index) => (
                                                <TableRow hover key={index}>
                                                    {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                                    <TableCell align="left"><Typography variant="h6">{row.billNo}</Typography></TableCell>
                                                    {/* <TableCell align="left"><Typography variant="h6">{utilsJS.getFormattedAmount(row.totalPaidAmount)}</Typography></TableCell>
                                                    <TableCell align="left"><Typography variant="h6">{utilsJS.getFormattedAmount(row.remainningAmount)}</Typography></TableCell> */}
                                                    <TableCell align="left"><Typography variant="h6">{row.billDate}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="h6">{utilsJS.getFormattedAmount(row.billTotalAmount)}</Typography></TableCell>
                                                    {/* <TableCell align="left">

                                                        <Tooltip title={"Show Details"}>
                                                            <IconButton
                                                                aria-label="delete"
                                                                size="small"
                                                                onClick={() => handleOpen(item, index)}
                                                            >

                                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                                                </svg>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell> */}
                                                </TableRow>
                                            ))}


                                        </TableBody>
                                    </Table>
                                    {item.oldBillModels.length === 0 && NoRecord()}
                                </StyledTableContainer>
                            </Grid>
                        </Grid>
                    </SubCard>}

                    <SubCard style={{ marginBottom: "6px", marginTop: "6px" }} title="RFP Details" content={false}>
                        <Grid container spacing={0} sx={{ my: 0 }}>
                            <Grid item xs={12}>
                                <StyledTableContainer>
                                    <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small">
                                        <StyledTableHead>
                                            <TableRow>
                                                {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                                <TableCell align="left">Agency</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="right">RFP Total Amount</TableCell>
                                            </TableRow>
                                        </StyledTableHead>
                                        <TableBody>
                                            {item.agencyPayOrderModels.length > 0 && item.agencyPayOrderModels.map((row, index) => (
                                                <TableRow hover key={index}>
                                                    {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                                    <TableCell align="left"><Typography variant="h6">{row.agencyName}</Typography></TableCell>
                                                    <TableCell align="left"><Typography variant="h6">{row.agencyPayorderDate}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="h6">{utilsJS.getFormattedAmount(row.payorderAmount)}</Typography></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {item.agencyPayOrderModels.length === 0 && NoRecord()}
                                </StyledTableContainer>
                            </Grid>
                        </Grid>
                    </SubCard>

                    <SubCard style={{ marginBottom: "6px", marginTop: "6px" }} title="Expense Details" content={false}>
                        <Grid container spacing={0} sx={{ my: 0 }}>
                            <Grid item xs={12}>
                                <StyledTableContainer>
                                    <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small">
                                        <StyledTableHead>
                                            <TableRow>
                                                {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                                <TableCell align="left">Expense Category Name</TableCell>
                                                <TableCell align="left">Expense Date</TableCell>
                                                <TableCell align="right">Expense Amount</TableCell>
                                            </TableRow>
                                        </StyledTableHead>
                                        <TableBody>
                                            {item.expenseModels.length > 0 && item.expenseModels.map((row, index) => (
                                                <TableRow hover key={index}>
                                                    {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                                    <TableCell align="left"><Typography variant="h6">{row.expenseCategoryName}</Typography></TableCell>
                                                    <TableCell align="left"><Typography variant="h6">{row.expenseDate}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="h6">{utilsJS.getFormattedAmount(row.expenseAmount)}</Typography></TableCell>
                                                </TableRow>
                                            ))}


                                        </TableBody>
                                    </Table>
                                    {item.expenseModels.length === 0 && NoRecord()}
                                </StyledTableContainer>
                            </Grid>
                        </Grid>
                    </SubCard>

                    <SubCard style={{ marginBottom: "6px", marginTop: "6px" }} title="Reimbursement Bill Details" content={false}>
                        <Grid container spacing={0} sx={{ my: 0 }}>
                            <Grid item xs={12}>
                                <StyledTableContainer>
                                    <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small">
                                        <StyledTableHead>
                                            <TableRow>
                                                {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                                <TableCell style={{ minWidth: 130 }} align="left">Reimbursement Category Name</TableCell>
                                                <TableCell style={{ minWidth: 190 }} align="left">Reimbursement Date</TableCell>
                                                <TableCell style={{ minWidth: 130 }} align="right">Reimbursement Amount</TableCell>
                                            </TableRow>
                                        </StyledTableHead>
                                        <TableBody>
                                            {item.reAmountModelBills.length > 0 && item.reAmountModelBills.map((row, index) => (
                                                <TableRow hover key={index}>
                                                    {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                                    <TableCell align="left"><Typography variant="h6">{row.reimbursmentCategoryName}</Typography></TableCell>
                                                    <TableCell align="left"><Typography variant="h6">{row.reimbursmentDate}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="h6">{utilsJS.getFormattedAmount(row.rebursmentAmount)}</Typography></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {item.reAmountModelBills.length === 0 && NoRecord()}
                                </StyledTableContainer>
                            </Grid>
                        </Grid>
                    </SubCard>
                    <Grid container spacing={0} sx={{ my: 0 }}>
                        <Grid item xs={12}>
                            <div
                                style={{
                                    borderRadius: "4px",
                                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light,
                                    display: "flex",
                                    justifyContent: "end",
                                    alignItems: "center",
                                    height: "50px",
                                    border: "1px solid",
                                    borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                                    margin: "12px 0 12px 0"
                                }}>
                                <div style={{ display: "flex", gap: "18px", width: "100%", justifyContent: "end", alignItems: "center", marginRight: "30px" }}>
                                    <Typography variant="h3">
                                        Grand Total:
                                    </Typography>
                                    <Typography variant="h4">
                                        {
                                            type !== "generated" ? utilsJS.getFormattedAmount(item.currentBillAmount) : utilsJS.getFormattedAmount(item.billTotalAmount)
                                        }
                                    </Typography>
                                </div>

                            </div>
                        </Grid>
                    </Grid>

                </DialogContent>
                {openInvoice && <InvoiceViewer open={openInvoice} handleClose={handleCloseInvoice} item={ITEM} RowIndex={INDEX_ITEM} />}
            </Dialog>
        </React.Fragment>
    );
}