import React from 'react';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import "./style.css";

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light
}));
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    // borderRadius: "6px"
}));

export default function ShipmentDetails({ item }) {

    return (

        <Grid container spacing={0} sx={{ my: 0 }}>
            <Grid item xs={12}>
                <StyledTableContainer>
                    <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small">
                        <StyledTableHead>
                            <TableRow>
                                {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                <TableCell style={{ minWidth: 100 }} align="left">Shipment</TableCell>
                                <TableCell style={{ minWidth: 150 }} align="left">Shipment Type</TableCell>
                                <TableCell style={{ minWidth: 90 }} align="left">Cargo</TableCell>
                                <TableCell style={{ minWidth: 140 }} align="left">Cargo Type</TableCell>
                                <TableCell style={{ minWidth: 80 }} align="left">Count</TableCell>
                                <TableCell style={{ minWidth: 130 }} align="left">Item Category</TableCell>
                                <TableCell style={{ minWidth: 100 }} align="left">Terminal</TableCell>
                                <TableCell style={{ minWidth: 100 }} align="left">Collectorate</TableCell>
                                <TableCell style={{ minWidth: 100 }} align="left">Bank</TableCell>
                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {item.shippingResponses.length > 0 && item.shippingResponses.map((row, index) => (
                                <TableRow hover key={index}>
                                    {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                    <TableCell align="left"><Typography variant="h6">{row.shipmentTypeName}</Typography></TableCell>
                                    <TableCell align="left"><Typography variant="h6">{row.shipmentTypeDetailName}</Typography></TableCell>
                                    <TableCell align="left"><Typography variant="h6">{row.cargoTypeName}</Typography></TableCell>
                                    <TableCell align="left"><Typography variant="h6">{row.cargoTypeDetailName}</Typography></TableCell>
                                    <TableCell align="left"><Typography variant="h6">{row.count}</Typography></TableCell>
                                    <TableCell align="left"><Typography variant="h6">{row.itemCategoryName}</Typography></TableCell>
                                    <TableCell align="left"><Typography variant="h6">{row.terminalName}</Typography></TableCell>
                                    <TableCell style={{ minWidth: 180 }} align="left"><Typography variant="h6">{row.collectorateName}</Typography></TableCell>
                                    <TableCell style={{ minWidth: 180 }} align="left"><Typography variant="h6">{row.bankName}</Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </Grid>
        </Grid>
    );
}