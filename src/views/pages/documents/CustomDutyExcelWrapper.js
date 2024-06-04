import React, { useState, useEffect } from 'react';
import { Typography, TableCell, TableRow, Button } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import "./style.css";;

export default function CustomDutyExcelWrapper({ onSubmit, disabled, children }) {

    const theme = useTheme();
    const backgroundStyle = { background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light, fontWeight: 600 }


    return (
        <React.Fragment>
            <TableRow>
                <TableCell align="center" colSpan={12} style={backgroundStyle} >
                    <Typography variant="h6">BREAK UP OF CUSTOM DUTY</Typography>
                </TableCell>
            </TableRow>

            <TableRow>

                <TableCell align="center" colSpan={6}>
                    <div className="table-splitter">
                        <Typography variant="h6">S  No</Typography>
                        <Typography variant="h6">Title</Typography>
                    </div>
                </TableCell>
                <TableCell align="center" colSpan={2}>
                    <div className="table-splitter">
                        <Typography variant="h6">Percentage</Typography>
                    </div>
                </TableCell>
                <TableCell align="center" colSpan={2}>
                    <div className="table-splitter">
                        <Typography variant="h6">Value</Typography>
                    </div>
                </TableCell>
                <TableCell align="center" colSpan={2}>
                    <div className="table-splitter">
                        <Typography variant="h6">Amount</Typography>
                    </div>
                </TableCell>
            </TableRow>
            {children}
            <TableRow>
                <TableCell align="right" colSpan={12}>
                    <Button variant='contained' size="small" onClick={onSubmit} disabled={disabled}>Update Custom Duty</Button>
                </TableCell>
            </TableRow>
        </React.Fragment>

    )
}