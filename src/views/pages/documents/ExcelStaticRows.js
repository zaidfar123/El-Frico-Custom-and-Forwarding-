import React, { useState, useEffect } from 'react';
import { Typography, TableCell, TableRow, } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import "./style.css";;
import utilsJS from "utilsJS";


export default function ExcelStaticRows({ Index, itemObject }) {

    const theme = useTheme();

    const fontStyle = {fontSize : "11px", color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }
    const formulaStyle = { fontSize : "10px", fontStyle: "italic" }

    const backgroundStyle = { background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light, fontWeight: 600 }


    return (
        <TableRow style={backgroundStyle}>
            <TableCell align="center" colSpan={10}>
                <div className="table-splitter">
                    <Typography variant="h6">{Index + 1}</Typography>
                    <Typography variant="h6" style={fontStyle}>{itemObject[Index].title}</Typography>
                    <Typography variant="h6" style={formulaStyle}>{itemObject[Index].formula}</Typography>
                
                </div>
            </TableCell>
            <TableCell align="center" colSpan={2} >
                <div className="table-splitter">
                    <Typography variant="h6">Rs.</Typography>
                    <Typography variant="h6" style={fontStyle}>{utilsJS.getFormattedAmount(Math.round(itemObject[Index].result))}</Typography>
                </div>
            </TableCell>
        </TableRow>
    )
}