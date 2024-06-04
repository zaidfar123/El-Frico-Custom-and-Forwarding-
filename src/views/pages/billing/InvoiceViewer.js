import React, { useState } from 'react';
import { useRef } from 'react';

import { Grid, DialogContent, IconButton, Dialog, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import useAuth from 'hooks/useAuth';
import { gridSpacing } from 'store/constant';

import CloseIcon from '@mui/icons-material/Close';


export default function InvoiceViewer({ open, handleClose, item, RowIndex }) {

    const theme = useTheme();
    const componentRef = useRef(null);
    const { user } = useAuth();
    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"sm"}
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
            >
                <DialogContent style={{ padding: "0px 0px" }}>
                    <Grid container justifyContent="center" spacing={gridSpacing}>
                        <Grid item xs={12} md={12} lg={12} ref={componentRef}>
                            <SubCard darkTitle title={"Paid Amount Details"} secondary={<IconButton
                                aria-label="delete"
                                size="small"
                                onClick={handleClose}
                            >
                            <CloseIcon fontSize="small" color="primary" />
                            </IconButton>}>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12}>
                                        <Grid container spacing={0}>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle1">Customer Name</Typography>
                                                <Typography variant="caption">{item.nameOfImporter}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle1">Vessel Name</Typography>
                                                <Typography variant="caption">{item.vesselName}</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="subtitle1">File No</Typography>
                                                <Typography variant="caption">{item.refNo}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                                    <TableRow>
                                                        <TableCell sx={{ pl: 1 }} align="left">Paid Amount</TableCell>
                                                        <TableCell align="left">Assigned Date</TableCell>
                                                        <TableCell align="left">Remarks</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {item.oldBillModels[RowIndex].payAmountModels.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{ pl: 1, pr: 1 }}>
                                                                <Typography align="left" variant="h6">
                                                                    {row.paidAmount}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell  >
                                                                <Typography align="left" variant="h6">
                                                                    {row.paidAmountDate}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell  >
                                                                <Typography align="left" variant="h6">
                                                                    {row.remarks}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                    {/* <Grid item xs={12}>
                                        <SubCard
                                            sx={{
                                                bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
                                            }}
                                        >
                                            <Grid container justifyContent="flex-end" spacing={gridSpacing}>
                                                <Grid item sm={6} md={4}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={6}>
                                                                    <Typography align="right" color="primary" variant="subtitle1">
                                                                        Total :
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Typography align="right" color="primary" variant="subtitle1">
                                                                        {item.employeeAssignedAmountTotalModels[RowIndex].assignedAmountTotal}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </SubCard>
                                    </Grid> */}
                                </Grid>
                            </SubCard>
                        </Grid>
                        {/* <Grid item xs={12} md={10} lg={8}>
                            <Grid
                                container
                                spacing={1}
                                justifyContent="center"
                                sx={{
                                    maxWidth: 850,
                                    mx: 'auto',
                                    mt: 0,
                                    mb: 2.5,
                                    '& > .MuiCardContent-root': {
                                        py: { xs: 3.75, md: 5.5 },
                                        px: { xs: 2.5, md: 5 }
                                    }
                                }}
                            >
                                <Grid item>
                                    <AnimateButton>
                                        <ReactToPrint trigger={() => <Button variant="contained">Print</Button>} content={() => componentRef.current} />
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </Grid> */}
                    </Grid>
                </DialogContent>

            </Dialog>
        </React.Fragment>
    );
}